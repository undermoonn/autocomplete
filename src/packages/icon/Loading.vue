<template><span class="loading" /></template>

<style scoped>
.loading {
  display: inline-block;
  border: 2px solid rgb(219, 234, 254);
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  border-left-color: transparent;
  animation: rorate 1.2s infinite;
}
@-webkit-keyframes rorate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
