if (!customElements.get('f-media-gallery')) {
	customElements.define('f-media-gallery', class MediaGallery extends HTMLElement {
		constructor() {
			super()
			this.selectors = {
				xrButton: '[data-first-xr-button]',
				mainSlider: 'f-swiper-carousel-component'
			}
			this.Utils = window.Foxify.Utils
		}
		connectedCallback() {
			this.domNodes = this.Utils.queryDomNodes(this.selectors, this)
			this.mediaLayout = this.dataset.layout
			if (this.domNodes.mainSlider) {
				this.check = setInterval(() => {
					this.mainSlider = this.domNodes.mainSlider.mainSwiper

					if (this.mainSlider && typeof this.mainSlider == 'object') {
						clearInterval(this.check)
						this.mainSlider.on('slideChange', this.onSlideChanged.bind(this))
					}
				}, 100)
			}
		}

		onSlideChanged() {
			const {realIndex, slides} = this.mainSlider
			this.activeMedia = slides[realIndex]
			this.playActiveMedia(this.activeMedia)
		}

		playActiveMedia(selected) {
			window.Foxify.Utils.pauseAllMedia()
			this.activeMedia = selected
			this.activeMediaType = this.activeMedia.dataset.mediaType
			const deferredMedia = selected.querySelector('f-deferred-media')
			if (deferredMedia) deferredMedia.loadContent(false)

			if (this.activeMediaType !== 'image') {
				this.classList.add('auto-hide-controls')
			} else {
				this.classList.remove('auto-hide-controls')
			}
		}

		setActiveMedia(mediaId) {
			const selectedMedia = this.querySelector(`[data-media-id="${mediaId}"]`)
			if (!selectedMedia) return;
			const mediaIndex = Number(selectedMedia.dataset.mediaIndex)
			this.scrollIntoView(selectedMedia)

			this.preventStickyHeader()
			if (this.mainSlider) this.mainSlider.slideTo(mediaIndex)
		}

		preventStickyHeader() {
			this.stickyHeader = this.stickyHeader || document.querySelector('f-sticky-header');
			if (!this.stickyHeader) return;
			this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'))
		}
		scrollIntoView(selectedMedia) {
			// if (this.mediaLayout === 'carousel') return false;
			// selectedMedia.scrollIntoView({
			// 	behavior: 'smooth'
			// })
		}
	})
}
