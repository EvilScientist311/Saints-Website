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

document.querySelectorAll('.gallery-button').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img')

    lightboxImage.src = button.dataset.full
    lightboxImage.alt = image.alt
    lightboxCaption.textContent = image.alt
    lightbox.showModal()
    lightboxClose.focus()
  })
})

lightboxClose.addEventListener('click', () => lightbox.close())

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close()
})
