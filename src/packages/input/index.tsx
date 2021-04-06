import { defineComponent } from '@vue/runtime-core'
import useModelValue from '../hooks/useModelValue'
import './styles.scss'

const Input = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    disabled: Boolean,
    placeholder: {
      type: String,
      default: 'input here'
    }
  },
  setup(props, { emit, attrs }) {
    const { modelVal } = useModelValue(props, emit)
    const { modelValue, ...inputProps } = props
    return () => {
      return (
        <input
          class="fancy-input"
          v-model={modelVal.value}
          {...inputProps}
          {...attrs}
        />
      )
    }
  }
})

export default Input
