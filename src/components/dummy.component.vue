<template>
 <div>
  <slot :phrase="phrase">Dummy</slot>
 </div>
</template>

<script>
import {onMounted, toRefs} from "vue";

export default {
  name: 'fohn-dummy',
  props: {
    phrase: {
      type: String,
      default: 'I am dummy',
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { phrase } = toRefs(props);

    onMounted( ()=> {
      console.log('moounting dummy');
    });

    return {
      phrase,
    };
  },
}
</script>

<style scoped>

</style>
