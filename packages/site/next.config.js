/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')
const withVideos = require('next-videos')
const withBundleAnalyzer = require('@next/bundle-analyzer')

Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const transform = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    }),
    withVideos,
    withTamagui({
      config: './tamagui.config.ts',
      components: ['tamagui'],
      importsWhitelist: ['constants.js', 'colors.js'],
      logTimings: true,
      disableExtraction,
      excludeReactNativeWebExports: [
        'Switch',
        'ProgressBar',
        'Picker',
        'Animated',
        'AnimatedFlatList',
        'VirtualizedList',
        'VirtualizedSectionList',
        // reanimated node_modules/react-native-reanimated/lib/reanimated2/component/FlatList.js
        // 'FlatList',
      ],
    }),
    // // template for modifying webpack further:
    // (nextConfig = {}) => {
    //   return Object.assign({}, nextConfig, {
    //     webpack(config, options) {
    //       config.optimization.minimize = false
    //       if (typeof nextConfig.webpack === 'function') {
    //         return nextConfig.webpack(config, options)
    //       }
    //       return config
    //     },
    //   })
    // },
    (config) => {
      // for github pages
      if (process.env.ON_GITHUB_PAGES) {
        console.log('Setting github pages base and asset paths')
        config.basePath = '/tamagui'
        config.assetPrefix = '/tamagui/'
      }
      return config
    },
  ],
  {
    // Next.js config
    async redirects() {
      return [
        {
          source: '/docs',
          destination: '/docs/intro',
          permanent: true,
        },
      ]
    },
  }
)

module.exports = function (name, opts) {
  const { defaultConfig } = opts
  defaultConfig.webpack5 = true
  // defaultConfig.swcMinify = true
  defaultConfig.wait = true
  defaultConfig.useSuspense = false
  // defaultConfig.experimental.reactRoot = 'concurrent'
  defaultConfig.typescript.ignoreBuildErrors = true
  return transform(name, { defaultConfig })
}
