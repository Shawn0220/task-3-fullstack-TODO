import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchTodos } from '../store/todoSlice'
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, error } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="flex justify-center p-8"><div className="text-xl">Loading...</div></div>;
  }

  if (status === 'failed') {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">TODO Task List</h2>
      
      {todos.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded text-center">No TODO, please add more TODO task XD</div>
      ) : (
        <div>
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;