'use client'
import { useEffect } from 'react'

function CheckVpn() {
  useEffect(() => {
    const country = document.cookie
      .split('; ')
      .find((row) => row.startsWith('country='))
      ?.split('=')[1]

    if (country === 'IR') {
      alert('Please use VPN to access this website.')
    }
  }, [])
  return null
}

export default CheckVpn
