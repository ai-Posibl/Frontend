"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// MUI Date Picker Component
interface MUIDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function MUIDatePicker({ date, setDate, placeholder = "Select Date", className }: MUIDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 px-4 justify-start text-left font-normal border-gray-300 hover:bg-gray-50",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {date ? format(date, "PPP") : <span className="text-gray-500">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

// MUI Time Picker Component
interface MUITimePickerProps {
  time: string
  setTime: (time: string) => void
  placeholder?: string
  className?: string
}

export function MUITimePicker({ time, setTime, placeholder = "Select Time", className }: MUITimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hours, setHours] = React.useState<string>(time ? time.split(":")[0] : "12")
  const [minutes, setMinutes] = React.useState<string>(time ? time.split(":")[1] : "00")
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM")

  // Format display time
  const formatDisplayTime = () => {
    if (!time) return ""
    const [h, m] = time.split(":")
    const hour = Number.parseInt(h, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${m} ${ampm}`
  }

  // Update time when hours, minutes, or period changes
  React.useEffect(() => {
    if (hours && minutes) {
      let hour = Number.parseInt(hours, 10)

      // Convert to 24-hour format if PM
      if (period === "PM" && hour < 12) {
        hour += 12
      }
      // Convert 12 AM to 00
      if (period === "AM" && hour === 12) {
        hour = 0
      }

      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinutes = minutes.padStart(2, "0")
      setTime(`${formattedHour}:${formattedMinutes}`)
    }
  }, [hours, minutes, period, setTime])

  // Initialize from existing time value
  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(":")
      const hour = Number.parseInt(h, 10)
      const isPM = hour >= 12
      setHours((hour % 12 || 12).toString())
      setMinutes(m)
      setPeriod(isPM ? "PM" : "AM")
    }
  }, [])

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString())

  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 px-4 justify-start text-left font-normal border-gray-300 hover:bg-gray-50",
            !time && "text-muted-foreground",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          {time ? formatDisplayTime() : <span className="text-gray-500">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-500">Hour</label>
              <Select value={hours} onValueChange={setHours}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-500">Minute</label>
              <Select value={minutes} onValueChange={setMinutes}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-500">AM/PM</label>
              <Select value={period} onValueChange={(value) => setPeriod(value as "AM" | "PM")}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsOpen(false)} className="bg-black text-[#b5d333] hover:bg-gray-900">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
