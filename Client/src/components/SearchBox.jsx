import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

export default function FreeSoloCreateOptionDialog(search) {
  return (
    <React.Fragment>
      <Autocomplete
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }
          return filtered;
        }}
        options={search.name}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return (`${option.firstName} ${option.lastName}`);
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        sx={{ width:280}}
        freeSolo
        renderOption={(props, option) => <li  {...props}>{`${option.firstName}  ${option.lastName}`}</li>}
        renderInput={(params) =><TextField {...params}  label="Search" />} 
      />
    </React.Fragment>
  );
}
