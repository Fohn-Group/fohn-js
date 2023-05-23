<template>
  <div>
    <h1>{{title}}</h1>
    <div v-html="message"></div>
  </div>
</template>

<script>
export default {
  name: 'ui-toast',
  props: {
    title: String,
    message: String,
  },
  setup: function (props, { attrs, slots, emit }) {
    const {title, message} = props;

    return { title, message };
  }
}
</script>
