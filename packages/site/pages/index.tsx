import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Community } from '@tamagui/site/components/HeroCommunity'
import { FeaturesGrid } from '@tamagui/site/components/HeroFeaturesGrid'
import { useMemo } from 'react'
import { Separator, XStack, YStack, styled } from 'tamagui'

import { CocentricCircles } from '../components/CocentricCircles'
import { useTint } from '../components/ColorToggleButton'
import { ContainerLarge } from '../components/Container'
import { HeaderFloating } from '../components/HeaderFloating'
import { HeroBelow } from '../components/HeroBelow'
import { HeroExampleAnimations } from '../components/HeroExampleAnimations'
import { HeroExampleCode } from '../components/HeroExampleCode'
import { HeroExampleProps } from '../components/HeroExampleProps'
import { HeroExampleThemes } from '../components/HeroExampleThemes'
import { HeroPerformance } from '../components/HeroPerformance'
import { HeroResponsive } from '../components/HeroResponsive'
import { HeroTypography } from '../components/HeroTypography'
import { InstallInput } from '../components/InstallInput'
import { SearchButton } from '../components/Search'

export default function Home() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating isHome />
      <Hero />
      <Separator borderStyle="dotted" />
      <XStack zi={100} theme="alt1" my={-28} ai="center" jc="center">
        <SearchButton color="$color" width={320} size="$6">
          Search Docs...
        </SearchButton>
      </XStack>
      <YStack shac="$shadowColorHover" shar="$1" py="$8" pb="$9">
        <HeroBelow />
      </YStack>
      <Separator borderStyle="dotted" />
      <ContainerLarge fd="column" pos="relative" zi={100000}>
        <XStack als="center" pos="absolute" y={-28} jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>
      <Section contain="paint layout" pos="relative" zi={1000}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleThemes />
      </Section>
      <Section pb="$0" zi={10}>
        <HeroResponsive />
      </Section>
      <SectionTinted contain="paint layout" gradient bubble>
        <HeroPerformance />
      </SectionTinted>
      <SectionTinted contain="paint layout" noBorderTop zi={100}>
        <YStack fullscreen className="bg-grid-big mask-gradient-up" />
        <HeroExampleAnimations />
      </SectionTinted>
      <Section contain="paint layout" zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid-big mask-gradient-down" />
        <HeroExampleCode />
      </Section>
      <Section mt={-100}>
        <FeaturesGrid />
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-up" />
      </Section>
      <SectionTinted contain="paint layout" bubble gradient>
        <HeroTypography />
      </SectionTinted>
      <Section>
        <HeroExampleProps />
      </Section>
      <Section mt={-70} zi={0}>
        <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={-615} left={0} right={0} ai="center">
          <CocentricCircles />
        </YStack>
        <Community />
      </Section>
    </>
  )
}

const Section = styled(YStack, {
  name: 'Section',
  pos: 'relative',
  py: '$10',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  },
})

const SectionTinted = ({ children, gradient, extraPad, bubble, noBorderTop, ...props }: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])
  return (
    <YStack
      zi={2}
      contain="paint"
      pos="relative"
      py="$9"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: `$${tint}3`,
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        zi={-1}
        bc={gradient ? `$${tint}1` : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: `$${tint}3`,
        })}
      />
      {childrenMemo}
    </YStack>
  )
}
