export function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let particles = []
  let mouse = { x: -1000, y: -1000 }
  let animationId

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const parent = canvas.parentElement
    const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect()
    const width = Math.max(1, Math.floor(rect.width))
    const height = Math.max(1, Math.floor(rect.height))

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function getParticleCount() {
    return window.innerWidth < 768 ? 45 : 100
  }

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * canvas.offsetWidth
      this.y = Math.random() * canvas.offsetHeight
      this.size = Math.random() * 3 + 1
      this.speedY = -(Math.random() * 0.3 + 0.1)
      this.speedX = (Math.random() - 0.5) * 0.2
      this.opacity = Math.random() * 0.3 + 0.05
      this.sineOffset = Math.random() * Math.PI * 2
      this.sineSpeed = Math.random() * 0.01 + 0.005
      this.sineAmplitude = Math.random() * 20 + 10
      this.time = 0
      // Shape: 0 = circle, 1 = diamond, 2 = hexagon
      this.shape = Math.floor(Math.random() * 3)
    }

    update() {
      this.time++
      this.y += this.speedY
      this.x += Math.sin(this.time * this.sineSpeed + this.sineOffset) * 0.3

      // Mouse repulsion
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const force = (120 - dist) / 120
        this.x += (dx / dist) * force * 2
        this.y += (dy / dist) * force * 2
      }

      // Reset when off screen
      if (this.y < -10) {
        this.reset()
        this.y = canvas.offsetHeight + 10
      }
    }

    draw() {
      ctx.save()
      ctx.globalAlpha = this.opacity
      ctx.fillStyle = '#00d4ff'
      ctx.translate(this.x, this.y)

      if (this.shape === 0) {
        // Circle
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (this.shape === 1) {
        // Diamond
        ctx.beginPath()
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2)
      } else {
        // Hexagon
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6
          const px = Math.cos(angle) * this.size * 1.2
          const py = Math.sin(angle) * this.size * 1.2
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()
    }
  }

  function init() {
    particles = []
    const count = getParticleCount()
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    particles.forEach(p => {
      p.update()
      p.draw()
    })
    animationId = requestAnimationFrame(animate)
  }

  // Event listeners
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -1000
    mouse.y = -1000
  })

  window.addEventListener('resize', () => {
    resize()
    init()
  })

  resize()
  init()
  animate()

  return () => {
    cancelAnimationFrame(animationId)
  }
}
