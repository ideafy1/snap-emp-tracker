import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, getDocs, addDoc } from "firebase/firestore";
import { format } from "date-fns";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  status: 'P' | 'PL' | 'A' | 'L';
  formattedTime: string;
}

interface RegularizationRequest {
  date: Date;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EmployeeDashboard = () => {
  const [personalLogs, setPersonalLogs] = useState<AttendanceLog[]>([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    regularize: 0
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [regularizationReason, setRegularizationReason] = useState("");
  const [regularizationTime, setRegularizationTime] = useState("");
  const [showRegularizeDialog, setShowRegularizeDialog] = useState(false);
  const employeeId = "39466"; // This should come from authentication context

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "/";
    }
  };

  const handleRegularizationSubmit = async () => {
    if (!selectedDate || !regularizationReason || !regularizationTime) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "regularization_requests"), {
        employeeId,
        date: selectedDate,
        time: regularizationTime,
        reason: regularizationReason,
        status: 'pending',
        submittedAt: new Date()
      });

      toast.success("Regularization request submitted successfully");
      setShowRegularizeDialog(false);
      setRegularizationReason("");
      setRegularizationTime("");
    } catch (error) {
      console.error("Error submitting regularization request:", error);
      toast.error("Failed to submit regularization request");
    }
  };

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
      
      const present = logs.filter(log => log.status === 'P').length;
      const late = logs.filter(log => log.status === 'PL').length;
      const regularize = logs.filter(log => !log.status).length;
      
      setStats({
        present,
        absent: 30 - (present + late),
        late,
        regularize
      });
    });

    return () => unsubscribe();
  }, [employeeId]);

  return (
    <div className="container mx-auto py-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/lovable-uploads/406b5f0c-4670-4e06-8166-fdfc696f6146.png" alt="Sky Investment Logo" className="h-12" />
          <h1 className="text-3xl font-bold">Sky Investment - Employee Dashboard</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          className="text-white hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Button 
          className="h-auto p-6 bg-green-900 hover:bg-green-800"
          onClick={() => toast.info(`You have been present for ${stats.present} days this month`)}
        >
          <div className="text-left w-full">
            <h3 className="text-xl font-bold mb-2">Present (P)</h3>
            <p className="text-4xl font-bold">{stats.present}</p>
          </div>
        </Button>
        
        <Button 
          className="h-auto p-6 bg-red-900 hover:bg-red-800"
          onClick={() => toast.info(`You have been absent for ${stats.absent} days this month`)}
        >
          <div className="text-left w-full">
            <h3 className="text-xl font-bold mb-2">Absent (A)</h3>
            <p className="text-4xl font-bold">{stats.absent}</p>
          </div>
        </Button>
        
        <Button 
          className="h-auto p-6 bg-yellow-900 hover:bg-yellow-800"
          onClick={() => toast.info(`You have been late for ${stats.late} days this month`)}
        >
          <div className="text-left w-full">
            <h3 className="text-xl font-bold mb-2">Late (L)</h3>
            <p className="text-4xl font-bold">{stats.late}</p>
          </div>
        </Button>
        
        <Button 
          className="h-auto p-6 bg-blue-900 hover:bg-blue-800"
          onClick={() => setShowRegularizeDialog(true)}
        >
          <div className="text-left w-full">
            <h3 className="text-xl font-bold mb-2">Regularize</h3>
            <p className="text-4xl font-bold">{stats.regularize}</p>
          </div>
        </Button>
      </div>

      <Dialog open={showRegularizeDialog} onOpenChange={setShowRegularizeDialog}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Regularize Attendance</DialogTitle>
            <DialogDescription>
              Please fill in the details to regularize your attendance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={regularizationTime}
                onChange={(e) => setRegularizationTime(e.target.value)}
                className="bg-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={regularizationReason}
                onChange={(e) => setRegularizationReason(e.target.value)}
                className="bg-gray-700"
                placeholder="Please provide a reason for regularization"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegularizeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegularizationSubmit}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                        <Dialog>
                          <DialogTrigger asChild>
                            <img 
                              src={log.photo} 
                              alt="Attendance" 
                              className="w-16 h-16 object-cover rounded cursor-pointer"
                            />
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Attendance Photo</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <img 
                                src={log.photo} 
                                alt="Attendance" 
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
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