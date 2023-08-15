import { Box, Typography, useTheme, useMediaQuery,IconButton} from "@mui/material";
import {DarkMode,LightMode} from "@mui/icons-material";
import { useDispatch,useSelector } from "react-redux";
import { setMode} from "state";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const mode = useSelector((state)=>state.mode);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    
    <Box>  
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 5%"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Typography fontWeight="bolder" fontSize="40px" color={theme.palette.secondary.dark}>
          Faciogram
        </Typography>
      <Box>
      <IconButton   onClick={() => dispatch(setMode())}>
            {mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: "black", fontSize: "25px" }} />
            )}
     </IconButton>
      </Box>
      
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" fontSize={"1.5rem"} variant="h5" sx={{ mb: "1.5rem" }} textAlign="center">
          Welcome to Faciogram!
        </Typography>
        <Form />
      </Box>
    </Box>
    
  );
};

export default LoginPage;
