export const sleep = (delay = 0) => new Promise(r => setTimeout(r, delay))

export const keyDownEnterEvent = new KeyboardEvent('keydown', {
  key: 'Enter'
})
