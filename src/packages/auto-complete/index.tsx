import {
  ExtractPropTypes,
  InputHTMLAttributes,
  PropType,
  defineComponent,
  ref,
  Transition
} from 'vue'
import useModelValue from '../hooks/useModelValue'
import { isKeyDown, isKeyEnter, isKeyUp } from '../utils/keyboard'
import { UPDATE_MODEL_EVENT } from '../utils/constants'
import Input from '../input'
import './styles.scss'

const autoCompleteProps = {
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as PropType<string[]>,
    default: []
  },
  disabled: Boolean,
  class: String,
  placeholder: {
    type: String,
    default: 'input here'
  },

  // improve code intellisense when using jsx
  onChange: Function as PropType<(val?: string | number) => void>,
  onInput: Function as PropType<(val?: string | number) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>
}

const useOptions = (props: ExtractPropTypes<typeof autoCompleteProps>) => {
  const showOptions = ref(false)
  const optionIndex = ref(0)

  const optionIndexMinus = () => {
    optionIndex.value > 0
      ? optionIndex.value--
      : (optionIndex.value = props.options.length - 1)
  }

  const optionIndexPlus = () => {
    optionIndex.value < props.options.length - 1
      ? optionIndex.value++
      : (optionIndex.value = 0)
  }

  return {
    showOptions,
    optionIndex,
    optionIndexMinus,
    optionIndexPlus
  }
}

const AutoComplete = defineComponent({
  name: 'AutoComplete',

  props: autoCompleteProps,

  inheritAttrs: false,

  emits: ['focus', 'blur', 'change', 'input', UPDATE_MODEL_EVENT],

  setup(props, { emit }) {
    const { modelVal } = useModelValue(props, emit)
    const {
      showOptions,
      optionIndex,
      optionIndexMinus,
      optionIndexPlus
    } = useOptions(props)

    const handleOptionSelect = (idx: number) => {
      modelVal.value = props.options[idx]
      showOptions.value = false
    }

    const inputEvents: InputHTMLAttributes = {
      onKeydown(e) {
        if (isKeyDown(e) || isKeyUp(e)) {
          e.preventDefault()
        }
      },
      onKeyup(e) {
        if (isKeyDown(e)) {
          optionIndexPlus()
        } else if (isKeyUp(e)) {
          optionIndexMinus()
        } else if (isKeyEnter(e)) {
          showOptions.value
            ? handleOptionSelect(optionIndex.value)
            : (showOptions.value = true)
        }
      },
      onFocus(e) {
        showOptions.value = true
        emit('focus', e)
      },
      onInput(e) {
        showOptions.value = true
        emit('input', e)
      },
      onBlur(e) {
        showOptions.value = false
        emit('blur', e)
      }
    }

    return {
      modelVal,
      handleOptionSelect,
      optionIndex,
      showOptions,
      inputEvents
    }
  },

  render() {
    const inputNode = (
      <Input
        v-model={this.modelVal}
        disabled={this.disabled}
        placeholder={this.placeholder}
        {...this.inputEvents}
      />
    )

    const isSelected = (idx: number) => {
      return this.modelVal === this.options[idx]
    }

    const isSelecting = (idx: number) => {
      return (
        this.optionIndex === idx &&
        // ignore the option which has already been selected
        !isSelected(idx)
      )
    }

    const optionsNode = (
      <div class="select">
        {this.options.map((option, idx) => (
          <span
            class={[
              'select__item',
              {
                'select__item-ready': isSelecting(idx),
                'select__item-on': isSelected(idx)
              }
            ]}
            onClick={() => this.handleOptionSelect(idx)}
            key={option}
            onMouseenter={() => {
              this.optionIndex = idx
            }}
          >
            {option}
          </span>
        ))}
      </div>
    )

    return (
      <div class={['fancy-auto-complete', this.class]}>
        {inputNode}
        <Transition name="select-transform">
          {this.options.length && this.showOptions && this.modelVal
            ? optionsNode
            : null}
        </Transition>
      </div>
    )
  }
})

export default AutoComplete
