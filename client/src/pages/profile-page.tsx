import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Edit } from "lucide-react";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Profile" />

      <main className="pt-20 px-4">
        <div className="mb-6">
          <h2 className="text-white font-semibold text-xl mb-4">Profile</h2>
          
          {/* User Profile Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                  <User className="text-white/70 text-4xl" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-xl">
                    {user ? `${user.firstName} ${user.lastName}` : "User"}
                  </h3>
                  <p className="text-white/60 text-sm">{user?.email || "user@example.com"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-white/60 mr-3" />
                  <span className="text-white/60">{user?.email || "user@example.com"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white/60 mr-3">Role:</span>
                  <span className="text-white font-medium capitalize">{user?.role || "user"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white/60 mr-3">Email Verified:</span>
                  <span className="text-white font-medium">
                    {user?.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary font-medium py-2 px-4 rounded-lg transition-all duration-300"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </main>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-primary border-none text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm onClose={() => setIsEditModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Navbar />
    </div>
  );
} 