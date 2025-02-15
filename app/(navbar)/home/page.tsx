"use client";
import { CompletedIcon, TaskIcon, TodoIcon } from "@/app/assets/icons";
import Task from "./Task";
import { useEffect, useState } from "react";
import { Button, FormControl, FormLabel, Input, ModalClose, Radio, RadioGroup, Textarea } from "@mui/joy";
import { Add, CheckCircle } from "@mui/icons-material";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { TaskType } from "./types";
import { addTask, fetchTask } from "@/app/actions/api";
import { getAuth } from "@/app/actions/cookie";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Plugin } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { parseJwt } from "@/app/actions/utils";

interface ExtendedChartOptions extends ChartOptions<"doughnut"> {
  centerText?: string;
}

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Register a global plugin to draw center text.
// This plugin will look for a "centerText" property in the chart options.
const centerTextPlugin: Plugin = {
  id: "centerTextPlugin",
  beforeDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const centerText = (chart.options as any).centerText as string;
    if (centerText) {
      ctx.save();
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(centerText, width / 2, height / 2);
      ctx.restore();
    }
  },
};
ChartJS.register(centerTextPlugin);

type GroupedTask = {
  date: Date;
  formatted: string;
  todo: TaskType[];
  completed: TaskType[];
};

const Home = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTask[]>([]);
  const [user, setUser] = useState<string>("");
  // State to control the modal open/close
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // State to store form values for a new task
  const [newTask, setNewTask] = useState<{
    heading: string;
    content: string;
    priority: string;
    createdOn: string;
    deadline: string;
  }>({
    heading: "",
    content: "",
    priority: "Medium",
    createdOn: new Date().toISOString().split("T")[0],
    deadline: new Date().toISOString().split("T")[0],
  });

  // Helper function to format date as "DD MMM YYYY"
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch tasks from your API
  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const token = await getAuth();
        if (token) {
          const res = await fetchTask(token.value);
          setUser((await parseJwt(token.value)).name);
          const res2 = res.map(
            (task: {
              heading: string;
              content: string;
              priority: string;
              createdAt: string;
              deadline: string;
              _id: string;
              completed?: boolean;
            }) => ({
              ...task,
              createdOn: new Date(task.createdAt),
              deadline: new Date(task.deadline),
            })
          );
          setTasks(res2);
        }
      } catch (error) {
        console.error("Error fetching tasks ", error);
      }
    };
    fetchTasksData();
  }, [refresh]);

  // Group tasks by deadline date
  useEffect(() => {
    const temp: Record<string, { todo: TaskType[]; completed: TaskType[] }> = {};
    tasks.forEach((task) => {
      const key = task.deadline.toISOString().split("T")[0];
      if (!temp[key]) {
        temp[key] = { todo: [], completed: [] };
      }
      if (task.completed) {
        temp[key].completed.push(task);
      } else {
        temp[key].todo.push(task);
      }
    });

    const sortedGroupedTasks: GroupedTask[] = Object.keys(temp)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((key) => ({
        date: new Date(key),
        formatted: formatDate(new Date(key)),
        todo: temp[key].todo,
        completed: temp[key].completed,
      }));

    setGroupedTasks(sortedGroupedTasks);
  }, [tasks]);

  // Handler for the add task form submission
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task: TaskType = {
      _id: "",
      createdOn: new Date(newTask.createdOn),
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

  // ------------------
  //  Donut Chart Logic (Chart.js)
  // ------------------
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalTasks - completedCount;

  // Calculate percentages
  const completedPercentage = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;
  const pendingPercentage = totalTasks ? Math.round((pendingCount / totalTasks) * 100) : 0;

  // Chart.js data for the "Completed" donut
  const completedData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Completed",
        data: [completedCount, pendingCount],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  // Chart.js data for the "Pending" donut
  const pendingData = {
    labels: ["Pending", "Remaining"],
    datasets: [
      {
        label: "Pending",
        data: [pendingCount, completedCount],
        backgroundColor: ["#F44336", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  // Common donut chart options
  const donutOptions: ExtendedChartOptions = {
    cutout: "75%", // controls how 'thick' the donut is
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
    // We'll set "centerText" dynamically via the options below.
  };

  return (
    <div className="p-10">
      <div className="text-3xl text-slate-800 font-medium">Welcome back, {user} 👋</div>

      <div className="flex gap-x-12 px-4">
        {/* TODO Section */}
        <div className="mt-8 w-1/2 border rounded-2xl shadow-md p-6">
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

        {/* COMPLETED + Donut Charts Section */}
        <div className="w-1/2 ">
          {/* Donut Charts Section */}
          <div className="my-8 p-4 border rounded-2xl shadow-md">
            <div className="inline-flex gap-x-3 text-red-500 font-medium mt-2">
              <TaskIcon /> To-Do
            </div>
            <div className="flex items-center justify-center gap-8 mt-4">
              {/* Completed Donut */}
              <div className="flex flex-col items-center">
                <div style={{ width: 160, height: 160 }}>
                  <Doughnut data={completedData} options={{ ...donutOptions, centerText: `${completedPercentage}%` } as never} />
                </div>
                <div className="text-center mt-2">
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>

              {/* Pending Donut */}
              <div className="flex flex-col items-center">
                <div style={{ width: 160, height: 160 }}>
                  <Doughnut data={pendingData} options={{ ...donutOptions, centerText: `${pendingPercentage}%` } as never} />
                </div>
                <div className="text-center mt-2">
                  <span className="font-medium text-red-600">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* COMPLETED Section */}
          <div className="mt-8 border rounded-2xl shadow-md p-6">
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
                <div className="w-full text-center text-xl mt-4 text-slate-600 font-medium">No Completed Task</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new task */}
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
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
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
