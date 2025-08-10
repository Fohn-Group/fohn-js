<script>
/**
 * Manage an array of Filters to be applied on table.
 * Special icon is used when filter Ui is display or not.
 * The number of filters is also shown.
 */
import { computed, inject, nextTick, ref, watch } from 'vue';
import { useTableStoreFactory } from './table.store';
import { useActiveFilters, useAddDefaultFilter } from './composable/filter';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/core';
import { OnClickOutside } from '@vueuse/components';

export default {
  components: {
    OnClickOutside,
  },
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
      tableStore.filterItems(matchType.value, activeFilters.value);
    }, props.debounceFetchTime);

    const { filters, totalItems } = storeToRefs(tableStore);
    const matchType = ref(tableStore.matchType);
    const activeFilters = computed(() => useActiveFilters(filters.value));

    const filterCount = ref(activeFilters.value.length);
    if (filters.value.length === 0) {
      useAddDefaultFilter(filters, columns, operators);
    }

    watch(totalItems, (newV) => {
      filterMatchResult.value = activeFilters.value.length > 0 ? newV : 0;
    });

    watch(
      [activeFilters, matchType],
      ([newFilter, newMatchType], [oldFilter, oldMatchType]) => {
        if (newMatchType !== oldMatchType) {
          debounceFetch();
          return;
        }
        if (newFilter.length !== oldFilter.length) {
          filterCount.value = newFilter.length;
          debounceFetch();
          return;
        }
        if (JSON.stringify(newFilter) !== JSON.stringify(oldFilter)) {
          debounceFetch();
        }
      },
      { deep: true },
    );

    const iconCss = computed(() => ({
      [iconName]: !isActive.value && activeFilters.value.length === 0,
      [altIconName]: isActive.value || activeFilters.value.length > 0,
    }));

    const removeFilter = (id) => {
      const idx = filters.value.findIndex(f => f.filterId === id);
      filters.value.splice(idx, 1);

      if (filters.value.length === 0) {
        isActive.value = false;
        nextTick(() => {
          useAddDefaultFilter(filters, columns, operators);
        });
      }
    };

    const insertFilter = () => {
      useAddDefaultFilter(filters, columns, operators);
    };

    const closeFilters = () => {
      isActive.value = false;
    };

    /**
     * Fired when a filter column value has changed.
     * Filters are send via ref value. They are automatically update by
     * TableFilterColumn component.
     */
    const updateFilter = (filter) => {};

    const setMatchType = (idx) => {
      matchType.value = matchTypes[idx].id;
    };

    const removeAll = () => {
      filters.value.splice(0, filters.value.length);
      isActive.value = false;
      nextTick(() => {
        useAddDefaultFilter(filters, columns, operators);
      });
    };

    const toggleFilterIcon = () => (isActive.value = !isActive.value);

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
      filterCount,
      closeFilters,
      removeFilter,
      insertFilter,
      updateFilter,
      setMatchType,
    };
  },
};
</script>

<template>
  <OnClickOutside @trigger="closeFilters">
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
      :filterCount="filterCount"
      :filterMatchResult="filterMatchResult"
      :removeFilter="removeFilter"
      :closeFilters="closeFilters"
      :insertFilter="insertFilter"
      :updateFilter="updateFilter"
      :setMatchType="setMatchType"
      v-bind="$attrs"
      >table filter</slot
    >
  </OnClickOutside>
</template>

<style scoped></style>
