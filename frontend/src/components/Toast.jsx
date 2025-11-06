import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 1800); // auto close
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="toast">
      {message}
    </div>
  );
}
