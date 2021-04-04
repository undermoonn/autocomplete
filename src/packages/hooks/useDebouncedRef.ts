import { customRef } from '@vue/reactivity'
import type { Timer } from '@/packages/types'

export default function useDebouncedRef<T = any>(value: T, delay = 200) {
  let timeout: Timer
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
