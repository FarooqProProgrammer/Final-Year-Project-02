import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerDemoProps {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
}

export function DatePickerDemo({ selectedDate, onDateChange }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate)

  // Update the parent component's state when the date is selected
  const handleSelectDate = (selectedDate: Date) => {
    setDate(selectedDate)
    if (onDateChange) {
      onDateChange(selectedDate) // Pass selected date back to the parent component
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100%] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
