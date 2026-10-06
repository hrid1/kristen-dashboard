"use client"
import Settings from '@/components/Dashboard/SettingPage/SettingPage'
import { RenderPortal } from '@/components/Reusable/RenderPortal'
import React from 'react'


export default function SettingsPage() {

  return (
    <div>
      <RenderPortal elementId='header-title' >Settings</RenderPortal>
      <Settings />
    </div>
  )
}

