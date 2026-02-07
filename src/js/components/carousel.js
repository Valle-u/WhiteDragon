import { gsap } from 'gsap'

export class Carousel {
  constructor(container) {
    this.container = container
    this.track = container.querySelector('.carousel__track')
    this.slides = [...container.querySelectorAll('.carousel__slide')]
    this.currentIndex = 0
    this.isDragging = false
    this.startX = 0
    this.currentX = 0
    this.autoplayInterval = null

    if (!this.track || this.slides.length < 2) return

    this.autoplayDelay = parseInt(container.dataset.carouselAutoplay) || 0
    this.perView = parseInt(container.dataset.carouselPerView) || 1

    this.init()
  }

  init() {
    this.createDots()
    this.setupArrows()
    this.setupDrag()
    this.updateSlideWidths()
    this.goTo(0, false)

    if (this.autoplayDelay) this.startAutoplay()

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay())
    this.container.addEventListener('mouseleave', () => {
      if (this.autoplayDelay) this.startAutoplay()
    })

    // Responsive
    window.addEventListener('resize', () => {
      this.updateSlideWidths()
      this.goTo(this.currentIndex, false)
    })
  }

  updateSlideWidths() {
    const containerWidth = this.container.offsetWidth
    const gap = 32
    const slideWidth = (containerWidth - gap * (this.perView - 1)) / this.perView
    this.slides.forEach((s) => {
      s.style.flex = `0 0 ${slideWidth}px`
      s.style.maxWidth = `${slideWidth}px`
    })
    this.slideWidth = slideWidth + gap
    this.maxIndex = Math.max(0, this.slides.length - this.perView)
  }

  createDots() {
    const dotsContainer = this.container.querySelector('.carousel__dots')
    if (!dotsContainer) return
    this.dotsContainer = dotsContainer

    const count = this.slides.length - (this.perView - 1)
    dotsContainer.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button')
      dot.className = 'carousel__dot'
      dot.setAttribute('aria-label', `Ir a slide ${i + 1}`)
      if (i === 0) dot.classList.add('active')
      dot.addEventListener('click', () => this.goTo(i))
      dotsContainer.appendChild(dot)
    }
  }

  updateDots() {
    if (!this.dotsContainer) return
    const dots = this.dotsContainer.querySelectorAll('.carousel__dot')
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === this.currentIndex)
    })
  }

  setupArrows() {
    const prev = this.container.querySelector('.carousel__arrow--prev')
    const next = this.container.querySelector('.carousel__arrow--next')
    if (prev) prev.addEventListener('click', () => this.prev())
    if (next) next.addEventListener('click', () => this.next())
  }

  setupDrag() {
    this.track.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a')) return
      this.isDragging = true
      this.startX = e.clientX
      this.currentX = -this.currentIndex * this.slideWidth
      this.track.style.cursor = 'grabbing'
      this.stopAutoplay()
    })

    document.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return
      const delta = e.clientX - this.startX
      gsap.set(this.track, { x: this.currentX + delta })
    })

    document.addEventListener('pointerup', (e) => {
      if (!this.isDragging) return
      this.isDragging = false
      this.track.style.cursor = ''
      const delta = e.clientX - this.startX

      if (Math.abs(delta) > 50) {
        if (delta < 0) this.next()
        else this.prev()
      } else {
        this.goTo(this.currentIndex)
      }

      if (this.autoplayDelay) this.startAutoplay()
    })
  }

  goTo(index, animate = true) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex))
    const x = -this.currentIndex * this.slideWidth

    if (animate) {
      gsap.to(this.track, {
        x,
        duration: 0.6,
        ease: 'power3.inOut',
      })
    } else {
      gsap.set(this.track, { x })
    }

    this.updateDots()
  }

  next() {
    if (this.currentIndex >= this.maxIndex) {
      this.goTo(0)
    } else {
      this.goTo(this.currentIndex + 1)
    }
  }

  prev() {
    if (this.currentIndex <= 0) {
      this.goTo(this.maxIndex)
    } else {
      this.goTo(this.currentIndex - 1)
    }
  }

  startAutoplay() {
    this.stopAutoplay()
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay)
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }
}
