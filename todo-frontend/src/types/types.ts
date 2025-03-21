export interface Todo {
    id: string;
    task: string;
    status: "Pending" | "Completed";
  }
  
  export interface TodoFormData {
    task: string;
    status: "Pending" | "Completed";
  }
  
  export interface ApiResponse {
    message: string;
    id?: string;
  }
  
  export interface ApiError {
    error: string;
  }