// ==UserScript==
// @name         Danbooru - Fix Pixiv Source
// @author       hdk5
// @version      20250727111143
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/fix-pixiv-source.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/fix-pixiv-source.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

/* globals
  Danbooru
  $
*/

async function fix_pixiv_source() {
  const location_match = window.location.pathname.match(/^\/uploads\/(\d+)(\/|$)/);

  const upload_id = location_match && location_match[1];
  if (!upload_id)
    return Danbooru.Notice.error('not on upload page');

  const data = await $.get(`/uploads/${upload_id}.json`, {
    only: 'media_assets[id,post[id]],upload_media_assets[id,media_asset_id,source_url]',
  });

  const media_assets = {};
  for (const media_asset of data.media_assets) {
    media_assets[media_asset.id] = media_asset;
  }

  for (const upload_media_asset of data.upload_media_assets) {
    upload_media_asset.media_asset = media_assets[upload_media_asset.media_asset_id];

    const post_id = upload_media_asset.media_asset.post?.id;
    if (!post_id)
      continue;

    const source_url = upload_media_asset.source_url;
    const source_url_match = source_url.match(/^https:\/\/i\.pximg\.net\/img-original\/img\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d+_p\d+\.\w+$/);
    if (!source_url_match) {
      Danbooru.Notice.error(`not a pixiv url: ${source_url}`);
      continue;
    }

    await $.ajax({
      url: `/posts/${post_id}.json`,
      type: 'PATCH',
      data: {
        'post[source]': source_url,
      },
    });
  }
}

let fix_pixiv_source_promise = null;
$('.source-data-fetch').after(() => $('<a>', {
  class: 'source-data-fix-pixiv-source',
  text: 'Fix Pixiv Source',
  style: 'display: block; margin-top: .25em;',
  href: '#',
  click: async (ev) => {
    ev.preventDefault();
    if (fix_pixiv_source_promise) {
      return;
    }
    Danbooru.Notice.info('fixing pixiv sources...');
    fix_pixiv_source_promise = fix_pixiv_source();
    await fix_pixiv_source_promise;
    fix_pixiv_source_promise = null;
    Danbooru.Notice.info('pixiv sources fixed');
  },
}));
