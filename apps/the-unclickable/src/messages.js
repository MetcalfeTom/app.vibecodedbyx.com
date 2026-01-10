/**
 * Messages Module - All gaslighting and UI messages
 */

export const gaslightMessages = [
  "🤔 Hmm, the button seems to be working fine on our end...",
  "📋 Have you tried clicking MORE precisely?",
  "🔧 This is a known issue. Solution: Click better.",
  "📊 Our analytics show 99.7% of users click this button successfully.",
  "🎯 Pro tip: The button is right there. Just click it.",
  "💡 Maybe try using your OTHER hand?",
  "🖱️ Your mouse driver might need an update. Ironic, isn't it?",
  "📱 This works perfectly on mobile. Are you on mobile?",
  "🧠 Studies show clicking ability decreases with frustration.",
  "⚡ The button moved? No it didn't. That's impossible.",
  "🎭 Are you sure you're not IMAGINING that it's moving?",
  "📝 We've logged your click coordinates. They seem... wrong.",
  "🔬 Our scientists confirm: the button is stationary.",
  "🌡️ Your screen might be too hot. Buttons get shy when hot.",
  "👀 We're watching. We see you failing. It's okay.",
  "💭 What if the button was inside you all along?",
  "🎪 The button isn't avoiding you. You're avoiding success.",
  "📉 Your click accuracy is in the bottom 1%. Impressive!",
  "🧘 Have you tried NOT wanting to click it?",
  "🎰 Random fact: You have better odds at a casino.",
  "🤷 Look, we don't know what to tell you at this point.",
  "📦 The button is exactly where it's always been.",
  "🔮 Our psychic says you'll click it in... never.",
  "🏆 Achievement Unlocked: Professional Button Misser",
  "⏰ You've been trying for a while now, huh?",
  "🌈 Maybe the real update was the friends we made along the way.",
]

export const onScreenMessages = [
  "Almost had it!",
  "So close!",
  "Try again!",
  "Not quite...",
  "Keep trying!",
  "You can do it!",
  "One more time!",
  "Nearly there!",
  "Just a bit more!",
  "Don't give up!",
  "Persistence is key!",
  "That was close!",
  "Getting warmer...",
  "Or not.",
  "Oops!",
  "Whoops!",
  "Nice try!",
  "Better luck next time!",
  "The button believes in you!",
  "...does it though?",
]

export const angryMessages = [
  "STOP CHASING ME",
  "I SAID NO",
  "LEAVE ME ALONE",
  "WHY WON'T YOU QUIT",
  "I DON'T WANT TO BE CLICKED",
  "THIS IS HARASSMENT",
]

export const smugMessages = [
  "lol",
  "too slow",
  "nope",
  "😏",
  "missed",
  "haha",
  "nice try",
  "🏃💨",
]

export const taunts = ['😂', '🤣', '💨', '👋', '✌️', '🏃', '😏', '🙃', '👀', '💀']

/**
 * Get a random message from an array
 */
export const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)]
}
