import { throttle, debounce } from 'lodash'

function Throttled(wait: number = 30) {
  return function (target, key, descriptor) {
    const originalMethod = descriptor.value
    const throttledMethod = throttle(originalMethod, wait)

    descriptor.value = throttledMethod

    return descriptor
  }
}

function Debounced(wait: number = 30) {
  return function (target, key, descriptor) {
    const originalMethod = descriptor.value
    const debouncedMethod = debounce(originalMethod, wait)

    descriptor.value = debouncedMethod

    return descriptor
  }
}

export { Throttled, Debounced }
