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
let activeGallery = []
let activeIndex = 0
let touchStartX = 0

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

document.querySelectorAll('.view-all-photos').forEach(button => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery))
})

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
