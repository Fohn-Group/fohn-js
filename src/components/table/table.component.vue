<script>
/**
 * Todo serve two different mode. Load all items and use fuse search internally or
 * use as it is now, loading items per page load.
 */
import {onMounted, ref} from 'vue';
import debounce from 'lodash.debounce';
import { useTableStoreFactory } from './table.store';

export default {
  name: 'fohn-table',
  props: {
    actions: {
      type: Object,
    },
    searchDebounceValue: {
      type: Number,
      default: 500,
    },
    columns: {
      type: Array,
    },
    storeId: String,
    dataUrl: String,
    itemsPerPage: Number,
    keepTableState: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, slots, emit }) {
    const { columns, dataUrl, searchDebounceValue, storeId, keepTableState } = props;
    const rows = ref([]);
    const isFetching = ref(false);
    const currentPage = ref(1);
    const sortColumn = ref('');
    const sortDirection = ref('');
    const itemsPerPage = ref(props.itemsPerPage);
    const totalItems = ref(0);
    const query = ref('');
    // each table get its own tableStore.
    const tableStore = useTableStoreFactory(storeId)();

    const debounceSearch = debounce((query) => {
      tableStore.searchItems(query);
    }, searchDebounceValue);

    tableStore.setDataUrl(dataUrl);
    if (!keepTableState) {
      tableStore.setCurrentPage(1);
      tableStore.setItemsPerPage(itemsPerPage);
      tableStore.setCurrentQuery('');
      tableStore.setSort({columnName: '', direction: 'none'});
    }

    // subscribe to store change event.
    tableStore.$subscribe((mutation, state) => {
      rows.value = [...state.currentRows];
      isFetching.value = state.isFetching;
      currentPage.value = state.tableState.currentPage;
      totalItems.value = state.totalItems;
      sortColumn.value = state.tableState.sort.columnName;
      sortDirection.value = state.tableState.sort.direction;
      itemsPerPage.value = state.tableState.itemsPerPage;
      query.value = state.tableState.currentQuery;
    });

    const loadPage = (pageNumber) => {
      tableStore.loadPage(pageNumber);
    };

    const setItemsPerPage = (itemsPerPage) => {
      tableStore.setItemsPerPage(itemsPerPage);
      tableStore.loadPage(1);
    }

    const sortTable = (columnName, dir) => {
      tableStore.sortTable(columnName, dir);
    };

    const searchItems = (query) => {
      debounceSearch(query);
    }

    const clearSearch = () => {
      debounceSearch('');
    }

    const executeAction = (actionName, id) => {
      props.actions[actionName](id);
    }

    onMounted(() => {
      tableStore.fetchItems();
    });

    return {
      isFetching,
      query,
      columns,
      sortDirection,
      sortColumn,
      rows,
      currentPage,
      totalItems,
      itemsPerPage,
      loadPage,
      searchItems,
      sortTable,
      clearSearch,
      setItemsPerPage,
      executeAction,
    };
  },
};
</script>

<template>
  <div>
    <slot
        :isFetching="isFetching"
        :query="query"
        :columns="columns"
        :sortDirection="sortDirection"
        :sortColumn="sortColumn"
        :rows="rows"
        :currentPage="currentPage"
        :totalItems="totalItems"
        :itemsPerPage="itemsPerPage"
        :loadPage="loadPage"
        :searchItems="searchItems"
        :sortTable="sortTable"
        :clearSearch="clearSearch"
        :setItemsPerPage="setItemsPerPage"
        :executeAction="executeAction"
        v-bind="$attrs">table</slot>
  </div>
</template>
