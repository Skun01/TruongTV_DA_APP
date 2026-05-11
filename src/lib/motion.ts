import type { Transition, Variants } from 'framer-motion'

/**
 * Tacho motion presets.
 *
 * Triết lý: "shoji-screen" — chậm, có chủ đích, không bouncy.
 * Dùng cubic-bezier(0.4, 0, 0.2, 1) xuyên suốt.
 */

export const shojiEase: Transition['ease'] = [0.4, 0, 0.2, 1]

export const shojiTransition = {
  duration: 0.32,
  ease: shojiEase,
} satisfies Transition

export const shojiSlowTransition = {
  duration: 0.48,
  ease: shojiEase,
} satisfies Transition

/** Fade + dịch nhẹ lên, dùng cho page / section entrance. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: shojiTransition,
  },
}

/** Fade thuần. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: shojiTransition,
  },
}

/** Scale nhẹ từ 0.97 → 1, dùng cho card hover / modal. */
export const softScale: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: shojiTransition,
  },
}

/**
 * Stagger parent — dùng cho list khi muốn con xuất hiện lần lượt.
 * Gắn parent `variants={staggerParent()}` và con `variants={fadeInUp}`.
 */
export const staggerParent = (staggerChildren = 0.06, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

/**
 * Slide drawer — dùng cho sheet/side panel.
 */
export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: shojiSlowTransition,
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: shojiTransition,
  },
}

export const slideFromBottom: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: shojiSlowTransition,
  },
  exit: {
    opacity: 0,
    y: 24,
    transition: shojiTransition,
  },
}
