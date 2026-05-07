"use client";

import { useNews } from '../context/NewsContext';

export default function ToastContainer() {
  const { toasts } = useNews();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
