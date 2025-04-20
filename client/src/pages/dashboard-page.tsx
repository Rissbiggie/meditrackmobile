import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { useQuery } from "@tanstack/react-query";
import { MedicalInfo } from "@shared/schema";
import { Heart, Activity, AlertTriangle, Clock, Bell, Plus, Calendar, MapPin, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { MedicalInfoForm } from "@/components/medical-info-form";
import { HealthStatus } from "@/components/health-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const { userEmergencyHistory = [], openEmergencyModal } = useEmergency();
  const [showMedicalInfoForm, setShowMedicalInfoForm] = useState(false);
  
  // Query for medical information
  const { data: medicalInfo } = useQuery<MedicalInfo | null>({
    queryKey: ['/api/medical-info'],
  });

  // Mock data for quick actions
  const quickActions = [
    { icon: <Phone className="h-5 w-5" />, label: "Call Emergency", action: () => window.location.href = 'tel:911' },
    { icon: <MapPin className="h-5 w-5" />, label: "Find Hospital", action: () => window.location.href = '/facilities' },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Chat Support", action: () => window.location.href = '/support' },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule Checkup", action: () => window.location.href = '/appointments' },
  ];

  // Mock data for recent activity
  const recentActivity = [
    { type: "appointment", text: "Upcoming doctor appointment", time: "2 hours ago" },
    { type: "medication", text: "Medication reminder", time: "4 hours ago" },
    { type: "checkup", text: "Monthly health checkup", time: "1 day ago" },
  ];

  // Mock data for notifications
  const notifications = [
    { type: "alert", text: "New health advisory in your area", time: "Just now" },
    { type: "update", text: "System maintenance scheduled", time: "5 minutes ago" },
    { type: "reminder", text: "Don't forget your daily medication", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Dashboard" />

      <main className="pt-20 px-4">
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    className="flex flex-col items-center justify-center h-24 bg-white/5 hover:bg-white/10 text-white p-4 rounded-lg transition-all duration-200"
                    onClick={action.action}
                  >
                    {action.icon}
                    <span className="mt-2 text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Alert Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Emergency Alert</h3>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                onClick={openEmergencyModal}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Emergency
              </Button>
            </CardContent>
          </Card>

          {/* Health Status */}
          <HealthStatus />

          {/* Recent Activity */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-sm">{activity.text}</p>
                      <span className="text-white/40 text-xs">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medical Information Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Medical Information</h3>
              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white/80 text-xs mb-1">Blood Type</h4>
                  <p className="text-white font-medium">{medicalInfo?.bloodType || "Not specified"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white/80 text-xs mb-1">Allergies</h4>
                  <p className="text-white font-medium">{medicalInfo?.allergies || "None reported"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white/80 text-xs mb-1">Chronic Conditions</h4>
                  <p className="text-white font-medium">{medicalInfo?.conditions || "None reported"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <h4 className="text-white/80 text-xs mb-1">Current Medications</h4>
                  <p className="text-white font-medium">{medicalInfo?.medications || "None reported"}</p>
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-4 transition-all duration-300"
                onClick={() => setShowMedicalInfoForm(true)}
              >
                Update Medical Information
              </Button>
            </CardContent>
          </Card>

          {/* System Notifications */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">System Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-sm">{notification.text}</p>
                      <span className="text-white/40 text-xs">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency History Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Emergency History</h3>
              {!userEmergencyHistory || userEmergencyHistory.length === 0 ? (
                <div className="text-white/60 text-center py-4">
                  No emergency history
                </div>
              ) : (
                <div className="space-y-3">
                  {userEmergencyHistory.map((emergency) => (
                    <div key={emergency.id} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{emergency.emergencyType}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          emergency.status === 'active' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {emergency.status}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{emergency.description}</p>
                      <div className="flex items-center text-white/40 text-xs mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(emergency.createdAt || Date.now()).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />

      {/* Medical Info Form Dialog */}
      <Dialog open={showMedicalInfoForm} onOpenChange={setShowMedicalInfoForm}>
        <DialogContent className="bg-primary/95 border-accent/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Update Medical Information</DialogTitle>
          </DialogHeader>
          <MedicalInfoForm 
            initialData={medicalInfo || undefined}
            onClose={() => setShowMedicalInfoForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
