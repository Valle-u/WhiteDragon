import '../main.js'
import '../../css/pages/empresa.css'
import { initHeroAnimation } from '../animations/hero-animation.js'
import { initScrollAnimations } from '../animations/scroll-animations.js'
import dragonModelUrl from '../../assets/3d/dragon.glb'

const dragonModel = document.querySelector('[data-dragon-model]')
if (dragonModel) {
  dragonModel.setAttribute('src', dragonModelUrl)
}

initHeroAnimation()
initScrollAnimations()
