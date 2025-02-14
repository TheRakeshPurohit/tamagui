import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet'
import { composeRefs } from '@tamagui/compose-refs'
import { styled, themeable, useIsomorphicLayoutEffect, withStaticProperties } from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { XStack, YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, {
  ReactNode,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react'

// <Drawer.Provider>
//   <Drawer>
//     <Drawer.Backdrop />
//     <Drawer.Handle />
//     <Drawer.Frame>
//        <Drawer.ScrollView /> (optional)
//     </Drawer.Frame>
//   </Drawer>
// </Drawer.Provider>

type OpenChangeHandler =
  | ((showing: boolean) => void)
  | React.Dispatch<React.SetStateAction<boolean>>

export const DrawerProvider = BottomSheetModalProvider

const DRAWER_NAME = 'Drawer'
// const HANDLE_NAME = 'DrawerHandle'

export const DrawerHandle = styled(XStack, {
  name: 'DrawerHandle',
  height: 8,
  borderRadius: 100,
  backgroundColor: '$backgroundHover',
  position: 'absolute',
  pointerEvents: 'auto',
  zIndex: 10,
  y: -20,
  top: 0,
  left: '30%',
  right: '30%',
  opacity: 0.5,

  hoverStyle: {
    opacity: 0.7,
  },
})

// export type DrawerHandleProps = ScopedProps<XStackProps, 'Drawer'>
// test memo
// export const DrawerHandle = DrawerHandleFrame.extractable(
//   forwardRef(({ __scopeDrawer, ...props }: DrawerHandleProps) => {
//     const context = useDrawerContext(HANDLE_NAME, __scopeDrawer)

//     return null
//   }),
//   {
//     neverFlatten: true,
//   }
// )

type DrawerContextValue = {
  open?: boolean
  onChangeOpen?: OpenChangeHandler
  backgroundComponent?: any
  handleComponent?: any
}

const [createDrawerContext, createDrawerScope] = createContextScope(DRAWER_NAME)
const [DrawerRootProvider, useDrawerContext] = createDrawerContext<DrawerContextValue>(
  DRAWER_NAME,
  {}
)

export const DrawerBackdrop = styled(YStack, {
  name: 'DrawerBackdrop',
  backgroundColor: '$color',
  fullscreen: true,
  opacity: 0.2,
})

export const DrawerFrame = styled(YStack, {
  name: 'DrawerFrame',
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  padding: '$4',
})

export type DrawerProps = ScopedProps<
  Omit<Partial<BottomSheetModalProps>, 'onChange' | 'backgroundStyle' | 'style'>,
  'Drawer'
> & {
  open?: boolean
  defaultOpen?: boolean
  onChangeOpen?: OpenChangeHandler
  children?: ReactNode
}

export const Drawer = withStaticProperties(
  themeable(
    forwardRef<BottomSheetModal, DrawerProps>((props, ref) => {
      const {
        __scopeDrawer,
        children: childrenProp,
        open: openProp,
        defaultOpen,
        onChangeOpen,
        ...rest
      } = props
      const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen || false,
        onChange: onChangeOpen,
      })
      const sheetRef = useRef<BottomSheetModal>(null)

      useIsomorphicLayoutEffect(() => {
        if (!open) {
          // bugfix
          setTimeout(() => {
            sheetRef.current?.dismiss()
          })
        } else {
          sheetRef.current?.present()
        }
        onChangeOpen?.(open)
      }, [open])

      let handleComponent: any = null
      let backdropComponent: any = null
      let frameComponent: any = null

      React.Children.forEach(childrenProp, (child) => {
        if (isValidElement(child)) {
          switch (child.type?.['staticConfig'].componentName) {
            case 'DrawerHandle':
              handleComponent = child
              break
            case 'DrawerFrame':
              frameComponent = child
              break
            case 'DrawerBackdrop':
              backdropComponent = child
              break
            default:
              console.warn('Warning: passed invalid child to Drawer', child)
          }
        }
      })

      // TODO find components

      return (
        <DrawerRootProvider
          scope={__scopeDrawer}
          open={open}
          onChangeOpen={useCallback(setOpen, [])}
        >
          <BottomSheetModal
            handleComponent={() => handleComponent}
            backdropComponent={() => backdropComponent}
            snapPoints={['80%']}
            ref={composeRefs(ref, sheetRef)}
            onChange={(i) => {
              setOpen(i === 0)
            }}
            backgroundStyle={{
              backgroundColor: 'transparent',
            }}
            {...rest}
          >
            {frameComponent}
          </BottomSheetModal>
        </DrawerRootProvider>
      )
    }),
    {
      componentName: 'Drawer',
    }
  ),
  {
    Provider: DrawerProvider,
    Handle: DrawerHandle,
    Frame: DrawerFrame,
    Backdrop: DrawerBackdrop,
    // could leave these separate imports...
    ScrollView: BottomSheetScrollView,
    FlatList: BottomSheetFlatList,
    VirtualizedList: BottomSheetVirtualizedList,
    SectionList: BottomSheetSectionList,
  }
)

export { createDrawerScope }
