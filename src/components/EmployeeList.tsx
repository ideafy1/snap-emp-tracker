import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, MapPin, Globe } from 'lucide-react';
import AttendanceCalendar from './AttendanceCalendar';

interface Employee {
  id: string;
  name: string;
  email: string;
  photo?: string;
  status?: string;
  loginTime?: string;
  logoutTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  ipAddress?: string;
}

const EmployeeList: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'P':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'PL':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-800">Employees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant="outline"
              className="w-full justify-between hover:bg-gray-50 p-4"
              onClick={() => {
                setSelectedEmployee(employee);
                setShowDialog(true);
              }}
            >
              <div className="flex items-center gap-3">
                {employee.photo ? (
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{employee.name}</p>
                  <p className="text-sm text-gray-500">ID: {employee.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(employee.status)}`}>
                {employee.status || 'N/A'}
              </span>
            </Button>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        {selectedEmployee.photo ? (
                          <img
                            src={selectedEmployee.photo}
                            alt={selectedEmployee.name}
                            className="w-32 h-32 rounded-lg cursor-pointer object-cover"
                          />
                        ) : (
                          <User className="w-32 h-32 p-6 bg-gray-100 rounded-lg" />
                        )}
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        {selectedEmployee.photo && (
                          <img
                            src={selectedEmployee.photo}
                            alt={selectedEmployee.name}
                            className="max-w-full h-auto rounded"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedEmployee.name}</h3>
                      <p className="text-gray-600">Employee ID: {selectedEmployee.id}</p>
                      <p className="text-gray-600">{selectedEmployee.email}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Today's Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status || 'N/A'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Time Logs</p>
                        <div className="text-sm">
                          <p>Login: {selectedEmployee.loginTime || 'N/A'}</p>
                          <p>Logout: {selectedEmployee.logoutTime || 'N/A'}</p>
                        </div>
                      </div>
                      {selectedEmployee.location && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                          </p>
                          <p className="text-sm">
                            {selectedEmployee.location.latitude}, {selectedEmployee.location.longitude}
                          </p>
                        </div>
                      )}
                      {selectedEmployee.ipAddress && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            IP Address
                          </p>
                          <p className="text-sm">{selectedEmployee.ipAddress}</p>
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
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;