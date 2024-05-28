<script>

import {onMounted, ref, toRefs} from "vue";
import {useDebounceFn} from "@vueuse/core";

export default {
  name: 'fohn-table-filter-select',
  emits: ['onItemSelect'],
  props: {
    items : {
      type: Array,
      default: () => [],
    }
  },

  setup(props, { attrs, slots, emit }) {
    const { items } = toRefs(props);
    const isActive = ref(false);
    const inputContainer = ref();
    const inputEl = ref();

    const toggleSelect = () => {
      isActive.value = !isActive.value;
    }

    const closeSelect = useDebounceFn(() => {
      isActive.value = false;
    }, 200);

    const selectItem = (idx) => {
      inputEl.value.focus();
      inputEl.value.value = items.value[idx].label;
      emit('onItemSelect', items.value[idx].value);
      closeSelect();
    }

    onMounted(() => {
      inputEl.value = inputContainer.value.querySelector('input');
    });

    return {items, isActive, inputContainer, toggleSelect, selectItem, closeSelect}
  }
}
</script>

<template>
  <div ref="inputContainer">
    <slot
        :items="items"
        :isActive="isActive"
        :toggleSelect="toggleSelect"
        :selectItem="selectItem"
        :closeSelect="closeSelect"
        v-bind="$attrs">filter select</slot>
  </div>
</template>

<style scoped>

</style>
