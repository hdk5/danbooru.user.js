// ==UserScript==
// @name         Danbooru - Panzoom
// @author       hdk5
// @version      20251027162911
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/mediaasset-panzoom.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/mediaasset-panzoom.user.js
// @match        *://*.donmai.us/*
// @grant        none
// @require      https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js
// ==/UserScript==

// Scroll zooms
// Dragging pans
// Alt+scroll rotates
// Click on zoom level resets

/* globals
  $
  panzoom
*/

class MediaAssetComponent {
  static initialize() {
    $('.media-asset-component').each((i, el) => {
      if (el.exPanzoom === undefined) {
        el.exPanzoom = new MediaAssetComponent(el);
      }
    });
  }

  constructor(element) {
    this.$component = $(element);
    this.$component.css('top', '1rem');
    this.$component.css('position', 'sticky');
    this.$component.css('--height', 'calc(max(var(--min-asset-height), 100vh - max(1rem, var(--header-visible-height))))');
    this.$component.css('max-height', 'var(--height)');
    this.$component.css('min-height', 'var(--height)');
    this.$component.css('overflow', 'hidden');
    this.$component.removeClass('media-asset-component-fit-height');

    this.$container = this.$component.find('.media-asset-container');
    this.$container.css('width', '100%');
    this.$container.css('height', '100%');

    this.$zoomLevel = this.$component.find('.media-asset-zoom-level');
    this.$zoomLevel.css('z-index', '1');
    this.$zoomLevel.css('cursor', 'pointer');
    this.$zoomLevel.css('pointer-events', 'all');

    this.$panzoom = $('<div class="media-asset-panzoom"></div>');
    this.$panzoom.css('width', '100%');
    this.$panzoom.css('height', '100%');
    this.$panzoom.css('flex', '1');
    this.$panzoom.css('display', 'flex');
    this.$panzoom.css('align-items', 'center');
    this.$panzoom.css('justify-content', 'center');

    this.$image = this.$component.find('.media-asset-image');
    if (this.$image.length) {
      this.$panzoom.insertBefore(this.$image);
      this.$image.detach().appendTo(this.$panzoom);

      this.$image.off();
      this.$image.css('cursor', 'default');
      this.$image.css('max-height', '100%');
      this.$image.css('max-width', '100%');

      this.minZoom = 0.2;
      this.maxZoom = 15;

      this.panzoom = panzoom(this.$panzoom.get(0), {
        beforeWheel: (event) => this.handleWheel(event),
        maxZoom: this.maxZoom,
        minZoom: this.minZoom
      });

      this.fit();
      this.$zoomLevel.on('click', () => this.fit());

      this.updateZoom();
      this.panzoom.on('zoom', () => {
        const t = this.panzoom.getTransform();
        if (t.scale < this.minZoom) {
          this.panzoom.zoomAbs(t.x, t.y, this.minZoom);
        } else if (t.scale > this.maxZoom) {
          this.panzoom.zoomAbs(t.x, t.y, this.maxZoom);
        }
        this.updateZoom();
      });

      new ResizeObserver(() => this.updateZoom()).observe(this.$image.get(0));
    }
  }

  fit() {
    this.panzoom.zoomAbs(0, 0, 1);
    this.panzoom.moveTo(0, 0);
    this.setRotation(0);
  }

  updateZoom() {
    this.$zoomLevel.removeClass('hidden').text(`${Math.round(100 * this.zoomLevel)}%`);

    // Rendering without smoothing makes checking for artifacts easier
    this.$container.css('image-rendering', this.zoomLevel > 1 ? 'pixelated' : 'auto');
  }

  handleWheel(event) {
    if (!event.altKey) {
      return false;
    }

    event.preventDefault();

    const degrees = Math.sign(event.deltaY) * 15;
    this.setRotation(this.rotation + degrees);

    return true;
  }

  setRotation(angle) {
    this.rotation = angle;
    this.$image.css('transform', `rotate(${this.rotation}deg)`);
  }

  get zoomLevel() {
    return (this.$image.width() * this.panzoom.getTransform().scale) / Number(this.$component.css('--media-asset-width'));
  }
}

$(MediaAssetComponent.initialize);

new MutationObserver((_mutationList, _observer) => {
  $(MediaAssetComponent.initialize);
}).observe(document.body, { childList: true, subtree: true });
