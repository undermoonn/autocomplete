import { ref, watch } from '@vue/runtime-core'
import { UPDATE_MODEL_EVENT } from '../utils/constants'
import useDebouncedRef from './useDebouncedRef'

export default function useModelValue(
  props: { modelValue: string | number },
  emit: Function,
  debounceDelay = 0
) {
  const modelVal = debounceDelay
    ? useDebouncedRef(props.modelValue, debounceDelay)
    : ref(props.modelValue)

  watch(modelVal, val => {
    emit(UPDATE_MODEL_EVENT, val)
    emit('change', val)
  })

  watch(
    () => props.modelValue,
    val => {
      modelVal.value = val
    }
  )

  return {
    modelVal
  }
}
