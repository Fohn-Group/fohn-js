/**
 * Paginator method.
 * Export three method for table to use.
 *  - increasePage(number);
 *  - decreasePage(number);
 *  - loadPage(number)
 * @param fetchPage
 * @param tableStore
 * @returns {{increasePage: increasePage, decreasePage: decreasePage, loadPage: loadPage}}
 */
function getPaginatorMethod(fetchPage, tableStore) {
  /**
   * Call fetchPage callback and store current table page into tableStore.
   * @param page
   */
  const loadPage = (page = 1) => {
    tableStore.currentPage = page;

    fetchPage();
  }

  return {
    increasePage: (by = 1) => {
      loadPage(tableStore.currentPage + by);
    },
    decreasePage: (by = 1) => {
      if ((tableStore.currentPage - by) > 0 ) {
        loadPage(tableStore.currentPage - by);
      }
    },
    loadPage: loadPage,
  }
}

export {
  getPaginatorMethod
}
