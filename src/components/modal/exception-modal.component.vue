<template>
  <Teleport to="body">
    <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full inset-0 h-modal h-full"
         :class="{'hidden': !isOpenState}" >
      <div class="relative top-20 mx-auto border w-4/5 shadow-lg rounded-md bg-white">
        <div class="grid grid-cols-6 bg-red-500 p-2  text-white">
          <div class="col-span-5">Ui Exception</div>
          <div class="cursor-pointer" @click="closeModal"><span class="bi bi-x float-right text-lg"></span></div>
        </div>
        <div v-html="html" class="p-5 overflow-auto max-h-fit" ></div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { watch, ref, toRefs } from 'vue';

export default {
  name:'fohn-ui-exception',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    html: {
      type: String,
      default: '',
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { html } = toRefs(props);
    const isOpenState = ref(props.isOpen);

    watch(html, (newV) => {
      isOpenState.value = true;
    });

    const closeModal = () => {
      isOpenState.value = false;
    }

    return {
      html,
      isOpenState,
      closeModal,
    };
  },
};
</script>
