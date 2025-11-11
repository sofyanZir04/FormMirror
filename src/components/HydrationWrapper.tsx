'use client'

import { useEffect, useState } from 'react'

interface HydrationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  suppressHydrationWarning?: boolean
}

export function HydrationWrapper({ 
  children, 
  fallback = null,
  suppressHydrationWarning = false 
}: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Show fallback during hydration to prevent mismatches
  if (!isHydrated) {
    return <>{fallback}</>
  }

  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  )
}

// Hook to check if component is hydrated
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
