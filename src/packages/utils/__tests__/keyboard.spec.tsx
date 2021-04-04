import { mount } from '@vue/test-utils'
import { isKeyDown, isKeyEnter, isKeyUp } from '../keyboard'
describe('utils: keyboard', () => {
  it('should judge is pressed "enter" correctly', () => {
    const fn = jest.fn()
    const wrapper = mount({
      render() {
        return (
          <span
            onKeypress={e => {
              if (isKeyEnter(e)) fn()
            }}
          />
        )
      }
    })
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowUp'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowDown'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'A'
    })
    expect(fn).not.toBeCalledWith()
    wrapper.find('span').trigger('keypress', {
      key: 'Enter'
    })
    expect(fn).toBeCalledWith()
  })

  it('should judge is pressed "Up" correctly', () => {
    const fn = jest.fn()
    const wrapper = mount({
      render() {
        return (
          <span
            onKeypress={e => {
              if (isKeyUp(e)) fn()
            }}
          />
        )
      }
    })
    wrapper.find('span').trigger('keypress', {
      key: 'Enter'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowDown'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'A'
    })
    expect(fn).not.toBeCalledWith()
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowUp'
    })
    expect(fn).toBeCalledWith()
  })

  it('should judge is pressed "down" correctly', () => {
    const fn = jest.fn()
    const wrapper = mount({
      render() {
        return (
          <span
            onKeypress={e => {
              if (isKeyDown(e)) fn()
            }}
          />
        )
      }
    })
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowUp'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'Enter'
    })
    wrapper.find('span').trigger('keypress', {
      key: 'A'
    })
    expect(fn).not.toBeCalledWith()
    wrapper.find('span').trigger('keypress', {
      key: 'ArrowDown'
    })
    expect(fn).toBeCalledWith()
  })
})
