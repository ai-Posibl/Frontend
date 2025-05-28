"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, setDate, placeholder = "Select date", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            placeholder={placeholder}
            value={date ? format(date, "PPP") : ""}
            className={cn(
              "w-full h-12 px-4 rounded-md border border-gray-300 focus:border-gray-400 focus:ring-0 cursor-pointer",
              className,
            )}
            readOnly
          />
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-gray-200" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date)
            // Don't close the popover yet, wait for OK button
          }}
          initialFocus
          className="custom-calendar"
        />
        <div className="flex justify-between items-center p-3 border-t border-gray-100">
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
            onClick={() => setIsOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
