// ==UserScript==
// @name         Danbooru - Is First Upload?
// @author       hdk5
// @version      20260105094153
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/is-first-upload.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/is-first-upload.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

/* globals
  $
*/

function getRelativeTimeString(date) {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const seconds = Math.floor(difference / 1000);

  const cutoffs = [
    60,
    60 * 60,
    60 * 60 * 24,
    60 * 60 * 24 * 7,
    60 * 60 * 24 * 30,
    60 * 60 * 24 * 365,
    Infinity,
  ];
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(seconds));
  const unit = units[unitIndex];
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const value = Math.floor(seconds / divisor);

  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });
  return rtf.format(value, unit);
}

$('.media-asset-component').each(async (i, el) => {
  const $media_asset_component = $(el);

  const user_id = $('body').data(`current-user-id`);
  const media_asset_id = $('body').data(`media-asset-id`) // media asset page
    || Number.parseInt($('#media_asset_id').val(), 10); // upload page
  const media_asset = await $.get(`/media_assets/${media_asset_id}.json`);
  const upload_media_assets = await $.get('/upload_media_assets.json', {
    limit: 1,
    page: 'a0',
    search: {
      media_asset_id,
      upload: {
        uploader_id: user_id,
      },
    },
  });
  const upload_media_asset = upload_media_assets[0];
  const created_at = new Date(media_asset.created_at);
  const is_first_upload = upload_media_asset && (new Date(upload_media_asset.created_at) <= created_at);

  const created_at_str = getRelativeTimeString(created_at);
  const buttonText = is_first_upload ? 'First Upload' : 'Not First Upload';
  const button = $('<a>', {
    class: `button-xs ${is_first_upload ? 'button-primary' : 'button-danger'}`,
    text: `${buttonText} (${created_at_str})`,
    href: `/upload_media_assets?search[media_asset_id]=${media_asset_id}&search[upload][uploader_id]=${user_id}`,
  });

  $media_asset_component.find('> div:last').append(button);
});
