import { useState, useEffect } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";

const styles = {
  button: {
    textTransform: "none",
    border: "2px solid black",
    padding: "2px 2px",
    borderRadius: "10px",
    color: "black",
  },
};

const SaltCard = ({ saltData }) => {
  const [saltFormList, setsaltFormList] = useState(null);
  const [saltStrengthList, setsaltStrengthList] = useState([]);
  const [saltPackingList, setsaltPackingList] = useState([]);
  const [currentSelected, setCurrentSelected] = useState({
    saltForm: "",
    saltStrength: "",
    saltPacking: "",
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (saltData) {
      const initialForm = saltData?.available_forms?.[0] || null;
      setsaltFormList(initialForm);
      setCurrentSelected((prev) => ({ ...prev, saltForm: initialForm }));

      if (initialForm) {
        const strengths = Object.keys(
          saltData.salt_forms_json?.[initialForm] || {}
        );
        setsaltStrengthList(strengths);
        setCurrentSelected((prev) => ({ ...prev, saltStrength: strengths[0] }));

        if (strengths.length > 0) {
          const packaging = Object.keys(
            saltData.salt_forms_json?.[initialForm]?.[strengths[0]] || {}
          );
          setsaltPackingList(packaging);
          setCurrentSelected((prev) => ({
            ...prev,
            saltPacking: packaging[0],
          }));
          const packagingData =
            saltData.salt_forms_json?.[initialForm]?.[strengths[0]];
          const firstKey = packagingData ? Object.keys(packagingData)[0] : null;
          const firstKeyData = firstKey ? packagingData[firstKey] : null;
          handlePrice(firstKeyData);
        }
      }
    }
  }, [saltData]);

  const handleFormChange = (form) => {
    setsaltFormList(form);
    const strengths = Object.keys(saltData.salt_forms_json?.[form] || {});
    setsaltStrengthList(strengths);

    if (strengths.length > 0) {
      const packagingData = saltData.salt_forms_json?.[form]?.[strengths[0]];
      const packaging = Object.keys(packagingData || {});
      setsaltPackingList(packaging);
      const firstKey = packaging.length > 0 ? packaging[0] : null;
      const firstKeyData = firstKey ? packagingData[firstKey] : null;
      handlePrice(firstKeyData);
    } else {
      setsaltPackingList([]);
      setResult("No store have this medicine");
    }
  };

  const handleStrengthChange = (strength) => {
    const packagingData = saltData.salt_forms_json?.[saltFormList]?.[strength];
    const packaging = Object.keys(packagingData || {});
    setsaltPackingList(packaging);
    const firstKey = packaging.length > 0 ? packaging[0] : null;
    const firstKeyData = firstKey ? packagingData[firstKey] : null;
    handlePrice(firstKeyData);
  };

  const handlePackagingChange = (packaging) => {
    const packagingData = saltData.salt_forms_json?.[saltFormList];
    const packingData = Object.values(packagingData).reduce(
      (acc, pack) => acc || pack[packaging],
      undefined
    );

    console.log(packingData);

    handlePrice(packingData);
  };

  const handlePrice = (stores) => {
    let result = "No store have this medicine";
    let lowestPrice = Infinity;
    let allNull = true;

    if (stores) {
      Object.values(stores).forEach((value) => {
        if (value !== null) {
          allNull = false;
          value.forEach((item) => {
            if (item.selling_price < lowestPrice) {
              lowestPrice = item.selling_price;
              result = `Lowest price: ${lowestPrice}`;
            }
          });
        }
      });
    }

    if (allNull) {
      result = "No stores selling this product near you";
    }
    setResult(result);
  };

  return (
    <Grid
      container
      my={10}
      sx={{ border: "1px solid black", borderRadius: "8px" }}
    >
      <Grid item xs={4} pl={2}>
        <Grid container>
          <Grid item xs={2.5}>
            <Typography pt={0.6}>Form: </Typography>
          </Grid>
          <Grid
            item
            xs={8.5}
            sx={{
              display: "flex",
              gap: "5px",
              padding: "5px",
              flexWrap: "wrap",
            }}
          >
            {saltData?.available_forms?.map((form) => (
              <Button
                key={form}
                style={styles.button}
                className="button"
                onClick={() => handleFormChange(form)}
              >
                {form}
              </Button>
            ))}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2.5}>
            <Typography pt={0.6}>Strength: </Typography>
          </Grid>
          <Grid
            item
            xs={8.5}
            sx={{
              display: "flex",
              gap: "5px",
              padding: "5px",
              flexWrap: "wrap",
            }}
          >
            {saltStrengthList?.map((strength) => (
              <Button
                key={strength}
                style={styles.button}
                className="button"
                onClick={() => handleStrengthChange(strength)}
              >
                {strength}
              </Button>
            ))}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2.5}>
            <Typography pt={0.6}>Packaging: </Typography>
          </Grid>
          <Grid
            item
            xs={8.5}
            sx={{
              display: "flex",
              gap: "5px",
              padding: "5px",
              flexWrap: "wrap",
            }}
          >
            {saltPackingList?.map((packaging) => (
              <Button
                key={packaging}
                style={styles.button}
                className="button"
                onClick={() => handlePackagingChange(packaging)}
              >
                {packaging}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>{saltData?.salt}</Typography>
        <Typography pt={0.6}>
          {currentSelected.saltForm} | {currentSelected.saltStrength} |{" "}
          {currentSelected.saltPacking}{" "}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>{result}</Typography>
      </Grid>
    </Grid>
  );
};

export default SaltCard;
