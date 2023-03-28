import {reactive, ref} from 'vue';

/**
 * Return a reactive object with all input attributes.
 * @param props
 * @returns {*}
 */
function getInputAttrs(props) {
  const inputAttrs = reactive({
    name: props.ctrlName,
    value: ref(props.ctrlValue),
    type: props.type,
    required: props.isRequired,
    readonly: props.isReadOnly,
    placeholder: props.placeholder,
    disabled: props.isDisabled,
  });

  if (props.type === 'number' || props.type === 'range') {
    inputAttrs.step = props.step;
  }

  if (props.type === 'range') {
    inputAttrs.min = props.min;
    inputAttrs.max = props.max;
  }

  return inputAttrs;
}

export {
  getInputAttrs,
};
