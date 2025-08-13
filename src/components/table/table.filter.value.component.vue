<script>
/**
 * Hold a filter item value.
 * Value is set via a dynamic component.
 * When user change value, an onUpdateValue event is emitted.
 */
import { ref, toRefs, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

export default {
  name: 'fohn-table-filter-value',
  emits: ['onUpdateValue'],
  props: {
    component: {
      type: Object,
      default: () => {
        return {
          id: 'input',
          props: {
            name: '',
            type: 'text',
            value: '',
          },
        };
      },
    },
    debounceTime: {
      type: Number,
      default: 0,
    },
  },

  setup(props, { attrs, slots, emit }) {
    const { component } = toRefs(props);
    const componentName = ref(component.value.id);
    let componentProps = ref(component.value.props);
    const debounceUpdate = useDebounceFn((value) => {
      emit('onUpdateValue', value);
    }, props.debounceTime);

    const preventClickOutside = isOn => console.log('prevent outside', isOn);

    if (component.value.id === 'flat-pickr') {
      componentProps.value.config.onOpen = () => preventClickOutside(true);
      componentProps.value.config.onClose = () => preventClickOutside(false);
    }

    /**
     *  Change component when parent props changed, i.e. when user select a new
     *  column, the new component can setup value according to the new column type.
     */
    watch(component, (newComponent) => {
      componentName.value = newComponent.id;
      componentProps.value = newComponent.props;
    });

    const update = (value) => {
      debounceUpdate(value);
    };

    return { componentName, componentProps, update };
  },
};
</script>

<template>
  <div>
    <slot
      :componentName="componentName"
      :update="update"
      :componentProps="componentProps"
    ></slot>
  </div>
</template>

<style scoped></style>
