<script>
import {ref, onMounted, reactive, watch} from 'vue';
import { useFormStoreFactory } from "./form.store";

/**
 * Handle form control and submission.
 *
 */
export default {
  name: 'fohn-form',
  props: {
    storeId: String,
    dataRecordId: String,
    canLeave: Boolean,
    submitUrl: String,
    valuesUrl: {
      type: String,
      default: null,
    },
  },
  setup: function (props, { attrs, slots, emit }) {
    const { submitUrl, storeId, dataRecordId, valuesUrl } = props;
    const canLeave = ref(props.canLeave);
    const container = ref(null);
    const submitBtn = ref(null);
    const errors = reactive({});
    const isSubmitting = ref(false);
    const isDirty = ref(false);

    const formStore = useFormStoreFactory(storeId)();

    formStore.$subscribe((mutation, state) => {
      isSubmitting.value = state.isSubmitting;
      canLeave.value = state.canLeave;
      setBtnState(state.isSubmitting);
      isDirty.value = formStore.checkIfDirty();
    });

    const setBtnState = (isSubmiting) => {
      if (isSubmiting) {
        submitBtn.value?.classList.add('loading');
      } else {
        submitBtn.value?.classList.remove('loading');
      }
    }

    /**
     * Submit form.
     */
    const submitForm = (e) => {
      if (!isSubmitting.value)  {
        formStore.submitForm();
      }
    };

    onMounted(() => {
      formStore.submitUrl = submitUrl;
      formStore.canLeave = canLeave;
      formStore.formEl = container.value.querySelector('form');
      formStore.valuesUrl = valuesUrl;
      submitBtn.value = container.value.querySelector('form button[type="submit"]');

      if (dataRecordId) {
        formStore.setDataId(dataRecordId);
      }
    });

    return { canLeave, isSubmitting, errors, submitForm, storeId, isDirty, container };
  },
};

</script>

<template>
  <div ref="container" v-bind="$attrs">
    <slot :canLeave="canLeave"
          :isSubmitting="isSubmitting"
          :formErrors="errors"
          :submitForm="submitForm"
          :storeId="storeId"
          :isDirty="isDirty"
    >form content</slot>
  </div>
</template>
