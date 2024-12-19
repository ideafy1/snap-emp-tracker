import { format, isAfter, isBefore, parseISO, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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

export const calculateAttendance = (employeeCreatedAt: Date, attendanceLogs: any[]) => {
  const today = new Date();
  const workingDays = Math.max(0, differenceInDays(today, employeeCreatedAt));
  
  const present = attendanceLogs.filter(log => log.status === 'P').length;
  const late = attendanceLogs.filter(log => log.status === 'PL').length;
  
  return {
    present,
    late,
    absent: Math.max(0, workingDays - (present + late))
  };
};

export const canRegularize = (date: Date, status: string) => {
  return status === 'A' || status === 'PL';
};