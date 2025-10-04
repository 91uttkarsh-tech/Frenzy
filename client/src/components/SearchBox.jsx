import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    setData([]);
  };

  const handleSelect = (item) => {
    setQuery(`${item?.firstName} ${item?.lastName}`);
    setShowSuggestions(false);
    navigate(`/profile/${item._id}`);
  };

  // Fetch data when query changes (with debounce)
  useEffect(() => {
    if (!query) {
      setData([]);
      setShowSuggestions(false);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/search/users`,
          { params: { query } }
        );
        if(response?.data && response?.data?.users){
          setData(response.data.users);
          setShowSuggestions(true);
        } else {
          setData([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } 
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <TextField
        fullWidth
        placeholder={"Search..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
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

      {showSuggestions && data.length > 0 && (
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
            {data.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onMouseDown={() => handleSelect(item)}>
                  <ListItemText primary={`${item?.firstName} ${item?.lastName}`} />
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
