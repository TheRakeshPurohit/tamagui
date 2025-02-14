import React from 'react'
import { Button, Input, SizeTokens, TextArea, XStack, YStack } from 'tamagui'

export default function FormsDemo() {
  return (
    <YStack maxWidth={200} overflow="hidden" space="$2" m="$3" p="$2">
      <FormDemo size="$1" />
      <FormDemo size="$2" />
      <FormDemo size="$3" />
      <TextArea numberOfLines={2} />
    </YStack>
  )
}

function FormDemo(props: { size: SizeTokens }) {
  return (
    <XStack space="$1">
      <Input f={1} w="0%" size={props.size} placeholder={`Size ${props.size}...`} />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}
