"use client";

import React, { useRef, useEffect, ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface StarBackgroundProps {
  color?: string;
}

function StarBackground({ color }: StarBackgroundProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_408_119)">
        <path
          d="M32.34 26.68C32.34 26.3152 32.0445 26.02 31.68 26.02C31.3155 26.02 31.02 26.3152 31.02 26.68C31.02 27.0448 31.3155 27.34 31.68 27.34C32.0445 27.34 32.34 27.0448 32.34 26.68Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.1 3.96C56.4645 3.96 56.76 4.25519 56.76 4.62C56.76 4.98481 56.4645 5.28 56.1 5.28C55.9131 5.28 55.7443 5.20201 55.624 5.07762C55.5632 5.01446 55.5147 4.93904 55.4829 4.8559C55.4552 4.78243 55.44 4.70315 55.44 4.62C55.44 4.5549 55.4494 4.49174 55.4668 4.43244C55.4906 4.35188 55.5292 4.27775 55.5795 4.21329C55.7004 4.05926 55.8885 3.96 56.1 3.96ZM40.26 17.16C40.6245 17.16 40.92 17.4552 40.92 17.82C40.92 18.1848 40.6245 18.48 40.26 18.48C39.8955 18.48 39.6 18.1848 39.6 17.82C39.6 17.4552 39.8955 17.16 40.26 17.16ZM68.64 19.14C69.0045 19.14 69.3 19.4352 69.3 19.8C69.3 20.1648 69.0045 20.46 68.64 20.46C68.2755 20.46 67.98 20.1648 67.98 19.8C67.98 19.4352 68.2755 19.14 68.64 19.14ZM57.42 34.32C57.7845 34.32 58.08 34.6152 58.08 34.98C58.08 35.3448 57.7845 35.64 57.42 35.64C57.0555 35.64 56.76 35.3448 56.76 34.98C56.76 34.6152 57.0555 34.32 57.42 34.32ZM18.48 22.44C18.8445 22.44 19.14 22.7352 19.14 23.1C19.14 23.4648 18.8445 23.76 18.48 23.76C18.1155 23.76 17.82 23.4648 17.82 23.1C17.82 22.7352 18.1155 22.44 18.48 22.44ZM78.54 12.54C78.9045 12.54 79.2 12.8352 79.2 13.2C79.2 13.5648 78.9045 13.86 78.54 13.86C78.1755 13.86 77.88 13.5648 77.88 13.2C77.88 12.8352 78.1755 12.54 78.54 12.54Z"
          fill={color || "currentColor"}
        />
      </g>
      <defs>
        <clipPath id="clip0_408_119">
          <rect width="100" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface StarButtonProps {
  children: ReactNode;
  lightWidth?: number;
  duration?: number;
  lightColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  className?: string;
  onClick?: () => void;
}

export function StarButton({
  children,
  lightWidth = 110,
  duration = 3,
  lightColor = "#FAFAFA",
  backgroundColor = "currentColor",
  borderWidth = 2,
  className,
  onClick,
  ...props
}: StarButtonProps) {
  const pathRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const div = pathRef.current;
      div.style.setProperty(
        "--path",
        `path('M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0')`
      );
    }
  }, []);

  return (
    <button
      style={
        {
          "--duration": duration,
          "--light-width": `${lightWidth}px`,
          "--light-color": lightColor,
          "--border-width": `${borderWidth}px`,
          isolation: "isolate",
        } as CSSProperties
      }
      ref={pathRef}
      onClick={onClick}
      className={cn(
        "relative z-[3] overflow-hidden px-3 py-1.5 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 group/star-button",
        className
      )}
      {...props}
    >
      <div
        className="absolute aspect-square inset-0 animate-star-btn bg-[radial-gradient(ellipse_at_center,var(--light-color),transparent,transparent)]"
        style={
          {
            offsetPath: "var(--path)",
            offsetDistance: "0%",
            width: "var(--light-width)",
          } as CSSProperties
        }
      />
      <div
        className="absolute inset-0 border-white/20 z-[4] overflow-hidden rounded-[inherit]"
        style={{ borderWidth: "var(--border-width)" }}
        aria-hidden="true"
      >
        <StarBackground color={backgroundColor} />
      </div>
      <span className="z-10 relative">{children}</span>
    </button>
  );
}
