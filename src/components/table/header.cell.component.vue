<script>
import {computed, toRefs, reactive } from "vue";

export default {
  /**
     *  Table Header cell component.
     *  Use dynamic slot name in order to render component.
     *
     *  Props: column as an Object
     *    {
     *        name: 'the column  name', // use for template slotName and data-header-name attribute.
     *        label: 'the column label', // Usually the value to display in Header.
     *    }
     *
     *
    */
  name: 'fohn-header-cell',
  props: {
    column: {
      type: Object,
      default: () => {
        return {
          name: '',
          label: '',
          isSortable: false,
        };
      }
    },
    sortColumn: String,
    sortDirection: String,
  },
  emits: {
    sortTable: (columnName = '') => {
      return !!columnName;
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { sortColumn, sortDirection } = toRefs(props);
    const { column } = reactive(props);

    const isSorted = computed(() => {
      return column.name === sortColumn.value;
    });

    const isAscending = computed(() => {
      return sortDirection.value === 'asc';
    })

    const toggleSort = () => {
      if (column.isSortable) {
        emit('sortTable', column.name);
      }
    };

    // allow sorting table per column def name.
    const sort = (dir) => {
      if (column.isSortable) {
        emit('sortTable', column.name, dir);
      }
    };

    return { column, isSorted, isAscending, sort, toggleSort };
  },
};
</script>

<template>
  <slot :name="column.name"
        :headerName="column.name"
        :headerLabel="column.label"
        :isSortable="column.isSortable"
        :isSorted="isSorted"
        :isAscending="isAscending"
        :sort="sort"
        :toggleSort="toggleSort"
        v-bind="$attrs">Header</slot>
</template>

