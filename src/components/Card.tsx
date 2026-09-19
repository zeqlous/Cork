import React, { useState, useMemo } from "react";
import type { Post } from "../types";
import { Timestamp } from "firebase/firestore";

interface CardProps {
  item: Post;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='225' viewBox='0 0 300 225'><rect width='100%' height='100%' fill='%232b2b2b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='monospace' font-size='16'>NO IMAGE</text></svg>";

const getOptimizedUrl = (url?: string): string => {
  if (!url || !url.trim()) return FALLBACK_IMAGE;

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=500&output=webp&q=80`;
};

const formatDate = (ts?: Timestamp | Date | number): string => {
  if (!ts) return "Recently";
  let dateObj: Date;
  if (ts instanceof Timestamp) {
    dateObj = ts.toDate();
  } else if (ts instanceof Date) {
    dateObj = ts;
  } else {
    dateObj = new Date(ts);
  }
  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const Card: React.FC<CardProps> = React.memo(({ item }) => {
  // Memoize image URL calculation so reference stays stable between snapshot renders
  const initialUrl = useMemo(() => getOptimizedUrl(item.imageUrl), [item.imageUrl]);
  
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);
  const [hasTriedRaw, setHasTriedRaw] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleError = () => {
    if (!hasTriedRaw && item.imageUrl && item.imageUrl.trim()) {
      setHasTriedRaw(true);
      let rawUrl = item.imageUrl.trim();
      if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
        rawUrl = `https://${rawUrl}`;
      }
      setImgSrc(rawUrl);
    } else {
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div
      className={`card-container ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label={`Polaroid for ${item.title || "item"}. Click to flip.`}
    >
      <div className="card-inner">
        {/* FRONT FACE */}
        <div className="card-face card-front">
          <div className="image-container">
            <img
              src={imgSrc}
              alt={item.title ? `Image for ${item.title}` : "Item listing"}
              loading="lazy"
              decoding="async"
              className={isLoaded ? "loaded" : ""}
              onLoad={() => setIsLoaded(true)}
              onError={handleError}
            />
          </div>
          <h3>{item.title || "Untitled Item"}</h3>
          <p className="price">{item.price || "$0.00"}</p>
          <div className="seller">Seller: {item.seller || "Anonymous"}</div>
          <span className="flip-hint">Click to flip ↺</span>
        </div>

        {/* BACK FACE */}
        <div className="card-face card-back">
          <h3>{item.title || "Untitled Item"}</h3>
          <div className="description">
            <p>{item.description || "No description provided."}</p>
          </div>
          <div className="meta-info">
            <div>Seller: {item.seller || "Anonymous"}</div>
            <span className="date">Posted: {formatDate(item.timestamp)}</span>
            <span className="flip-hint" style={{ display: "block", marginTop: "6px" }}>
              Click to return ↺
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});