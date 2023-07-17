import React, { FC, memo, useEffect, FormEvent, ChangeEvent} from 'react';
import {
  Button,
  Divider,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';

interface SearchbarProps {
  setSearchGif: React.Dispatch<React.SetStateAction<string>>;
  updateOffset: React.Dispatch<React.SetStateAction<number>>;
  searchGif: string;
  offset: number,
  limit: number
}

const Searchbar: FC<SearchbarProps> = ({ setSearchGif, searchGif, offset, limit, updateOffset }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchGif.length > 0) {
        naviagteWithQueryParams();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    
  }, [searchGif, offset, limit]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    naviagteWithQueryParams();
  };

  const naviagteWithQueryParams = () => {
  
    if (searchGif !== "") {
      navigate(`/search/?q=${searchGif}&offset=${offset}&limit=${limit}`);
    } else {
      alert("Please enter a gif name");
    }
  };
  

  // store value of searched input and clear route when it empties
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchGif(e.target.value);
    if(e.target.value === "") {
      setSearchGif("")
      updateOffset(0)
      navigate("/");
    }
  };
  const handleResetSearch = () => {
    if(searchGif !== "") {
      setSearchGif("")
      updateOffset(0);
      navigate("/");
    }
  };

  return (
    <Paper
      component="form"
      elevation={3}
      sx={{
        marginY:3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1,
        py: 0.5,
      }}
      onSubmit={handleFormSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
        value={searchGif}
        onChange={handleInputChange}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleResetSearch}>
        <ClearIcon />
      </IconButton>
      <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
      <Button type="submit" variant="contained" className="btn">
        Search
      </Button>
    </Paper>
  );
};

export default memo(Searchbar);
