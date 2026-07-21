import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  leftImage: string;
  rightImage: string;
  altLeft?: string;
  altRight?: string;
  initialPosition?: number;
  leftLabel?: string;
  rightLabel?: string;
}

export const ImageComparisonSlider = React.forwardRef<HTMLDivElement, ImageComparisonSliderProps>(
  ({ className, leftImage, rightImage, altLeft = "Left image", altRight = "Right image",
     initialPosition = 50, leftLabel, rightLabel, ...props }, ref) => {
    const [sliderPosition, setSliderPosition] = React.useState(initialPosition);
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };

    React.useEffect(() => {
      if (!isDragging) return;
      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const onEnd = () => { setIsDragging(false); document.body.style.cursor = ""; };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchend", onEnd);
      document.body.style.cursor = "ew-resize";
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchend", onEnd);
        document.body.style.cursor = "";
      };
    }, [isDragging]);

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full h-full overflow-hidden select-none group", className)}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        {...props}
      >
        <img src={rightImage} alt={altRight}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}>
          <img src={leftImage} alt={altLeft}
            className="w-full h-full object-cover" draggable={false} />
        </div>

        {leftLabel && (
          <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none"
            style={{ opacity: sliderPosition > 15 ? 1 : 0, transition: "opacity 0.2s" }}>
            {leftLabel}
          </div>
        )}
        {rightLabel && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none"
            style={{ opacity: sliderPosition < 85 ? 1 : 0, transition: "opacity 0.2s" }}>
            {rightLabel}
          </div>
        )}

        <div className="absolute top-0 h-full cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 2px)`, width: "4px" }}>
          <div className="absolute inset-y-0 w-0.5 bg-white/80 left-[2px]" />
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full shadow-xl",
            "bg-black/70 border-2 border-white/80 backdrop-blur-md",
            "transition-transform duration-200 group-hover:scale-105",
            isDragging && "scale-110"
          )}
            role="slider" aria-valuenow={sliderPosition} aria-valuemin={0} aria-valuemax={100}>
            <div className="flex items-center text-white">
              <ChevronLeft className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ImageComparisonSlider.displayName = "ImageComparisonSlider";
