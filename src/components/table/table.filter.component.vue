<script>
/**
 * Manage an array of Filters to be applied on table.
 * Special icon is used when filter Ui is display or not.
 * The number of filters is also shown.
 */
import { computed, inject, nextTick, ref, watch } from 'vue';
import { useTableStoreFactory } from './table.store';
import { useDefaultFilterValue } from './composable/filter';
import { storeToRefs } from 'pinia';

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
    matchTypes: Array,
  },

  setup(props) {
    const tableStore = useTableStoreFactory(inject('tableStoreId', 'myId'))();
    const { iconName, altIconName, matchTypes } = props;
    const isActive = ref(props.isActive);

    const columns = props.columns;
    const operators = props.operators;
    const { filters, activeFilters, matchType } = storeToRefs(tableStore);
    if (filters.value.length === 0) {
      tableStore.addFilter(useDefaultFilterValue(columns, operators));
    }

    watch(() => activeFilters.value.length, (newL, oldL) => {
      if (newL < oldL) {
        // one filter is remove.
        tableStore.fetchItems();
      }
    });

    const iconCss = computed(() => ({
      [iconName]: !isActive.value && activeFilters.value.length === 0,
      [altIconName]: isActive.value || activeFilters.value.length > 0,
    }));

    const removeFilter = (id) => {
      tableStore.removeFilter(id);
      if (tableStore.getActiveFilterCount() === 0) {
        isActive.value = false;
        nextTick(() => {
          tableStore.addFilter(useDefaultFilterValue(columns, operators));
        });
      }
    };

    const insertFilter = () => {
      tableStore.addFilter(useDefaultFilterValue(columns, operators));
    };

    /**
     * Fired when a filter column value has changed.
     */
    const updateFilter = (filter) => {
      tableStore.updateFilter(filter);
      tableStore.fetchItems();
    };

    const setMatchType = (idx) => {
      tableStore.setFilterMatchType(matchTypes[idx].id);
    };

    const toggleFilterIcon = () => isActive.value = !isActive.value;

    return {
      iconCss,
      toggleFilterIcon,
      isActive,
      matchType,
      matchTypes,
      columns,
      operators,
      filters,
      activeFilters,
      removeFilter,
      insertFilter,
      updateFilter,
      setMatchType,
    };
  },
};

</script>

<template>
  <slot
      :iconCss=iconCss
      :toggleFilterIcon=toggleFilterIcon
      :isActive="isActive"
      :matchType="matchType"
      :matchTypes="matchTypes"
      :columns="columns"
      :operators="operators"
      :filters="filters"
      :filterCount="activeFilters.length"
      :removeFilter="removeFilter"
      :insertFilter="insertFilter"
      :updateFilter="updateFilter"
      :setMatchType="setMatchType"
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>
