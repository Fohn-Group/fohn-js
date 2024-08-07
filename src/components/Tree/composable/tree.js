import apiService from '../../../services/api.service';

/**
 *
 * Convert all key value to string.
 */
const useStringKey = (nodes) => {
  return nodes.map((node) => {
    node.key = node.key.toString();
    if (node?.children?.length > 0) {
      node.children = useStringKey(node.children);
    }

    return node;
  });
};

/**
 *
 * When extendedNode is use, it adds some options to the node properties.
 * Supported option are:
 *  - collapseIcons,
 *  - expandedIcons,
 */
const useExtendedNode = (nodes, options) => {
  return nodes.map((node) => {
    const extendedNode = { ...node, ...options };
    if (extendedNode.children && extendedNode.children.length > 0) {
      extendedNode.children = useExtendedNode(extendedNode.children, options);
    }

    return extendedNode;
  });
};

/**
 *
 * Post Data request.
 * Request will send:
 *  - the current node key select by user,
 *  - the mode: either select or unselect,
 *  - an array of all key nodes selected,
 *  - the raw value of the entire tree node,
 *
 */
const usePostData = (url, action, key, selectedKeys, treeValue) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ __nodeAction: action, __nodeKey: key, __nodeKeys: selectedKeys, __treeValue: treeValue }),
  };

  const { data, onFetchFinally } = apiService.fetchAsResponse(url, options);
  onFetchFinally(() => {
    const js = data.value?.jsRendered;
    if (js) {
      apiService.evalResponse(js);
    }
  });
};

export { useStringKey, useExtendedNode, usePostData };
