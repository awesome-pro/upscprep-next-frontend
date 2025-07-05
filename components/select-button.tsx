import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { Button } from "./ui/button";

interface SelectButtonsProps<T extends string | number> {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  options: Record<string, T> | [string, T][];
  labelTransform?: (key: string) => string;
  className?: string;
  gridCols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  disabled?: boolean;
}

export function SelectButtons<T extends string | number>({
  name,
  control,
  label,
  description,
  options,
  labelTransform = (key) => key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
  className,
  gridCols = { default: 2, sm: 3, md: 4 },
  disabled = false,
}: SelectButtonsProps<T>) {
  const optionsArray = Array.isArray(options) ? options : Object.entries(options);
  
  // Generate grid classes based on provided columns
  const gridClassNames = cn(
    `grid gap-2`,
    `grid-cols-${gridCols.default}`,
    gridCols.sm && `sm:grid-cols-${gridCols.sm}`,
    gridCols.md && `md:grid-cols-${gridCols.md}`,
    gridCols.lg && `lg:grid-cols-${gridCols.lg}`,
    className
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div 
              className={gridClassNames}
              role="radiogroup"
              aria-label={label || name}
            >
              {optionsArray.map(([key, value]) => {
                const isSelected = field.value === value;
                const displayLabel = labelTransform(key);
                
                return (
                  <Button
                    key={key}
                    variant={isSelected ? "default" : "outline"}
                    type="button"
                    id={`${name}-${key}`}
                    disabled={disabled}
                    onClick={() => field.onChange(value)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                  >
                    {displayLabel}
                  </Button>
                );
              })}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}