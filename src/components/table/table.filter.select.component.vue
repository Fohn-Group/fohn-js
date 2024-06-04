<script>
/**
 * Select input.
 * Use for selecting filter column or filter column operator.
 */

import {onMounted, ref, toRefs, watch} from "vue";
import {useDebounceFn} from "@vueuse/core";

export default {
  name: 'fohn-table-filter-select',
  emits: ['onItemSelect'],
  props: {
    initValue: String,
    items : {
      type: Array,
      default: () => [],
    }
  },

  setup(props, { attrs, slots, emit }) {
    const { items, initValue } = toRefs(props);
    const isActive = ref(false);
    const inputContainer = ref();
    const inputEl = ref();
    const value = ref(initValue.value);

    watch(initValue, (newVal) => {
      value.value = newVal;
    })

    const toggleSelect = () => {
      isActive.value = !isActive.value;
    }

    const closeSelect = useDebounceFn(() => {
      isActive.value = false;
    }, 200);

    const selectItem = (idx) => {
      inputEl.value.focus();
      value.value = items.value[idx].label;
      emit('onItemSelect', idx, items.value[idx].id);
      closeSelect();
    }

    onMounted(() => {
      inputEl.value = inputContainer.value.querySelector('input');
    });

    return {value, items, isActive, inputContainer, toggleSelect, selectItem, closeSelect}
  }
}
</script>

<template>
  <div ref="inputContainer">
    <slot
        :value="value"
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
