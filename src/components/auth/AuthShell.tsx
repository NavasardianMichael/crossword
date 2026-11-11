import type { ReactNode } from 'react'
import { PageHeader } from '@components/ui/layout/PageHeader'

/** The shared frame of the sign-in pages: one heading, one panel. */
export const AuthShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className='container-page max-w-xl pb-16'>
    <PageHeader title={title} subtitle={subtitle} />
    <div className='panel flex flex-col gap-5 p-5 sm:p-7'>{children}</div>
  </div>
)
