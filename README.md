# Installation

Using npm

```
npm install vue3-fancy-autocomplete
```

Using yarn

```
yarn add vue3-fancy-autocomplete
```

Usage

```vue
<template>
  <AutoComplete
    v-model="result"
    :options="options"
    :debounce="300"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</templete>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AutoComplete } from 'vue3-fancy-autocomplete'

export default defineComponent({
  components: {
    AutoComplete
  },
  setup() {
    const result = ref('')
    const options = ref([])

    // if you set debounce > 0, this event will be debounced
    const handleChange = (inputValue: string) => {}

    const handleInput = (inputValue: string) => {}
    const handleFocus = (e: Event) => {}
    const handleBlur = (e: Event) => {}

    return {
      result,
      options,
      handleInput,
      handleChange
    }
  }
})
</script>
```
