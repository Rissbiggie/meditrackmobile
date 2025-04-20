import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/reset-password-request", values);
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "If an account exists with this email, you will receive password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
          <p className="text-white/80 mb-6">
            If an account exists with the provided email address, you will receive password reset instructions shortly.
          </p>
          <Button
            onClick={() => setLocation("/auth")}
            className="bg-secondary hover:bg-secondary/80"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Reset Your Password</h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isSubmitting}
                        className="bg-white/20 text-white border-white/10"
                        placeholder="Enter your email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary hover:bg-secondary/80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Instructions...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full text-white/60 hover:text-white"
                onClick={() => setLocation("/auth")}
              >
                Back to Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 