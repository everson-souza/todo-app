// This file defines our Todo domain type in TypeScript, and a related helper
// function to get all Todos. You'd typically have one of these files for each
// domain object in your application.


export type Todo = {
  id?: number;
  text?: string;
  completed: boolean;
  deadline?: Date;
};

export type TodoUpdate = Partial<Todo> & Pick<Todo, "id">;
