import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDays, addMinutes, setMinutes, setHours, isSameDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  isDelivery?: boolean;
}

export default function DateTimePicker({
  selectedDate,
  onChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 7),
  isDelivery = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter available times (every 15 minutes)
  const filterTime = (time: Date) => {
    const currentDate = new Date();
    const selectedTime = new Date(time);

    // If it's today, only show future times (with 30 min buffer)
    if (isSameDay(currentDate, selectedTime)) {
      const bufferTime = addMinutes(currentDate, 30);
      return selectedTime >= bufferTime;
    }

    // For delivery, only allow 8:00 AM to 10:00 PM
    if (isDelivery) {
      const hour = selectedTime.getHours();
      return hour >= 8 && hour < 22;
    }

    // For rides, allow 24/7
    return true;
  };

  const handleChange = (date: Date | null) => {
    // Round to nearest 15 minutes
    if (date) {
      const minutes = date.getMinutes();
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const roundedDate = setMinutes(date, roundedMinutes);
      onChange(roundedDate);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={minDate}
        maxDate={maxDate}
        filterTime={filterTime}
        placeholderText={isDelivery ? "Select delivery time" : "Schedule for later"}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0088CC] focus:border-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        popperClassName="react-datepicker-popper"
        calendarClassName="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg"
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={() => setIsOpen(false)}
      />
    </div>
  );
}
