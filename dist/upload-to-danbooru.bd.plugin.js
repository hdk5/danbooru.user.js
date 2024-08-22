/**
 * @name UploadToDanbooru
 * @author hdk5
 * @authorId 219173750980083712
 * @version 20240822000840
 * @description Quickly upload media to danbooru
 * @source https://github.com/hdk5/danbooru.user.js
 * @updateUrl https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.bd.plugin.js
 */

module.exports = class UploadToDanbooru {
  constructor(meta) {
    this.meta = meta
  }

  start() {
    this.unpatchMessageContext = BdApi.ContextMenu.patch('message', (menu, props) => {
      if (props.mediaItem === undefined)
        return

      const copyLinkFilter = button => button?.key === 'copy-native-link'
      const copyLinkParent = BdApi.Utils.findInTree(menu, e => Array.isArray(e) && e.some(copyLinkFilter))

      if (copyLinkParent === undefined)
        return
      if (copyLinkParent.some(button => button?.props?.id === this.meta.slug))
        return

      // TODO: custom booru settings
      const uploadUrl = new URL('uploads/new', 'http://localhost:10115/')
      uploadUrl.searchParams.set('url', props.mediaItem.url)
      uploadUrl.searchParams.set('ref', `https://discord.com/channels/${props.channel.guild_id}/${props.message.channel_id}/${props.message.id}`)

      const uploadButton = BdApi.ContextMenu.buildItem({
        label: 'Upload to Danbooru',
        id: this.meta.menuID,
        action: () => open(uploadUrl),
      })

      copyLinkParent.splice(copyLinkParent.findIndex(copyLinkFilter), 0, uploadButton)
    })
  }

  stop() {
    BdApi.Patcher.unpatchAll(this.meta.slug)
    this.unpatchMessageContext()
  }
}
