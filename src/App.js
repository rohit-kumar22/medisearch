import React, { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import { constructUrl } from "./utils/urlHelper";
import SaltCard from "./components/common/SaltCard";
import "./App.css";
import { Typography, Box } from "@mui/material";

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoading && searchKeyword) {
      setIsLoading(true);
      const url = constructUrl(searchKeyword, "1,2"); // apiConstruct helper function
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const newData = await response.json();
        const updatedData = updateResponse(newData);
        setData(updatedData); // Update state with transformed data
      } catch (error) {
        console.error("Fetch Error:", error); // Log any errors
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading, searchKeyword]);

  useEffect(() => {
    if (searchKeyword) {
      fetchData();
    }
  }, [fetchData, searchKeyword]);

  const updateResponse = (data) => {
    if (!data || !data.data || !data.data.saltSuggestions) return [];
  
    data.data.saltSuggestions.forEach((item) => {
      const medicineForms = item.available_forms.map((type) => ({ type, isAvailable: false }));
  
      medicineForms.forEach((medForm) => {
        let medicineAvailable = false;
        const strengthList = [];
  
        Object.entries(item.salt_forms_json[medForm.type]).forEach(([strength, packagings]) => {
          let strengthAvailable = false;
          const packagingList = [];
  
          Object.entries(packagings).forEach(([packaging, packagingData]) => {
            const price = medicinePrice(packagingData);
            const isAvailable = !!price;
  
            packagingData = { isAvailable, lowestPrice: price };
            packagings[packaging] = packagingData;
  
            packagingList.push({ type: packaging, isAvailable: isAvailable, lowestPrice: price });
  
            if (isAvailable) {
              strengthAvailable = true;
              medForm.isAvailable = true;
            }
          });
  
          item.salt_forms_json[medForm.type][strength] = {
            ...packagings,
            isAvailable: strengthAvailable,
            packagingList: packagingList, // Ensure packagingList is correctly assigned here
          };
  
          if (strengthAvailable) {
            medicineAvailable = true;
          }
  
          strengthList.push({ type: strength, isAvailable: strengthAvailable });
        });
  
        medForm.isAvailable = medicineAvailable;
        item.salt_forms_json[medForm.type] = {
          ...item.salt_forms_json[medForm.type],
          medicineStrength: strengthList,
        };
      });
  
      item.available_forms = medicineForms;
    });
  
    return data;
  };

  const medicinePrice = (stores) => {
    let lowestPrice = Infinity;
    let result = "";

    if (stores) {
      Object.values(stores).forEach((value) => {
        if (value !== null) {
          value.forEach((item) => {
            if (item.selling_price < lowestPrice) {
              lowestPrice = item.selling_price;
              result = lowestPrice;
            }
          });
        }
      });
    }

    return result || "";
  };

  console.log(data);


  return (
    <Box className="container">
      <Typography className="heading" sx={{fontSize: '18px'}} mt={2}>
        Cappsule Web Development
      </Typography>
      <Box
        mt={5}
        sx={{ borderBottom: "1px solid gray", paddingBottom: "50px" }}
      >
        <SearchBar setSearchKeyword={setSearchKeyword} />
      </Box>

      {data ?
        data.data.saltSuggestions.map((item) => (
          <SaltCard key={item.id} saltData={item} /> 
          
        ))
      
        : 
        <Box sx={{height: "calc(100vh - 174px)" ,display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography sx={{textAlign: 'center', color: '#888', fontWeight: 700}}>"Find medicines with amazing discount"</Typography>
          
          </Box>}
        
    </Box>
  );
}

export default App;
