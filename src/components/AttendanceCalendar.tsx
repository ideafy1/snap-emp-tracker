import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  attendanceData: {
    date: string;
    status: string;
    loginTime?: string;
    logoutTime?: string;
  }[];
  onRegularize?: (date: Date) => void;
  isEmployee?: boolean;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceData,
  onRegularize,
  isEmployee = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-green-500';
      case 'A':
        return 'bg-red-500';
      case 'L':
      case 'PL':
        return 'bg-yellow-500';
      case 'GH':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const modifiers = {
    holiday: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return attendanceData.some(d => d.date === dateStr && d.status === 'GH');
    }
  };

  const modifiersStyles = {
    holiday: {
      color: 'red',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-4 shadow-sm">
      <Calendar
        mode="single"
        className="rounded-md border"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        components={{
          DayContent: ({ date }) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const attendance = attendanceData.find(d => d.date === dateStr);

            return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <span>{date.getDate()}</span>
                {attendance && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full mt-1",
                            getStatusColor(attendance.status)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p>Status: {attendance.status}</p>
                          {attendance.loginTime && <p>Login: {attendance.loginTime}</p>}
                          {attendance.logoutTime && <p>Logout: {attendance.logoutTime}</p>}
                          {isEmployee && (attendance.status === 'A' || attendance.status === 'PL') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onRegularize?.(date)}
                              className="w-full mt-2"
                            >
                              Regularize
                            </Button>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default AttendanceCalendar;