import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface RegularizationRequest {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const RegularizationRequests: React.FC<{ requests: RegularizationRequest[] }> = ({ requests }) => {
  const handleApprove = async (requestId: string) => {
    try {
      await updateDoc(doc(db, "regularization_requests", requestId), {
        status: 'approved'
      });
      toast.success("Request approved successfully");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await updateDoc(doc(db, "regularization_requests", requestId), {
        status: 'rejected'
      });
      toast.success("Request rejected successfully");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Regularization Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p>Employee ID: {request.employeeId}</p>
                <p>Date: {request.date}</p>
                <p>Time: {request.time}</p>
                <p>Reason: {request.reason}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegularizationRequests;