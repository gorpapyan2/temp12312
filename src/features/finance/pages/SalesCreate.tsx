import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from '@tabler/icons-react';
import { IconSend, IconArrowLeft } from "@tabler/icons-react";

// Import components
import { PageHeader } from "@/core/components/ui/page-header";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { SalesFormStandardized, ShiftControl } from "@/features/sales";
import { createSale } from "@/features/sales/services";
import { useToast } from "@/hooks";

export default function SalesCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

      toast({
        title: t("common.success"),
        description: t("sales.createSuccess"),
      });

      // Navigate back to the sales page
      navigate("/sales");
    },
    onError: (error: unknown) => {
      console.error("Create error:", error);
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("sales.createError"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: CreateSaleRequest): Promise<boolean> => {
    try {
      await createSaleMutation.mutateAsync(data);
      return true; // Indicate submission was successful
    } catch (error) {
      // Error is already handled by createSaleMutation.onError
      return false; // Indicate submission failed
    }
  };

  const handleCancel = () => {
    navigate("/sales");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={t("sales.newSale")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </div>
        }
      />

      <ShiftControl
        onShiftStart={() => {}}
        onShiftEnd={() => {}}
        isShiftOpen={false}
      />

      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <SalesFormStandardized onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
