import { useDebounceFn, useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

function useGetTableHeight(heightProps) {
  const desiredHeight = heightProps || '';
  const styleProperty = 'height';
  const style = ref({});
  if (desiredHeight.startsWith('viewport')) {
    const factor = (heightProps.split('-')[1] ?? 100) / 100;
    const { height } = useWindowSize();
    const debounceHeight = useDebounceFn((height) => {
      style.value[styleProperty] = Math.round(height * factor) + 'px';
    }, 250);
    watch(height, (newHeight) => {
      debounceHeight(newHeight);
    });
    style.value[styleProperty] = Math.round(height.value * factor) + 'px';
  }
  else if (desiredHeight) {
    style.value[styleProperty] = desiredHeight + 'px';
  }

  return style;
}

function useSortDirection(newColumnName, oldColumName, currentDirection, newDirection = null) {
  let direction;
  if (newColumnName !== oldColumName) {
    direction = 'asc';
  }
  else {
    if (newDirection) {
      direction = newDirection;
    }
    else {
      // find index of current direction and return next one
      if (currentDirection === 'none') {
        direction = 'asc';
      }
      else if (currentDirection === 'asc') {
        direction = 'desc';
      }
      else {
        direction = 'none';
      }
    }
  }

  return direction;
}

export { useGetTableHeight, useSortDirection };
