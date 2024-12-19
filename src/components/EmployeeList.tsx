import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AttendanceCalendar from './AttendanceCalendar';

interface Employee {
  id: string;
  name: string;
  email: string;
  photo?: string;
  status?: string;
}

const EmployeeList: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Employees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Dialog key={employee.id}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between hover:bg-gray-700"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="text-left">
                    <p className="font-bold">{employee.name}</p>
                    <p className="text-sm text-gray-400">ID: {employee.id}</p>
                  </div>
                  <div className={`px-2 py-1 rounded ${
                    employee.status === 'P' ? 'bg-green-600' :
                    employee.status === 'A' ? 'bg-red-600' :
                    'bg-yellow-600'
                  }`}>
                    {employee.status}
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Employee Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                    {employee.photo && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="w-16 h-16 rounded-full cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800">
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="max-w-full h-auto rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{employee.name}</h3>
                      <p className="text-gray-400">{employee.email}</p>
                      <p className="text-gray-400">ID: {employee.id}</p>
                    </div>
                  </div>
                  <AttendanceCalendar
                    attendanceData={[]} // This should be populated with actual attendance data
                    isEmployee={false}
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;