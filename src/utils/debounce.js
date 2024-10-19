export function debounce(fn, timeoutMs) {
  let timer
  return function _debounce(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), timeoutMs)
  }
}
