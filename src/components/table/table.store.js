import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import apiService from '../../services/api.service';
import { utils } from '../../utils';
import { watch } from 'vue';
import { useSortDirection } from './composable/table';

/**
 * Return a Pinia store definition function.
 *
 * Usage: const tableStore = useFactoryTableStore(myId)();
 *
 * @param id
 * @returns {StoreDefinition<*, {totalItems: null, itemsPerPage: null, currentQuery: string, currentPage: number}, {}, {fetchItems(*): (UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}>|(UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>)}
 */
export const useTableStoreFactory = (id) => {
  const store = defineStore(id, {
    state: () => ({
      url: null,
      tableState: useLocalStorage(id + '.tableState', {
        currentPage: 1,
        currentQuery: '',
        itemsPerPage: 10,
        sort: {
          columnName: '',
          direction: 'none',
        },
        filters: [],
        activeFilters: {
          matchType: 'and',
          columns: [],
        },
        matchType: 'and',
      }),
      currentRows: [],
      selectedRows: new Set(),
      totalItems: 0,
      isFetching: false,
    }),
    getters: {
      isRowSelected: (state) => {
        return id => state.selectedRows.has(id);
      },
      hasRowSelected: (state) => {
        return state.selectedRows.size > 0;
      },
      filters: (state) => {
        return state.tableState.filters;
      },
      matchType: (state) => {
        return state.tableState.matchType;
      },
    },
    actions: {
      setFilters(filters) {
        this.tableState.filters = filters;
      },
      /**
       * Return an apiService useFetch response.
       * @param args = Get argument to pass to url.
       * @param fn = A callback to call after data is fetch.
       * @returns {UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>}
       */
      fetchItems(args = {}, fn = () => {}) {
        if (!this.url) {
          console.warn('No url set to fetch data');
          return;
        }
        const options = {
          method: 'POST',
          body: utils().json().stringify({
            page: this.tableState.currentPage,
            _q: this.tableState.currentQuery,
            sorting: this.tableState.sort,
            ipp: this.tableState.itemsPerPage,
            filters: this.tableState.activeFilters,
          }),
        };

        const url = fohn.utils().url().appendParams(this.url, args);
        const { isFetching, data, onFetchFinally } = apiService.fetchAsResponse(url, options);

        watch(isFetching, (inProgress) => {
          this.isFetching = inProgress;
        });

        watch(data, (newData) => {
          const results = newData?.results || {};
          if (results.jsRendered) {
            apiService.evalResponse(results.jsRendered);
          }
          this.totalItems = results?.totalItems || 0;
          this.currentRows = results?.rows || [];
          if (this.currentRows.length === 0 && this.tableState.currentPage > 1) {
            // reload previous page if no rows are return.
            this.loadPage(this.tableState.currentPage - 1);
          }
        });

        onFetchFinally(() => {
          fn();
        });
      },
      updateRow(id, newRowValue) {
        this.currentRows.forEach((tableRow) => {
          if (tableRow.id === id) {
            Object.keys(newRowValue).forEach((key) => {
              if (tableRow.cells[key]) {
                tableRow.cells[key].value = newRowValue[key];
              }
            });
          }
        });
      },
      toggleRow(id) {
        if (this.isRowSelected(id)) {
          this.selectedRows.delete(id);
        }
        else {
          this.selectedRows.add(id);
        }
      },
      addRowIdToSelection(id) {
        this.selectedRows.add(id);
      },
      removeRowIdFromSelection(id) {
        this.selectedRows.delete(id);
      },
      clearSelectedRows() {
        this.selectedRows = new Set();
      },
      deleteRow(id) {
        this.currentRows = [...this.currentRows.filter((tableRow) => {
          return tableRow.id !== id;
        })];
        this.fetchItems();
      },
      loadPage(pageNumber) {
        this.tableState.currentPage = pageNumber;
        this.fetchItems();
      },
      sortTable(columnName, dir = '') {
        if (!dir) {
          const direction = useSortDirection(columnName, this.tableState.sort.columnName, this.tableState.sort.direction);
          this.tableState.sort.columnName = direction === 'none' ? '' : columnName;
          this.tableState.sort.direction = direction;
        }
        else {
          this.tableState.sort.direction = dir;
          this.tableState.sort.columnName = columnName;
        }

        this.fetchItems();
      },
      filterItems(matchType, columns, args = {}) {
        this.tableState.activeFilters.columns = columns;
        this.tableState.activeFilters.matchType = matchType;
        this.fetchItems(args, () => {
          this.matchSelectedRows();
        });
      },
      searchItems(query, args = {}) {
        if (query !== this.tableState.currentQuery) {
          this.tableState.currentQuery = query;
          this.tableState.currentPage = 1;
          this.fetchItems(args, () => {
            this.matchSelectedRows();
          });
        }
      },
      // Match selectedRow with value in currentRows.
      matchSelectedRows() {
        const currentRowSet = new Set(this.currentRows.map(row => row.id));
        const currentSelectedSet = new Set([...this.selectedRows]);
        this.selectedRows = currentSelectedSet.intersection(currentRowSet);
      },
      setItemsPerPage(ipp) {
        this.tableState.itemsPerPage = ipp;
      },
      setCurrentQuery(query) {
        this.tableState.currentQuery = query;
      },
      setCurrentPage(pageNumber) {
        this.tableState.currentPage = pageNumber;
      },
      setSort(sort) {
        this.tableState.sort = sort;
      },
      getCellValue(id, cellName) {
        const index = this.currentRows.findIndex(row => id === row.id);
        if (index > -1) {
          return this.currentRows[index].cells[cellName].value;
        }
        console.warn('Unable to find value for cell: ' + cellName);
        return '';
      },
      setDataUrl(url) {
        this.url = url;
      },
      /**
       * Callback server for the purpose of executing an action.
       * Callback will trigger onTrigger event in TriggerCtrl.
       */
      executeAction(url, targetElement) {
        const options = {
          method: 'POST',
          body: utils().json().stringify({
            ids: Array.from(this.selectedRows),
          }),
        };

        targetElement.classList.add('loading');
        const { isFetching, data, onFetchFinally, onFetchError } = apiService.fetchAsResponse(url, options);

        watch(isFetching, (inProgress) => {
          this.isFetching = inProgress;
        });

        onFetchFinally(() => {
          const results = data.value || {};
          if (results.jsRendered) {
            apiService.evalResponse(results.jsRendered);
          }
          if (results?.state?.reload) {
            this.fetchItems();
          }
          if (results?.state?.keepSelection === false) {
            this.selectedRows = new Set();
          }
          targetElement.classList.remove('loading');
        });

        onFetchError((error) => {
          console.error(error);
        });
      },
    },
  });

  fohn.vueService.addStore(id, store);
  return store;
};
