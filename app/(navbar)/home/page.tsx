"use client";
import { CompletedIcon, TodoIcon } from "@/app/assets/icons";
import Task from "./Task";
import { useEffect, useState, useMemo } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalClose,
  Radio,
  RadioGroup,
  Textarea,
} from "@mui/joy";
import { Add, CheckCircle } from "@mui/icons-material";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { TaskType } from "./types";
import { addTask, fetchTask } from "@/app/actions/api";
import { getAuth } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setTasks } from "@/store/slices/taskSlice";
import DonutCharts from "./DonutCharts";

// type GroupedTask = {
//   date: Date;
//   formatted: string;
//   todo: TaskType[];
//   completed: TaskType[];
// };

const Home = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Local state for new task form values
  const [newTask, setNewTask] = useState<{
    heading: string;
    content: string;
    priority: string;
    createdAt: string;
    deadline: string;
  }>({
    heading: "",
    content: "",
    priority: "Medium",
    createdAt: new Date().toISOString().split("T")[0],
    deadline: new Date().toISOString().split("T")[0],
  });

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const token = await getAuth();
        if (token) {
          const res = await fetchTask(token.value);
          const parsedJwt = await parseJwt(token.value);
          setUser(parsedJwt.name);

          const res2 = res.map(
            (task: {
              heading: string;
              content: string;
              priority: string;
              createdAt: string;
              deadline: string;
              id: string;
              completed?: boolean;
            }) => ({
              ...task,
              createdAt: new Date(task.createdAt).toISOString(),
              deadline: new Date(task.deadline).toISOString(),
              id: task.id,
            })
          );
          dispatch(setTasks(res2));
        }
      } catch (error) {
        console.error("Error fetching tasks ", error);
      }
    };
    fetchTasksData();
  }, [refresh, dispatch]);

  const groupedTasks = useMemo(() => {
    const temp: Record<string, { todo: TaskType[]; completed: TaskType[] }> = {};
    tasks.forEach((task) => {
      const deadlineDate = new Date(task.deadline);
      const key = deadlineDate.toISOString().split("T")[0];
      if (!temp[key]) {
        temp[key] = { todo: [], completed: [] };
      }
      if (task.completed) {
        temp[key].completed.push(task);
      } else {
        temp[key].todo.push(task);
      }
    });
    return Object.keys(temp)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((key) => ({
        date: new Date(key),
        formatted: formatDate(new Date(key)),
        todo: temp[key].todo,
        completed: temp[key].completed,
      }));
  }, [tasks]);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task = {
      createdAt: new Date(newTask.createdAt),
      priority: newTask.priority,
      heading: newTask.heading,
      content: newTask.content,
      completed: false,
      deadline: new Date(newTask.deadline),
    };

    try {
      const token = await getAuth();
      if (token) {
        setLoading(true);

        await addTask(token.value, task);
        setRefresh(!refresh);
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error adding task: ", error);
      setLoading(false);
    }
  };


  return (
    <div className="p-10 max-lg:px-4">
      <div className="text-3xl text-slate-800 font-medium">Welcome back, {user} 👋</div>

      <div className="flex max-lg:flex-col-reverse gap-x-12 px-4 max-lg:px-0">
        {/* To-Do Section */}
        <div className="mt-8 w-1/2 max-lg:w-full border rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div className="inline-flex gap-x-3 text-red-500 font-medium mt-2">
              <TodoIcon /> To-Do
            </div>
            <Button variant="outlined" size="sm" startDecorator={<Add />} color="danger" onClick={() => setOpen(true)}>
              Add Task
            </Button>
          </div>
          <div className="mt-3">
            {groupedTasks.map((group) => (
              <div key={group.formatted} className="mb-4">
                {group.todo.length > 0 && <div className="text-sm font-semibold">{group.formatted}</div>}
                <div className="ml-3">
                  {group.todo.map((task, index) => (
                    <Task key={index} task={task} refresh={refresh} setRefresh={setRefresh} />
                  ))}
                </div>
              </div>
            ))}
            {groupedTasks.reduce((total, group) => total + group.todo.length, 0) === 0 && (
              <div className="w-full text-center text-xl mt-4 text-slate-600 font-medium">No Tasks Yet</div>
            )}
          </div>
        </div>

        {/* Completed + Donut Charts Section */}
        <div className="w-1/2 max-lg:w-full">
          <DonutCharts completedCount={tasks.filter((t) => t.completed).length} pendingCount={tasks.filter((t) => !t.completed).length} />

          <div className="mt-8 border rounded-2xl shadow-md p-6 max-lg:w-full">
            <div className="inline-flex gap-x-3 text-green-500 font-medium mt-2">
              <CompletedIcon /> Completed Tasks
            </div>
            <div className="mt-3">
              {groupedTasks.map((group) => (
                <div key={group.formatted} className="mb-4">
                  {group.completed.length > 0 && <div className="text-sm font-semibold">{group.formatted}</div>}
                  <div className="ml-3">
                    {group.completed.map((task, index) => (
                      <Task key={index} task={task} refresh={refresh} setRefresh={setRefresh} />
                    ))}
                  </div>
                </div>
              ))}
              {groupedTasks.reduce((total, group) => total + group.completed.length, 0) === 0 && (
                <div className="w-full text-center text-xl mt-4 text-slate-600 font-medium">No Completed Tasks</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding a New Task */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog aria-labelledby="add-task-title" aria-describedby="add-task-description" sx={{ width: 800 }}>
          <ModalClose />
          <form onSubmit={handleAddTask}>
            <Typography id="add-task-title" component="h2" className="font-semibold">
              Add New Task
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
                  sx={{ display: "flex", flexDirection: "row", gap: 3, alignItems: "center" }}
                >
                  <Radio checkedIcon={<CheckCircle className="text-red-500" />} value="high" label="High" sx={{ display: "flex", alignItems: "center", gap: 1 }} />
                  <Radio checkedIcon={<CheckCircle className="text-blue-500" />} value="medium" label="Medium" sx={{ display: "flex", alignItems: "center", gap: 1 }} />
                  <Radio checkedIcon={<CheckCircle className="text-green-500" />} value="low" label="Low" sx={{ display: "flex", alignItems: "center", gap: 1 }} />
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
              <Button type="submit" loading={loading} variant="solid" color="danger">
                Add Task
              </Button>
            </div>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Home;
