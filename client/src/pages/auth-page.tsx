import { useState } from "react";
import { useLocation } from "wouter";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { InsertUser, LoginUser } from "@shared/schema";
import { Redirect } from "wouter";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [location] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Show loading or redirect if user is already logged in
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Redirect if user is logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (credentials: LoginUser) => {
    loginMutation.mutate(credentials);
  };

  const handleRegister = (userData: InsertUser) => {
    registerMutation.mutate(userData);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-primary login-bg">
      <div className="max-w-md w-full space-y-8">
        {/* Logo Section */}
        <Logo size="lg" />
        
        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex mb-6">
            <Button
              variant="link"
              className={`flex-1 pb-2 font-medium border-b-2 transition-all duration-300 ${
                activeTab === "login"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-white/60"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </Button>
            <Button
              variant="link"
              className={`flex-1 pb-2 font-medium border-b-2 transition-all duration-300 ${
                activeTab === "register"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-white/60"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </Button>
          </div>
          
          {activeTab === "login" ? (
            <LoginForm onSubmit={handleLogin} isPending={loginMutation.isPending} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isPending={registerMutation.isPending} />
          )}
        </div>
      </div>
    </section>
  );
}
