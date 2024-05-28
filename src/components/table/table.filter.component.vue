<script>
import {computed, inject, ref} from "vue";
import {useTableStoreFactory} from "./table.store";

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
  },

  setup(props, { attrs, slots, emit }) {
    const {iconName, altIconName} = props;
    const isActive = ref(props.isActive);

    const columns = ref(props.columns);
    const operators = ref(props.operators);

    const filters = ref({});

    const tableStore = useTableStoreFactory(inject('tableStoreId'))();
    const tableIsFetching = ref(false);

    tableStore.$subscribe((mutation, state) => {
      tableIsFetching.value = state.isFetching;
    });

    const iconCss = computed(() => ({
      [iconName]: !isActive.value,
      [altIconName]: isActive.value,
      'text-gray-200': tableIsFetching.value,
    }));

    const toggleFilterIcon = () => isActive.value = !isActive.value;

    return {
      iconCss,
      toggleFilterIcon,
      isActive,
      columns,
      operators,
      filters,
    }
  }
}

</script>

<template>
  <slot
      :iconCss=iconCss
      :toggleFilterIcon=toggleFilterIcon
      :isActive="isActive"
      :columns="columns"
      :operators="operators"
      :filters="filters"
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>