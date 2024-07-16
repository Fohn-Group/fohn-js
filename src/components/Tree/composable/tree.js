const supportedMode = ['single', 'multiple', 'checkbox'];
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
 *  - selectedColors => Tailwind utilities to applied to the selected node.
 *  - hoverColors => Tailwind utilities to be applied to a selectable node when hovered.
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

const useSelectMode = (mode, node, selectKey) => {
  let newKey = {};
  if (!supportedMode.includes(mode)) {
    return newKey;
  }

  if (mode === 'single') {
    newKey[node.key] = true;
  }
  else if (mode === 'multiple') {
    newKey = { ...{ [node.key]: true }, ...selectKey };
  }
  else if (mode === 'checkbox') {
    newKey = { ...{ [node.key]: { partialChecked: true } }, ...selectKey };
  }

  return newKey;
};

const useUnSelectMode = (mode, node, selectKey) => {

  let newKey = {};
  if (!supportedMode.includes(mode)) {
    return newKey;
  }

  if (mode === 'single') {
    newKey = {};
  }
  else if (mode === 'multiple') {
    for (const [key, value] of Object.entries(selectKey)) {
      if (key !== node.key) {
        newKey[key] = value;
      }
    }
  }

  return newKey;
};

export { useStringKey, useExtendedNode, useSelectMode, useUnSelectMode };
