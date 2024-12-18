import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { toast } from "sonner";

interface AttendanceLog {
  employeeId: string;
  timestamp: string;
  photo: string;
  ipAddress: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  status: string;
  formattedTime: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
}

const AdminDashboard = () => {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs: AttendanceLog[] = [];
      querySnapshot.forEach((doc) => {
        logs.push(doc.data() as AttendanceLog);
      });
      setAttendanceLogs(logs);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "employees"), newEmployee);
      toast.success("Employee added successfully");
      setShowAddEmployee(false);
      setNewEmployee({ id: '', name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee");
    }
  };

  return (
    <div className="container mx-auto py-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={() => setShowAddEmployee(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Employee
        </Button>
      </div>
      
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div>
              <Input
                placeholder="Employee ID"
                value={newEmployee.id}
                onChange={(e) => setNewEmployee({...newEmployee, id: e.target.value})}
                className="bg-gray-700"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="bg-gray-700"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="bg-gray-700"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Password"
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                className="bg-gray-700"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Add Employee
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Employee Attendance Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4">Employee ID</th>
                    <th className="text-left p-4">Date & Time</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">IP Address</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-4">{log.employeeId}</td>
                      <td className="p-4">{log.formattedTime}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded ${
                          log.status === 'P' ? 'bg-green-600' :
                          log.status === 'PL' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4">{log.ipAddress}</td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Location</Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Location Details</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p>Latitude: {log.location.latitude}</p>
                              <p>Longitude: {log.location.longitude}</p>
                              <p>Accuracy: {log.location.accuracy}m</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                      <td className="p-4">
                        <img 
                          src={log.photo} 
                          alt="Attendance" 
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;