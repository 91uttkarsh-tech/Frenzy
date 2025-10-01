// import * as React from 'react';
// import TextField from '@mui/material/TextField';
// import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// const filter = createFilterOptions();

// export default function FreeSoloCreateOptionDialog(search) {
//   return (
//     <React.Fragment>
//       <Autocomplete
//         filterOptions={(options, params) => {
//           const filtered = filter(options, params);
//           if (params.inputValue !== '') {
//             filtered.push({
//               inputValue: params.inputValue,
//               title: `Add "${params.inputValue}"`,
//             });
//           }
//           return filtered;
//         }}
//         options={search.name}
//         getOptionLabel={(option) => {
//           if (typeof option === 'string') {
//             return option;
//           }
//           if (option.inputValue) {
//             return option.inputValue;
//           }
//           return (`${option.firstName} ${option.lastName}`);
//         }}
//         selectOnFocus
//         clearOnBlur
//         handleHomeEndKeys
//         sx={{ width:280}}
//         freeSolo
//         renderOption={(props, option) => <li  {...props}>{`${option.firstName}  ${option.lastName}`}</li>}
//         renderInput={(params) =><TextField {...params}  label="Search" />} 
//       />
//     </React.Fragment>
//   );
// }


import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Paper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchBox = ({ placeholder = "Search...", data = [], onSelect }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
  };

  const handleSelect = (item) => {
    setQuery(item);
    setShowSuggestions(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // delay to allow click
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showSuggestions && filteredData.length > 0 && (
        <Paper
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <List>
            {filteredData.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSelect(item)}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBox;

