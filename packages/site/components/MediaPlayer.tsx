import { FastForward, Pause, Rewind } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import {
  Button,
  Card,
  Image,
  Paragraph,
  Separator,
  Square,
  Theme,
  ThemeName,
  XStack,
  YStack,
} from 'tamagui'

import image from '../public/kanye.jpg'

export const MediaPlayer = memo(
  ({
    theme,
    alt: altProp,
    onHoverSection,
    pointerEvents,
    pointerEventsControls,
  }: {
    theme?: ThemeName
    alt?: number | null
    onHoverSection?: (name: string) => void
    pointerEvents?: any
    pointerEventsControls?: any
  }) => {
    const alt = altProp ?? 0
    const themeName = theme ?? (alt ? (`alt${alt}` as any) : null)
    const barTheme = theme ?? (`alt${Math.min(4, alt + 1)}` as any)
    const mainButtonTheme = theme ?? (`alt${Math.min(4, alt + 2)}` as any)

    return (
      <Theme name={themeName}>
        <Card
          overflow="visible"
          bordered
          size="$6"
          br="$7"
          pointerEvents={pointerEvents}
          pl={0}
          pr={0}
          pb={0}
          pt={0}
          ai="stretch"
        >
          <XStack ai="center" p="$4" space="$5">
            <Square pos="relative" ov="hidden" br="$6" size={90}>
              <Image width={90} height={90} src={image.src} />
            </Square>

            <YStack miw={165} mt={-10} jc="center">
              <Paragraph fontWeight="700">Spaceship</Paragraph>
              <Paragraph theme={barTheme} size="$3">
                Kanye West
              </Paragraph>
              <Paragraph theme={barTheme} size="$3">
                College Dropout
              </Paragraph>
            </YStack>
          </XStack>

          <Separator mb={-1} />

          <Theme name={barTheme}>
            <XStack
              zi={1000}
              w="100%"
              px="$6"
              py="$4"
              bc="$background"
              bbrr={15}
              bblr={15}
              ai="center"
              space="$5"
              jc="center"
              pointerEvents={pointerEvents}
            >
              <Rewind size={20} />
              <Button
                theme={mainButtonTheme}
                bordered
                hoverStyle={{
                  elevation: '$6',
                  scale: 1.025,
                }}
                my="$-6"
                icon={Pause}
                size="$7"
                circular
                elevation="$4"
                pointerEvents={pointerEventsControls}
              />
              <FastForward size={20} />
            </XStack>
          </Theme>
        </Card>
      </Theme>
    )
  }
)
