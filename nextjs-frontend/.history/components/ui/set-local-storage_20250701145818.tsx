'use client'

import { useEffect } from 'react'

export function SetLocalStorageItem({
  itemName,
  itemValue
}: {
  itemName: string
  itemValue: string
}) {
  useEffect(() => {
    // This code will only run on the client
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(itemName, itemValue)
    }
  }, [itemName, itemValue]) // Re-run if props change

  return null // This component doesn't render anything visible
}