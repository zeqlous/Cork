import React, { useState } from "react";
import type { Post } from "../types";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x150/d0d2d1/1a1a1a?text=NO+IMAGE";

interface CardProps {
  item: Post;
}

export const Card: React.FC<CardProps> = ({ item }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : FALLBACK_IMAGE
  );

  return (
    <div className="card">
      <h3>{item.title}</h3>
      <div className="price">{item.price}</div>
      <img
        src={imgSrc}
        alt={item.title}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />
      <p>{item.description}</p>
      <div className="seller">posted_by: {item.seller}</div>
    </div>
  );
};