import React from "react";
import { Todo } from "../app/todo";
import { TodoItem } from "./todo-item";
import List from '@mui/material/List';

const TodoList = ({
   todos,
   onSelectTodo,
   onUpdateTodo,
   onDeleteTodo,
}: {
   todos: Todo[];
   onSelectTodo: (id?: number) => void;
   onUpdateTodo: (todo: Todo) => void;
   onDeleteTodo: (id?: number) => void;
}) => {
  return (
    <List sx={{ width: '100%', maxWidth: 600, marginTop: '20px', bgcolor: 'background.paper' }}>
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onSelect={() => onSelectTodo(todo.id)}
          onUpdate={(update) => onUpdateTodo(update)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </List>
  );
};
export default TodoList;