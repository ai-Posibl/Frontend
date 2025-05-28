"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ time, setTime, placeholder = "Select time", className }: TimePickerProps) {
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
        <div className="relative w-full">
          <Input
            placeholder={placeholder}
            value={formatDisplayTime()}
            className={cn(
              "w-full h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 cursor-pointer",
              className,
            )}
            readOnly
          />
          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 border-gray-200" align="start">
        <div className="flex flex-col space-y-4">
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
              <span className="w-8 text-center">{hours}</span>
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
              <span className="w-8 text-center">{minutes.toString().padStart(2, "0")}</span>
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
            <div className="text-sm font-medium">AM/PM</div>
            <div className="flex items-center space-x-2">
              <Button
                variant={period === "AM" ? "default" : "outline"}
                size="sm"
                className={cn("px-3", period === "AM" && "bg-[#b5d333] text-black hover:bg-[#a2c129] hover:text-black")}
                onClick={() => setPeriod("AM")}
              >
                AM
              </Button>
              <Button
                variant={period === "PM" ? "default" : "outline"}
                size="sm"
                className={cn("px-3", period === "PM" && "bg-[#b5d333] text-black hover:bg-[#a2c129] hover:text-black")}
                onClick={() => setPeriod("PM")}
              >
                PM
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            className="text-[#b5d333] hover:text-[#a2c129] hover:bg-transparent font-medium"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="ghost"
            className="text-[#b5d333] hover:text-[#a2c129] hover:bg-transparent font-medium"
            onClick={handleApply}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
