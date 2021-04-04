import { UPDATE_MODEL_EVENT } from '@/packages/utils/constants'
import { sleep } from '@/packages/utils/testUtils'
import { ref } from '@vue/reactivity'
import { defineComponent, watch } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import useModelValue from '../useModelValue'

const TEXT = 'I love Capcom!'
const TEXT2 = 'MH is the best game!!!'

const CustomComponent = defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, { emit }) {
    const { modelVal } = useModelValue(props, emit)
    const handleClick = () => {
      modelVal.value = TEXT2
    }
    return () => {
      return <span onClick={handleClick}>{modelVal.value}</span>
    }
  }
})

const DebouncedCustomComponent = defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, { emit }) {
    const { modelVal } = useModelValue(props, emit, 50)
    return () => {
      return <span>{modelVal.value}</span>
    }
  }
})

describe('hook: useModelValue', () => {
  it('should model correctly', async () => {
    const val = ref('')

    const wrapper = mount({
      render() {
        return <CustomComponent v-model={val.value} />
      }
    })

    val.value = TEXT
    await sleep()
    expect(wrapper.find('span').element.textContent).toBe(TEXT)

    wrapper.find('span').trigger('click')
    await sleep()
    expect(wrapper.find('span').element.textContent).toBe(TEXT2)
  })

  test('it`s value should be debounced', async () => {
    const val = ref('')
    const fn = jest.fn()
    watch(val, fn)
    mount({
      render() {
        return <DebouncedCustomComponent v-model={val.value} />
      }
    })

    val.value = '1'
    val.value = '2'
    val.value = '3'
    expect(fn).not.toBeCalled()
    await sleep(51)
    expect(fn).toBeCalledTimes(1)
  })
})
