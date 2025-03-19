import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskType } from '@/app/(navbar)/home/types'; // adjust the import path if needed

interface TaskState {
  tasks: TaskType[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set the entire tasks list
    setTasks(state, action: PayloadAction<TaskType[]>) {
      state.tasks = action.payload;
    },
    // Add a new task
    addTask(state, action: PayloadAction<TaskType>) {
      state.tasks.push(action.payload);
    },
    // You can add additional reducers (edit, delete, etc.)
    // editTask, removeTask, etc.
  },
});

export const { setTasks, addTask } = taskSlice.actions;
export default taskSlice.reducer;
