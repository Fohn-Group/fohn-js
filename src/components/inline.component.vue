<template>
  <slot :data="dataProp">fallback</slot>
</template>

<script>

export default {
  name: 'fohn-inline',
  props: {
    data: Object,
  },
  setup: function (props, { attrs, slots, emit }) {
    const { data } = props;
    data.date = new Date();

    return {
      dataProp: data,
    };
  },
};

</script>
