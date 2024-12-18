import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const mockEmployees = [
    {
      id: "39466",
      name: "Aditya Kumar",
      lastLogin: "2024-03-20 09:30:00",
      status: "Active",
    },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Employee ID</th>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Last Login</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b">
                      <td className="p-4">{employee.id}</td>
                      <td className="p-4">{employee.name}</td>
                      <td className="p-4">{employee.lastLogin}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {employee.status}
                        </span>
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