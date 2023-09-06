<script>
import {onMounted, ref, watch, computed} from 'vue';
import {useModalStoreFactory} from "./modal.store";
import {useElementSize, useWindowSize} from "@vueuse/core";

export default {
  name: 'fohn-modal',
  props: {
    storeId: String,
    message: {
      type: String,
      default: '',
    },
    title: String,
    isClosable: {
      type: Boolean,
    },
    callbacks: [Object, String],
    contentUrl: String,
    status: {
      type: String,
      default: 'close',
    }
  },
  emits: ['onConfirm', 'onCancel'],
  setup: function (props, { attrs, slots, emit }) {
    const { contentUrl, callbacks, storeId } = props;
    const modalTitle = ref(props.title);
    const hasRemoteContent = !!contentUrl;
    const isClosable = props.isClosable;
    const status = ref(props.status);
    const isLoading = ref(false);
    const container = ref(null);
    const modalEl = ref(null);
    const { height: modalHeight } = useElementSize(modalEl);
    const { height: windowHeight } = useWindowSize();
    let maxHeight = false;
    const modalMessage = ref('');

    // listen top props change and update store message.
    watch(() => props.message, (newMsg) => {
      modalStore.setMessage(newMsg);
    });

    const modalStore = useModalStoreFactory(storeId)();
    modalStore.status = status.value;
    modalStore.contentUrl = contentUrl;
    modalStore.callbacks = callbacks;
    modalStore.title = modalTitle.value;

    modalStore.$subscribe((mutation, state) => {
      status.value = state.status;
      isLoading.value = state.isLoading;
      modalTitle.value = state.title;
      modalMessage.value = state.message;
    });

    const closeModal = (forceClose = false) => {
      if (forceClose || isClosable) {
        modalStore.closeModal();
        maxHeight = false;
      }
    }

    const emitConfirm = (e) => {
      emit('onConfirm', e);
    }

    const emitCancel = (e) => {
      emit('onCancel', e);
    }
    const openModal = () => {
      modalStore.openModal();
    }

    const isOpen = computed(() => {
      return status.value === 'open';
    });

    const heightCss = computed(() => {
      if (!maxHeight) {
        maxHeight = (modalHeight.value > windowHeight.value);
      }
      return {
        'h-5/6' : maxHeight && isOpen,
      };
    });

    const onCallback = (event, name, args) => {
      modalStore.onCallback(event, name, args);
    }

    onMounted(() => {
      modalEl.value = container.value.querySelector('.__fohn-modal');
    });

    return {
      isOpen,
      modalTitle,
      closeModal,
      openModal,
      isLoading,
      container,
      heightCss,
      modalMessage,
      onCallback,
      hasRemoteContent,
      emitConfirm,
      emitCancel,
      isClosable,
    };
  },
};
</script>

<template>
  <div ref="container" role="dialog" aria-modal="true" aria-labelledby="modal-headline" v-esc="closeModal">
    <slot
        :heightCss="heightCss"
        :title="modalTitle"
        :isOpen="isOpen"
        :isLoading="isLoading"
        :closeModal="closeModal"
        :openModal="openModal"
        :onCallback="onCallback"
        :message="modalMessage"
        :hasRemoteContent="hasRemoteContent"
        :isClosable="isClosable"
        :confirm="emitConfirm"
        :cancel="emitCancel"
        v-bind="$attrs">Modal
    </slot>
  </div>
</template>