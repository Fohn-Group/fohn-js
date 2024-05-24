<script>
import {computed, inject, toRefs} from "vue";
import {toReactive} from "@vueuse/core";
import {useTableStoreFactory} from "./table.store";

export default {
  name: 'fohn-table-filter',
  props: {
  },

  setup(props, { attrs, slots, emit }) {

  }
}

</script>

<template>
  <slot v-bind="$attrs">table action</slot>
</template>

<style scoped>

</style>