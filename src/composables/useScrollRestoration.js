import { nextTick } from 'vue'
import { useRouter } from 'vue-router'

export function useScrollRestoration() {
  const router = useRouter()

  const saveScrollPosition = (key = 'main') => {
    const scrollData = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(`scroll_${key}`, JSON.stringify(scrollData))
  }

  const restoreScrollPosition = async (key = 'main', delay = 0) => {
    await nextTick()

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    const savedData = sessionStorage.getItem(`scroll_${key}`)
    if (savedData) {
      try {
        const { x, y, timestamp } = JSON.parse(savedData)

        // Solo restaurar si la posición es reciente (menos de 5 minutos)
        if (Date.now() - timestamp < 300000) {
          window.scrollTo({ x, y, behavior: 'smooth' })
          return true
        }
      } catch (error) {
        console.error('Error restaurando scroll:', error)
      }
    }

    // Scroll al top por defecto
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  }

  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  const scrollToElement = (selector, offset = 0) => {
    const element = document.querySelector(selector)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      })
      return true
    }
    return false
  }

  return {
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTop,
    scrollToElement,
  }
}
