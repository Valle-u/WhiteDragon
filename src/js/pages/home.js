import '../main.js'
import '../../css/pages/home.css'
import { initParticles } from '../animations/particles.js'
import { initHeroAnimation } from '../animations/hero-animation.js'
import { initScrollAnimations } from '../animations/scroll-animations.js'
import { initMarquee } from '../components/marquee.js'
import { initFeatureCards } from '../components/feature-cards.js'
import { initInteractiveEffects } from '../components/interactive-effects.js'

initParticles('heroParticles')
initHeroAnimation()
initScrollAnimations()
initMarquee()
initFeatureCards()
initInteractiveEffects()
