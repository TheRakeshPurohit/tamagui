import { AnimatePresenceContext, useEntering } from '@tamagui/animate-presence'
import { AnimationDriver } from '@tamagui/core'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import Animated, {
  WithDecayConfig,
  WithSpringConfig,
  WithTimingConfig,
  runOnJS,
  useAnimatedStyle,
  withDecay,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type AnimationsConfig<A extends Object = any> = {
  [Key in keyof A]: AnimationConfig
}

type AnimationConfig =
  | ({ type: 'timing'; loop?: number } & WithTimingConfig)
  | ({ type: 'spring'; loop?: number } & WithSpringConfig)
  | ({ type: 'decay'; loop?: number } & WithDecayConfig)
// | ({ type: 'transition' } & TransitionProps)

const AnimatedView = Animated.View
const AnimatedText = Animated.Text

AnimatedView['displayName'] = 'AnimatedView'
AnimatedText['displayName'] = 'AnimatedText'

export function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A> {
  return {
    avoidClasses: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimations: (props, helpers) => {
      const { pseudos, onDidAnimate, delay, getStyle, state, staticConfig } = helpers
      const [isEntering, safeToUnmount] = useEntering()
      const presence = useContext(AnimatePresenceContext)

      const exitStyle = presence?.exitVariant
        ? staticConfig.variantsParsed?.[presence.exitVariant]?.true || pseudos.exitStyle
        : pseudos.exitStyle

      const reanimatedOnDidAnimated = useCallback<NonNullable<typeof onDidAnimate>>(
        (...args) => {
          onDidAnimate?.(...args)
        },
        [onDidAnimate]
      )

      const all = getStyle({
        isEntering,
        exitVariant: presence?.exitVariant,
        enterVariant: presence?.enterVariant,
      })
      const [animatedStyles, nonAnimatedStyle] = [{}, {}]
      const animatedStyleKey = {
        transform: true,
        opacity: true,
      }
      for (const key of Object.keys(all)) {
        if (animatedStyleKey[key]) {
          animatedStyles[key] = all[key]
        } else {
          nonAnimatedStyle[key] = all[key]
        }
      }

      const args = [
        JSON.stringify(all),
        state.mounted,
        state.hover,
        state.press,
        state.pressIn,
        state.focus,
        delay,
        isEntering,
        onDidAnimate,
        reanimatedOnDidAnimated,
        presence?.exitVariant,
        presence?.enterVariant,
      ]

      const animatedStyle = useAnimatedStyle(() => {
        const style = animatedStyles

        const final = {
          transform: [] as any[],
        }

        const isExiting = isEntering === false
        const transition = animations[props.animation]

        const exitingStyleProps: Record<string, boolean> = {}
        if (exitStyle) {
          for (const key of Object.keys(exitStyle)) {
            exitingStyleProps[key] = true
          }
        }

        for (const key in style) {
          const value = style[key]
          const aconf = animationConfig(key, transition)
          const { animation, config, shouldRepeat, repeatCount, repeatReverse } = aconf

          const callback: (completed: boolean, value?: any) => void = (completed, recentValue) => {
            runOnJS(reanimatedOnDidAnimated)(key, completed, recentValue, {
              attemptedValue: value,
            })
            if (isExiting) {
              exitingStyleProps[key] = false
              const areStylesExiting = Object.values(exitingStyleProps).some(Boolean)
              // if this is true, then we've finished our exit animations
              if (!areStylesExiting) {
                if (safeToUnmount) {
                  runOnJS(safeToUnmount)()
                }
              }
            }
          }

          let { delayMs = null } = animationDelay(key, transition, delay)

          if (key === 'transform') {
            if (!Array.isArray(value)) {
              console.error(`Invalid transform value. Needs to be an array.`)
              continue
            }

            for (const transformObject of value) {
              const key = Object.keys(transformObject)[0]
              const transformValue = transformObject[key]
              let finalValue = animation(transformValue, config, callback)
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              final['transform'].push({
                [key]: finalValue,
              })
            }
            continue
          }

          if (typeof value === 'object') {
            // shadows
            final[key] = {}
            for (const innerStyleKey of Object.keys(value || {})) {
              let finalValue = animation(value, config, callback)
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              if (delayMs != null) {
                final[key][innerStyleKey] = withDelay(delayMs, finalValue)
              } else {
                final[key][innerStyleKey] = finalValue
              }
            }
            continue
          }

          let finalValue = animation(value, config, callback)
          if (shouldRepeat) {
            finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
          }
          if (delayMs != null && typeof delayMs === 'number') {
            final[key] = withDelay(delayMs, finalValue)
          } else {
            final[key] = finalValue
          }

          // end for (key in mergedStyles)
        }

        if (process.env.NODE_ENV === 'development' && props['debug']) {
          console.log('animation style', final)
        }

        return final
      }, args)

      return useMemo(() => {
        return {
          style: [nonAnimatedStyle, animatedStyle],
        }
      }, args)
    },
  }
}

function animationDelay(
  key: string,
  transition: AnimationConfig | undefined,
  defaultDelay?: number
) {
  'worklet'
  if (
    !transition ||
    !transition[key] ||
    transition[key].delayMs === undefined ||
    transition[key].delayMs === null
  ) {
    return {
      delayMs: null,
    }
  }
  return {
    delayMs: transition[key].delayMs as TransitionConfig['delay'],
  }
}

type TransitionConfigWithoutRepeats = (
  | ({ type?: 'spring' } & WithSpringConfig)
  | ({ type: 'timing' } & WithTimingConfig)
  | ({ type: 'decay' } & WithDecayConfig)
) & {
  delay?: number
}

type TransitionConfig = TransitionConfigWithoutRepeats & {
  /**
   * Number of times this animation should repeat. To make it infinite, use the `loop` boolean.
   *
   * Default: `0`
   *
   * It's worth noting that this value isn't *exactly* a `repeat`. Instead, it uses Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. If you want a repeated animation, I recommend setting it to `true` from the start, and make sure you have a `from` value.
   *
   * As a result, this value cannot be reliably changed on the fly. If you would like animations to repeat based on the `from` value, `repeat` must be a number when the component initializes. You can set it to `0` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  repeat?: number
  /**
   * Setting this to `true` is the same as `repeat: Infinity`
   *
   * Default: `false`
   *
   * Note: this value cannot be set on the fly. If you would like animations to repeat based on the `from` value, it must be `true` when the component initializes. You can set it to `false` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  loop?: boolean
  /**
   * Whether or not the animation repetition should alternate in direction.
   *
   * By default, this is `true`.
   *
   * If `false`, any animations with `loop` or `repeat` will not go back and forth. Instead, they will go from 0 -> 1, and again from 0 -> 1.
   *
   * If `true`, then animations will go 0 -> 1 -> 0.
   *
   * Setting this to `true` is like setting `animationDirection: alternate` in CSS.
   */
  repeatReverse?: boolean
}

const isColor = (styleKey: string) => {
  'worklet'
  return [
    'backgroundColor',
    'borderBottomColor',
    'borderColor',
    'borderEndColor',
    'borderLeftColor',
    'borderRightColor',
    'borderStartColor',
    'borderTopColor',
    'color',
  ].includes(styleKey)
}

function animationConfig<Animate>(styleProp: string, transition: AnimationConfig | undefined) {
  'worklet'
  const key = styleProp
  let repeatCount = 0
  let repeatReverse = true
  let animationType: Required<TransitionConfig>['type'] = 'spring'

  if (isColor(key) || key === 'opacity') {
    animationType = 'timing'
  }

  if (!transition) {
    return {}
  }

  // say that we're looking at `width`
  // first, check if we have transition.width.type
  if (transition[key]?.type) {
    animationType = transition[key]?.type
  } else if (transition.type) {
    // otherwise, fallback to transition.type
    animationType = transition.type
  }

  const loop = transition[key]?.loop || transition.loop || null

  if (loop != null) {
    repeatCount = loop ? -1 : 0
  }

  // if (transition[key]?.repeat != null) {
  //   repeatCount = transition[key]?.repeat
  // } else if (transition?.repeat != null) {
  //   repeatCount = transition.repeat
  // }

  // if (transition[key]?.repeatReverse != null) {
  //   repeatReverse = transition[key]?.repeatReverse
  // } else if (transition?.repeatReverse != null) {
  //   repeatReverse = transition.repeatReverse
  // }

  let config = {}
  // so sad, but fix it later :(
  let animation: any

  if (animationType === 'timing') {
    const duration =
      (transition[key] as WithTimingConfig)?.duration ?? (transition as WithTimingConfig)?.duration

    const easing =
      (transition[key] as WithTimingConfig)?.easing ?? (transition as WithTimingConfig)?.easing

    if (easing) {
      config['easing'] = easing
    }
    if (duration != null) {
      config['duration'] = duration
    }
    animation = withTiming
  } else if (animationType === 'spring') {
    animation = withSpring
    config = {} as WithSpringConfig
    configKeys.forEach((configKey) => {
      'worklet'
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]
      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  } else if (animationType === 'decay') {
    animation = withDecay
    config = {
      velocity: 2,
      deceleration: 2,
    }
    const configKeys: (keyof WithDecayConfig)[] = [
      'clamp',
      'velocity',
      'deceleration',
      'velocityFactor',
    ]
    configKeys.forEach((configKey) => {
      'worklet'
      // is this necessary ^ don't think so...?
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  }

  return {
    animation,
    config,
    repeatReverse,
    repeatCount,
    shouldRepeat: !!repeatCount,
  }
}

const configKeys: (keyof WithSpringConfig)[] = [
  'damping',
  'mass',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
  'stiffness',
  'velocity',
]
