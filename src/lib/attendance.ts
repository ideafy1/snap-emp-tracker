import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const WORK_START_TIME = '09:30';
export const WORK_END_TIME = '18:00';
export const TIMEZONE = 'Asia/Kolkata';

export type AttendanceStatus = 'P' | 'PL' | 'A' | 'L';

export const getAttendanceStatus = (loginTime: Date): AttendanceStatus => {
  const indianTime = toZonedTime(loginTime, TIMEZONE);
  const startTime = parseISO(`${format(indianTime, 'yyyy-MM-dd')}T${WORK_START_TIME}`);
  
  if (isBefore(indianTime, startTime)) {
    return 'P';
  }
  return 'PL';
};

export const formatIndianTime = (date: Date): string => {
  return format(toZonedTime(date, TIMEZONE), 'dd/MM/yyyy HH:mm:ss');
};