import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface AttendanceLog {
  employeeId: string;
  timestamp: string;
  photo: string;
  ipAddress: string;
  location: string;
}

const AdminDashboard = () => {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Attendance Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Employee ID</th>
                    <th className="text-left p-4">Timestamp</th>
                    <th className="text-left p-4">IP Address</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{log.employeeId}</td>
                      <td className="p-4">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-4">{log.ipAddress}</td>
                      <td className="p-4">{log.location}</td>
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