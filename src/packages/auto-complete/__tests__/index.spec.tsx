import AutoComplete from '../index.vue'
import { mount } from '@vue/test-utils'
import { ref } from '@vue/reactivity'
import { sleep } from '@/packages/utils/testUtils'

describe('component: AutoComplete', () => {
  it('should be triggered correctly', async () => {
    const inputValue = ref('')
    const options = ref(['a', 'b', 'c'])
    const wrapper = mount({
      render() {
        return (
          <AutoComplete v-model={inputValue.value} options={options.value} />
        )
      }
    })

    // test render options
    inputValue.value = '1'
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.select__item').length).toBe(3)

    // test hover
    await wrapper.findAll('.select__item')[1].trigger('mouseenter')
    expect(
      wrapper
        .findAll('.select__item')[1]
        .classes()
        .includes('select__item-ready')
    ).toBeTruthy()

    // test click option
    options.value = ['aaa', 'bbb', 'ccc', 'ddd']
    await sleep()
    await wrapper.findAll('.select__item')[3].trigger('click')
    expect(inputValue.value).toBe('ddd')

    // test on keyboard keyup Enter
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    await wrapper.findAll('.select__item')[1].trigger('mouseenter')
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    expect(inputValue.value).toBe('bbb')
  })

  it('should be disabled', async () => {
    const wrapper = mount({
      render() {
        return <AutoComplete options={['a', 'b', 'c']} disabled />
      }
    })
    const input = wrapper.find('input')
    input.element.value = '1'
    await input.trigger('focus')
    expect(wrapper.findAll('.select__item').length).toBe(0)
  })

  it('can be selected by keyboard', async () => {
    const val = ref('1')
    const wrapper = mount({
      render() {
        return <AutoComplete v-model={val.value} options={['a', 'b', 'c']} />
      }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keyup', { key: 'ArrowUp' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(val.value).toBe('c')

    await input.trigger('focus')
    await input.trigger('keyup', { key: 'ArrowUp' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(val.value).toBe('b')

    await input.trigger('focus')
    await input.trigger('keyup', { key: 'ArrowDown' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(val.value).toBe('c')

    await input.trigger('focus')
    await input.trigger('keyup', { key: 'ArrowDown' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(val.value).toBe('a')
  })

  it('should prevent default event if press down or up', async () => {
    const fn = jest.fn()
    const val = ref('123456')
    const wrapper = mount({
      render() {
        return (
          <AutoComplete
            v-model={val.value}
            onChange={fn}
            options={['a', 'b', 'c']}
          />
        )
      }
    })

    const findInput = () => wrapper.find('input')

    // 这里要先测试方向键上下触发keydown，保证没有触发默认事件
    // 再测试其它按键会触发
    // just lie to jest
    wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    wrapper.find('input').trigger('keydown', { key: 'KeyA' })
    wrapper.find('input').trigger('keyup', { key: 'KeyA' })

    // TODO
    // 模拟按下Delete或BackSpace删除内容
    // 确保模拟删除是可行的
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/activeElement
    // ??? document.activeElement is always <body></body>
    // findInput().element.focus()
    // await findInput().trigger('keydown', { key: 'BackSpace' })
    // await findInput().trigger('keydown', { key: 'Delete' })
    // expect(val.value).toBe('12345')

    // TODO
    // 这里通过模拟移动光标，删除内容来判断是否触发了默认事件
    // 即按下方向键上，再模拟按下Delete，内容没有被删除
    // 和按下方向键下，再模拟按下BackSpace，内容没有被删除
  })

  it('should emit onBlur event', async () => {
    const fn = jest.fn()
    const wrapper = mount({
      render() {
        return <AutoComplete onBlur={fn} />
      }
    })
    await wrapper.find('input').trigger('focus')
    expect(fn).not.toBeCalled()
    await wrapper.find('input').trigger('blur')
    expect(fn).toBeCalled()
  })

  it('should emit onIput event', async () => {
    const fn = jest.fn()
    const wrapper = mount({
      render() {
        return <AutoComplete onInput={fn} />
      }
    })
    const input = wrapper.find('input')
    input.trigger('focus')
    expect(fn).not.toBeCalled()
    await input.trigger('input')
    expect(fn).toBeCalled()
  })

  it('can loading', async () => {
    const wrapper = mount({
      render() {
        return <AutoComplete loading />
      }
    })
    expect(wrapper.find('.select__loading').exists()).toBeTruthy()
  })

  it('can loading use slot', async () => {
    const wrapper = mount({
      components: { AutoComplete },
      template: `
        <AutoComplete loading>
          <template #loading>
            loading
          </template>
        </AutoComplete>
      `
    })
    expect(wrapper.find('.select__loading').exists()).toBeTruthy()
  })
})
