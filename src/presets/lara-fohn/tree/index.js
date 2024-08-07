import { useHighlightColors, useHoverColors } from '../../../components/tree/composable/style';

export default {
  root: {
    class: [],
  },
  wrapper: {
    class: ['overflow-auto'],
  },
  node: {
    class: ['p-1', 'rounded-md'],
  },
  nodeChildren: ({ props }) => {
    return {
      class: props?.pt?.nodeChildrenClass || ['ml-2'],
    };
  },
  nodeToggleButton: ({ context }) => ({
    class: [
      { invisible: context.leaf },
    ],
  }),
  nodeToggleIcon: ({ props, context, instance }) => {
    let iconClass = [];
    if (props.node?.collapsedIcon && props.node?.expandedIcon) {
      iconClass = [
        { [props.node.collapsedIcon]: !context.expanded },
        { [props.node.expandedIcon]: context.expanded },
      ];
    }
    return {
      class: iconClass,
    };
  },
  nodeContent: ({ context, props, instance }) => {
    const selectedColors = useHighlightColors(props?.pt?.selectedColors);
    const hoverColor = useHoverColors(props?.pt?.hoverColors);

    return {
      class: [
        // Flex and Alignment
        'flex items-center',

        // Shape
        'rounded-md',

        // Spacing
        'px-2',

        // Colors
        // 'text-surface-600 dark:text-white/70',
        { [selectedColors]: context.selected },

        // States
        {
          [hoverColor]: (props.selectionMode === 'single' || props.selectionMode === 'multiple') && !context.selected,
          'opacity-30': (props.node.selectable === false) && context.leaf && props.selectionMode !== 'checkbox',
        },

        // Transition
        'transition-shadow duration-200',

        { 'cursor-pointer select-none': props.selectionMode === 'single' || props.selectionMode === 'multiple' },
      ],
    };
  },
  nodeCheckbox: ({ props, context, instance }) => {
    const boxColors = useHighlightColors(useHighlightColors(props?.pt?.selectedColors));
    return {
      root: {
        class: [
          'relative',

          // Alignment
          'inline-flex',
          'align-bottom',

          // Size
          'w-5',
          'h-5',

          // Spacing
          'mx-1',

          // Misc
          'cursor-pointer',
          'select-none',
        ],
      },
      box: {
        class: [
          // Alignment
          'flex',
          'items-center',
          'justify-center',

          // Size
          'w-5',
          'h-5',

          // Shape
          'rounded-md',
          'border',

          // Colors
          {
            [boxColors]: context.checked,
          },

          // States
          {
            'peer-hover:border-gray-300': !props.disabled && !context.checked,
            'cursor-default opacity-60': props.disabled,
          },

          // Transitions
          'transition-colors',
          'duration-200',
        ],
      },
      input: {
        class: [
          'peer',

          // Size
          'w-full ',
          'h-full',

          // Position
          'absolute',
          'top-0 left-0',
          'z-10',

          // Spacing
          'p-0',
          'm-0',

          // Shape
          'opacity-0',
          'rounded-md',
          'outline-none',

          // Misc
          'appearance-none',
          'cursor-pointer',
        ],
      },
    };
  },
  nodeicon: {
    class: ['mx-2'],
  },
  pcFilterContainer: {
    class: ['relative block', 'mb-2', 'w-full'],
  },
  pcFilterInput: ({ props }) => {
    return {
      class: props.pt.filterInputClass,
    };
  },
  loadingicon: {
    class: ['absolute top-[50%] right-[50%] -mt-2 -mr-2 animate-spin'],
  },
};
