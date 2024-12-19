import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import AttendanceCalendar from './AttendanceCalendar';

interface EmployeeDetailsDialogProps {
  employee: any;
  open: boolean;
  onClose: () => void;
}

const EmployeeDetailsDialog: React.FC<EmployeeDetailsDialogProps> = ({
  employee,
  open,
  onClose
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Employee Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Dialog>
                <DialogContent className="bg-white">
                  {employee?.photo && (
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="max-w-full h-auto rounded"
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{employee?.name}</h3>
                <p className="text-gray-600">Employee ID: {employee?.id}</p>
                <p className="text-gray-600">{employee?.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Today's Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    employee?.status === 'P' ? 'bg-green-100 text-green-800' :
                    employee?.status === 'A' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee?.status || 'N/A'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Time Logs</p>
                  <div className="text-sm">
                    <p>Login: {employee?.loginTime || 'N/A'}</p>
                    <p>Logout: {employee?.logoutTime || 'N/A'}</p>
                  </div>
                </div>
                {employee?.location && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-sm">
                      {employee.location.latitude}, {employee.location.longitude}
                    </p>
                  </div>
                )}
                {employee?.ipAddress && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">IP Address</p>
                    <p className="text-sm">{employee.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <AttendanceCalendar
            attendanceData={[]} // This should be populated with actual attendance data
            isEmployee={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;