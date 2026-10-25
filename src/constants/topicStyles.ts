import type { LucideIcon } from 'lucide-react'
import {
  Atom,
  BookOpen,
  Briefcase,
  Globe2,
  Landmark,
  Leaf,
  Palette,
  PawPrint,
  Sofa,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react'
import type { Topic } from './puzzle'

/**
 * Each topic's crayon: an icon and literal class sets (Tailwind only generates classes it can
 * read in the source, so none of these may be assembled at runtime).
 */
export type TopicStyle = { icon: LucideIcon; chip: string; tile: string; iconTone: string }

export const TOPIC_STYLES: Record<Topic, TopicStyle> = {
  general: { icon: Sparkles, chip: 'border-coral-300 bg-coral-100', tile: 'bg-coral-100 border-coral-300', iconTone: 'bg-coral-300' },
  nature: { icon: Leaf, chip: 'border-mint-300 bg-mint-100', tile: 'bg-mint-100 border-mint-300', iconTone: 'bg-mint-300' },
  animals: { icon: PawPrint, chip: 'border-sun-400 bg-sun-100', tile: 'bg-sun-100 border-sun-400', iconTone: 'bg-sun-300' },
  food: { icon: UtensilsCrossed, chip: 'border-rose-300 bg-rose-100', tile: 'bg-rose-100 border-rose-300', iconTone: 'bg-rose-300' },
  geography: { icon: Globe2, chip: 'border-sky-300 bg-sky-100', tile: 'bg-sky-100 border-sky-300', iconTone: 'bg-sky-300' },
  history: { icon: Landmark, chip: 'border-lavender-300 bg-lavender-100', tile: 'bg-lavender-100 border-lavender-300', iconTone: 'bg-lavender-300' },
  science: { icon: Atom, chip: 'border-teal-300 bg-teal-100', tile: 'bg-teal-100 border-teal-300', iconTone: 'bg-teal-300' },
  sport: { icon: Trophy, chip: 'border-coral-300 bg-coral-100', tile: 'bg-coral-100 border-coral-300', iconTone: 'bg-coral-300' },
  arts: { icon: Palette, chip: 'border-lavender-300 bg-lavender-100', tile: 'bg-lavender-100 border-lavender-300', iconTone: 'bg-lavender-300' },
  home: { icon: Sofa, chip: 'border-sun-400 bg-sun-100', tile: 'bg-sun-100 border-sun-400', iconTone: 'bg-sun-300' },
  professions: { icon: Briefcase, chip: 'border-sky-300 bg-sky-100', tile: 'bg-sky-100 border-sky-300', iconTone: 'bg-sky-300' },
  localCulture: { icon: BookOpen, chip: 'border-mint-300 bg-mint-100', tile: 'bg-mint-100 border-mint-300', iconTone: 'bg-mint-300' },
}
