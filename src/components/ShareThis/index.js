export default {
  name: 'share-this',
  props: {
    shareThisElementId: {
      type: String,
      default: 'st-2'
    },
    shareThisEmbedUrl: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: ''
    }
  },
  beforeDestroy() {
    const element = document.getElementById(this.shareThisElementId)
    if (element) {
      element.style.display = 'none'
    }
  },
  render() {
    console.log(this.url)
    if (window.__sharethis__) {
      window.__sharethis__.href = this.url
      const element = document.getElementById(this.shareThisElementId)
      if (element) {
        element.style.display = 'block'
      }
    } else {
      const shareScript = document.createElement('script')
      shareScript.setAttribute('src', this.shareThisEmbedUrl)
      shareScript.setAttribute('async', 'true')
      shareScript.onload = () => {
        window.__sharethis__.href = this.url
      }
      document.head.appendChild(shareScript)
    }
    return <div style="text-align:left;" class="sharethis-inline-share-buttons"></div>
  }
}
