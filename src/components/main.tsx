"use client"

import TodoList from "../components/todo-list";
import TodoDialog from "../components/todo-dialog";
import { useEffect, useState } from "react";
import { Todo } from "./../app/todo";
import { Backdrop, CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@/services/api";
import { AlertComponent } from "./alert";

export default function Main() {

  const [todo, setTodo] = useState<Todo>();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    handleAPIRead();
  }, []);

  //API FUNCTIONS
  const [loading, setLoading] = useState(true);
  const [alertStatus, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const showAlert = (newMessage: string, newSeverity = 'info') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const hideAlert = () => {
    setOpen(false);
  };

  const handleAPIRead = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Todo');
      setLoading(false);
      setTodos(response.data);
    } catch (error) {
      setLoading(false);
      setTodos([])
      showAlert('Something went wrong!', 'error');
      console.error('Error fetching data:', error);
    }
  };

  const handleAPICreate = async (todo:Todo) => {
    try {
      let resposta = await api.post('Todo', {
        id: undefined,
        text: todo.text,
        completed: todo.completed,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined
      });

      if (resposta.status == 201) //CREATED
      {
        todos.push(resposta.data);
        
        showAlert('To-do created successfully!', 'success');

        setTimeout(() => {
          hideAlert()
        }, 3000)
        
        handleClickClose();
      }      
      
    } catch (error) {
      showAlert('Something went wrong!', 'error');
      console.error('Error creating data:', error);
    }
  };

  const handleAPIUpdate = async (todo:Todo) => {
    try {

      let item = { 
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined
      } 
      let resposta = await api.put(`Todo/${todo.id}`, item );

      if (resposta.status == 204) //NO CONTENT
      {
        
        // Update list        
        setTodos(todos.map(objeto => {
          if (objeto.id == todo.id) {
            return item;
          }
          return objeto;
        }));

        console.log(todos);
        showAlert('To-do updated successfully!', 'success');

        setTimeout(() => {
          hideAlert()
        }, 3000)

        handleClickClose();
      }
    } catch (error) {
      showAlert('Something went wrong!', 'error');
      console.error('Error creating data:', error);
    }
  };

  const handleAPIDelete = async (id?:number) => {
    try {
      let resposta = await api.delete('Todo/'+id);

      if (resposta.status == 204) //NO CONTENT
      {

        setTodos(todos => todos.filter((item) => item.id !== id));
        showAlert('To-do deleted successfully!', 'success');

        setTimeout(() => {
          hideAlert()
        }, 3000)

        todos.push(resposta.data);
        handleClickClose();
      }      
    } catch (error) {
      showAlert('Something went wrong!', 'error');
      console.error('Error creating data:', error);
    }
  }

  // DIALOG FUNCTIONS  
  const [open, setDialogState] = useState(false);

  const handleClickOpen = () => {
    setTodo(undefined);
    setDialogState(true);
  };

  const handleClickClose = () => {
    setTodo(undefined);
    setDialogState(false);
  };

  const handleSelectTodo = (id?: number) => {
    setTodo(todos.find((item) => item.id == id));
    setDialogState(true);
  };

  return (
    <div>
      <AlertComponent
        alertStatus={alertStatus}
        severity={severity}
        message = {message}
      />
      <div className="principal">
        
        <h1>TO-DO LIST</h1>
        
        <Fab sx={{ marginLeft: "auto", display:"flex" }} color="primary" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>

        <TodoDialog 
          todo = {todo}
          state = {open}
          onCreateTodo = {(todo: Todo) => handleAPICreate(todo)}
          onUpdateTodo = {(todo: Todo) => handleAPIUpdate(todo)}
          onClickClose = {handleClickClose}
        />
        
        {!loading ? (
          todos.length == 0 ?
          (
            <p className="p-emptylist">Your to-do list is empty.</p>
          ) : 
          (
            <TodoList
              todos={todos}
              onSelectTodo = {(id?:number) => handleSelectTodo(id)}
              onUpdateTodo = {(todo: Todo) => handleAPIUpdate(todo)}
              onDeleteTodo = {(id?:number) => handleAPIDelete(id)}
            />
          )) : 
          (                   
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}          
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          )
        }
      </div>
    </div>    
  );
}
