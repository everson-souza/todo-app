import {createContext, ReactNode, useState, useContext} from 'react';


type Todo = {
  id: number;
  text: string;
  completed: boolean;

};

type TodoContextData = {
  todoList: Todo[];
}

export const TodoContext = createContext({} as TodoContextData);

export const useTodoContext = () => {
  return useContext(TodoContext);
}