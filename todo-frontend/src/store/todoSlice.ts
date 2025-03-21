import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoFormData } from '../types/types';
import { todoApi } from '../api/todoApi';

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    return await todoApi.getAllTodos();
  }
);

export const addNewTodo = createAsyncThunk(
  'todos/addNewTodo',
  async (todoData: TodoFormData) => {
    const response = await todoApi.addTodo(todoData);
    // 为了让Redux能够立即更新状态，我们需要返回完整的Todo对象
    // 因为API只返回id和消息，我们需要构造一个完整的Todo对象
    return {
      id: response.id!,
      task: todoData.task,
      status: todoData.status,
    } as Todo;
  }
);

export const updateExistingTodo = createAsyncThunk(
  'todos/updateExistingTodo',
  async ({ id, todoData }: { id: string; todoData: Partial<TodoFormData> }) => {
    await todoApi.updateTodo(id, todoData);
    // 返回更新后的数据以便Redux更新状态
    return { id, ...todoData };
  }
);

export const deleteTodoItem = createAsyncThunk(
  'todos/deleteTodoItem',
  async (id: string) => {
    await todoApi.deleteTodo(id);
    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取所有TODO
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch TODO list';
      })
      
      // 添加TODO
      .addCase(addNewTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      
      // 更新TODO
      .addCase(updateExistingTodo.fulfilled, (state, action) => {
        const { id, ...changes } = action.payload;
        const existingTodo = state.todos.find(todo => todo.id === id);
        if (existingTodo) {
          Object.assign(existingTodo, changes);
        }
      })
      
      // 删除TODO
      .addCase(deleteTodoItem.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.todos = state.todos.filter(todo => todo.id !== id);
      });
  },
});

export default todoSlice.reducer;