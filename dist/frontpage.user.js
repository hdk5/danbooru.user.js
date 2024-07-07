// ==UserScript==
// @name         Danbooru - Frontpage
// @namespace    danbooru.hdk5
// @version      1.0.4
// @description  Bring back the front page and catgirls post counter
// @author       hdk5
// @match        *://*.donmai.us/
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @run-at       document-start
// @homepageURL  https://github.com/hdk5/danbooru-frontpage.user.js
// @supportURL   https://github.com/hdk5/danbooru-frontpage.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru-frontpage.user.js/raw/master/danbooru-frontpage.user.js
// @downloadURL  https://github.com/hdk5/danbooru-frontpage.user.js/raw/master/danbooru-frontpage.user.js
// @resource     counter-0 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/0.gif
// @resource     counter-1 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/1.gif
// @resource     counter-2 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/2.gif
// @resource     counter-3 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/3.gif
// @resource     counter-4 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/4.gif
// @resource     counter-5 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/5.gif
// @resource     counter-6 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/6.gif
// @resource     counter-7 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/7.gif
// @resource     counter-8 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/8.gif
// @resource     counter-9 https://raw.githubusercontent.com/hdk5/danbooru-frontpage.user.js/da419aeeb3c27015ba74c2819c0ea7f1ca32dd26/resource/9.gif
// ==/UserScript==

/* globals $ */

GM_addStyle(`body { visibility: hidden; }`);

document.addEventListener('DOMContentLoaded', () => {
    // https://gitlab.com/hdk5/danbooru/-/blob/c0e5fd445f81497e19391177b1fed6c831a6e391/app/javascript/src/styles/specific/static_index.scss
    GM_addStyle(`
header#top, nav#nav {
    text-align: center;
}

header#top {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1 1 0%;
}

header#top #app-name-header {
    font-size: 4em;
    margin-top: 1em;
    margin-left: auto;
    margin-right: auto;
    height: unset;
}

#maintoggle {
  display: none !important;
}

header#top nav#nav {
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
}

header#top nav#nav menu#main-menu {
    background-color: unset;
}

div#page {
    flex: 2 1 0%;
}

form#search-box-form {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2em;
    justify-content: center;
}

form#search-box-form input#tags {
    max-width: 400px;
}

div#counter-girls {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
    margin-left: auto;
    margin-right: auto;
}

div.counter-girl img {
    width: 100%;
}
    `);

    // https://gitlab.com/hdk5/danbooru/-/blob/c0e5fd445f81497e19391177b1fed6c831a6e391/app/views/static/index.html.erb
    let $cStatic = $(`<div id="c-static"></div>`);
    let $aIndex = $('<div id="a-index"></div>');
    $cStatic.append($aIndex);

    let $searchBoxForm = $('form#search-box-form');
    $aIndex.append($searchBoxForm)

    let postCount = $("article[data-id]").attr('data-id') || "";
    let $counterGirls = $(`<div id="counter-girls"></div>`);
    postCount.split('').forEach((n) => {
        $counterGirls.append(
            $('<div>', {
                class: 'counter-girl',
                html: $('<img>', {
                    src: GM_getResourceURL(`counter-${n}`),
                    alt: n,
                }),
            }),
        );
    });
    $aIndex.append($counterGirls);

    $('.current').removeClass('current');
    $('menu#subnav-menu').remove();
    $('#c-posts').remove();
    $('#page').append($cStatic);

    GM_addStyle(`body { visibility: unset; }`);
});
