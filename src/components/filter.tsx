import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

export const Filter = ({
    handleFilter,
    handleSort,
}: {
    handleFilter: (value: string) => void;
    handleSort: (value: string) => void; 
}) => {

    const [order, setOrder] = React.useState('text');

    function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleFilter(e.target.value)
    }

    const handleOrder = (
        event: React.MouseEvent<HTMLElement>,
        newOrder: string | null,
      ) => {
        if (newOrder !== null) {
          setOrder(newOrder);
          handleSort(newOrder)

        }
      };

    return (
    <div className="filter">
        <TextField
            className='filter-input'
            id="search"            
            variant="outlined"             
            size="small"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onFilterChange(e)
            }}
            style={{alignContent: 'center'}}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">                    
                    <SearchIcon />                    
                </InputAdornment>
                )
            }}
        />

        <ToggleButtonGroup
            value={order}
            exclusive
            onChange={handleOrder}
            aria-label="text alignment"
        >
            <ToggleButton
                className='filter-botao'
                color="primary"
                size="small"
                value="date"          
            >
                <CalendarMonthIcon />
            </ToggleButton>
            <ToggleButton
                className='filter-botao'
                color="primary"
                size="small"
                value="text"          
            >
                <FormatColorTextIcon />
            </ToggleButton>
        </ToggleButtonGroup>

    </div>
  );
};