import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request);
      return Promise.reject({ message: "Network error. Please check your connection." });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// User endpoints
export const updateUser = async (userId: number, data: any) => {
  const response = await api.put(`/api/users/${userId}`, data);
  return response.data;
};

export const updateUserPassword = async (userId: number, data: { currentPassword: string; newPassword: string }) => {
  const response = await api.put(`/api/users/${userId}/password`, data);
  return response.data;
};

// Medical info endpoints
export const updateMedicalInfo = async (userId: number, data: any) => {
  const response = await api.put(`/api/medical-info/${userId}`, data);
  return response.data;
};

// Emergency endpoints
export const getActiveEmergencies = async () => {
  const response = await api.get("/api/emergencies/active");
  return response.data;
};

export const getUserEmergencyHistory = async (userId: number) => {
  const response = await api.get(`/api/emergencies/user/${userId}`);
  return response.data;
};

// Location endpoints
export const updateUserLocation = async (userId: number, data: { latitude: number; longitude: number }) => {
  const response = await api.put(`/api/users/${userId}/location`, data);
  return response.data;
};

// Health check endpoint
export const getHealthStatus = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

// Hospital endpoints
export const getNearbyHospitals = async (latitude: number, longitude: number, radius: number = 10) => {
  const response = await api.get(`/api/hospitals/nearby`, {
    params: { latitude, longitude, radius }
  });
  return response.data;
};

export const getHospitalDetails = async (hospitalId: number) => {
  const response = await api.get(`/api/hospitals/${hospitalId}`);
  return response.data;
};

// Chat support endpoints
export const getSupportAgents = async () => {
  const response = await api.get("/api/support/agents");
  return response.data;
};

export const startChatSession = async (userId: number) => {
  const response = await api.post("/api/support/chat", { userId });
  return response.data;
};

export const sendChatMessage = async (sessionId: string, message: string) => {
  const response = await api.post(`/api/support/chat/${sessionId}/message`, { message });
  return response.data;
};

// Checkup scheduling endpoints
export const getAvailableTimeSlots = async (hospitalId: number, date: string) => {
  const response = await api.get(`/api/checkups/slots`, {
    params: { hospitalId, date }
  });
  return response.data;
};

export const scheduleCheckup = async (data: {
  userId: number;
  hospitalId: number;
  date: string;
  timeSlot: string;
  reason: string;
}) => {
  const response = await api.post("/api/checkups/schedule", data);
  return response.data;
};

export const getScheduledCheckups = async (userId: number) => {
  const response = await api.get(`/api/checkups/user/${userId}`);
  return response.data;
}; 