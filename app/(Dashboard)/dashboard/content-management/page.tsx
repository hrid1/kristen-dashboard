import ContentManagementPage from '@/components/Dashboard/ContentManagement/contentTab/ContentTab'
import { RenderPortal } from '@/components/Reusable/RenderPortal'
import Loading from '@/components/Reusable/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <RenderPortal elementId='header-title' >Content Management</RenderPortal>
      <Suspense fallback={<Loading text="Loading content..." className="py-12" />}>
        <ContentManagementPage />
      </Suspense>
    </div>
  )
}
