"use client";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { TaskType } from "./types";
import { CheckCircle, Delete, Edit } from "@mui/icons-material";
import React, { useState } from "react";
import { deleteTask, editTask } from "@/app/actions/api";
import { getAuth } from "@/app/actions/cookie";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Task({
  task,
  refresh,
  setRefresh,
}: {
  task: TaskType;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState<{
    _id: string;
    heading: string;
    content: string;
    priority: string;
    createdOn: string;
    deadline: string;
    completed: boolean;
  }>({
    _id: task._id,
    heading: task.heading,
    content: task.content,
    priority: task.priority,
    createdOn: task.createdOn.toISOString().split("T")[0],
    deadline: task.deadline.toISOString().split("T")[0],
    completed: task.completed,
  });

  type Priority = string;

  const colors: Record<Priority, string> = {
    high: "text-red-500",
    medium: "text-blue-500",
    low: "text-green-500",
  };

  const handleEdit = async () => {
    try {
      console.log("editing");
      const task: TaskType = {
        _id: newTask._id,
        createdOn: new Date(newTask.createdOn),
        priority: newTask.priority,
        heading: newTask.heading,
        content: newTask.content,
        completed: newTask.completed,
        deadline: new Date(newTask.deadline),
      };

      const token = await getAuth();
      if (token) {
        setLoading(true);
        await editTask(token.value, task);
        setOpen(false);
        setLoading(false);
        setRefresh(!refresh);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error editing task: ", error);
    }
  };
  const handleCheckBox = async (completed: boolean) => {
    try {
      console.log("editing");
      const task: TaskType = {
        _id: newTask._id,
        createdOn: new Date(newTask.createdOn),
        priority: newTask.priority,
        heading: newTask.heading,
        content: newTask.content,
        completed: completed,
        deadline: new Date(newTask.deadline),
      };

      const token = await getAuth();
      if (token) {
        setLoading(true);
        await editTask(token.value, task);
        setOpen(false);
        setLoading(false);
        setRefresh(!refresh);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error editing task: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getAuth();
      if (token) {
        setLoading(true);
        await deleteTask(token.value, task._id);
        setLoading(false);
        setRefresh(!refresh);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting task: ", error);
    }
  };
  return (
    <>
      <div className="px-4 mt-4 w-full border py-4 rounded-xl cursor-pointer">
        <div className="flex justify-between">
          <div className=" inline-flex gap-x-4">
            <Checkbox
              onChange={(e) => {
                handleCheckBox(e.target.checked);
              }}
              checked={task.completed}
              color="danger"
            />
            <div className=" font-bold">{task.heading}</div>
          </div>
          {!task.completed && (
            <div>
              <IconButton
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Edit fontSize="small" className="text-slate-400" />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <Delete fontSize="small" className="text-slate-400" />
              </IconButton>
            </div>
          )}
        </div>
        <div className="px-10 text-slate-800">
          {task.content}
          <div className="flex text-xs justify-between mt-4">
            <div className="capitalize">Priority: <span className={`${colors[task.priority]} font-medium`}>{task.priority}</span></div>
            <div>Created On: {task.createdOn.toDateString()}</div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog aria-labelledby="add-task-title" aria-describedby="add-task-description" sx={{ width: 800 }}>
          <ModalClose />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <Typography id="add-task-title" component="h2" className="font-semibold">
              Edit Task
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  size="lg"
                  required
                  value={newTask.heading}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, heading: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Content</FormLabel>
                <Textarea
                  size="lg"
                  required
                  minRows={3}
                  value={newTask.content}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, content: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <RadioGroup
                  orientation="horizontal"
                  defaultValue="medium"
                  value={newTask.priority}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3, // Add spacing between radio buttons
                    alignItems: "center", // Ensures vertical alignment
                  }}
                >
                  <Radio
                    checkedIcon={<CheckCircle className="text-red-500" />}
                    value="high"
                    label="High"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  />
                  <Radio
                    checkedIcon={<CheckCircle className="text-blue-500" />}
                    value="medium"
                    label="Medium"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  />
                  <Radio
                    checkedIcon={<CheckCircle className="text-green-500" />}
                    value="low"
                    label="Low"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Deadline Date</FormLabel>
                <Input
                  required
                  size="lg"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, deadline: e.target.value }))}
                />
              </FormControl>
            </Stack>
            <div className="mt-8 flex justify-end gap-x-3">
              <Button variant="plain" onClick={() => setOpen(false)} color="danger">
                Cancel
              </Button>
              <Button loading={loading} type="submit" variant="solid" color="danger">
                Edit Task
              </Button>
            </div>
          </form>
        </ModalDialog>
      </Modal>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
