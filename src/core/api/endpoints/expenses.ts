/**
 * Expenses API
 *
 * This file provides API functions for working with expenses data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { Expense } from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.EXPENSES;

/**
 * Fetches all expenses with optional filters
 */
export async function getExpenses(filters?: {
  category?: string;
  start_date?: string;
  end_date?: string;
  payment_status?: string;
}): Promise<ApiResponse<Expense[]>> {
  return fetchFromFunction<Expense[]>(ENDPOINT, {
    queryParams: filters,
  });
}

/**
 * Fetches an expense by ID
 */
export async function getExpenseById(
  id: string
): Promise<ApiResponse<Expense>> {
  return fetchFromFunction<Expense>(`${ENDPOINT}/${id}`);
}

/**
 * Fetches all expense categories
 */
export async function getExpenseCategories(): Promise<ApiResponse<string[]>> {
  return fetchFromFunction<string[]>(`${ENDPOINT}/categories`);
}

/**
 * Creates a new expense
 */
export async function createExpense(
  data: Omit<Expense, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Expense>> {
  return fetchFromFunction<Expense>(ENDPOINT, {
    method: "POST",
    body: data,
  });
}

/**
 * Updates an expense by ID
 */
export async function updateExpense(
  id: string,
  data: Partial<Omit<Expense, "id" | "created_at" | "updated_at">>
): Promise<ApiResponse<Expense>> {
  return fetchFromFunction<Expense>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * Deletes an expense by ID
 */
export async function deleteExpense(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fetches expenses count
 */
export async function getExpensesCount(): Promise<
  ApiResponse<{ count: number }>
> {
  return fetchFromFunction<{ count: number }>(`${ENDPOINT}/count`);
}

/**
 * Exports expenses data as CSV
 */
export async function exportExpenses(filters?: {
  startDate?: string;
  endDate?: string;
  format?: 'csv' | 'json';
  category?: string;
}): Promise<string> {
  const response = await fetchFromFunction<string>(`${ENDPOINT}/export`, {
    queryParams: filters,
    responseType: "json"
  });
  
  if (response instanceof Response) {
    return await response.text();
  }
  
  return response as string;
}

/**
 * Expenses API object with all methods
 */
export const expensesApi = {
  getExpenses,
  getExpenseById,
  getExpenseCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesCount,
  exportExpenses,
};
