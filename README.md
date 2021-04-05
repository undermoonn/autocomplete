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
    @input="handleInput"
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

    const handleInput = () => {
      // search somethings
    }

    return {
      result,
      options,
      handleInput
    }
  }
})
</script>
```
