"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, setDate, placeholder = "Select Date", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate)
            setIsOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ time, setTime, placeholder = "Select Time", className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hours, setHours] = React.useState<number>(12)
  const [minutes, setMinutes] = React.useState<number>(0)
  const [period, setPeriod] = React.useState<"AM" | "PM">("PM")

  React.useEffect(() => {
    if (time) {
      const [hourStr, minuteStr] = time.split(":")
      let hour = Number.parseInt(hourStr, 10)
      const minute = Number.parseInt(minuteStr, 10)

      const newPeriod = hour >= 12 ? "PM" : "AM"
      if (hour > 12) hour -= 12
      if (hour === 0) hour = 12

      setHours(hour)
      setMinutes(minute)
      setPeriod(newPeriod)
    }
  }, [time])

  const handleApply = () => {
    let hour = hours
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0

    const formattedHour = hour.toString().padStart(2, "0")
    const formattedMinute = minutes.toString().padStart(2, "0")
    setTime(`${formattedHour}:${formattedMinute}`)
    setIsOpen(false)
  }

  const formatDisplayTime = () => {
    if (!time) return ""
    const date = new Date()
    const [hourStr, minuteStr] = time.split(":")
    date.setHours(Number.parseInt(hourStr, 10))
    date.setMinutes(Number.parseInt(minuteStr, 10))
    return format(date, "h:mm a")
  }

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
      <PopoverContent className="w-80 p-4" align="start">
        <div className="flex flex-col space-y-4">
          <div className="text-sm font-medium text-center">Select Time</div>

          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Hours</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setHours((prev) => (prev === 1 ? 12 : prev - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">{hours}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setHours((prev) => (prev === 12 ? 1 : prev + 1))}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Minutes</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setMinutes((prev) => (prev === 0 ? 55 : prev - 5))}
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">{minutes.toString().padStart(2, "0")}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setMinutes((prev) => (prev === 55 ? 0 : prev + 5))}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Period</div>
            <div className="flex items-center space-x-2">
              <Button
                variant={period === "AM" ? "default" : "outline"}
                size="sm"
                className={cn("px-4", period === "AM" && "bg-[#b5d333] text-black hover:bg-[#a2c129] hover:text-black")}
                onClick={() => setPeriod("AM")}
              >
                AM
              </Button>
              <Button
                variant={period === "PM" ? "default" : "outline"}
                size="sm"
                className={cn("px-4", period === "PM" && "bg-[#b5d333] text-black hover:bg-[#a2c129] hover:text-black")}
                onClick={() => setPeriod("PM")}
              >
                PM
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-[#b5d333] text-black hover:bg-[#a2c129] hover:text-black">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
