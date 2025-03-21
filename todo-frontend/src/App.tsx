import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">TODO APP</h1>
        <TodoForm />
        <TodoList />
      </div>
    </Provider>
  );
};

export default App;