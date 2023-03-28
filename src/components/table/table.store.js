import { defineStore } from 'pinia';
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
  return defineStore(id, {
    state: () => ({
      url: null,
      currentPage: 1,
      currentQuery: '',
      currentRows: [],
      totalItems: 0,
      itemsPerPage: 10,
      isFetching: false,
      sortColumn: '',
      sortDirection: 'none',
    }),
    getters: {
    },
    actions: {
      /**
       * Return an apiService useFetch response.
       * @param url
       * @returns {UseFetchReturn<*>&PromiseLike<UseFetchReturn<*>>}
       */
      fetchItems() {
        const options = {
          method: 'POST',
          body: utils().json().stringify({
            page: this.currentPage,
            _q: this.currentQuery,
            sorting: {columnName: this.sortColumn, direction: this.sortDirection},
            ipp: this.itemsPerPage,
          }),
        }

        const { isFetching, data } = apiService.fetchAsResponse(this.url, options);

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
        this.currentPage = pageNumber;
        this.fetchItems();
      },
      sortTable(columnName, dir = '') {
        if (!dir) {
          const direction = determineSortDirection(columnName, this.sortColumn, this.sortDirection);
          this.sortColumn = direction === 'none' ? '' : columnName;
          this.sortDirection = direction;
        } else {
          this.sortDirection = dir;
          this.sortColumn = columnName;
        }

        this.fetchItems();
      },
      searchItems(query) {
        if (query !== this.currentQuery) {
          this.currentQuery = query;
          this.currentPage = 1;
          this.fetchItems();
        }
      },
      getCellValue(id, cellName) {
        const index = this.currentRows.findIndex((row => id === row.id));
        if (index > -1) {
          return this.currentRows[index].cells[cellName].value;
        }
        console.warn('Unable to find value for cell: ' + cellName);
        return '';
      },
    },
  });
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
