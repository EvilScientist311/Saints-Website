document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]')

  if (!link) return

  const hash = link.getAttribute('href')
  const target = hash && hash !== '#' ? document.querySelector(hash) : null

  if (!target) return

  event.preventDefault()

  const desktopNav = document.querySelector('#nav')
  const mobileNav = document.querySelector('#navButton')
  const mobileVisible = mobileNav && getComputedStyle(mobileNav).display !== 'none'
  const offset = mobileVisible ? mobileNav.offsetHeight : desktopNav.offsetHeight
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
  history.pushState(null, '', hash)
})

document.querySelector('#year').textContent = new Date().getFullYear()

const lightbox = document.querySelector('#gallery-lightbox')
const lightboxImage = lightbox.querySelector('img')
const lightboxCaption = lightbox.querySelector('p')
const lightboxClose = lightbox.querySelector('.lightbox-close')
const lightboxPrevious = lightbox.querySelector('.lightbox-previous')
const lightboxNext = lightbox.querySelector('.lightbox-next')
const galleryButtons = [...document.querySelectorAll('.gallery-button')]
const galleryPreview = document.querySelector('.saints-gallery')
const galleryFigures = [...galleryPreview.querySelectorAll('figure')]
const galleryPrevious = galleryPreview.querySelector('.gallery-grid-previous')
const galleryNext = galleryPreview.querySelector('.gallery-grid-next')
let activeGallery = []
let activeIndex = 0
let touchStartX = 0
let previewStart = 0
let previewTouchStartX = 0
let previewTouchStartY = 0

const showPreview = start => {
  previewStart = (start + galleryFigures.length) % galleryFigures.length

  galleryFigures.forEach(figure => {
    figure.classList.remove('is-visible', 'is-featured', 'gallery-slot-1', 'gallery-slot-2', 'gallery-slot-3', 'gallery-slot-4', 'gallery-slot-5')
  })

  for (let slot = 0; slot < 5; slot += 1) {
    const figure = galleryFigures[(previewStart + slot) % galleryFigures.length]

    figure.classList.add('is-visible', `gallery-slot-${slot + 1}`)
    if (slot === 0) figure.classList.add('is-featured')
  }
}

const showImage = index => {
  activeIndex = (index + activeGallery.length) % activeGallery.length
  const button = activeGallery[activeIndex]
  const image = button.querySelector('img')

  lightboxImage.src = button.dataset.full
  lightboxImage.alt = image.alt
  lightboxCaption.textContent = image.alt
}

const openGallery = (gallery, index = 0) => {
  activeGallery = galleryButtons.filter(button => button.dataset.gallery === gallery)
  showImage(index)
  lightbox.showModal()
  lightboxClose.focus()
}

galleryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const group = galleryButtons.filter(item => item.dataset.gallery === button.dataset.gallery)
    openGallery(button.dataset.gallery, group.indexOf(button))
  })
})

galleryPrevious.addEventListener('click', () => showPreview(previewStart - 1))
galleryNext.addEventListener('click', () => showPreview(previewStart + 1))

galleryPreview.addEventListener('touchstart', event => {
  previewTouchStartX = event.changedTouches[0].screenX
  previewTouchStartY = event.changedTouches[0].screenY
}, { passive: true })

galleryPreview.addEventListener('touchend', event => {
  const distanceX = event.changedTouches[0].screenX - previewTouchStartX
  const distanceY = event.changedTouches[0].screenY - previewTouchStartY

  if (Math.abs(distanceX) < 50 || Math.abs(distanceX) <= Math.abs(distanceY)) return

  showPreview(previewStart + (distanceX < 0 ? 1 : -1))
}, { passive: true })

lightboxClose.addEventListener('click', () => lightbox.close())
lightboxPrevious.addEventListener('click', () => showImage(activeIndex - 1))
lightboxNext.addEventListener('click', () => showImage(activeIndex + 1))

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close()
})

lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showImage(activeIndex - 1)
  if (event.key === 'ArrowRight') showImage(activeIndex + 1)
})

lightbox.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX
}, { passive: true })

lightbox.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX

  if (Math.abs(distance) < 50) return

  showImage(activeIndex + (distance < 0 ? 1 : -1))
}, { passive: true })
