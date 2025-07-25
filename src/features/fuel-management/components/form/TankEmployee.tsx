import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { Control, FieldValues } from "react-hook-form";
import { Employee, FuelTank } from "@/types";

interface TankEmployeeProps {
  control: Control<FieldValues>;
  tanks?: FuelTank[];
  employees?: Employee[];
}

export function TankEmployee({ control, tanks, employees }: TankEmployeeProps) {
  return (
    <>
      <FormField
        control={control}
        name="tank_id"
        rules={{ required: "Tank is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Fuel Tank</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tank" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tanks?.map((tank) => (
                  <SelectItem key={tank.id} value={tank.id}>
                    {tank.name} ({typeof tank.fuel_type === 'string' ? tank.fuel_type : tank.fuel_type?.name || 'Unknown'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="employee_id"
        rules={{ required: "Employee is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Employee</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
