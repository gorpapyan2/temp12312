import * as React from "react";
import { cn } from "@/shared/utils";

export interface CardPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the root div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card component
 * Handles accessibility and core structure without styling
 */
export const CardPrimitive = React.forwardRef<
  HTMLDivElement,
  CardPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardPrimitive.displayName = "CardPrimitive";

export interface CardHeaderPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the header div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card Header component
 */
export const CardHeaderPrimitive = React.forwardRef<
  HTMLDivElement,
  CardHeaderPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardHeaderPrimitive.displayName = "CardHeaderPrimitive";

export interface CardFooterPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the footer div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card Footer component
 */
export const CardFooterPrimitive = React.forwardRef<
  HTMLDivElement,
  CardFooterPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardFooterPrimitive.displayName = "CardFooterPrimitive";

export interface CardTitlePrimitiveProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Forward ref to the title heading element
   */
  ref?: React.ForwardedRef<HTMLHeadingElement>;
  /**
   * HTML heading level (h1-h6)
   * @default 'h3'
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Base primitive Card Title component
 */
export const CardTitlePrimitive = React.forwardRef<
  HTMLHeadingElement,
  CardTitlePrimitiveProps
>(({ className, as: Comp = "h3", ...props }, ref) => {
  return <Comp ref={ref} className={className} {...props} />;
});
CardTitlePrimitive.displayName = "CardTitlePrimitive";

export interface CardDescriptionPrimitiveProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Forward ref to the description paragraph element
   */
  ref?: React.ForwardedRef<HTMLParagraphElement>;
}

/**
 * Base primitive Card Description component
 */
export const CardDescriptionPrimitive = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionPrimitiveProps
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={className} {...props} />;
});
CardDescriptionPrimitive.displayName = "CardDescriptionPrimitive";

export interface CardContentPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the content div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card Content component
 */
export const CardContentPrimitive = React.forwardRef<
  HTMLDivElement,
  CardContentPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardContentPrimitive.displayName = "CardContentPrimitive";

export interface CardMediaPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the media div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card Media component for images and media content
 */
export const CardMediaPrimitive = React.forwardRef<
  HTMLDivElement,
  CardMediaPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardMediaPrimitive.displayName = "CardMediaPrimitive";

export interface CardActionsPrimitiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the actions div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Card Actions component for action buttons
 */
export const CardActionsPrimitive = React.forwardRef<
  HTMLDivElement,
  CardActionsPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
CardActionsPrimitive.displayName = "CardActionsPrimitive";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
