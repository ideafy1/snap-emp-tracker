import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Camera from "./Camera";
import { getAttendanceStatus, formatIndianTime } from "@/lib/attendance";

const LoginForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { employeeId, password });

    // Admin credentials
    if (employeeId === "00000" && password === "admin001") {
      toast.success("Welcome Admin!");
      navigate("/admin");
      return;
    }

    // Check if employee exists
    const employeeRef = doc(db, "employees", employeeId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      toast.error("Employee not found");
      return;
    }

    const employeeData = employeeDoc.data();
    if (employeeData.password !== password) {
      toast.error("Invalid password");
      return;
    }

    // Check if first login of the day
    const today = new Date().toISOString().split('T')[0];
    const attendanceRef = doc(db, "attendance", `${employeeId}_${today}`);
    const attendanceDoc = await getDoc(attendanceRef);

    if (!attendanceDoc.exists()) {
      setShowCamera(true);
      toast.success("First login of the day - Please capture your photo");
    } else {
      // Subsequent login
      navigate("/employee");
      toast.success("Welcome back!");
    }
  };

  const handlePhotoCapture = async (imageData: string) => {
    try {
      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const loginTime = new Date();
      const status = getAttendanceStatus(loginTime);

      const loginData = {
        employeeId,
        timestamp: loginTime.toISOString(),
        photo: imageData,
        ipAddress: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        status,
        formattedTime: formatIndianTime(loginTime)
      };

      const today = loginTime.toISOString().split('T')[0];
      await setDoc(doc(db, "attendance", `${employeeId}_${today}`), loginData);
      
      console.log("Login data:", loginData);
      
      toast.success(`Attendance marked as ${status}`);
      navigate("/employee");
    } catch (error) {
      console.error("Error saving login data:", error);
      toast.error("Error recording attendance");
    }
  };

  return (
    <Card className="w-[350px] shadow-lg bg-gray-900 text-white">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <img src="/lovable-uploads/406b5f0c-4670-4e06-8166-fdfc696f6146.png" alt="Sky Investment Logo" className="h-16" />
        </div>
        <CardTitle className="text-2xl text-center">Sky Investment HRMS</CardTitle>
      </CardHeader>
      <CardContent>
        {!showCamera ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="employeeId"
                placeholder="Employee ID"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
        ) : (
          <Camera onCapture={handlePhotoCapture} />
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;