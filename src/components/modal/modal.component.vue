<script>
import {onMounted, ref, computed} from 'vue';
import {useModalStoreFactory} from "./modal.store";
import {useElementSize, useWindowSize} from "@vueuse/core";

export default {
  name: 'fohn-modal',
  props: {
    storeId: String,
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
  setup: function (props, extra) {
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
    const message = ref('');

    const modalStore = useModalStoreFactory(storeId)();
    modalStore.status = status.value;
    modalStore.contentUrl = contentUrl;
    modalStore.callbacks = callbacks;
    modalStore.title = modalTitle.value;

    modalStore.$subscribe((mutation, state) => {
      status.value = state.status;
      isLoading.value = state.isLoading;
      modalTitle.value = state.title;
      message.value = state.message;
    });

    const closeModal = () => {
      if (isClosable) {
        modalStore.closeModal();
        maxHeight = false;
      }
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
      message,
      onCallback,
      hasRemoteContent,
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
        :message="message"
        :hasRemoteContent="hasRemoteContent"
        :isClosable="isClosable"
        v-bind="$attrs">Modal
    </slot>
  </div>
</template>