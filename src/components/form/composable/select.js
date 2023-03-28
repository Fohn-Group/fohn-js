import {watch, ref, reactive, computed} from 'vue';
import apiService from "../../../services/api.service";

const getItemLabel = (items, value) => {
  // console.log('getLabel', value);
  const filteredItems = items.filter((i) => i.key === value);
  if (filteredItems.length > 0) {
    return filteredItems[0].label;
  }

  // return null;
}

const useSelect = (props) => {
  const filterMode = props.filterMode;
  const loadItems = ref([...props.items]);
  const filterValue = ref(null);
  const requestUrl  = props.requestUrl;

  // Hook when list items are closed.
  const onClose = (fn) => {
    fn();
  };
  
  const findSiblingIndex = (currentItemKey, direction) => {
    let siblingIndex;
    const index = select.items.findIndex((item) => item.key === currentItemKey);
    switch (direction) {
    case 'up':
      if (index === 0 || index === -1) {
        siblingIndex = select.items.length - 1;
      } else {
        siblingIndex = index - 1;
      }
      break;
    case 'down':
      if (index === (select.items.length - 1) || index === -1) {
        siblingIndex = 0;
      } else {
        siblingIndex = index + 1;
      }
      break;
    default:
    }

    return siblingIndex;
  }

  const select = reactive({
    isOpen: false,
    isFetching: false,
    value: props.modelValue,
    openIcon: props.openIcon,
    closeIcon: props.closeIcon,
    // select.items = props.items;
    deleteIcon: props.deleteIcon,
    allowNull: props.allowNull,
    toggleState: computed(() => (select.isOpen ? select.closeIcon : select.openIcon)),
    deleteState: computed(() => (select.value ? select.deleteIcon : '')),
    label: computed(() => {
      if (filterValue.value !== null) {
        return filterValue.value;
      }
      return getItemLabel(loadItems.value, select.value);
    }),

  });

  if (filterMode === 'search') {
    select.items = useFilterModeSearch(filterValue, loadItems);
  } else {
    select.items = useQueryModeSearch(loadItems);
  }

  const fetchItems = useFetchItems(props.requestUrl, select, loadItems, props.items);

  return {select, onClose, filterMode, requestUrl, filterValue, fetchItems, findSiblingIndex};
};

const useQueryModeSearch = (loadItems) => {
  return computed( () => {
    return loadItems.value;
  })
};

const useFilterModeSearch = (filterValue, loadItems) => {
  return computed( () => {
    const value = filterValue.value || '';
    return loadItems.value.filter( (item ) => item.label.toLowerCase().includes(value.toLowerCase()));
  })
};
const useAsyncFetchItems = (url, select, loadItems) => {
  return async (payload) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    const response = await apiService.fetchAsResponse(url, options);

    loadItems.value = response.data?.results;
  }
}

const queryItems = async (url, payload) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(payload),
  };

  const response = await apiService.fetchAsResponse(url, options);

  return response.data?.results || [];
}

const useFetchItems = (url, select, loadItems, propsItem = []) => {
  return (payload, callback = null) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    const {isFetching, data } = apiService.fetchAsResponse(url, options);

    watch(isFetching, (inProgress) => {
      select.isFetching = inProgress;
    });

    watch(data, (data) => {
      loadItems.value = propsItem.concat([...data?.results || []]);

      if (callback) {
        callback(loadItems.value);
      }

      if (data.value?.jsRendered) {
        apiService.evalResponse(data.value?.jsRendered);
      }
    });
  };
}

export {
  getItemLabel, useSelect
};
