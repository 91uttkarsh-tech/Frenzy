import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
  const Accounts = () => {
   return (
     <div>
        <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                wordWrap:"break-word",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>
                Log Out
              </MenuItem>
              <MenuItem>
              <SettingsIcon/>
                Settings  
              </MenuItem>
              <MenuItem onClick={remove} >
              <DeleteIcon/>
                Account
              </MenuItem>
            </Select>
          </FormControl>
     </div>
   )
 }
 
 export default Accounts
 
