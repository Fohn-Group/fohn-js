
<script>
import {
  watch, onUpdated, ref, toRefs, onMounted,
} from 'vue';
import { useSelect } from './composable/select';
import {onKeyStroke, useDebounceFn} from "@vueuse/core";

export default {
  name: 'fohn-select',
  emits: ['update:modelValue'],
  props: {
    maxItems: {
      type: Number,
      default: 10,
    },
    filterMode: {
      type: String,
      validator(value) {
        // The value must match one of these strings
        return ['search', 'query'].includes(value)
      }
    },
    allowNull: {
      type: Boolean,
      default: true,
    },
    requestUrl: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    deleteIcon: {
      type: String,
      default: 'bi bi-x',
    },
    openIcon: {
      type: String,
      default: 'bi bi-arrow-down',
    },
    closeIcon: {
      type: String,
      default: 'bi bi-arrow-up',
    },
    modelValue: [String, Number],
  },
  setup: function (props, { attrs, slots, emit }) {
    const selectEl = ref(null);
    const selectInputEl = ref(null);
    const { modelValue } = toRefs(props);
    const {select, filterMode, filterValue, fetchItems, findSiblingIndex } = useSelect(props);
    let valueOnOpen;

    onKeyStroke(['ArrowUp'], (e) => {
      e.preventDefault();
      if (!select.isOpen) {
        openItems();
      } else {
        const index = findSiblingIndex(select.value, 'up');
        select.value = select.items[index].key;
        emit('update:modelValue', select.items[index].key);
      }
    },{ target: selectInputEl })

    onKeyStroke(['ArrowDown'], (e) => {
      e.preventDefault();
      if (!select.isOpen) {
        openItems();
      } else {
        const index = findSiblingIndex(select.value, 'down');
        select.value = select.items[index].key;
        emit('update:modelValue', select.items[index].key);
      }
    },{ target: selectInputEl })

    onKeyStroke('Escape', (e) => {
      emit('update:modelValue', valueOnOpen);
      select.value = valueOnOpen;
      closeItems();
    },{ target: selectInputEl })

    onKeyStroke('Enter', (e) => {
      if (select.isOpen) {
        closeItems();
        e.stopPropagation();
        e.preventDefault();
      }
    },{ target: selectInputEl })

    /**
     * Watch when modelValue changes, i.e. when attached to a form
     * that get its values by querying server. Then the form component will set
     * a new control value and select need to react accordingly.
     */
    watch(modelValue, (newValue) => {
      select.value = newValue;
      if (newValue && !select.label) {
        fetchItems({action: 'init', value: newValue});
      }
    });

    // add specific method for select.
    const toggleList = () => {
      if (select.isOpen) {
        closeItems();
      } else {
        openItems();
      }
    };

    const setValue = (item) => {
      emit('update:modelValue', item.key);
      select.value = item.key;
      filterValue.value = null;
      closeItems()
    };

    const closeItems = () => {
      if (select.isOpen) {
        select.isOpen = false;
        filterValue.value = null;
      }
    };

    const openItems = () => {
      if (!select.isOpen) {
        select.isOpen = true;
        valueOnOpen = modelValue.value;
      }
    }

    const clearValue = () => {
      emit('update:modelValue', null);
      select.value = null;
      openItems();
      selectInputEl.value.focus();
    };

    const isItemSelected = (item) => select.value === item.key;

    const debounceFetchItems = useDebounceFn((label) => {
      if (label) {
        fetchItems({ action: 'query', fohnSelect_q: label }, () => {
          select.isOpen = true;
        });
      }
    }, 500);

    const filterItems = (e) => {
      filterValue.value = e.target.value;

      if (filterMode === 'query') {
        select.isOpen = false;
        debounceFetchItems(filterValue.value);
      } else {
        openItems();
      }
    };

    onMounted( () => {

      // initialise select items.
      if (props.requestUrl) {
        fetchItems({action: 'init', value: modelValue.value});
      }
      selectInputEl.value = selectEl.value.querySelector('input[type="text"]');
    });

    onUpdated(() => {
      // scroll items in order to properly display selection in item list element.
      if (select.value && select.isOpen) {
        const element = selectEl.value.querySelector(`[data-id="${select.value}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
        }
      }
    });

    return {
      select,
      toggleList,
      setValue,
      closeItems,
      openItems,
      clearValue,
      isItemSelected,
      filterItems,
      selectEl,
    };
  },
};
</script>

<template>
  <div ref="selectEl" >
    <slot
        :select="select"
        :toggleList="toggleList"
        :setValue="setValue"
        :closeItems="closeItems"
        :openItems="openItems"
        :clearValue="clearValue"
        :isItemSelected="isItemSelected"
        :filterItems="filterItems"
    >input slot
    </slot>
  </div>
</template>