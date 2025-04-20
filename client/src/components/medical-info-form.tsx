import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { MedicalInfo } from "@shared/schema";

interface MedicalInfoFormProps {
  initialData?: MedicalInfo | null;
  onClose: () => void;
}

export function MedicalInfoForm({ initialData, onClose }: MedicalInfoFormProps) {
  const [bloodType, setBloodType] = useState(initialData?.bloodType || "");
  const [allergies, setAllergies] = useState(initialData?.allergies || "");
  const [conditions, setConditions] = useState(initialData?.conditions || "");
  const [medications, setMedications] = useState(initialData?.medications || "");

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: {
      bloodType: string;
      allergies: string;
      conditions: string;
      medications: string;
    }) => {
      const response = await fetch("/api/medical-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update medical information");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-info"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      bloodType,
      allergies,
      conditions,
      medications,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bloodType" className="text-white">
          Blood Type
        </Label>
        <Input
          id="bloodType"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          placeholder="e.g., A+, O-, etc."
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-white">
          Allergies
        </Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="List any allergies (separate with commas)"
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions" className="text-white">
          Chronic Conditions
        </Label>
        <Textarea
          id="conditions"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="List any chronic conditions (separate with commas)"
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications" className="text-white">
          Current Medications
        </Label>
        <Textarea
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="List current medications (separate with commas)"
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white"
          disabled={updateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
} 