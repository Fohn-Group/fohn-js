<script>
import {computed, inject, nextTick, onMounted, reactive, ref} from "vue";
import {useTableStoreFactory} from "./table.store";

export default {
  name: 'fohn-table-filter',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    iconName: String,
    altIconName: String,
    columns: Array,
    operators: Array,
  },

  setup(props, { attrs, slots, emit }) {
    const tableStore = useTableStoreFactory('myid'/* inject('tableStoreId') */)();

    const {iconName, altIconName} = props;
    const isActive = ref(props.isActive);

    const columns = props.columns;
    const operators = props.operators;
    const filters = ref(tableStore.filters);
    const tableIsFetching = ref(false);

    tableStore.$subscribe((mutation, state) => {
      tableIsFetching.value = state.isFetching;
      filters.value = state.tableState.filters;
    });

    const iconCss = computed(() => ({
      [iconName]: !isActive.value,
      [altIconName]: isActive.value,
      'text-gray-200': tableIsFetching.value,
    }));

    const removeFilter = (id) => {
      tableStore.removeFilter(id);
    }

    const addFilter = (filter) => {
      tableStore.addFilter(filter);
    }

    const toggleFilterIcon = () => isActive.value = !isActive.value;

    return {
      iconCss,
      toggleFilterIcon,
      isActive,
      columns,
      operators,
      filters,
      removeFilter,
      addFilter,
    }
  }
}

</script>

<template>
  <slot
      :iconCss=iconCss
      :toggleFilterIcon=toggleFilterIcon
      :isActive="isActive"
      :columns="columns"
      :operators="operators"
      :filters="filters"
      :removeFilter="removeFilter"
      :addFilter="addFilter"
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>