'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// True on every hard refresh (module re-evaluates). Stays false across route changes.
let isFirstLoad = true

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const delay = isFirstLoad ? 0.1 : 0

  // Reset after first mount so route changes get no delay
  useEffect(() => {
    isFirstLoad = false
  }, [])

  return (
    <motion.div
      key={pathname}
      data-component="page-transition"
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
