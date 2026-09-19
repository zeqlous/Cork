import React from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} role="dialog" aria-modal="true">
      <div className="form-container">
        <div className="modal-header">
          <h2>Board Guide & Tips</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close help modal">
            &times;
          </button>
        </div>

        <ul className="help-list">
          <li>
            <strong>Flip Polaroids:</strong> Click or tap on any item card 
            on the board to flip it over and read its detailed description 
            and posting date.
          </li>
          <li>
            <strong>Create a Listing:</strong> Click the<strong> "+" </strong>
            button on the bottom-right corner to post your own item onto the 
            public cork board.
          </li>
          <li>
            <strong>Image Links:</strong> You can paste direct image URLs 
            (from Unsplash, Imgur, etc.). If a link breaks, a local fallback 
            card will automatically display.
          </li>
          <li>
            <strong>Themes:</strong> Use the dropdown menu in the top bar to 
            switch between themes. <em>[More to come, hopefully]</em>
          </li>
        </ul>

        <button type="button" onClick={onClose} style={{ marginTop: "15px" }}>
          Got It!
        </button>
      </div>
    </div>
  );
};