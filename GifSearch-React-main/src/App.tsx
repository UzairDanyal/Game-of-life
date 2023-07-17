import React, { useState } from "react";
import Content from "./pages/Content";
import Searchbar from "./components/SearchBar";

import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import { Container } from "@mui/material";

const App: React.FC = () => {
 
  const [searchGif, setSearchGif] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [paramsOffset, setParamsOffset] = useState<number>(0);


  return (
    <>
      <BrowserRouter>
        <Header setParamsOffset={setParamsOffset}/>
        <Container maxWidth="md">
          <Searchbar
            setSearchGif={setSearchGif}
            searchGif={searchGif}
            offset={offset}
            limit={limit}
            updateOffset={setOffset}
      
          />
        </Container>
        <Routes>
          <Route path="/" element={<Content setSearchGif={setSearchGif} updateLimit={setLimit} updateOffset={setOffset} searchGif={searchGif} paramsOffset={paramsOffset} setParamsOffset={setParamsOffset}/>} />
          <Route
            path="search"
            element={<Content setSearchGif={setSearchGif}  updateLimit={setLimit} updateOffset={setOffset} searchGif={searchGif} paramsOffset={paramsOffset} setParamsOffset={setParamsOffset}/>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
