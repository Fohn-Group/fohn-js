<script>
/**
 * Allow selecting an item from an array of object: [{id: 'id', label: 'label'}...].
 * The internal value is the id of the selected item but display is the label.
 */

import {computed, onMounted, ref, toRefs, watch} from "vue";
import {useDebounceFn} from "@vueuse/core";
import {useFindIndexDefault} from "./composable/utils";

export default {
  name: 'fohn-item-select',
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
    const currentIdx = ref(useFindIndexDefault(items.value, (i) => i.id === initValue.value));

    watch(initValue, (newVal) => {
      currentIdx.value = useFindIndexDefault(items.value, (i) => i.id === newVal);
    })

    const toggleSelect = () => {
      isActive.value = !isActive.value;
    }

    const closeSelect = useDebounceFn(() => {
      isActive.value = false;
    }, 200);

    const value = computed( () => {
      return items.value[currentIdx.value].label;
    });

    const selectItem = (idx) => {
      inputEl.value.focus();
      // only fire when different item is selected.
      if (currentIdx.value !== idx) {
        currentIdx.value = idx;
        emit('onItemSelect', idx, items.value[idx].id);
      }
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
