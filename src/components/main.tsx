"use client"

import TodoList from "../components/todo-list";
import TodoDialog from "../components/todo-dialog";
import { useEffect, useState } from "react";
import { Todo } from "./../app/todo";
import { Backdrop, CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@/services/api";
import { AlertComponent } from "./alert";
import { Filter } from "./filter";
import { debounce } from '../utils/debounce';
import dayjs from 'dayjs';


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
      setfilteredTodos(response.data);        
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
        deadline: todo.deadline ? todo.deadline : undefined
      });

      if (resposta.status == 201) //CREATED
      {
        todos.push(resposta.data);
        filterListTodos(filterValue, todos);
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
        deadline: todo.deadline ? todo.deadline : undefined
      } 
      let resposta = await api.put(`Todo/${todo.id}`, item );

      if (resposta.status == 204) //NO CONTENT
      {
        
        let updatedTodos = todos.slice(0).map(objeto => {
          if (objeto.id == todo.id) {
            return item;
          }
          return objeto;
        });
        // Update list        
        setTodos(updatedTodos);

        filterListTodos(filterValue, updatedTodos);

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

        let updatedTodos = todos.slice(0).filter((item) => item.id !== id) 
        setTodos(updatedTodos);
        filterListTodos(filterValue, updatedTodos);
        showAlert('To-do deleted successfully!', 'success');

        setTimeout(() => {
          hideAlert()
        }, 3000)

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

  // FILTER FUNCTIONS
  const [filteredTodos, setfilteredTodos] = useState<Todo[]>([]);
  const [filterValue, setfilterValue] = useState('');

  const filterListTodos = debounce((search:string, todos : Todo[]) => {
    setfilterValue(search);    
    setfilteredTodos(todos.slice(0).filter(todo => todo.text?.toLowerCase().includes(search.toLowerCase())));

  }, 300); // Debounce for 300ms

  const sortList = (sort: string, todos: Todo[]) => {
    let filtered: Todo[];
    switch (sort) {
      case 'id':
        filtered = todos.slice(0).sort((a, b) => {
          if (a.id == undefined) return 1;
          if (b.id == undefined) return -1;  
          return a.id - b.id;
        })
        // todos = filtered;
        setfilteredTodos(filtered);
        break;

      case 'date':
        filtered = todos.slice(0).sort((a, b) => {
          if (a.deadline == undefined) return 1;
          if (b.deadline == undefined) return -1;      
          return dayjs(a.deadline).toDate().getTime() - dayjs(b.deadline).toDate().getTime();
        })
        // todos = filtered;
        setfilteredTodos(filtered);    
        console.log(filtered);
        break;

      case 'text':
        filtered = todos.slice(0).sort((a, b) => {
          if (a.text == undefined) return 1;
          if (b.text == undefined) return -1;
          return a.text.localeCompare(b.text)
        })
        // todos = filtered;
        setfilteredTodos(filtered);        
        break;
      default:
        filtered = todos.slice(0).sort((a, b) => {
          if (a.id == undefined) return 1;
          if (b.id == undefined) return -1;  
          return a.id - b.id;
        })
        // todos = filtered;
        setfilteredTodos(filtered);
        break;
    }
  }

  return (
    <div>
      <AlertComponent
        alertStatus={alertStatus}
        severity={severity}
        message = {message}
      />
      <div className="principal">
        
        <h1>TO-DO LIST</h1>
        
        <Filter
          handleFilter = {(filter: string) => filterListTodos(filter, todos)}
          handleSort =  {(selected: string) => sortList(selected, todos)}
        />

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
              todos={filteredTodos}
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
        <Fab sx={{ marginLeft: "auto", display:"flex", marginTop: "50px" }} color="primary" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>        
      </div>
    </div>    
  );
}
