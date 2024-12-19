import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import EmployeeDetailsDialog from './EmployeeDetailsDialog';

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

        {selectedEmployee && (
          <EmployeeDetailsDialog
            employee={selectedEmployee}
            open={showDialog}
            onClose={() => {
              setShowDialog(false);
              setSelectedEmployee(null);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;