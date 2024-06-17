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
import { useDebounceFn } from '@vueuse/core';

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
    debounceFetchTime: {
      type: Number,
      default: 250,
    },
  },

  setup(props) {
    const tableStore = useTableStoreFactory(inject('tableStoreId', 'myId'))();
    const { iconName, altIconName, matchTypes, columns, operators } = props;
    const isActive = ref(props.isActive);
    const filterMatchResult = ref(0);

    const debounceFetch = useDebounceFn((value) => {
      tableStore.fetchItems();
    }, props.debounceFetchTime);

    const { filters, activeFilters, matchType, totalItems } = storeToRefs(tableStore);
    if (filters.value.length === 0) {
      tableStore.addFilter(useDefaultFilterValue(columns, operators));
    }

    watch(totalItems, (newV) => {
      filterMatchResult.value = activeFilters.value.length > 0 ? newV : 0;
    });

    watch(() => activeFilters.value.length, (newL, oldL) => {
      if (newL < oldL) {
        // one filter is remove.
        debounceFetch();
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
      tableStore.filterItems();
    };

    const setMatchType = (idx) => {
      tableStore.setFilterMatchType(matchTypes[idx].id);
      if (activeFilters.value.length > 0) {
        debounceFetch();
      }
    };

    const removeAll = () => {
      tableStore.removeAllFilter();
      isActive.value = false;
      nextTick(() => {
        tableStore.addFilter(useDefaultFilterValue(columns, operators));
      });
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
      filterMatchResult,
      removeAll,
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
      :iconCss="iconCss"
      :toggleFilterIcon="toggleFilterIcon"
      :isActive="isActive"
      :matchType="matchType"
      :matchTypes="matchTypes"
      :columns="columns"
      :operators="operators"
      :filters="filters"
      :removeAll="removeAll"
      :filterCount="activeFilters.length"
      :filterMatchResult="filterMatchResult"
      :removeFilter="removeFilter"
      :insertFilter="insertFilter"
      :updateFilter="updateFilter"
      :setMatchType="setMatchType"
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>
