import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi, Sale } from "@/core/api";
import { useToast } from "@/hooks";

// Define the update request interface based on the Sale type
interface UpdateSaleRequest {
  filling_system_id?: string;
  fuel_type_id?: string;
  quantity?: number;
  price_per_liter?: number;
  total_price?: number;
  payment_method?: string;
  employee_id?: string;
  shift_id?: string;
  comments?: string;
}

export function useSalesMutations() {
  // State declarations
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Define mutations
  const deleteMutation = useMutation({
    mutationFn: salesApi.deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });

      toast({
        title: "Success",
        description: "Sale deleted successfully and tank level restored",
      });
      setIsDeleteDialogOpen(false);
      setSaleToDelete(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive",
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (params: { id: string; updates: UpdateSaleRequest }) =>
      salesApi.updateSale(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

      toast({
        title: "Success",
        description: "Sale updated successfully and tank level adjusted",
      });
      setIsEditDialogOpen(false);
      setSelectedSale(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update sale",
        variant: "destructive",
      });
    },
  });

  // Effect to reset state when dialogs close
  useEffect(() => {
    if (!isEditDialogOpen) {
      // Only reset selected sale when edit dialog closes
      setSelectedSale(null);
    }
  }, [isEditDialogOpen]);

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      // Only reset sale to delete when delete dialog closes
      setSaleToDelete(null);
    }
  }, [isDeleteDialogOpen]);

  // Handler functions
  const handleEdit = useCallback((sale: Sale) => {
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setSaleToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (saleToDelete) {
      deleteMutation.mutate(saleToDelete);
    }
  }, [saleToDelete, deleteMutation]);

  return {
    selectedSale,
    setSelectedSale,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    saleToDelete,
    setSaleToDelete,
    deleteMutation,
    updateMutation,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
