import React, { useEffect, useState } from "react";
import { Todo, TodoUpdate } from "../app/todo";
import { TodoItem } from "./todo-item";
import List from '@mui/material/List';
import { GetStaticProps } from "next";
import { api } from "@/services/api";

const TodoList = ({
   todos,
   onSelectTodo,
   onCreateTodo,
   onUpdateTodo,
   onDeleteTodo,
}: {
   todos: Todo[];
   onSelectTodo: (id: number) => void;
   onCreateTodo: (todo: Todo) => void;
   onUpdateTodo: (todo: Todo) => void;
   onDeleteTodo: (id: number) => void;
}) => {
  return (
    <List sx={{ width: '100%', maxWidth: 600, marginTop: '20px', bgcolor: 'background.paper' }}>
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onSelect={() => onSelectTodo(todo.id)}
          onCreate={(update) => onCreateTodo(update)}
          onUpdate={(update) => onUpdateTodo(update)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </List>
  );
};
export default TodoList;