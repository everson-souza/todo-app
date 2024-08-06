"use client"

import Image from "next/image";
import TodoList from "../components/todo-list";
import TodoDialog from "../components/todo-dialog";
import { useEffect, useState } from "react";
import { Todo, TodoUpdate } from "./../app/todo";
import { Alert, Backdrop, CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from '@mui/icons-material/Check';
import { api } from "@/services/api";


export default function Main() {

  const [todo, setTodo] = useState<Todo>();
  const [todos, setTodos] = useState<Todo[]>([]);

  //API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleAPIRead();
  }, []);


  const handleAPIRead = async () => {
    try {
      setLoading(true);
      const response = await api.get('/todos');
      setLoading(false);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAPICreate = async (todo:Todo) => {
    try {
      let resposta = await api.post('todos', { ...todo });
      console.log(resposta.status);
      alert('Data created successfully!');
      // Optionally, fetch and update the displayed data
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };


  const handleAPIUpdate = async (todo:Todo) => {
    try {
      await api.put(`todos/${todo.id}`, { ...todo });
      alert('Data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const handleAPIDelete = async (id:number) => {
    try {
      await api.delete('todos/'+id);
      alert('Data deleted successfully!');
      setTodos(todos => todos.filter((item) => item.id !== id));
      
      // Optionally, fetch and update the displayed data
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  //// END API


  const handleSelectTodo = (id: number) => {
    setTodo(todos.find((item) => item.id == id));
    console.log(todo);
    setDialogState(true);
  };

  const handleCreateTodo = (todo: Todo) => {
    handleAPICreate(todo);
    console.log(todo);
  }

  const handleUpdateTodo = (todo: Todo) => {
    handleAPIUpdate(todo);
    console.log(todo);
  }
  
  const handleDeleteTodo = (id: number) => {
    handleAPIDelete(id);
    //
  };

  // Dialog functions  
  const [open, setDialogState] = useState(false);

  const handleClickOpen = () => {
    setTodo(undefined);
    setDialogState(true);
  };

  const handleClickClose = () => {
    setTodo(undefined);
    setDialogState(false);
  };

  return (    
    <div>
      {/* <Alert style={{width: '100%'}} icon={<CheckIcon fontSize="inherit" />} severity="success">
        Here is a gentle confirmation that your action was successful.
      </Alert> */}

      <div style={{width: '600px'}}>
        
        <h1 style={{textAlign:"center"}}>TO-DO LIST</h1>
        <Fab sx={{ marginLeft: "auto", display:"flex" }} color="primary" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
        <TodoDialog 
          todo = {todo}
          state = {open}
          onCreateTodo = {(todo: Todo) => handleCreateTodo(todo)}
          onUpdateTodo = {(todo: Todo) => handleUpdateTodo(todo)}
          onClickClose = {handleClickClose}
        />
        {!loading ? (
          todos.length == 0 ?(
            <p style={{textAlign: "center"}}>Your to-do list is empty.</p>
          ) : (
          // Render your component using the fetched data
          <TodoList
            todos={todos}
            onSelectTodo = {(id:number) => handleSelectTodo(id)}
            onUpdateTodo = {(todo: Todo) => handleUpdateTodo(todo)}
            onDeleteTodo = {(id:number) => handleDeleteTodo(id)}
          />
          )) : (
          // Render a loading state or placeholder
          
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}          
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        
      </div>
    </div>
  );
}
