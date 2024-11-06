// ==UserScript==
// @name         Danbooru - Dock Edit Form
// @author       hdk5
// @version      20241106223343
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/editform-dock.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/editform-dock.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

/* globals
  Danbooru
  $
*/

if ($('#c-posts #a-show').length) {
  const uploadEditPanelDock = JSON.parse(Danbooru.Cookie.get('upload_edit_panel_dock') || JSON.stringify('auto'))
  const uploadEditContainerWidth = Danbooru.Cookie.get('upload_edit_container_width')

  const assetWidth = $('body').attr('data-post-image-width')
  const assetHeight = $('body').attr('data-post-image-height')
  const { assetUrl, assetImage } = (() => {
    let assetUrl, assetImage

    const videoUrl = $('meta[property=\'og:video\']').attr('content')
    const imageUrl = $('meta[property=\'og:image\']').attr('content')

    if (videoUrl) {
      assetUrl = videoUrl
      assetImage = $(`
        <video
          width="${assetWidth}"
          height="${assetHeight}"
          autoplay="autoplay"
          loop="loop"
          controls="controls"
          class="media-asset-image"
        >
      `)
    }
    else {
      assetUrl = imageUrl
      assetImage = $(`
        <img
          width="${assetWidth}"
          height="${assetHeight}"
          draggable="false"
          class="media-asset-image"
        >
      `)
    }

    return { assetUrl, assetImage }
  })()

  const assetDesc = (() => {
    const postInfoSize = $('#post-info-size').text()
    const size = /Size: (.*)/.exec(postInfoSize)[1]
    const dims = /\((.*)\)/.exec(postInfoSize)[1]
    return `${size}, ${dims}`
  })()
  const assetPageUrl = $('#post-info-size a:last-of-type').attr('href')

  const cPosts = $('#c-posts')

  const cUploads = $(`
    <div id="c-uploads">
      <div id="a-show">
        <div id="p-single-asset-upload" class="h-full">
          <div class="upload-container h-full"
              x-data="{ dock: $persist('${uploadEditPanelDock}').as('upload_edit_panel_dock').using(Danbooru.Cookie) }"
              x-bind:data-dock="dock"
              data-dock="${uploadEditPanelDock}"
          >
            <div class="upload-image-container">
              <div
                class="media-asset-component media-asset-component-fit-height media-asset-component-fit-width flex flex-col h-full top-0"
                data-dynamic-height="false"
                data-scroll-on-zoom="true"
                style="--header-initial-height: 0px; --header-visible-height: 0px; --media-asset-width: ${assetWidth}; --media-asset-height: ${assetHeight};"
              >
                <div class="media-asset-container relative max-h-inherit overflow-hidden mx-auto">
                  <div
                    class="media-asset-zoom-level hidden absolute top-0.5 left-0.5 p-1 m-0.5 leading-none rounded text-xs font-arial font-bold pointer-events-none transition-opacity"
                  >
                    100%
                  </div>
                </div>
                <div class="flex flex-wrap flex-none gap-2 items-center justify-center text-xs my-1">
                  <a href="${assetPageUrl}">${assetDesc}</a>
                </div>
              </div>
            </div>
            <div class="upload-divider px-4 cursor-col-resize"></div>
            <div class="upload-edit-container">
              <div class="inline-block float-right mx-1">
                <a class="inactive-link" href="javascript:void(0)" aria-expanded="false">
                  <svg class="icon svg-icon close-icon" viewBox="0 0 320 512"><use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#xmark"></use></svg>
                </a>
              </div>
              <div class="popup-menu inline-block float-right mx-1" data-hide-on-click="true">
                <a class="popup-menu-button inactive-link" href="javascript:void(0)" aria-expanded="false">
                  <svg class="icon svg-icon ellipsis-icon" viewBox="0 0 448 512"><use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#ellipsis"></use></svg>
                </a>
                <ul class="popup-menu-content">
                  <li>
                    <a x-on:click="dock = 'auto'" id="dock-auto-link" title="Rotate your screen to change layout" href="javascript:void(0)">
                      <svg class="icon svg-icon rotate-icon" viewBox="0 0 512 512">
                        <use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#rotate"></use>
                      </svg> Automatic
                    </a>
                  </li>
                  <li>
                    <a x-on:click="dock = 'right'" id="dock-right-link" data-shortcut="shift+r" href="javascript:void(0)" title="Shortcut is shift+r">
                      <svg class="icon svg-icon dock-right-icon" viewBox="0 0 1024 1024">
                        <use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#dock-right"></use>
                      </svg> Dock to Right
                    </a>
                  </li>
                  <li>
                    <a x-on:click="dock = 'bottom'" id="dock-bottom-link" data-shortcut="shift+b" href="javascript:void(0)" title="Shortcut is shift+b">
                      <svg class="icon svg-icon dock-bottom-icon" viewBox="0 0 1024 1024">
                        <use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#dock-bottom"></use>
                      </svg> Dock to Bottom
                    </a>
                  </li>
                  <li>
                    <a x-on:click="dock = 'left'" id="dock-left-link" data-shortcut="shift+l" href="javascript:void(0)" title="Shortcut is shift+l">
                      <svg class="icon svg-icon dock-left-icon" viewBox="0 0 1024 1024">
                        <use fill="currentColor" href="/packs/static/images/icons-f4ca0cd60cf43cc54f9a.svg#dock-left"></use>
                      </svg> Dock to Left
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `)

  if (uploadEditContainerWidth !== null)
    cUploads.find('.upload-container').css('--edit-container-width', uploadEditContainerWidth)

  cUploads.find('.media-asset-container').append(assetImage)
  cUploads
    .find('.close-icon')
    .closest('div')
    .on('click.danbooru', (e) => {
      Danbooru.Post.close_edit_dialog()
      e.preventDefault()
    })

  const mediaAssetComponent = new Danbooru.MediaAssetComponent(cUploads.find('.media-asset-component'))

  const editSection = cPosts.find('#edit')

  Danbooru.Post.open_edit_dialog = function () {
    cPosts.detach()

    // Don't load right away in case of shit internet
    assetImage.attr('src', assetUrl)

    editSection.css('display', '')
    editSection.detach()
    cUploads.find('.upload-edit-container').append(editSection)

    $('#page').append(cUploads)

    Danbooru.RelatedTag.show()
    mediaAssetComponent.updateHeight()
    mediaAssetComponent.updateZoom()

    $('#post_tag_string').selectEnd()
  }

  Danbooru.Post.close_edit_dialog = function () {
    cUploads.detach()

    editSection.detach()
    cPosts.find('#content').append(editSection)

    $('#page').append(cPosts)
  }
}
