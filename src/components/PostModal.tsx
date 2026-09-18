import React, { useState } from "react";
import { addDoc } from "firebase/firestore";
import { itemsCollection } from "../firebase";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seller, setSeller] = useState("");

  if (!isOpen) return null;

  const formatCurrency = (input: string): string => {
    const cleaned = input.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? "$0.00" : "$" + num.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newItem = {
      title,
      price: formatCurrency(price),
      imageUrl,
      description,
      seller,
      timestamp: new Date()
    };

    try {
      await addDoc(itemsCollection, newItem);
      setTitle("");
      setPrice("");
      setImageUrl("");
      setDescription("");
      setSeller("");
      onClose();
      onPostCreated();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div 
      className="modal-overlay active" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="form-container">
        <div className="modal-header">
          <h2 id="modal-title">Post an Item</h2>
          <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close form modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="sr-only">Item Name</label>
          <input
            id="title"
            type="text"
            placeholder="Item Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="price" className="sr-only">Price</label>
          <input
            id="price"
            type="text"
            placeholder="Price (e.g. $15 or Free)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label htmlFor="imageUrl" className="sr-only">Image URL (optional)</label>
          <input
            id="imageUrl"
            type="url"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <label htmlFor="description" className="sr-only">Description</label>
          <textarea
            id="description"
            placeholder="Short description..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="seller" className="sr-only">Your Name / Contact Info</label>
          <input
            id="seller"
            type="text"
            placeholder="Your Name / Contact Info"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            required
          />

          <button type="submit">Pin to Board</button>
        </form>
      </div>
    </div>
  );
};