// ==UserScript==
// @name         Danbooru - Estimate WEBP quality
// @author       hdk5
// @version      20241207163351
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/estimate-webp-quality.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/estimate-webp-quality.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

/* globals
  $
*/

function parseRIFF(buffer) {
  function getFourCC(buffer, offset) {
    return new TextDecoder().decode(buffer.slice(offset, offset + 4))
  }

  function getUint24(buffer, offset) {
    const dv = new DataView(buffer)
    return dv.getUint16(offset, true) | (dv.getUint8(offset + 2, true) << 16)
  }

  function readChunks(buffer, offset) {
    const chunks = []
    while (offset < buffer.byteLength) {
      const chunk = readChunk(buffer, offset)
      chunks.push(chunk)
      offset += 8 + chunk.length + (chunk.length % 2)
    }
    return chunks
  }

  function readChunk(buffer, offset) {
    const header = getFourCC(buffer, offset)
    const length = new DataView(buffer).getUint32(offset + 4, true)
    const payload = buffer.slice(offset + 8, offset + 8 + length)
    const chunk = { header, length }

    if (header === 'RIFF') {
      chunk.format = getFourCC(payload, 0)
      chunk.subchunks = readChunks(payload, 4)
    }
    else if (header === 'ANMF') {
      chunk.duration = getUint24(payload, 12)
      chunk.subchunks = readChunks(payload, 16)
    }
    else if (['VP8 ', 'VP8L'].includes(header)) {
      chunk.payload = payload
    }

    return chunk
  }

  return readChunk(buffer, 0)
}

function estimateQuality(chunk) {
  if (chunk.header === 'VP8L')
    return 101

  if (chunk.header !== 'VP8 ')
    return

  const data = new Uint8Array(chunk.payload)
  let Q

  let bit_pos
  const GET_BIT = (n) => {
    let val = 0
    while (n-- > 0) {
      const p = bit_pos++
      const bit = !!(data[p >> 3] & (128 >> (p & 7)))
      val = (val << 1) | bit
    }
    return val
  }
  const CONDITIONAL_SKIP = n => GET_BIT(1) ? GET_BIT(n) : 0

  let pos = 0

  // Skip frame tag
  pos += 3

  // key frame signature
  if (data[pos++] !== 0x9D)
    return
  if (data[pos++] !== 0x01)
    return
  if (data[pos++] !== 0x2A)
    return

  // Skip main Header
  pos += 4
  bit_pos = pos * 8

  GET_BIT(2) // colorspace + clamp type

  // Segment header
  if (GET_BIT(1)) { // use_segment_
    const update_map = GET_BIT(1)
    if (GET_BIT(1)) { // update data
      const absolute_delta = GET_BIT(1)
      const q = [0, 0, 0, 0]
      for (let s = 0; s < 4; ++s) {
        if (GET_BIT(1)) {
          q[s] = GET_BIT(7)
          if (GET_BIT(1))
            q[s] = -q[s] // sign
        }
      }
      if (absolute_delta)
        Q = q[0] // just use the first segment's quantizer
      for (let s = 0; s < 4; ++s) CONDITIONAL_SKIP(7) // filter strength
    }
    if (update_map) {
      for (let s = 0; s < 3; ++s) CONDITIONAL_SKIP(8)
    }
  }

  // Filter header
  GET_BIT(1 + 6 + 3) // simple + level + sharpness
  if (GET_BIT(1)) { // use_lf_delta
    if (GET_BIT(1)) { // update lf_delta?
      for (let n = 0; n < 4 + 4; ++n) CONDITIONAL_SKIP(6)
    }
  }

  // num partitions
  GET_BIT(2)

  // ParseQuant
  Q ??= GET_BIT(7)

  // base mapping
  Q = (127 - Q) * 100 / 127
  // correction for power-law behavior in low range
  if (Q < 80) {
    Q = (Q / 80.0) ** (1.0 / 0.38) * 80
  }
  return Q
}

$('.media-asset-component').each(async (i, el) => {
  const $component = $(el)
  const $image = $component.find('.media-asset-image')

  const imgUrl = $image.attr('src')
  if (!new URL(imgUrl).pathname.endsWith('.webp'))
    return

  const imgBuffer = await fetch(imgUrl).then(response => response.arrayBuffer())

  const riff = parseRIFF(imgBuffer)

  let lossy = 0
  let lossless = 0
  let qs = 0
  let ds = 0
  for (const chunk of riff.subchunks) {
    let frame
    let duration = 1

    if (chunk.header === 'ANMF') {
      frame = chunk.subchunks.find(c => ['VP8 ', 'VP8L'].includes(c.header))
      duration = chunk.duration
    }
    else if (['VP8 ', 'VP8L'].includes(chunk.header)) {
      frame = chunk
    }

    if (!frame)
      continue

    const fq = estimateQuality(frame)

    if (fq === 101) {
      lossless += duration
    }
    else {
      lossy += duration
    }

    ds += duration
    qs += fq * duration
  }
  const q = qs / ds

  let s
  if (q === 101) {
    s = 'Lossless'
  }
  else if (lossless > 0) {
    s = `${lossy} Lossy / ${lossless} Lossless (${q.toFixed(2)})`
  }
  else {
    s = `Lossy (${q.toFixed(2)})`
  }

  $component.children().last().append($('<span>', { text: `WEBP: ${s}` }))
})
