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
  },

  setup(props, { attrs, slots, emit }) {
    const {iconName, altIconName} = props;
    const isActive = ref(props.isActive);

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
    }
  }
}

</script>

<template>
  <slot
      :iconCss=iconCss
      :toggleFilterIcon=toggleFilterIcon
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>