import React, { useState } from "react";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { itemsCollection } from "../firebase";
import { containsProfanity } from "../utils/wordFilter";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Format currency field to accept digits and decimals only
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and single decimal point
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setPrice(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedTitle = title.trim();
    const trimmedSeller = seller.trim();
    const trimmedDescription = description.trim();
    const trimmedImageUrl = imageUrl.trim();

    // Edge case validation check
    if (!trimmedTitle) {
      setErrorMsg("Please enter a valid title.");
      return;
    }
    if (containsProfanity(trimmedTitle)) {
      setErrorMsg("Title contains profane language.");
      return;
    }
    if (containsProfanity(trimmedSeller)) {
      setErrorMsg("Seller name contains profane language.");
      return;
    }
    if (containsProfanity(trimmedDescription)) {
      setErrorMsg("Description contains profane language.");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrorMsg("Please enter a valid numeric price.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(itemsCollection, {
        title: trimmedTitle,
        price: `$${parseFloat(price).toFixed(2)}`,
        description: trimmedDescription,
        seller: trimmedSeller,
        imageUrl: trimmedImageUrl || null,
        timestamp: serverTimestamp(),
      });

      // Clear fields & state
      setTitle("");
      setPrice("");
      setDescription("");
      setSeller("");
      setImageUrl("");
      onPostCreated();
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setErrorMsg("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} role="dialog" aria-modal="true">
      <div className="form-container">
        <div className="modal-header">
          <h2>Create New Listing</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {errorMsg && <div className="form-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title-input" className="sr-only">Title</label>
          <input
            id="title-input"
            type="text"
            placeholder="Item Title (Max 50 chars)"
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <span className="char-counter">{title.length}/50</span>

          <label htmlFor="price-input" className="sr-only">Price</label>
          <input
            id="price-input"
            type="text"
            inputMode="decimal"
            placeholder="Price ($ Dollar Amount) e.g. 15.00"
            value={price}
            maxLength={9}
            onChange={handlePriceChange}
            required
          />

          <label htmlFor="seller-input" className="sr-only">Seller Name</label>
          <input
            id="seller-input"
            type="text"
            placeholder="Seller Name (Max 32 chars)"
            value={seller}
            maxLength={32}
            onChange={(e) => setSeller(e.target.value)}
            required
          />
          <span className="char-counter">{seller.length}/32</span>

          <label htmlFor="image-input" className="sr-only">Image URL</label>
          <input
            id="image-input"
            type="text"
            placeholder="Image URL (Optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <label htmlFor="desc-input" className="sr-only">Description</label>
          <textarea
            id="desc-input"
            placeholder="Description (Max 175 chars)"
            rows={4}
            value={description}
            maxLength={175}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="char-counter">{description.length}/175</span>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </div>
  );
};