<script>
/**
 * Todo serve two different mode. Load all items and use fuse search internally or
 * use as it is now, loading items per page load.
 */
import {onMounted, ref, provide, computed} from 'vue';
import debounce from 'lodash.debounce';
import { useTableStoreFactory } from './table.store';

export default {
  name: 'fohn-table',
  props: {
    rowActions: {
      type: Object,
    },
    searchDebounceValue: {
      type: Number,
      default: 500,
    },
    columns: {
      type: Array,
    },
    hasSelectableRows: {
      type: Boolean,
      default: false,
    },
    storeId: String,
    dataUrl: String,
    itemsPerPage: Number,
    keepTableState: {
      type: Boolean,
      default: true,
    },
    keepSelectionAcrossPage: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { attrs, slots, emit }) {
    const { columns,
      dataUrl,
      searchDebounceValue,
      storeId,
      keepTableState,
      hasSelectableRows,
      keepSelectionAcrossPage } = props;

    const rows = ref([]);
    const isFetching = ref(false);
    const currentPage = ref(1);
    const sortColumn = ref('');
    const sortDirection = ref('');
    const itemsPerPage = ref(props.itemsPerPage);
    const totalItems = ref(0);
    const selectedRows = ref(new Set());
    const query = ref('');

    // each table get its own tableStore.
    const tableStore = useTableStoreFactory(storeId)();

    const debounceSearch = debounce((query) => {
      tableStore.searchItems(query);
      if (!keepSelectionAcrossPage) {
        clearSelectedRows();
      }
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
      selectedRows.value = new Set(state.selectedRows) ;
    });

    const hasAllRowSelected = computed(() => {
      return (selectedRows.value.size === 0) ? false : rows.value.every((row) => selectedRows.value.has(row.id));
    });

    const hasSomeRowSelected = computed( () => {
      return rows.value.reduce((acc, row) => {
        if (selectedRows.value.has(row.id)) {
          acc.push(row.id);
        }
        return acc;
      }, []).length > 0;
    });

    const selectedRowSize = computed(() => selectedRows.value.size);

    const pageSelectState = computed(() => {
      return {
        all : hasAllRowSelected.value,
        partial: hasSomeRowSelected.value && !hasAllRowSelected.value,
        none: !hasAllRowSelected.value && !hasSomeRowSelected.value,
      };
    });

    const loadPage = (pageNumber) => {
      if (!keepSelectionAcrossPage) {
        tableStore.clearSelectedRows();
      }
      tableStore.loadPage(pageNumber);
    };

    const setItemsPerPage = (itemsPerPage) => {
      tableStore.setItemsPerPage(itemsPerPage);
      tableStore.loadPage(1);
    }

    const sortTable = (columnName, dir) => {
      tableStore.sortTable(columnName, dir);
    };

    const togglePageRows = () => {
      if (hasAllRowSelected.value) {
        rows.value.forEach( (row) => tableStore.removeRowIdFromSelection(row.id));
      } else {
        rows.value.forEach( (row) => tableStore.addRowIdToSelection(row.id));
      }
    }

    const clearSelectedRows = () => {
      tableStore.clearSelectedRows();
    }

    const searchItems = (query) => {
      debounceSearch(query);
    }

    const clearSearch = () => {
      debounceSearch('');
    }

    /**
     * Execute a table row action, i.e. call a javascript function pass into props.action.
     * The function is executed with the row id as first param.
     *
     * @param actionName
     * @param id
     */
    const executeRowAction = (actionName, id) => {
      props.rowActions[actionName](id);
    }

    onMounted(() => {
      tableStore.fetchItems();
    });

    // have storeId available to children component
    provide('tableStoreId', storeId);

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
      hasSelectableRows,
      selectedRowSize,
      togglePageRows,
      clearSelectedRows,
      pageSelectState,
      executeRowAction,
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
        :executeRowAction="executeRowAction"
        :hasSelectableRows="hasSelectableRows"
        :selectedRowSize="selectedRowSize"
        :togglePageRows="togglePageRows"
        :pageSelectState="pageSelectState"
        :clearSelectedRows="clearSelectedRows"
        v-bind="$attrs">table</slot>
  </div>
</template>
