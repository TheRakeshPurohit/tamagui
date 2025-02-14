import '@docsearch/css'
import '@tamagui/font-fira-mono/css/400.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import '@tamagui/font-silkscreen/css/400.css'

import '../app.css'

import { DocsPage } from '@components/DocsPage'
import { Footer } from '@components/Footer'
import * as NextThemes from '@components/NextTheme'
import { gtagUrl, renderSnippet } from '@lib/analytics'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { useMemo, useState } from 'react'
import { YStack } from 'tamagui'

import { SearchProvider } from '../components/Search'
import Tamagui from '../tamagui.config'

globalThis['React'] = React
Error.stackTraceLimit = Infinity

const isChrome =
  typeof document !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  /Chrome/.test(navigator.userAgent) &&
  /Google Inc/.test(navigator.vendor)
if (isChrome) {
  // log out CSS for debugging
  const blocks = Tamagui.getCSS().split('}\n')
  console.groupCollapsed('CSS')
  for (const block of blocks) {
    const title = block.slice(0, block.indexOf('{')).split(', ').join('\n')
    console.groupCollapsed(title)
    console.log(block)
    console.groupEnd()
  }
  console.groupEnd()
}

export default function App(props: AppProps) {
  const isClient = typeof document !== 'undefined'
  const classes = isClient ? [...document.documentElement.classList] : []
  const isDark = classes.includes('tui_dark')
  const [theme, setTheme] = useState(isDark ? 'dark' : 'light')

  // memo to avoid re-render on dark/light change
  const contents = useMemo(() => {
    return (
      <SearchProvider>
        <ContentInner {...props} />
      </SearchProvider>
    )
  }, [props])

  // cant do system them because next SSR
  return (
    <>
      <Head>
        {/* TODO bye google */}
        <Script async src={gtagUrl} />
        <Script dangerouslySetInnerHTML={{ __html: renderSnippet() || '' }} />
      </Head>
      <NextThemes.ThemeProvider
        enableSystem
        disableTransitionOnChange
        attribute="class"
        defaultTheme="system"
        value={{
          dark: 'tui_dark',
          light: 'tui_light',
        }}
        onChangeTheme={(x) => setTheme(x.replace('tui_', ''))}
      >
        <Tamagui.Provider disableRootThemeClass defaultTheme={theme}>
          {contents}
        </Tamagui.Provider>
      </NextThemes.ThemeProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isDocs = router.pathname.includes('/docs')
  const isDemo = router.pathname.includes('/responsive-demo')
  return (
    <YStack>
      {isDocs ? (
        <DocsPage>
          <Component {...pageProps} />
        </DocsPage>
      ) : (
        <Component {...pageProps} />
      )}
      {!isDocs && !isDemo && <Footer />}
    </YStack>
  )
}
