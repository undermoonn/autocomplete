import { sleep } from '@/packages/utils/testUtils'
import { watch } from '@vue/runtime-core'
import useDebouncedRef from '../useDebouncedRef'

describe('hook: useDebouncedRef', () => {
  it('should be debounced 300ms', async () => {
    const fn = jest.fn()
    const inputValue = useDebouncedRef('', 300)
    watch(inputValue, fn)
    inputValue.value = '1'
    inputValue.value = '11'
    inputValue.value = '111'
    await sleep(301)
    expect(fn).toBeCalledTimes(1)

    inputValue.value = '1111'
    await sleep(301)
    inputValue.value = '11111'
    await sleep(301)
    expect(fn).toBeCalledTimes(3)
  })

  it('should be debounced 200ms(default delay)', async () => {
    const fn = jest.fn()
    const inputValue = useDebouncedRef('')
    watch(inputValue, fn)
    inputValue.value = '1'
    inputValue.value = '11'
    inputValue.value = '111'
    await sleep(201)
    expect(fn).toBeCalledTimes(1)

    inputValue.value = '1111'
    await sleep(201)
    expect(fn).toBeCalledTimes(2)
  })
})
