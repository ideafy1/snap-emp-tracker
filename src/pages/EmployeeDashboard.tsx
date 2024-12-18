import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { format } from "date-fns";

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
  status: 'P' | 'PL' | 'A' | 'L';
  formattedTime: string;
}

const EmployeeDashboard = () => {
  const [personalLogs, setPersonalLogs] = useState<AttendanceLog[]>([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    regularize: 0
  });
  const employeeId = "39466";

  useEffect(() => {
    const q = query(
      collection(db, "attendance"),
      where("employeeId", "==", employeeId),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logs: AttendanceLog[] = [];
      querySnapshot.forEach((doc) => {
        logs.push(doc.data() as AttendanceLog);
      });
      setPersonalLogs(logs);
      
      // Calculate stats
      const present = logs.filter(log => log.status === 'P').length;
      const late = logs.filter(log => log.status === 'PL').length;
      const regularize = logs.filter(log => !log.status).length;
      
      setStats({
        present,
        absent: 30 - (present + late), // Assuming 30 days month
        late,
        regularize
      });
    });

    return () => unsubscribe();
  }, [employeeId]);

  return (
    <div className="container mx-auto py-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-green-900">
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.present}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-900">
          <CardHeader>
            <CardTitle>Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.absent}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-900">
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.late}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-900">
          <CardHeader>
            <CardTitle>Regularize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.regularize}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Your Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Time</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {personalLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-4">{format(new Date(log.timestamp), 'dd/MM/yyyy')}</td>
                      <td className="p-4">{format(new Date(log.timestamp), 'HH:mm:ss')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded ${
                          log.status === 'P' ? 'bg-green-600' :
                          log.status === 'PL' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
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

export default EmployeeDashboard;