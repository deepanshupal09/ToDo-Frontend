export type TaskType = {
  _id: string;
  createdOn: Date;
  priority: string;
  heading: string;
  content: string;
  completed: boolean;
  deadline: Date;
};
