import {defineStore} from "pinia";
import apiService from "../../services/api.service";
import { watch } from "vue";

export const useFormStoreFactory = (id) => {
  const store = defineStore(id, {
    state: () => ({
      submitUrl: null,
      valuesUrl: null,
      formEl: null,
      controls: new Map(),
      canLeave: true,
      isSubmitting: false,
      errors: new Map(),
      recordId: null,
    }),
    getters: {
    },
    actions: {
      setDataId(id) {
        this.recordId = id;
        if (this.valuesUrl) {
          this.clearControlValues();
          this.fetchControlValues();
        }
      },
      clearControlsValue() {
        for (const value of this.controls.values()) {
          value.value = '';
        }
      },
      fetchControlValues() {
        const options = {
          method: 'POST',
          body: JSON.stringify({id: this.recordId}),
        };

        const { isFetching, data } = apiService.fetchAsResponse(this.valuesUrl, options);

        watch(isFetching, (inProgress) => {
          this.isSubmitting = inProgress;
        });

        watch(data, (newData) => {
          if (newData.results?.status === 'success') {
            Object.keys(newData.results?.values || []).forEach( (controlName) => {
              if (this.controls.has(controlName)) {
                this.controls.get(controlName).value = newData.results.values[controlName];
              }
            });
          } else {
            console.error('Record id return an error: ' + this.recordId);
            this.recordId = null;
          }
        });
      },
      /**
       * Submit form inputs values as a POST request and process server response.
       *
       * Response may contain Javascript expression to be eval using apiService.
       * Response may contain validation errors.
       */
      submitForm() {
        const options = {
          method: 'POST',
          body: JSON.stringify({__formRecordId: this.recordId, ...this.getFormData(this.formEl)}),
        };

        const { isFetching, data, onFetchFinally } = apiService.fetchAsResponse(this.submitUrl, options);
        onFetchFinally( () => {
          const js = data.value?.jsRendered;
          if (js) {
            apiService.evalResponse(js);
          }
        });

        watch(isFetching, (inProgress) => {
          this.isSubmitting = inProgress;
        });

        watch(data, (newData) => {
          const validationErrors = newData?.validationErrors || {};
          Object.keys(validationErrors).forEach((controlName) => {
            this.errors.set(controlName, {
              msg: validationErrors[controlName].messages.join(' / '),
              submitValue: validationErrors[controlName].value,
            });
          });
        });
      },
      /**
       * Set controls map object with a control definition:
       *     {
       *       name: the name of the control,
       *       originalValue: value when loaded,
       *       value: input current value,
       *       isDisabled: input is disabled or not,
       *     }
       *
       * @param controlName
       * @param control
       */
      registerControl(controlName, control) {
        this.controls.set(controlName, control);
      },
      /**
       * Set current input value of a control.
       * @param controlName
       * @param value
       */
      setControlValue(controlName, value) {
        this.controls.get(controlName).value = value;
      },
      checkIfDirty() {
        let dirty = false;
        const formData = this.getFormData(this.formEl);

        for (const control of this.controls.values()) {
          if (control.originalValue !== formData[control.name]) {
            dirty = true;
          }
        }

        return dirty;
      },
      clearError(controlName) {
        if (this.errors.has(controlName)) {
          this.errors.delete(controlName);
        }
      },
      /**
       * Retrieve all controls input current value.
       * Payload is sent using FormData instead of form Controls Map value property because
       * Vue watch function will not detect Javascript input change when using Jquery for example.
       *
       * @returns {{}}
       */
      getFormData(el) {
        const data = {};
        const formData = new FormData(el);
        for( const key of formData.keys()) {
          data[key] = formData.get(key);
        }

        return data;
      }
    }
  });

  fohn.vueService.addStore(id, store);

  return store;
}
