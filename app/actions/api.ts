"use server";

import { TaskType } from "../(navbar)/home/types";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/user/login`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const signup = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/user/signup`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchTask = async (token: string) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/todo/fetchAllTasks`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addTask = async (token: string, task: TaskType) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/todo/addTask`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
      body: JSON.stringify(task),
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const editTask = async (token: string, task: TaskType) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/todo/editTask`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        taskid: task._id
      },
      cache: "no-cache",
      body: JSON.stringify(task),
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTask = async (token: string, taskId: string) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/todo/deleteTask`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        taskid: taskId
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
