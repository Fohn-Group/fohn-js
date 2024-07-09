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

export { useExtendedNode };
