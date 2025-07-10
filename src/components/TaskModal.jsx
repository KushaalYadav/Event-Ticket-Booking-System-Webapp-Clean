import React, { useState, useEffect } from 'react';

const TaskModal = ({ columnId, task, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [desc, setDesc] = useState(task?.desc || '');

  useEffect(() => {
    setTitle(task?.title || '');
    setDesc(task?.desc || '');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: task?.id, title, desc });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">{task ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex justify-between items-center">
            {task && (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
