import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = location.split("/verify-email/")[1];
        if (!token) {
          setStatus("error");
          setMessage("Invalid verification link");
          return;
        }

        const res = await apiRequest("GET", `/api/verify-email/${token}`);
        const data = await res.json();
        
        setStatus("success");
        setMessage(data.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation("/auth");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Verification failed");
      }
    };

    verifyEmail();
  }, [location, setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary" />
            <p className="mt-4 text-white">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-white mb-4">Email Verified!</h1>
            <p className="text-white/80 mb-6">{message}</p>
            <p className="text-white/60">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
            <p className="text-white/80 mb-6">{message}</p>
            <Button
              onClick={() => setLocation("/auth")}
              className="bg-secondary hover:bg-secondary/80"
            >
              Return to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 