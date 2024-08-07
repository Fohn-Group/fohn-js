const useHighlightColors = (color) => {
  return color ? color : 'border-gray-200 bg-white';
};

const useHoverColors = (color) => {
  return color ? color : 'hover:bg-gray-200';
};

export { useHighlightColors, useHoverColors };
