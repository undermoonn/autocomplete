<template>
  <auto-complete
    v-model="val"
    :options="options"
    :debounce="300"
    @change="onChange"
    @input="onInput"
    class="w-72"
    :loading="loading"
  >
    <!-- <template #loading>searching...</template> -->
  </auto-complete>
  <PlayJsx />
</template>

<script lang="ts" setup>
interface Resp {
  data: string[]
}
const fakeApi = (val: string) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: [`${val}`, `${val}${val}`, `${val}${val}${val}`]
      })
    }, 300)
  }) as Promise<Resp>

import AutoComplete from '@/packages/auto-complete/index.vue'
import PlayJsx from './PlayJsx'
import { ref } from '@vue/reactivity'
const options = ref<string[]>([])
const loading = ref(false)
const val = ref('')

function onChange(val: string) {
  console.log(val)
  loading.value = true
  fakeApi(val)
    .then(res => {
      options.value = res.data
    })
    .finally(() => {
      loading.value = false
    })
}
function onInput(val: string) {
  // console.log(val)
}
</script>

<style>
.w-72 {
  width: 18rem;
}
</style>
