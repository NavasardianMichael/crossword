import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge only knows Tailwind's built-in scales. The app's type steps are custom
 * `--text-*` theme values, which it would otherwise file under `text-color` and drop one
 * of every size-plus-colour pair. Keep this list in sync with §1 of globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'h3', 'body', 'body-sm', 'caption'] },
      ],
    },
  },
})

/** Merges class names and resolves conflicting Tailwind utilities, so a caller can override a primitive's default. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
