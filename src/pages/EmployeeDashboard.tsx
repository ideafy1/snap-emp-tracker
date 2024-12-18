import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Camera from "@/components/Camera";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EmployeeDashboard = () => {
  const [location, setLocation] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");

  useEffect(() => {
    // Get location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Could not get location");
      }
    );

    // Get IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => {
        console.error("Error getting IP:", error);
        toast.error("Could not get IP address");
      });
  }, []);

  const handlePhotoCapture = (imageData: string) => {
    console.log("Photo captured:", imageData);
    // Here you would typically send this data to your backend
    toast.success("Photo captured successfully");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Camera</CardTitle>
          </CardHeader>
          <CardContent>
            <Camera onCapture={handlePhotoCapture} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Session Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Location:</p>
              <p>{location || "Loading..."}</p>
            </div>
            <div>
              <p className="font-semibold">IP Address:</p>
              <p>{ipAddress || "Loading..."}</p>
            </div>
            <div>
              <p className="font-semibold">Login Time:</p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;