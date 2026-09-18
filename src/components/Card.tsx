import React, { useState } from "react";

interface Item {
  title: string;
  price: string;
  imageUrl?: string;
  description?: string;
  seller?: string;
}

const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";

const getOptimizedUrl = (url?: string): string => {
  if (!url) return FALLBACK_IMAGE;

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=500&output=webp&q=80`;
};

export const Card: React.FC<{ item: Item }> = ({ item }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => getOptimizedUrl(item.imageUrl));
  const [hasTriedRaw, setHasTriedRaw] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    if (!hasTriedRaw && item.imageUrl) {
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
    <div className="card">
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
      <div className="card-content">
        <h3>{item.title}</h3>
        <p className="price">{item.price}</p>
        <p>{item.description}</p>
        <small>Seller: {item.seller}</small>
      </div>
    </div>
  );
};