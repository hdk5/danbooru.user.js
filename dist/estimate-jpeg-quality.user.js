// ==UserScript==
// @name         Danbooru - Estimate JPEG quality
// @author       hdk5
// @version      20241206012823
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/estimate-jpeg-quality.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/estimate-jpeg-quality.user.js
// @match        *://*.donmai.us/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/md5.min.js
// ==/UserScript==

/* globals
  $
  CryptoJS
*/

const markerLenBytes = {
  /* eslint-disable antfu/consistent-list-newline */
  0x00: 0, 0x01: 0,
  0xD0: 0, 0xD1: 0, 0xD2: 0, 0xD3: 0, 0xD4: 0, 0xD5: 0, 0xD6: 0, 0xD7: 0,
  0xD8: 0, 0xD9: 0, 0xDA: 0,
  0x30: 0, 0x31: 0, 0x32: 0, 0x33: 0, 0x34: 0, 0x35: 0, 0x36: 0, 0x37: 0,
  0x38: 0, 0x39: 0, 0x3A: 0, 0x3B: 0, 0x3C: 0, 0x3D: 0, 0x3E: 0, 0x3F: 0,
  0x4F: 0,
  0x92: 0, 0x93: 0,
  0x74: 4, 0x75: 4, 0x77: 4,
  /* eslint-enable antfu/consistent-list-newline */
}

function extractJPEGMetadata(data) {
  const dqtList = []
  let subsampling

  let offset = 0

  for (; offset < data.length - 1; offset++) {
    if (data[offset] === 0xFF && data[offset + 1] === 0xD8)
      break
  }

  offset += 2

  for (; offset < data.length - 1; offset++) {
    if (data[offset] !== 0xFF)
      continue

    const marker = data[offset + 1]

    if (marker === 0xFF)
      continue
    if (marker === 0xD9 || marker === 0xDA || marker === 0x93)
      break

    let length = 0
    for (let n = 0; n < (markerLenBytes[marker] ?? 2); n++) {
      length <<= 8
      length |= data[offset + 2 + n]
    }

    const segment = data.slice(offset + 2 + 2, offset + 2 + length)
    offset += length + 1

    // DQT
    // https://github.com/exiftool/exiftool/blob/b6d6096376f940912506e2df7a11ce57ac144269/lib/Image/ExifTool.pm#L7422
    if (marker === 0xDB) {
      const num = segment[0] & 0x0F // table number
      dqtList[num] = segment
    }

    // SOF
    // https://github.com/exiftool/exiftool/blob/b6d6096376f940912506e2df7a11ce57ac144269/lib/Image/ExifTool.pm#L7204
    if ((marker & 0xF0) === 0xC0 && (marker === 0xC0 || (marker & 0x03)) && subsampling === undefined) {
      subsampling = ''
      for (let i = 0; i < segment[5]; ++i) {
        const factor = segment[6 + 3 * i + 1]
        subsampling += (factor >> 4)
        subsampling += (factor & 0x0F)
      }
    }
  }

  return { dqtList, subsampling }
}

// https://github.com/exiftool/exiftool/blob/b6d6096376f940912506e2df7a11ce57ac144269/lib/Image/ExifTool/JPEGDigest.pm#L2450
function estimateQuality(dqtList) {
  const qtbl = []
  let sum = 0
  dqtList.filter(dqt => dqt !== undefined).forEach((dqt) => {
    for (let i = 1; i + 64 <= dqt.length; i += 65) {
      const qt = dqt.slice(i, i + 64)
      qt.forEach(v => sum += v)
      qtbl.push(qt)
    }
  })

  if (qtbl.length === 0)
    return undefined

  let hash = []
  let sums = []
  let qval = qtbl[0][2] + qtbl[0][53]
  if (qtbl.length > 1) {
    qval += qtbl[1][0] + qtbl[1][63]
    hash = [
      /* eslint-disable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
      1020, 1015,  932,  848,  780,  735,  702,  679,  660,  645,
       632,  623,  613,  607,  600,  594,  589,  585,  581,  571,
       555,  542,  529,  514,  494,  474,  457,  439,  424,  410,
       397,  386,  373,  364,  351,  341,  334,  324,  317,  309,
       299,  294,  287,  279,  274,  267,  262,  257,  251,  247,
       243,  237,  232,  227,  222,  217,  213,  207,  202,  198,
       192,  188,  183,  177,  173,  168,  163,  157,  153,  148,
       143,  139,  132,  128,  125,  119,  115,  108,  104,   99,
        94,   90,   84,   79,   74,   70,   64,   59,   55,   49,
        45,   40,   34,   30,   25,   20,   15,   11,    6,    4,
      /* eslint-enable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
    ]
    sums = [
      /* eslint-disable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
      32640, 32635, 32266, 31495, 30665, 29804, 29146, 28599, 28104, 27670,
      27225, 26725, 26210, 25716, 25240, 24789, 24373, 23946, 23572, 22846,
      21801, 20842, 19949, 19121, 18386, 17651, 16998, 16349, 15800, 15247,
      14783, 14321, 13859, 13535, 13081, 12702, 12423, 12056, 11779, 11513,
      11135, 10955, 10676, 10392, 10208,  9928,  9747,  9564,  9369,  9193,
       9017,  8822,  8639,  8458,  8270,  8084,  7896,  7710,  7527,  7347,
       7156,  6977,  6788,  6607,  6422,  6236,  6054,  5867,  5684,  5495,
       5305,  5128,  4945,  4751,  4638,  4442,  4248,  4065,  3888,  3698,
       3509,  3326,  3139,  2957,  2775,  2586,  2405,  2216,  2037,  1846,
       1666,  1483,  1297,  1109,   927,   735,   554,   375,   201,   128,
      /* eslint-enable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
    ]
  }
  else {
    hash = [
      /* eslint-disable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
      510,  505,  422,  380,  355,  338,  326,  318,  311,  305,
      300,  297,  293,  291,  288,  286,  284,  283,  281,  280,
      279,  278,  277,  273,  262,  251,  243,  233,  225,  218,
      211,  205,  198,  193,  186,  181,  177,  172,  168,  164,
      158,  156,  152,  148,  145,  142,  139,  136,  133,  131,
      129,  126,  123,  120,  118,  115,  113,  110,  107,  105,
      102,  100,   97,   94,   92,   89,   87,   83,   81,   79,
       76,   74,   70,   68,   66,   63,   61,   57,   55,   52,
       50,   48,   44,   42,   39,   37,   34,   31,   29,   26,
       24,   21,   18,   16,   13,   11,    8,    6,    3,    2,
      /* eslint-enable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
    ]
    sums = [
      /* eslint-disable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
      16320, 16315, 15946, 15277, 14655, 14073, 13623, 13230, 12859, 12560,
      12240, 11861, 11456, 11081, 10714, 10360, 10027,  9679,  9368,  9056,
       8680,  8331,  7995,  7668,  7376,  7084,  6823,  6562,  6345,  6125,
       5939,  5756,  5571,  5421,  5240,  5086,  4976,  4829,  4719,  4616,
       4463,  4393,  4280,  4166,  4092,  3980,  3909,  3835,  3755,  3688,
       3621,  3541,  3467,  3396,  3323,  3247,  3170,  3096,  3021,  2952,
       2874,  2804,  2727,  2657,  2583,  2509,  2437,  2362,  2290,  2211,
       2136,  2068,  1996,  1915,  1858,  1773,  1692,  1620,  1552,  1477,
       1398,  1326,  1251,  1179,  1109,  1031,   961,   884,   814,   736,
        667,   592,   518,   441,   369,   292,   221,   151,    86,    64,
      /* eslint-enable style/indent, style/no-multi-spaces, antfu/consistent-list-newline */
    ]
  }

  for (let i = 0; i < 100; i++) {
    if (qval >= hash[i] || sum >= sums[i])
      return i + 1
  }
}

$('.media-asset-component').each(async (i, el) => {
  const $component = $(el)
  const $image = $component.find('.media-asset-image')

  const imgUrl = $image.attr('src')
  if (!imgUrl.endsWith('.jpg'))
    return

  const imgBuffer = await fetch(imgUrl).then(response => response.arrayBuffer())
  const imgData = new Uint8Array(imgBuffer)

  const { dqtList, subsampling } = extractJPEGMetadata(imgData)
  const quality = estimateQuality(dqtList) ?? 'unknown'
  const dqtString = dqtList.filter(dqt => dqt !== undefined).map(dqt => String.fromCharCode.apply(null, dqt)).join('\0')

  let dqtHash = CryptoJS.MD5(dqtString).toString()
  if (subsampling !== null)
    dqtHash += `:${subsampling}`
  dqtHash += ` <${quality}>`

  $component.children().last().append($('<span>', { text: dqtHash }))
})
