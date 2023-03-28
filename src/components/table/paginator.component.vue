<script>

import { computed, toRefs } from "vue";
import range from "lodash.range";

export default {
  name: 'fohn-table-paginator',
  props: {
    // prevent page changing when true.
    disabled: {
      type: Boolean,
      default: false,
    },
    // the current selected page.
    currentPage: {
      type: Number,
      default: 1,
    },
    // the total items this paginator has to deal with.
    totalItems: {
      type: Number,
      default: 0,
    },
    // How many page button to display for page changing.
    pageLimit: {
      type: Number,
      default: 5,
    },
    // How many items each page contains.
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    itemsPerPages: {
      type: Array,
      default: () => [10, 25, 50, 100],
    }
  },
  emits: {
    loadPage: (number) => {
      if (number > 0) {
        return true;
      }
      return false;
    },
    setItemsPerPage: (numberOfItems) => {
      if (numberOfItems > 0) {
        return true;
      }
      return false;
    }
  },
  setup: function (props, { attrs, slots, emit }) {
    const { pageLimit, itemsPerPages } = props;
    // Making these variable reactive since values can change during or after page load request.
    const { currentPage, disabled, totalItems, itemsPerPage } = toRefs(props);

    /**
     * Computed total pages number base on totalItems and item per page.
     * @type {ComputedRef<unknown>}
     */
    const totalPages = computed( () => {
      if (totalItems.value < itemsPerPage.value) {
        return 1;
      }
      return Math.ceil(totalItems.value / itemsPerPage.value);
    });

    const fromItem = computed( () => {
      return ((itemsPerPage.value * currentPage.value) - itemsPerPage.value) + 1 ;
    });

    const toItem = computed( () => {
      return (fromItem.value + itemsPerPage.value) - 1;
    });

    /**
     * Computed which page buttons should be display according to current page and page limit value.
     * @type {ComputedRef<*[]>}
     */
    const pageRange = computed( () => {
      const nextPage = currentPage.value + 1;
      const from1 = nextPage - Math.round(pageLimit / 2);
      const from2 = totalPages.value + 1 - pageLimit;
      const from = Math.max(Math.min(from1, from2), 1)
      const to = Math.min(from + pageLimit - 1, totalPages.value);

      return range(from, to + 1).map((page) => page);
    });

    const emitPageRequest = (page) => {
      if (!disabled.value) {
        emit('loadPage', page);
      }
    }

    const setItemsPerPage = (numberOfItems) => {
      if (itemsPerPages.value !== numberOfItems) {
        emit('setItemsPerPage', numberOfItems);
      }
    };

    const goToPage = (pageNumber) => {
      emitPageRequest(pageNumber);
    };

    return {
      pageRange,
      totalItems,
      currentPage,
      itemsPerPages,
      totalPages,
      fromItem,
      toItem,
      setItemsPerPage,
      goToPage,
    };
  },
};
</script>

<template>
  <slot
      :range="pageRange"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :itemsPerPages="itemsPerPages"
      :fromItem="fromItem"
      :toItem="toItem"
      :setItemsPerPage="setItemsPerPage"
      :goToPage="goToPage"
      v-bind="$attrs">paginator</slot>
</template>
