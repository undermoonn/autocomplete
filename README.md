# Installation

## Using npm

```
npm install vue3-fancy-autocomplete
```

## Using yarn

```
yarn add vue3-fancy-autocomplete
```

## Preview

![](./image/example.gif)

## Usage

```vue
<template>
  <AutoComplete
    v-model="result"
    :options="options"
    :loading="false"
    :debounce="300"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- you can custom loading content with slot -->
    <template #loading>
      searching...
    </template>
  </AutoComplete>
</templete>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AutoComplete } from 'vue3-fancy-autocomplete'

const fakeApi = (val: string) => new Promise(resolve => {
  setTimeout(() => {
    resolve({
      data: ['a', 'b', 'c']
    })
  }, 300)
})

export default defineComponent({
  components: {
    AutoComplete
  },
  setup() {
    const result = ref('')
    const options = ref<string[]>([])
    const loading = ref(false)

    // if you set debounce > 0
    // the event bind on @change will be debounced
    const handleChange = (inputValue: string) => {
      loading.value = true
      fakeApi(result.value)
        .then(res => {
          result.value = res.data
        })
        .finally(() => {
          loading.value = false
        })
    }

    const handleInput = (inputValue: string) => {}
    const handleFocus = (e: Event) => {}
    const handleBlur = (e: Event) => {}

    return {
      result,
      options,
      loading,
      handleInput,
      handleChange
    }
  }
})
</script>
```
