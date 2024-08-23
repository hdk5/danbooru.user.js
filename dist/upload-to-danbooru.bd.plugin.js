/**
 * @name UploadToDanbooru
 * @author hdk5
 * @authorId 219173750980083712
 * @version 20240823135202
 * @description Quickly upload media to danbooru
 * @source https://github.com/hdk5/danbooru.user.js
 * @updateUrl https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.bd.plugin.js
 */

const DEFAULT_BOORU = 'https://danbooru.donmai.us/'

module.exports = class UploadToDanbooru {
  constructor(meta) {
    this.meta = meta
    this.settings = {
      booru: '',
    }
  }

  start() {
    Object.assign(this.settings, BdApi.Data.load(this.meta.name, 'settings'))

    this.unpatchMessageContext = BdApi.ContextMenu.patch('message', (menu, props) => {
      if (props.mediaItem === undefined)
        return

      const copyLinkFilter = button => button?.key === 'copy-native-link'
      const copyLinkParent = BdApi.Utils.findInTree(menu, e => Array.isArray(e) && e.some(copyLinkFilter))

      if (copyLinkParent === undefined)
        return
      if (copyLinkParent.some(button => button?.props?.id === this.meta.slug))
        return

      const uploadUrl = new URL('uploads/new', this.settings.booru || DEFAULT_BOORU)
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

  getSettingsPanel() {
    const settingsPanel = Object.assign(document.createElement('div'), {
      id: 'utd-settings',
    })
    const booruSettingsItem = Object.assign(document.createElement('div'), {
      className: 'bd-setting-item',
    })
    const booruSettingsHeader = Object.assign(document.createElement('div'), {
      className: 'bd-setting-header',
    })
    const booruSettingsLabel = Object.assign(document.createElement('label'), {
      for: 'utd-settings-booru',
      className: 'bd-setting-title',
      textContent: 'Danbooru URL',
    })
    const booruSettingsInput = Object.assign(document.createElement('input'), {
      type: 'text',
      name: 'utd-settings-booru',
      id: 'utd-settings-booru',
      value: this.settings.booru,
      placeholder: DEFAULT_BOORU,
    })
    booruSettingsInput.addEventListener('change', (e) => {
      this.settings.booru = e.target.value
      BdApi.Data.save(this.meta.name, 'settings', this.settings)
    })
    settingsPanel.append(booruSettingsItem)
    booruSettingsItem.append(booruSettingsHeader)
    booruSettingsHeader.append(booruSettingsLabel)
    booruSettingsItem.append(booruSettingsInput)

    return settingsPanel
  }
}
