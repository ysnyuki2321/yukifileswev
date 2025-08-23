"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar, Clock, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfessionalDatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  minDate?: Date
  maxDate?: Date
  includeTime?: boolean
  disabled?: boolean
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ProfessionalDatePicker({
  value = '',
  onChange,
  placeholder = 'Select date and time...',
  label,
  className = '',
  minDate,
  maxDate,
  includeTime = true,
  disabled = false
}: ProfessionalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  )
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date()
  )
  const [timeValue, setTimeValue] = useState('')

  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          console.warn('Invalid date value:', value)
          return
        }
        setSelectedDate(date)
        setViewDate(date)
        if (includeTime) {
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          setTimeValue(`${hours}:${minutes}`)
        }
      } catch (error) {
        console.warn('Error parsing date:', value, error)
      }
    }
  }, [value, includeTime])

  const formatDisplayValue = () => {
    if (!selectedDate) return ''
    
    const date = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    if (includeTime && timeValue) {
      return `${date} at ${timeValue}`
    }
    
    return date
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false
    return date1.toDateString() === date2.toDateString()
  }

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return
    
    setSelectedDate(date)
    
    if (!includeTime) {
      const isoString = date.toISOString()
      onChange(isoString)
      setIsOpen(false)
    }
  }

  const handleTimeChange = (time: string) => {
    setTimeValue(time)
  }

  const handleConfirm = () => {
    if (!selectedDate) return
    
    let finalDate = new Date(selectedDate)
    
    if (includeTime && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      finalDate.setHours(hours, minutes, 0, 0)
    }
    
    onChange(finalDate.toISOString())
    setIsOpen(false)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getQuickDates = () => {
    const now = new Date()
    const options = [
      { label: 'In 1 hour', date: new Date(now.getTime() + 60 * 60 * 1000) },
      { label: 'In 24 hours', date: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      { label: 'In 7 days', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      { label: 'In 30 days', date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) }
    ]
    
    return options.filter(option => !isDateDisabled(option.date))
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      
      {/* Input Field */}
      <div className="relative">
        <Input
          value={formatDisplayValue()}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(true)}
          className={cn(
            "bg-black/30 border-purple-500/30 text-white placeholder-gray-400 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-purple-400 hover:text-purple-300"
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      {/* Date Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl z-50 p-2 sm:p-4 max-w-[320px] sm:max-w-none"
          >
            {/* Quick Select */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {getQuickDates().map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(option.date)
                      setViewDate(option.date)
                      if (includeTime) {
                        const hours = option.date.getHours().toString().padStart(2, '0')
                        const minutes = option.date.getMinutes().toString().padStart(2, '0')
                        setTimeValue(`${hours}:${minutes}`)
                      }
                    }}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0 text-purple-400 hover:text-white hover:bg-purple-500/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="text-white font-semibold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </h3>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0 text-purple-400 hover:text-white hover:bg-purple-500/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {getDaysInMonth(viewDate).map((date, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  disabled={!date || isDateDisabled(date)}
                  onClick={() => date && handleDateSelect(date)}
                  className={cn(
                    "h-8 w-8 p-0 text-sm",
                    !date && "invisible",
                    date && isSameDay(date, selectedDate) 
                      ? "bg-purple-500 text-white hover:bg-purple-600" 
                      : "text-gray-300 hover:text-white hover:bg-purple-500/20",
                    date && isSameDay(date, new Date()) && "ring-1 ring-purple-400",
                    date && isDateDisabled(date) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {date?.getDate()}
                </Button>
              ))}
            </div>

            {/* Time Picker */}
            {includeTime && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <label className="text-sm font-medium text-white">Time</label>
                </div>
                <Input
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedDate}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}