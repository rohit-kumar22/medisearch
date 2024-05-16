import React, { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import { constructUrl } from "./utils/urlHelper";
import SaltCard from "./components/common/SaltCard";
import "./App.css"
import { Typography, Box } from "@mui/material";
function App() {
  const [searchKeyword, setSearchKeyword] = useState("paracitamol");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
      const url = constructUrl(searchKeyword, "1,2"); // apiConstruct helper function
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const newData = await response.json();
        setData(newData);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading, searchKeyword]);

  useEffect(() => {
    fetchData();
  }, [searchKeyword]);


  return (
    <Box className="container">
      <Typography>Cappsule Web Development</Typography>
      <SearchBar setSearchKeyword={setSearchKeyword} />
      {data?.data.saltSuggestions.map((item) => (
        <SaltCard saltData={item} />
      ))}
    </Box>
  );
}

export default App;
