import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginUser } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (data: LoginUser) => void;
  isPending: boolean;
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = (data: LoginUser) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white animate-slide-up-fast">
          Sign in to your account
        </h2>
      </div>
      <Form {...form}>
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-white/80 text-sm mb-1">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="your username"
                    className="w-full bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-white/80 text-sm mb-1">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </FormControl>
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    className="text-sm text-red-500 hover:text-red-600 p-0 h-auto"
                    onClick={() => window.location.href = '/forgot-password'}
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className="flex items-center text-white/80 text-sm">
              <Checkbox 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                className="rounded text-secondary mr-2" 
              />
              Remember me
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">Or continue with</p>
          <div className="flex justify-center space-x-4 mt-3">
            <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 border-0">
              <FaGoogle className="text-lg" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 border-0">
              <FaFacebookF className="text-lg" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 border-0">
              <FaApple className="text-lg" />
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
