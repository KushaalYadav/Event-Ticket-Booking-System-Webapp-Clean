// src/components/Modal.jsx
import React, { useState, useEffect } from 'react';

export const Modal = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(event?.title || '');

  useEffect(() => {
    setTitle(event?.title || '');
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...event, title });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {event?.id ? 'Edit Event' : 'Add Event'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          />

          <div className="flex justify-between">
            {event?.id && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;