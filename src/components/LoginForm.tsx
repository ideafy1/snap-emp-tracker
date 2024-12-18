import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Camera from "./Camera";

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

    // Employee credentials
    if (employeeId === "39466" && password === "Aditya@123") {
      setShowCamera(true);
      toast.success("Please capture your photo to continue");
      return;
    }

    toast.error("Invalid credentials");
  };

  const handlePhotoCapture = async (imageData: string) => {
    try {
      const loginData = {
        employeeId,
        timestamp: new Date().toISOString(),
        photo: imageData,
        ipAddress: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
        location: "Location data will be added here", // You'll need to implement geolocation
      };

      await setDoc(doc(db, "attendance", `${employeeId}_${Date.now()}`), loginData);
      
      // Send to Telegram bot (you'll need to implement this)
      // For now, we'll just log the data
      console.log("Login data:", loginData);
      
      toast.success("Login successful!");
      navigate("/employee");
    } catch (error) {
      console.error("Error saving login data:", error);
      toast.error("Error saving login data");
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">HRMS Login</CardTitle>
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
              />
            </div>
            <Button type="submit" className="w-full">
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