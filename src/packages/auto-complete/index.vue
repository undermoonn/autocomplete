<template>
  <div class="f-auto-complete">
    <input
      class="f-input"
      v-model="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <transition name="select-transform">
      <div class="select" v-if="loading || showOptionsNode">
        <div v-if="loading" class="select__loading">
          <slot v-if="$slots.loading" name="loading" />
          <Loading v-else />
        </div>
        <template v-else>
          <span
            v-for="(option, idx) in options"
            :class="[
              'select__item',
              {
                'select__item-ready': isSelecting(idx),
                'select__item-on': isSelected(idx)
              }
            ]"
            :key="option"
            @click="handleOptionSelect(idx)"
            @mouseenter="optionIndex = idx"
          >
            {{ option }}
          </span>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmit, computed } from 'vue'
import type { InputHTMLAttributes, PropType } from 'vue'
import useModelValue from '../hooks/useModelValue'
import { UPDATE_MODEL_EVENT } from '../utils/constants'
import { isKeyDown, isKeyUp, isKeyEnter } from '../utils/keyboard'
import Loading from '../icon/Loading.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as PropType<string[]>,
    default: []
  },
  debounce: {
    type: Number,
    default: 0
  },
  loading: Boolean,
  disabled: Boolean,
  placeholder: {
    type: String,
    default: 'input here'
  },

  // improve code intellisense when using jsx
  onChange: Function as PropType<(val?: string | number) => void>,
  onInput: Function as PropType<(val?: string | number) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>
})

const emit = defineEmit([
  'focus',
  'blur',
  'change',
  'input',
  UPDATE_MODEL_EVENT
])

const { modelVal } = useModelValue(props, emit, props.debounce)

/** options */

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

const showOptionsNode = computed(
  () => props.options.length && showOptions.value && modelVal.value
)

const isSelected = (idx: number) => {
  return modelVal.value === props.options[idx]
}

const isSelecting = (idx: number) => {
  return (
    optionIndex.value === idx &&
    // ignore the option which has already been selected
    !isSelected(idx)
  )
}

/** event handlers */

const handleOptionSelect = (idx: number) => {
  modelVal.value = props.options[idx]
  showOptions.value = false
}

const onKeydown = (e: KeyboardEvent) => {
  if (isKeyDown(e) || isKeyUp(e)) {
    e.preventDefault()
  }
}

const onKeyup = (e: KeyboardEvent) => {
  if (isKeyDown(e)) {
    optionIndexPlus()
  } else if (isKeyUp(e)) {
    optionIndexMinus()
  } else if (isKeyEnter(e)) {
    showOptions.value
      ? handleOptionSelect(optionIndex.value)
      : (showOptions.value = true)
  }
}

const onInput = (e: Event) => {
  showOptions.value = true
  emit('input', e.target!.value)
}

const onFocus = (e: Event) => {
  showOptions.value = true
  emit('focus', e)
}

const onBlur = (e: Event) => {
  showOptions.value = false
  emit('blur', e)
}
</script>

<style lang="scss" scoped>
.f-input {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.4;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  outline: none;
  margin: 0;
  padding: 0.25rem 0.75rem;
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px;

  &:focus {
    border-color: rgb(96, 165, 250);
    box-shadow: 0 0 #000, 0 0 #000, 0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  &::placeholder {
    color: rgb(209, 213, 219);
  }
}

.f-auto-complete {
  position: relative;
  display: inline-block;

  .select {
    display: inline-flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    padding: 0.25rem 0;
    border-radius: 0.375rem;
    box-shadow: 0 0 #000, 0 0 #000, 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);

    &__loading {
      display: flex;
      justify-content: center;
      padding: 6px 0;
    }

    &__item {
      transition: all 0.3s;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      cursor: pointer;

      &-on {
        background-color: rgb(219, 234, 254);
      }

      &-ready {
        background-color: rgb(243, 244, 246);
      }
    }
  }
}

// transitions

.select-transform-enter-active,
.select-transform-leave-active {
  transition: all 0.3s;
}

.select-transform-enter-from,
.select-transform-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
