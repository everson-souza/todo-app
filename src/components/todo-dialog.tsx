"use client"

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'dayjs/locale/en-gb';


import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Todo, TodoUpdate } from "../app/todo";
import { Grid } from '@mui/material';

const TodoDialog = ({
  todo,
  state,
  onCreateTodo,
  onUpdateTodo,
  onClickClose,
}: {
  todo?: Todo;
  state: boolean;
  onCreateTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo) => void;
  onClickClose: () => void;
}) => {
    
  const handleClose = () => {
    onClickClose();
  }

  // Form
  const { register, setValue, handleSubmit, formState: {errors} } = useForm<Todo>({
    defaultValues: todo
      ? {
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          deadline: todo.deadline
        }
      : undefined
  });

  const onSubmit: SubmitHandler<Todo> = (infos: Todo) => {
    onUpdateTodo(infos);
    console.log(infos);
  }

  return (
      <Dialog        
        open={state}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"       
      >
        <DialogTitle>To-do</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent> 
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            
              <Grid item xs={12}>
                <input type="hidden" id="id" {...register("id")} value={todo? todo.id : NaN}/>
                <TextField
                  label="Description"
                  defaultValue={todo? todo.text : undefined}   
                  error={errors.text ? true : false}
                  helperText={errors.text ? errors.text?.message: ""}
                  {...register("text", {
                    shouldUnregister: true,
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description should be at least 10 characters",
                    },
                    maxLength: {
                      value: 255,
                      message: "Description should be at most 255 characters",
                    },
                  })}
                  autoFocus
                  required
                  id="text"
                  fullWidth
                  variant="standard"            
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'  >
                  <DatePicker
                    slotProps={{ textField: { fullWidth: true } }}
                    defaultValue={todo ? dayjs(todo.deadline) : undefined }
                    {...register("deadline", {
                      shouldUnregister: true,
                    })}
                    onChange={(date) => {
                      if (date) {
                        setValue('deadline', date.toDate());
                      }
                    }}
                  />                
                </LocalizationProvider>
              </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit(onSubmit)} type="submit" variant='contained' size='medium'>Save</Button>
        </DialogActions>
      </Dialog>
  );
};

export default TodoDialog;