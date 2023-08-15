import React from 'react'

const MobileMenu = () => {
  return (
    <div>
      
<IconButton
onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
>
<Menu />
</IconButton>

<Box
position="fixed"
right="0"
bottom="0"
height="100%"
zIndex="10"
maxWidth="500px"
minWidth="300px"
backgroundColor={background}
>
{/* CLOSE ICON */}
<Box display="flex" justifyContent="flex-end" p="1rem">
  <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
    <Close />
  </IconButton>
</Box>

{/* MENU ITEMS */}
<FlexBetween
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  gap="1rem"
>
  <FormControl variant="standard" value={fullName}>
    <Select
      value={fullName}
      sx={{
        backgroundColor: neutralLight,
        width: "180px",
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
      freeSolo
    >
      <MenuItem value={fullName}>
        <Typography>{fullName}</Typography>
      </MenuItem>
      <MenuItem onClick={() => dispatch(setLogout())}>
        Log Out
      </MenuItem>
    </Select>
  </FormControl>
  <IconButton onClick={() => dispatch(setMode())}>
    {theme.palette.mode === "dark" ? (
      <>
      <DarkMode sx={{height:'2rem',width:"2rem"}}/>
      <p>LightMode</p>
      </>
    ) : (
      <>
      <LightMode sx={{ color: dark,height:'2rem',width:"2rem"}} />
      <p>DarkMode</p>
      </>
    )}
  </IconButton>
  <Box display='flex' alignItems='center' gap='1rem' justifyContent='flex-start'>
  <Message sx={{ fontSize: "25px" }}/>
  <p>Message</p>
  </Box>
  <Box display='flex' alignItems='center' gap='1rem'justifyContent='flex-start'>
  <Notifications sx={{ fontSize: "25px" }}/>
  <p>Notifications</p>
  </Box>
  <Box display='flex' alignItems='center' gap='1rem'justifyContent='flex-start'>
  <Help sx={{ fontSize: "25px" }}/>
  <p>Help</p>
  </Box>
</FlexBetween>
</Box>
    </div>
  )
}

export default MobileMenu
