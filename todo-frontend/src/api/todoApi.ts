import { Todo, TodoFormData, ApiResponse } from '../types/types';

const BASE_URL = "http://127.0.0.1:5000/todos";

export const todoApi = {
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取TODO列表失败');
      }
      return await response.json();
    } catch (error) {
      console.error('获取TODO列表错误:', error);
      throw error;
    }
  },

  async addTodo(todoData: TodoFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '添加TODO失败');
      }
      
      return data;
    } catch (error) {
      console.error('添加TODO错误:', error);
      throw error;
    }
  },

  async updateTodo(id: string, todoData: Partial<TodoFormData>): Promise<ApiResponse> {
    try {
      if (!todoData.task && !todoData.status) {
        throw new Error('至少需要更新一个字段');
      }

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新TODO失败');
      }
      
      return data;
    } catch (error) {
      console.error('更新TODO错误:', error);
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除TODO失败');
      }
      
      return data;
    } catch (error) {
      console.error('删除TODO错误:', error);
      throw error;
    }
  },
};