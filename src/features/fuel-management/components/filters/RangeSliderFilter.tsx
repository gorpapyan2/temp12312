import { useState, useEffect } from "react";
import { Label } from "@/core/components/ui/label";
import { Slider } from "@/core/components/ui/slider";
import { Input } from "@/core/components/ui/primitives/input";
import { Button } from "@/core/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/shared/utils";

interface RangeSliderFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue: (value: number) => string;
  className?: string;
}

export function RangeSliderFilter({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  className,
}: RangeSliderFilterProps) {
  const [localMin, setLocalMin] = useState(value[0].toString());
  const [localMax, setLocalMax] = useState(value[1].toString());
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);

  // Calculate the percentage for visual indicators
  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  // Update local values when props change
  useEffect(() => {
    setLocalMin(value[0].toString());
    setLocalMax(value[1].toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    setIsDragging(true);
    onChange([newValue[0], newValue[1]]);

    // Determine which handle is being moved
    if (newValue[0] !== value[0]) {
      setActiveHandle("min");
    } else if (newValue[1] !== value[1]) {
      setActiveHandle("max");
    }

    // Clear dragging state after a short delay
    setTimeout(() => {
      setIsDragging(false);
      setActiveHandle(null);
    }, 500);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value;
    setLocalMin(newMin);

    if (newMin === "") return;

    const numericValue = Number(newMin);
    if (
      !isNaN(numericValue) &&
      numericValue >= min &&
      numericValue <= value[1]
    ) {
      onChange([numericValue, value[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value;
    setLocalMax(newMax);

    if (newMax === "") return;

    const numericValue = Number(newMax);
    if (
      !isNaN(numericValue) &&
      numericValue >= value[0] &&
      numericValue <= max
    ) {
      onChange([value[0], numericValue]);
    }
  };

  const resetToDefault = () => {
    onChange([min, max]);
  };

  const isCustomRange = value[0] > min || value[1] < max;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
        {isCustomRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="relative pt-5 pb-8">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value[0], value[1]]}
          onValueChange={handleSliderChange}
          className="z-10"
        />

        {/* Custom tooltip for min value */}
        <div
          className={cn(
            "absolute top-0 px-2 py-1 rounded-md text-xs bg-primary text-primary-foreground transform -translate-x-1/2 transition-all duration-200",
            isDragging && activeHandle === "min"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90"
          )}
          style={{ left: `${minPercent}%` }}
        >
          {formatValue(value[0])}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-primary"></div>
        </div>

        {/* Custom tooltip for max value */}
        <div
          className={cn(
            "absolute top-0 px-2 py-1 rounded-md text-xs bg-primary text-primary-foreground transform -translate-x-1/2 transition-all duration-200",
            isDragging && activeHandle === "max"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90"
          )}
          style={{ left: `${maxPercent}%` }}
        >
          {formatValue(value[1])}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-primary"></div>
        </div>

        {/* Value markers */}
        <div className="flex justify-between mt-1 px-1 text-xs text-muted-foreground">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col flex-1">
          <span className="text-xs text-muted-foreground mb-1">Min</span>
          <Input
            type="text"
            value={localMin}
            onChange={handleMinChange}
            onBlur={() => {
              if (localMin === "" || isNaN(Number(localMin))) {
                setLocalMin(value[0].toString());
              }
            }}
            className="h-8 bg-50/20 border-50/20 hover:bg-80/20 focus:border-50/20 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-xs text-muted-foreground mb-1">Max</span>
          <Input
            type="text"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={() => {
              if (localMax === "" || isNaN(Number(localMax))) {
                setLocalMax(value[1].toString());
              }
            }}
            className="h-8 bg-50/20 border-50/20 hover:bg-80/20 focus:border-50/20 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
      </div>

      {/* Selected range indicator */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          <span className="text-primary">{formatValue(value[0])}</span>
          <span className="mx-2 text-muted-foreground">—</span>
          <span className="text-primary">{formatValue(value[1])}</span>
        </div>
        {isCustomRange && (
          <span className="text-xs text-muted-foreground">
            Range: {formatValue(value[1] - value[0])}
          </span>
        )}
      </div>
    </div>
  );
}
