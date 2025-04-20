import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Database, Ambulance, Hospital } from "lucide-react";

interface ServiceStatus {
  status: string;
  message: string;
}

interface HealthStatus {
  status: string;
  services: {
    database: ServiceStatus;
    ambulanceService: ServiceStatus;
    medicalFacilities: ServiceStatus;
  };
}

export function HealthStatus() {
  const { data: healthStatus, isLoading } = useQuery<HealthStatus>({
    queryKey: ['/api/health'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusIcon = (service: string) => {
    switch (service) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'ambulanceService':
        return <Ambulance className="h-4 w-4" />;
      case 'medicalFacilities':
        return <Hospital className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-4 bg-white/20 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
      <CardContent className="p-4">
        <h3 className="text-white font-semibold mb-3">System Status</h3>
        <div className="space-y-3">
          {Object.entries(healthStatus?.services || {}).map(([service, status]) => (
            <div key={service} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)} mr-3`}></div>
                <div className="flex items-center">
                  {getStatusIcon(service)}
                  <span className="text-white font-medium text-sm ml-2">
                    {service === 'database' ? 'Database' :
                     service === 'ambulanceService' ? 'Ambulance Service' :
                     'Medical Facilities'}
                  </span>
                </div>
              </div>
              <span className={`text-xs ${
                status.status === 'operational' ? 'text-green-400' :
                status.status === 'degraded' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {status.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 