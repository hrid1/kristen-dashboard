import PaymentPage from '@/components/Dashboard/Payments/Payments'
import { RenderPortal } from '@/components/Reusable/RenderPortal'
import React from 'react'

export default function page() {
  return (
    <div>
      <RenderPortal elementId='header-title' >Payments Overview</RenderPortal>
      <PaymentPage />
    </div>
  )
}
