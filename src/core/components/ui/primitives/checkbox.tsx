import * as React from "react";
import { cn } from "@/shared/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, onCheckedChange, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || innerRef;

    React.useEffect(() => {
      if (
        typeof resolvedRef === "object" &&
        resolvedRef !== null &&
        "current" in resolvedRef &&
        resolvedRef.current
      ) {
        resolvedRef.current.indeterminate = !!indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    // Handle both onChange and onCheckedChange
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={resolvedRef}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {props.checked && (
          <Check className="absolute left-0.5 top-0.5 h-3 w-3 text-primary-foreground pointer-events-none" />
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
