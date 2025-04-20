import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableTimeSlots, scheduleCheckup, getScheduledCheckups } from "@/lib/api";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduledCheckup {
  id: number;
  hospitalName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [reason, setReason] = useState("");

  // Get available time slots
  const { data: timeSlots } = useQuery<TimeSlot[]>({
    queryKey: ['timeSlots', selectedDate, selectedHospital],
    queryFn: async () => {
      if (!selectedDate || !selectedHospital) return [];
      return getAvailableTimeSlots(parseInt(selectedHospital), selectedDate);
    },
    enabled: !!selectedDate && !!selectedHospital
  });

  // Get scheduled checkups
  const { data: scheduledCheckups } = useQuery<ScheduledCheckup[]>({
    queryKey: ['scheduledCheckups'],
    queryFn: async () => {
      // In a real app, we would get the user's ID from the auth context
      const userId = 1; // Temporary user ID
      return getScheduledCheckups(userId);
    }
  });

  const handleScheduleCheckup = async () => {
    if (!selectedDate || !selectedHospital || !timeSlots?.[0] || !reason) return;

    try {
      // In a real app, we would get the user's ID from the auth context
      const userId = 1; // Temporary user ID
      await scheduleCheckup({
        userId,
        hospitalId: parseInt(selectedHospital),
        date: selectedDate,
        timeSlot: timeSlots[0].startTime,
        reason
      });

      // Reset form
      setSelectedDate("");
      setSelectedHospital("");
      setReason("");
    } catch (error) {
      console.error('Failed to schedule checkup:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Schedule Checkup" />

      <main className="pt-20 px-4">
        <div className="space-y-6">
          {/* Schedule New Checkup Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Schedule New Checkup</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <Input
                    type="date"
                    className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-white/60" />
                  <Input
                    type="text"
                    placeholder="Select Hospital"
                    className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-white/60" />
                  <Input
                    type="text"
                    placeholder="Reason for checkup"
                    className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                {timeSlots && timeSlots.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-white font-medium text-sm">Available Time Slots</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          className={`w-full ${
                            slot.isAvailable
                              ? 'bg-secondary text-white'
                              : 'bg-white/10 text-white/40'
                          }`}
                          disabled={!slot.isAvailable}
                        >
                          {slot.startTime} - {slot.endTime}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-secondary text-white rounded-lg px-4 py-3"
                  onClick={handleScheduleCheckup}
                >
                  Schedule Checkup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Checkups Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Your Scheduled Checkups</h2>
              <div className="space-y-3">
                {scheduledCheckups && scheduledCheckups.length > 0 ? (
                  scheduledCheckups.map((checkup) => (
                    <div key={checkup.id} className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{checkup.hospitalName}</h3>
                        <div className="flex items-center text-white/60 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{checkup.date} at {checkup.timeSlot}</span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">{checkup.reason}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        checkup.status === 'scheduled'
                          ? 'bg-green-500/20 text-green-400'
                          : checkup.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {checkup.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60 text-center py-4">
                    No scheduled checkups
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
} 