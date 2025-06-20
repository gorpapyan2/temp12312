
// Re-export the original service for backwards compatibility
export * from "./dashboard";

// Import API endpoints
import { dashboardApi } from "@/core/api/endpoints/dashboard";
import { financialsApi } from "@/core/api/endpoints/financials";
import { tanksApi } from "@/core/api/endpoints/tanks";
import { salesApi } from "@/core/api/endpoints/sales";

// Import types
import type { DashboardData as ApiDashboardData } from "@/core/api/types";
import type { DashboardData } from "../types";
import { SalesSummary } from '../../../core/api/endpoints/dashboard';
import { FinancialDashboard } from '../../../core/api/types';

/**
 * Get dashboard data from the API
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Make parallel requests to get all required data
    const [dashboardResponse, financialResponse, tanksResponse, salesResponse] =
      await Promise.all([
        dashboardApi.getData(),
        financialsApi.getFinanceOverview(),
        tanksApi.getTanks(),
        salesApi.getSales(),
      ]);

    // Handle errors
    if (dashboardResponse.error) {
      throw new Error(dashboardResponse.error.message);
    }

    // Extract data
    const dashboardData = dashboardResponse.data;
    const financialData = financialResponse.data;
    const tanks = tanksResponse.data || [];
    const sales = salesResponse.data || [];

    // Calculate inventory value based on tank levels
    const inventoryValue = tanks.reduce((sum, tank) => {
      const defaultPricePerLiter = 500; // Example price in AMD
      return sum + tank.current_level * defaultPricePerLiter;
    }, 0);

    // Calculate all required properties for DashboardData using correct property names
    const totalSales = financialData?.total_sales || 0;
    const totalExpenses = financialData?.total_expenses || 0;
    const netProfit = financialData?.net_profit || 0;
    // Use quantity_liters property from Sale type
    const totalLitersSold = sales.reduce((sum, sale) => sum + (sale.quantity_liters || 0), 0);
    
    return {
      sales: sales,
      expenses: [], // Would need to fetch from expenses API if needed
      tanks: tanks,
      totalSales,
      totalExpenses,
      netProfit,
      inventoryValue,
      revenue: totalSales,
      revenuePercentChange: 12.5, // Mock data
      fuelSold: totalLitersSold,
      fuelSoldPercentChange: 8.3, // Mock data
      expensesPercentChange: -5.2, // Mock data
      profit: netProfit,
      profitPercentChange: 15.7, // Mock data
      totalRevenue: totalSales,
      revenueChange: 12.5, // Mock data
      totalLitersSold,
      salesVolumeChange: 8.3, // Mock data
      expensesChange: -5.2, // Mock data
      efficiencyRatio: totalExpenses > 0 ? totalSales / totalExpenses : 0,
      efficiencyChange: 3.2, // Mock data
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return complete dashboard data structure in case of error
    return {
      sales: [],
      expenses: [],
      tanks: [],
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      inventoryValue: 0,
      revenue: 0,
      revenuePercentChange: 0,
      fuelSold: 0,
      fuelSoldPercentChange: 0,
      expensesPercentChange: 0,
      profit: 0,
      profitPercentChange: 0,
      totalRevenue: 0,
      revenueChange: 0,
      totalLitersSold: 0,
      salesVolumeChange: 0,
      expensesChange: 0,
      efficiencyRatio: 0,
      efficiencyChange: 0,
    };
  }
}

// Export as fetchDashboardData for backwards compatibility
export const fetchDashboardData = getDashboardData;

/**
 * Get real-time fuel levels
 */
export async function getFuelLevels(): Promise<Record<string, number>> {
  const response = await dashboardApi.getFuelLevels();

  if (response.error) {
    console.error("Error fetching fuel levels:", response.error);
    return {};
  }

  return response.data || {};
}

/**
 * Get sales summary by timeframe
 */
export async function getSalesSummary(
  timeframe: "day" | "week" | "month" = "day"
): Promise<SalesSummary> {
  try {
    const response = await dashboardApi.getSalesSummary(timeframe);
    return response.data || {
      total_sales: 0,
      total_revenue: 0,
      sales_by_fuel_type: {},
      sales_by_payment_method: {},
      timeframe,
      period_start: new Date().toISOString(),
      period_end: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    // Return default SalesSummary structure
    return {
      total_sales: 0,
      total_revenue: 0,
      sales_by_fuel_type: {},
      sales_by_payment_method: {},
      timeframe,
      period_start: new Date().toISOString(),
      period_end: new Date().toISOString(),
    };
  }
}

/**
 * Get financial dashboard data
 */
export async function getFinancialDashboard(): Promise<FinancialDashboard> {
  try {
    // This would call the actual API endpoint when implemented
    // For now, return mock data with proper structure
    return {
      revenue: {
        total: 0,
        trend: [],
      },
      expenses: {
        total: 0,
        trend: [],
      },
      profit: {
        total: 0,
        trend: [],
      },
    };
  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    // Return default FinancialDashboard structure
    return {
      revenue: {
        total: 0,
        trend: [],
      },
      expenses: {
        total: 0,
        trend: [],
      },
      profit: {
        total: 0,
        trend: [],
      },
    };
  }
}

// Export dashboard service as an object for compatibility
export const dashboardService = {
  getDashboardData,
  getFuelLevels,
  getSalesSummary,
  getFinancialDashboard,
};
