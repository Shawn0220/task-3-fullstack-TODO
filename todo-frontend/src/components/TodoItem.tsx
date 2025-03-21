import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types/types';
import { updateExistingTodo, deleteTodoItem } from '../store/todoSlice';
import { AppDispatch } from '../store/store';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);

  const handleStatusToggle = () => {
    const newStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
    dispatch(updateExistingTodo({
      id: todo.id,
      todoData: { status: newStatus }
    }));
  };

  const handleDelete = () => {
    dispatch(deleteTodoItem(todo.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask.trim() !== '') {
      dispatch(updateExistingTodo({
        id: todo.id,
        todoData: { task: editedTask }
      }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(todo.task);
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded mb-2 bg-white shadow-sm">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="border rounded p-2 w-full"
            autoFocus
          />
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              save
            </button>
            <button 
              onClick={handleCancel}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.status === 'Completed'}
              onChange={handleStatusToggle}
              className="h-5 w-5"
            />
            <span className={`text-lg ${todo.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
              {todo.task}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              edit
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;