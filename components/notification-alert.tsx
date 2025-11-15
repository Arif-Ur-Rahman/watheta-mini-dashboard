'use client'

import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NotificationAlertProps {
  type: 'success' | 'error'
  title: string
  description?: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export function NotificationAlert({
  type,
  title,
  description,
  onClose,
  autoClose = true,
  duration = 4000,
}: NotificationAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!autoClose) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [autoClose, duration, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  const textColor = type === 'success' ? 'text-green-900' : 'text-red-900'
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600'

  return (
    <div className={`fixed top-4 right-4 max-w-md rounded-lg border ${bgColor} p-4 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1">
          <p className={`font-semibold ${textColor}`}>{title}</p>
          {description && <p className={`text-sm mt-1 ${textColor} opacity-90`}>{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className={`flex-shrink-0 ${textColor} hover:opacity-75`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
