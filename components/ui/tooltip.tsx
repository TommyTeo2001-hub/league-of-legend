'use client';

import * as React from 'react';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipContentPrimitive
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-[#121214] border border-[#2a2a30] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = 'TooltipContent';

// Basic Tooltip component
export function Tooltip({
  children,
  content,
  className,
  ...props
}: {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}) {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className} {...props}>
          {content}
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
}

// Enhanced tooltip for League of Legends game elements (runes, spells, items)
export function GameElementTooltip({
  children,
  title,
  description,
  icon,
  className,
}: {
  children: React.ReactNode
  title: string
  description: string
  icon?: string
  className?: string
}) {
  // Clean the description by removing HTML tags
  const cleanDescription = description?.replace(/<[^>]*>?/gm, '') || '';

  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(
            'max-w-md bg-[#121214] border border-[#2a2a30] p-3',
            className
          )}
        >
          <div className="flex gap-3">
            {icon && (
              <div className="flex-shrink-0 h-12 w-12 relative">
                <ImageWithFallback 
                  src={icon.includes('perk-images') || icon.includes('Styles') 
                    ? `https://ddragon.leagueoflegends.com/cdn/13.7.1/img/passive/${icon.split('/').pop()?.replace('.png', '')}.png` 
                    : `https://ddragon.leagueoflegends.com/cdn/13.7.1/img/${icon}`} 
                  alt={title}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-300 mt-1">{cleanDescription}</p>
            </div>
          </div>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
}

// Image with fallback component
const ImageWithFallback = ({ 
  src, 
  alt, 
  className 
}: { 
  src: string; 
  alt: string; 
  className?: string;
}) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  if (error) {
    return (
      <div 
        className={cn(
          "bg-blue-800/30 flex items-center justify-center text-xs text-blue-300", 
          className
        )}
      >
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1c] z-10">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        style={{ opacity: loading ? 0 : 1 }}
      />
    </div>
  );
};
