import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';




export const Filter = ({
    handleFilter
}: {
    handleFilter: (value: string) => void;
}) => {

    function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleFilter(e.target.value)
    }

    return (
    <div className="filter">
        <TextField
            autoFocus
            id="search"            
            variant="outlined" 
            label="Search"
            onChange={(e) => {
                onFilterChange(e)
            }}
            style={{alignContent: 'center'}}
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </InputAdornment>
                )
            }}
        />

    </div>
  );
};