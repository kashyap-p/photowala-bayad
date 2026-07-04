"use client";

import { useState, type ImgHTMLAttributes } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * An <img> that gracefully handles broken/invalid URLs.
 * Instead of the browser's default broken-image icon, shows a clean
 * placeholder with a camera icon and the original URL.
 */
export function SmartImage({ src, alt, className, ...rest }: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-foreground/[0.04] text-muted-foreground",
          className
        )}
        title={`Could not load: ${src}`}
      >
        <ImageIcon className="h-6 w-6 opacity-40" />
        <span className="max-w-[80%] truncate px-2 text-center font-mono-label text-[9px] uppercase tracking-widest opacity-50">
          {src.split("/").pop() || "image"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={className}
      {...rest}
    />
  );
}
