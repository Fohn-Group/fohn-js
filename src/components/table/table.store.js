import { defineStore } from 'pinia';
import { useLocalStorage } from "@vueuse/core";
import apiService from "../../services/api.service";
import {utils} from "../../utils";
import {watch} from "vue";

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
        }
      }),
      currentRows: [],
      totalItems: 0,
      isFetching: false,
    }),
    getters: {
    },
    actions: {
      /**
       * Return an apiService useFetch response.
       * @param args = Get argument to pass to url.
       * @returns {UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>}
       */
      fetchItems(args = {}) {
        const options = {
          method: 'POST',
          body: utils().json().stringify({
            page: this.tableState.currentPage,
            _q: this.tableState.currentQuery,
            sorting: this.tableState.sort,
            ipp: this.tableState.itemsPerPage,
          }),
        }

        const url = fohn.utils().url().appendParams(this.url, args);
        const { isFetching, data } = apiService.fetchAsResponse(url, options);

        watch(isFetching, (inProgress) => {
          this.isFetching = inProgress;
        });

        watch(data, (newData) => {
          const results = newData?.results || {};
          this.totalItems = results?.totalItems || 0;
          this.currentRows = results?.rows || [];
        });
      },
      updateRow(id, newRowValue) {
        this.currentRows.forEach( (tableRow) => {
          if (tableRow.id === id) {
            Object.keys(newRowValue).forEach( (key) => {
              if (tableRow.cells[key]) {
                tableRow.cells[key].value = newRowValue[key];
              }
            })
          }
        });
      },
      deleteRow(id) {
        this.currentRows = [...this.currentRows.filter((tableRow) => {
          return tableRow.id !== id
        })];
      },
      loadPage(pageNumber) {
        this.tableState.currentPage = pageNumber;
        this.fetchItems();
      },
      sortTable(columnName, dir = '') {
        if (!dir) {
          // eslint-disable-next-line max-len
          const direction = determineSortDirection(columnName, this.tableState.sort.columnName, this.tableState.sort.direction);
          this.tableState.sort.columnName = direction === 'none' ? '' : columnName;
          this.tableState.sort.direction = direction;
        } else {
          this.tableState.sort.direction = dir;
          this.tableState.sort.columnName = columnName;
        }

        this.fetchItems();
      },
      searchItems(query) {
        if (query !== this.tableState.currentQuery) {
          this.tableState.currentQuery = query;
          this.tableState.currentPage = 1;
          this.fetchItems();
        }
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
        const index = this.currentRows.findIndex((row => id === row.id));
        if (index > -1) {
          return this.currentRows[index].cells[cellName].value;
        }
        console.warn('Unable to find value for cell: ' + cellName);
        return '';
      },
      setDataUrl(url) {
        this.url = url;
      },
    },
  });
  fohn.vueService.addStore(id, store);

  return store;
};

function determineSortDirection(newColumnName, oldColumName, currentDirection, newDirection = null) {
  let direction;
  if (newColumnName !== oldColumName) {
    direction = 'asc';
  } else {
    if (newDirection) {
      direction = newDirection;
    } else {
      // find index of current direction and return next one
      if (currentDirection === 'none'){
        direction = 'asc';
      } else if (currentDirection === 'asc') {
        direction = 'desc';
      }
      else {
        direction = 'none';
      }
    }
  }

  return direction;
}
