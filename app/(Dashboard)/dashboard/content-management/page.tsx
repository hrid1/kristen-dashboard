import ContentManagementPage from '@/components/Dashboard/ContentManagement/contentTab/ContentTab'
import { RenderPortal } from '@/components/Reusable/RenderPortal'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
       <RenderPortal elementId='header-title' >Content Management</RenderPortal>
     <Suspense fallback={<p>loading</p>}>
        <ContentManagementPage />
     </Suspense>
    </div>
  )
}
