<template>
  <auto-complete
    v-model="val"
    :options="options"
    @change="onChange"
    @focus="onChange"
    class="w-72"
  />
</template>

<script lang="ts" setup>
import AutoComplete from '@/packages/auto-complete'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
function onChange(val: string) {
  console.log(val)
}
const options = computed(() => [
  `${val.value}`,
  `${val.value}${val.value}`,
  `${val.value}${val.value}${val.value}`
])
const val = ref('111')
</script>

<style>
.w-72 {
  width: 18rem;
}
</style>
