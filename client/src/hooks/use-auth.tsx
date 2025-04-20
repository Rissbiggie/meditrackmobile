import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { UserRole, LoginUser } from '@shared/schema';
import { useToast } from './use-toast';
import { useLocation } from 'wouter';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
  isAdmin: boolean;
  isResponseTeam: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/user');
        if (!res.ok) return null;
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Session fetch error:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (session) {
      setUser(session);
    }
  }, [session]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      try {
        const res = await apiRequest('POST', '/api/login', credentials);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['/api/user'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      console.error('Login mutation error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      try {
        const res = await apiRequest('POST', '/api/register', userData);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        return data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['/api/user'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Success",
        description: "Registered successfully",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiRequest('POST', '/api/logout');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Logout failed');
        }
        return res;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      setLocation('/auth');
    },
    onError: (error: Error) => {
      console.error('Logout mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  });

  const isAdmin = user?.role === UserRole.ADMIN;
  const isResponseTeam = user?.role === UserRole.RESPONSE_TEAM;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      loginMutation,
      logoutMutation,
      registerMutation,
      isAdmin,
      isResponseTeam
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
