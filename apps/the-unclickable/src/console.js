/**
 * Console Module - Styled console logging utilities
 */

const styles = {
  title: 'color:#0ff;font-size:20px;font-weight:bold;',
  gaslight: 'color:#f0f;font-size:14px;font-weight:bold;',
  warning: 'color:#ff0;font-size:12px;',
  error: 'color:#f00;font-size:12px;',
  success: 'color:#0f0;font-size:14px;font-weight:bold;',
  divider: 'color:#333;',
}

export const logTitle = (msg) => {
  console.log('%c' + msg, styles.title)
}

export const logGaslight = (msg) => {
  console.log('%c' + msg, styles.gaslight)
}

export const logWarning = (msg) => {
  console.warn('%c' + msg, styles.warning)
}

export const logError = (msg) => {
  console.error('%c' + msg, styles.error)
}

export const logSuccess = (msg) => {
  console.log('%c' + msg, styles.success)
}

export const logDivider = () => {
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.divider)
}

export const initConsole = () => {
  logTitle('🎮 THE UNCLICKABLE - Debug Console')
  logDivider()
  logGaslight("Welcome! Just click the UPDATE button to continue.")
  logGaslight("It's very simple. Everyone does it.")
  logDivider()
}
