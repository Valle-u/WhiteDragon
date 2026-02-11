import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initTextReveal() {
  document.querySelectorAll('[data-text-reveal]').forEach((el) => {
    // SAFETY: Skip elements inside hero sections — hero has its own animation
    if (el.closest('.hero')) return

    // SAFETY: Skip elements that use background-clip: text (gradient text)
    const style = window.getComputedStyle(el)
    if (style.webkitBackgroundClip === 'text' || style.backgroundClip === 'text') return

    // If already processed, reset to clean state
    if (el.dataset.textRevealReady) {
      const existingWords = el.querySelectorAll('.word-inner')
      if (existingWords.length) {
        gsap.killTweensOf(existingWords)
        gsap.set(existingWords, { y: 0, opacity: 1, clearProps: 'all' })
      }
      return
    }

    // Mark as processed to prevent double-processing
    el.dataset.textRevealReady = 'true'

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        words.forEach((word) => {
          if (/^\s+$/.test(word) || word === '') {
            frag.appendChild(document.createTextNode(word))
          } else {
            const wrap = document.createElement('span')
            wrap.className = 'word-wrap'
            wrap.style.display = 'inline-block'
            wrap.style.overflow = 'hidden'
            wrap.style.verticalAlign = 'top'
            const inner = document.createElement('span')
            inner.className = 'word-inner'
            inner.style.display = 'inline-block'
            inner.textContent = word
            wrap.appendChild(inner)
            frag.appendChild(wrap)
          }
        })
        node.parentNode.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode)
      }
    }

    Array.from(el.childNodes).forEach(processNode)

    const wordInners = el.querySelectorAll('.word-inner')

    if (!wordInners.length) return

    // First: set all words to their final (visible) state explicitly
    gsap.set(wordInners, { y: 0, opacity: 1 })

    // Check if element is in viewport
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0

    if (isInView) {
      // Small delay for page-load feel, then animate from hidden to visible
      gsap.from(wordInners, {
        y: '100%',
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3,
      })
    } else {
      gsap.from(wordInners, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: '100%',
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  })
}
