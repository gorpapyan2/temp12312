import { useQuery } from "@tanstack/react-query";
import { fillingSystemsApi } from "@/core/api";
import { FillingSystem } from "@/core/api";
import { FormSelect } from "@/core/components/ui/primitives/form-fields";
import { Control, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import React from "react";
import { UseFormReturn } from "react-hook-form";

// Define the form data structure for sales
interface SalesFormData {
  quantity: number;
  unit_price: number;
  total_sales?: number;
  shift_id: string;
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  date?: string;
  comments?: string;
}

interface FillingSystemSelectProps {
  control: Control<SalesFormData>;
  onChange?: (value: string) => void;
  onSelect?: (systemId: string) => void;
  value?: string;
}

export function FillingSystemSelect({
  control,
  onChange,
  onSelect,
  value,
}: FillingSystemSelectProps) {
  const { t } = useTranslation();
  const [retryCount, setRetryCount] = useState(0);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["filling-systems", retryCount],
    queryFn: fillingSystemsApi.getFillingSystems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Extract the filling systems from the API response
  const fillingSystems = React.useMemo(() => {
    return (response?.data || []) as FillingSystem[];
  }, [response?.data]);

  // Log errors to console and show toast notification
  useEffect(() => {
    if (error) {
      console.error("Error fetching filling systems:", error);
      toast.error(t("common.error"), {
        description: t("common.errorMessage", { message: String(error) }),
      });
    }
  }, [error, t]);

  // Show notification for offline mode
  useEffect(() => {
    if (!navigator.onLine && fillingSystems.length > 0) {
      toast.warning(t("common.warning"), {
        description: "Using offline mode with sample filling systems data",
        duration: 5000,
      });
    }
  }, [fillingSystems, t]);

  // Handle retry when error occurs
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Watch for field changes - must be called in every render path
  const selectedValue = useWatch({
    control,
    name: "filling_system_id",
  }) as string;

  // Call callbacks when the value changes
  useEffect(() => {
    if (selectedValue && typeof selectedValue === 'string') {
      if (onChange) onChange(selectedValue);
      if (onSelect) onSelect(selectedValue);
    }
  }, [selectedValue, onChange, onSelect]);

  // Create options array for the FormSelect component (outside conditions)
  const options = fillingSystems.map((system: FillingSystem) => {
    // Construct a label based on available properties
    const name = system.name || `System ${system.id.substring(0, 8)}`;
    const status = system.status ? ` (${system.status})` : "";

    return {
      value: system.id,
      label: `${name}${status}`,
    };
  });

  // Determine what content to render
  let content;

  if (isLoading) {
    content = (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">
            {t("common.loading", "Loading filling systems...")}
          </span>
        </div>
      </div>
    );
  } else if (isError && fillingSystems.length === 0) {
    content = (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t(
              "fillingSystems.errorFetching",
              "Failed to load filling systems"
            )}
          </AlertDescription>
        </Alert>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          {t("common.retry", "Retry")}
        </Button>
      </div>
    );
  } else if (options.length === 0) {
    content = (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t(
              "fillingSystems.noSystems",
              "No filling systems found. Please add filling systems before creating a sale."
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Create a minimal form object for FormSelect
  const formObject = {
    control,
  } as UseFormReturn<SalesFormData>;

  // Always render the FormSelect component with options
  return (
    <div className="space-y-4">
      {content}
      <FormSelect
        name="filling_system_id"
        label={t("sales.fillingSystem")}
        form={formObject}
        options={options}
        placeholder={
          isLoading
            ? t("fillingSystems.loading", "Loading...")
            : t("fillingSystems.selectTank")
        }
        onChange={onChange}
      />
    </div>
  );
}
