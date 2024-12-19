import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import EmployeeList from "@/components/EmployeeList";
import RegularizationRequests from "@/components/RegularizationRequests";

const AdminDashboard = () => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    email: '',
    password: ''
  });
  const [employees, setEmployees] = useState([]);
  const [regularizationRequests, setRegularizationRequests] = useState([]);

  useEffect(() => {
    // Fetch employees
    const employeesQuery = query(collection(db, "employees"), orderBy("name"));
    const unsubscribeEmployees = onSnapshot(employeesQuery, (snapshot) => {
      const employeesList = [];
      snapshot.forEach((doc) => {
        employeesList.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeesList);
    });

    // Fetch regularization requests
    const requestsQuery = query(collection(db, "regularization_requests"), orderBy("timestamp", "desc"));
    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = [];
      snapshot.forEach((doc) => {
        requestsList.push({ id: doc.id, ...doc.data() });
      });
      setRegularizationRequests(requestsList);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeRequests();
    };
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "employees", newEmployee.id), {
        ...newEmployee,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Employee added successfully");
      setShowAddEmployee(false);
      setNewEmployee({ id: '', name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "/";
    }
  };

  return (
    <div className="container mx-auto py-8 bg-gray-900 text-white min-h-screen px-4">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src="/lovable-uploads/406b5f0c-4670-4e06-8166-fdfc696f6146.png" alt="Sky Investment Logo" className="h-12" />
          <h1 className="text-3xl font-bold">Sky Investment - Admin Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => setShowAddEmployee(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Employee
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-gray-800"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <Input
              placeholder="Employee ID"
              value={newEmployee.id}
              onChange={(e) => setNewEmployee({...newEmployee, id: e.target.value})}
              className="bg-gray-700"
              required
            />
            <Input
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              className="bg-gray-700"
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              className="bg-gray-700"
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
              className="bg-gray-700"
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Add Employee
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        <EmployeeList employees={employees} />
        <RegularizationRequests requests={regularizationRequests} />
      </div>
    </div>
  );
};

export default AdminDashboard;