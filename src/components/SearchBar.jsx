import React, { useRef, useEffect } from 'react';
import {
   TextField, Box, InputAdornment, List, ListItem, ListItemText, Button
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useRecentSearches } from '../hooks/useRecentSearches';

const SearchBar = React.memo(({setSearchKeyword})=>{

    const { searchTerm, setSearchTerm, recentSearches, handleSearch, setShowList, showList } = useRecentSearches(setSearchKeyword);
    // ref for not displaying search list is user click outside the search list
    const searchRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowList(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    return(
          <Box ref={searchRef} sx={{ position: 'relative', width: 'auto', textAlign: 'center'}}>
            <TextField
              size="small"
              className='search'
              autoComplete="off"
              placeholder="Type your medicine name here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              onClick={()=> setShowList(true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button sx={{textTransform: 'none', color: '#2a527a', fontWeight: 700}}
                    onClick={() => handleSearch(searchTerm)}
                    >Search</Button>
                  </InputAdornment>
                ),
                startAdornment:(
                    <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {showList && recentSearches.length > 0 && (
              <List className="searchList" sx={{ top: '50px', position: 'absolute', zIndex: 1 }}>
                {recentSearches.map((search, index) => (
                  <ListItem button key={index} onClick={() => handleSearch(search)}>
                    <ListItemText secondary={search} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>)
});

export default SearchBar;