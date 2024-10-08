"use client"

import React from "react";
import { Todo } from "../app/todo";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from "material-ui-confirm";

export function TodoItem({
  todo,
  onSelect,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onSelect: () => void;
  onUpdate: (todo: Todo) => void;
  onDelete: () => void;
}) {

  
  const [checked, setChecked] = React.useState([true, false]);
      
  const handleToggle = (todo: Todo) => () => {
    todo.completed  = !todo.completed;
    onUpdate(todo);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleSelect = (todo: Todo) => () => {
    onSelect();
  };

  const confirm = useConfirm();

  const handleDelete = (item: Todo) => () => {
    confirm({ description: `Are you sure you want to delete ${item.text}?` })
    .then(() => {
      onDelete();
    });
  };

  return (

    <ListItem
      key={todo.id}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={handleDelete(todo)} >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton role={undefined} dense>
        <ListItemIcon>
          <Checkbox
            onClick={handleToggle(todo)} 
            edge="start"            
            checked={todo.completed}
            onChange={handleChange}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText style={{textDecorationLine: todo.completed ? 'line-through' : '', color: todo.completed ? '#bbbbbb' : todo.deadline && todo.deadline < new Date() ? '#ff0000' : '', textDecorationStyle: 'solid'}} id={'item-'+todo.id} primary={todo.text} onClick={handleSelect(todo)} />        
      </ListItemButton>
    </ListItem>
  );
}