import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initTextReveal() {
  document.querySelectorAll('[data-text-reveal]').forEach((el) => {
    // Preserve inner HTML (including spans like .hero__title-accent)
    const original = el.innerHTML
    // Split text nodes into words while keeping HTML tags intact
    const fragment = document.createElement('div')
    fragment.innerHTML = original

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
            const inner = document.createElement('span')
            inner.className = 'word-inner'
            inner.textContent = word
            wrap.appendChild(inner)
            frag.appendChild(wrap)
          }
        })
        node.parentNode.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Process children of elements (like <span class="hero__title-accent">)
        Array.from(node.childNodes).forEach(processNode)
      }
    }

    Array.from(el.childNodes).forEach(processNode)

    const wordInners = el.querySelectorAll('.word-inner')

    // Check if element is already in viewport (hero, top of page)
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0

    if (isInView) {
      // Animate immediately for elements already visible
      gsap.from(wordInners, {
        y: '100%',
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3,
      })
    } else {
      // Use ScrollTrigger for elements below the fold
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
