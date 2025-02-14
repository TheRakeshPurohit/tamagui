export const docsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Configuration', route: '/docs/intro/configuration' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
      { title: 'Releases', route: 'https://github.com/tamagui/tamagui/releases' },
    ],
  },

  {
    label: 'Core',
    pages: [
      { title: 'styled()', route: '/docs/core/styled' },
      { title: 'Animations', route: '/docs/core/animations' },
      { title: 'Stack & Text', route: '/docs/core/stack-and-text' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'useMedia()', route: '/docs/core/use-media' },
      { title: 'useTheme()', route: '/docs/core/use-theme' },
    ],
  },

  {
    label: 'Tamagui',
    pages: [
      { title: 'Stacks', route: '/docs/components/stacks' },
      { title: 'Paragraph', route: '/docs/components/text' },
      { title: 'Button', route: '/docs/components/button' },
      { title: 'Headings', route: '/docs/components/headings' },
      { title: 'Image', route: '/docs/components/image' },
      { title: 'Label', route: '/docs/components/label' },
      { title: 'Inputs', route: '/docs/components/inputs' },
      { title: 'Switch', route: '/docs/components/switch' },
      { title: 'Shapes', route: '/docs/components/shapes' },
      { title: 'Separator', route: '/docs/components/separator' },
      { title: 'Popover', route: '/docs/components/popover' },
      { title: 'HoverablePopover', route: '/docs/components/hoverable-popover' },
      { title: 'Tooltip', route: '/docs/components/tooltip' },
      { title: 'LinearGradient', route: '/docs/components/linear-gradient' },
      { title: 'VisuallyHidden', route: '/docs/components/visually-hidden' },
      { title: 'HTML Elements', route: '/docs/components/html-elements' },
      { title: 'Anchor', route: '/docs/components/anchor' },
    ],
  },

  {
    label: 'Separate Components',
    pages: [
      { title: 'Drawer', route: '/docs/components/drawer' },
      { title: 'Menu', route: '/docs/components/menu' },
    ],
  },

  {
    label: 'Extras',
    pages: [{ title: 'Feather Icons', route: '/docs/components/feather-icons' }],
  },

  {
    label: 'Guides',
    pages: [
      { title: 'Design Systems', route: '/docs/guides/design-systems' },
      { title: 'Developing', route: '/docs/intro/dev-tools' },
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
      { title: 'create-tamagui-app', route: '/docs/guides/create-tamagui-app' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages)
