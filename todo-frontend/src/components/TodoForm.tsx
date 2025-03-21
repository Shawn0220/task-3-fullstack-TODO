import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewTodo } from '../store/todoSlice';
import { AppDispatch } from '../store/store';

const TodoForm: React.FC = () => {
  const [task, setTask] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task.trim() === '') {
      setError('task description can not be empty');
      return;
    }
    
    try {
      await dispatch(addNewTodo({ task, status })).unwrap();
      setTask('');
      setStatus('Pending');
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('failed to add task');
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Add new TODO Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task" className="block mb-1">Task Description:</label>
          <input
            id="task"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Please enter the task..."
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block mb-1">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Pending' | 'Completed')}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        {error && <div className="text-red-500">{error}</div>}
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TodoForm;