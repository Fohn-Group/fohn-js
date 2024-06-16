import { useDebounceFn, useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

function useGetTableHeight(heightProps) {
  const maxHeight = ref({});
  if (heightProps.startsWith('viewport')) {
    const factor = (heightProps.split('-')[1] ?? 100) / 100;
    const { height } = useWindowSize();
    const debounceHeight = useDebounceFn((height) => {
      maxHeight.value['max-height'] = Math.round(height * factor) + 'px';
    }, 250);
    watch(height, (newHeight) => {
      debounceHeight(newHeight);
    });
    maxHeight.value['max-height'] = Math.round(height.value * factor) + 'px';
  }
  else if (heightProps > 0) {
    maxHeight.value['max-height'] = heightProps + 'px';
  }

  return maxHeight;
}

export { useGetTableHeight };
