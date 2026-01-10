/**
 * Game Module - Core game logic for THE UNCLICKABLE
 */

import {
  gaslightMessages,
  onScreenMessages,
  angryMessages,
  smugMessages,
  taunts,
  getRandomMessage
} from './messages.js'

import { logGaslight, logWarning, initConsole } from './console.js'

// DOM Elements
let btn, container, messageEl, progressEl, progressFill, rageFill

// State
let attempts = 0
let totalDistance = 0
let startTime = Date.now()
let rage = 0
let evasionLevel = 1
let hasBeenClose = false
let fakeProgressActive = false

/**
 * Initialize DOM references
 */
const initDOM = () => {
  btn = document.getElementById('updateBtn')
  container = document.getElementById('container')
  messageEl = document.getElementById('message')
  progressEl = document.getElementById('fakeProgress')
  progressFill = document.getElementById('progressFill')
  rageFill = document.getElementById('rageFill')
}

/**
 * Get random position within container bounds
 */
const getRandomPosition = () => {
  const containerRect = container.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()
  const maxX = containerRect.width - btnRect.width - 20
  const maxY = containerRect.height - btnRect.height - 20
  return {
    x: Math.random() * maxX + 10,
    y: Math.random() * maxY + 10
  }
}

/**
 * Show on-screen message
 */
const showMessage = (text) => {
  messageEl.textContent = text
  messageEl.classList.add('visible')
  setTimeout(() => messageEl.classList.remove('visible'), 1500)
}

/**
 * Spawn floating taunt emoji
 */
const spawnTaunt = (x, y) => {
  const taunt = document.createElement('div')
  taunt.className = 'taunt'
  taunt.textContent = getRandomMessage(taunts)
  taunt.style.left = x + 'px'
  taunt.style.top = y + 'px'
  document.body.appendChild(taunt)
  setTimeout(() => taunt.remove(), 2000)
}

/**
 * Update button appearance based on rage
 */
const updateButtonMood = () => {
  if (rage > 80) {
    btn.classList.add('angry')
    btn.classList.remove('smug')
    btn.textContent = getRandomMessage(angryMessages)
  } else if (rage > 40) {
    btn.classList.add('smug')
    btn.classList.remove('angry')
    btn.textContent = getRandomMessage(smugMessages)
  } else {
    btn.classList.remove('angry', 'smug')
    btn.textContent = 'UPDATE NOW'
  }
}

/**
 * Start fake progress bar animation
 */
const startFakeProgress = () => {
  fakeProgressActive = true
  progressEl.classList.add('active')
  logGaslight("🎉 Update starting! See? It works!")

  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 99) {
      progress = 99
      clearInterval(interval)
      setTimeout(() => {
        progressFill.style.width = '0%'
        progressEl.classList.remove('active')
        fakeProgressActive = false
        showMessage("Update failed. Try clicking again.")
        logGaslight("❌ Update failed. Error: USER_CLICK_INSUFFICIENT")
        logGaslight("Please click the button to retry.")
      }, 2000)
    }
    progressFill.style.width = progress + '%'
  }, 200)
}

/**
 * Handle button evasion on mouse move
 */
const evadeButton = (e) => {
  const btnRect = btn.getBoundingClientRect()
  const btnCenterX = btnRect.left + btnRect.width / 2
  const btnCenterY = btnRect.top + btnRect.height / 2
  const dist = Math.sqrt(Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2))

  const evasionRadius = 100 + rage * 2

  if (dist < evasionRadius) {
    hasBeenClose = true
    attempts++
    document.getElementById('attempts').textContent = attempts

    // Calculate escape direction
    const angle = Math.atan2(btnCenterY - e.clientY, btnCenterX - e.clientX)
    const escapeDistance = 150 + Math.random() * 100 + evasionLevel * 20

    // New position
    let newX = btnCenterX + Math.cos(angle) * escapeDistance - btnRect.width / 2
    let newY = btnCenterY + Math.sin(angle) * escapeDistance - btnRect.height / 2

    // Keep within container
    const containerRect = container.getBoundingClientRect()
    newX = Math.max(containerRect.left + 10, Math.min(containerRect.right - btnRect.width - 10, newX))
    newY = Math.max(containerRect.top + 10, Math.min(containerRect.bottom - btnRect.height - 10, newY))

    // If cornered, teleport
    if (newX <= containerRect.left + 20 || newX >= containerRect.right - btnRect.width - 20 ||
        newY <= containerRect.top + 20 || newY >= containerRect.bottom - btnRect.height - 20) {
      const pos = getRandomPosition()
      newX = containerRect.left + pos.x
      newY = containerRect.top + pos.y
      spawnTaunt(btnCenterX, btnCenterY)
    }

    // Update distance
    totalDistance += escapeDistance / 5280
    document.getElementById('distance').textContent = totalDistance.toFixed(2)

    // Move button
    btn.style.position = 'fixed'
    btn.style.left = newX + 'px'
    btn.style.top = newY + 'px'

    // Update rage
    rage = Math.min(100, rage + 2)
    rageFill.style.width = rage + '%'
    updateButtonMood()

    // Console gaslighting
    if (attempts % 5 === 0) {
      logGaslight(getRandomMessage(gaslightMessages))
    }

    // On-screen message
    if (Math.random() < 0.3) {
      showMessage(getRandomMessage(onScreenMessages))
    }

    // Increase difficulty
    if (attempts % 10 === 0) {
      evasionLevel++
      logWarning(`⚠️ Evasion protocols upgraded to level ${evasionLevel}`)
    }

    // Fake progress tease
    if (attempts === 15 && !fakeProgressActive) {
      startFakeProgress()
    }
  }
}

/**
 * Set up event listeners
 */
const setupEvents = () => {
  document.addEventListener('mousemove', evadeButton)

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('%c🎊 IMPOSSIBLE! You actually clicked it!', 'color:#0f0;font-size:24px;')
    console.log('%cJust kidding. This log is fake. You didn\'t click anything.', 'color:#f00;font-size:12px;')
    showMessage("Nice try. That click didn't count.")
  })

  btn.addEventListener('mousedown', (e) => {
    e.preventDefault()
    const pos = getRandomPosition()
    const containerRect = container.getBoundingClientRect()
    btn.style.left = (containerRect.left + pos.x) + 'px'
    btn.style.top = (containerRect.top + pos.y) + 'px'
    logWarning("⚠️ Direct click attempt detected. Button relocated.")
    spawnTaunt(e.clientX, e.clientY)
  })

  btn.addEventListener('focus', () => {
    btn.blur()
    const pos = getRandomPosition()
    const containerRect = container.getBoundingClientRect()
    btn.style.left = (containerRect.left + pos.x) + 'px'
    btn.style.top = (containerRect.top + pos.y) + 'px'
    logWarning("⚠️ Keyboard navigation? Really? The button has moved.")
  })
}

/**
 * Start timers
 */
const startTimers = () => {
  // Update elapsed time
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60
    document.getElementById('time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`
  }, 1000)

  // Decay rage
  setInterval(() => {
    if (rage > 0) {
      rage = Math.max(0, rage - 1)
      rageFill.style.width = rage + '%'
      updateButtonMood()
    }
  }, 500)

  // Random console messages
  setInterval(() => {
    if (hasBeenClose && Math.random() < 0.3) {
      logGaslight(getRandomMessage(gaslightMessages))
    }
  }, 8000)

  // Early console opener detection
  setTimeout(() => {
    if (!hasBeenClose) {
      logGaslight("👋 Hey! We see you opened the console.")
      logGaslight("Looking for cheats? There aren't any.")
      logGaslight("The button is just... hard to click for some people.")
    }
  }, 3000)
}

/**
 * Initialize the game
 */
export const initGame = () => {
  initDOM()
  initConsole()
  setupEvents()
  startTimers()

  // Set initial position
  const initPos = getRandomPosition()
  const containerRect = container.getBoundingClientRect()
  btn.style.position = 'fixed'
  btn.style.left = (containerRect.left + initPos.x) + 'px'
  btn.style.top = (containerRect.top + initPos.y) + 'px'
}
