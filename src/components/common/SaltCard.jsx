import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";

const styles = {
  button: {
    textTransform: "none",
    border: "2px solid #112d31",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    color: "#112d31",
  },
  container: {
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    padding: "1rem",
    borderRadius: "0.8rem",
    background: "linear-gradient(to right, #fff 0%, #e9f2f2 100%)",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    padding: "5px",
    flexWrap: "wrap",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  saltName: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#222",
    textAlign: "center",
  },
  selectedDetails: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#2a527a",
  },
  price: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#112d31",
  },
  notAvailable: {
    border: "2px solid #a7d6d4",
    padding: "1rem 2rem",
    borderRadius: "0.5rem",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#112d31",
    backgroundColor: "#fff",
    textAlign: "center",
    width: "15rem",
  },
  showHide: {
    textTransform: "none",
    fontWeight: 700,
  },
};

const SaltCard = ({ saltData }) => {
  const [saltFormList, setsaltFormList] = useState(null);
  const [medicineData, setMedicineData] = useState([]);
  const [saltStrengthList, setsaltStrengthList] = useState([]);
  const [saltPackingList, setsaltPackingList] = useState([]);
  const [currentSelected, setCurrentSelected] = useState({
    saltForm: "",
    saltStrength: "",
    saltPacking: "",
  });
  const [showMore, setShowMore] = useState({
    form: false,
    strength: false,
    packaging: false,
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

  useEffect(() => {
    const response = [];
    saltData.available_forms.forEach((saltForm) => {
      const responseGenerator = {
        saltType: saltForm,
        isAvailable: false,
        strength: [],
      };
  
      const strengths = Object.keys(saltData.salt_forms_json[saltForm]);
      strengths.forEach((strength) => {
        const strengthData = {
          strengthType: strength,
          isAvailable: false,
          packaging: [],
        };
  
        const packagings = Object.keys(saltData.salt_forms_json[saltForm][strength]);
        packagings.forEach((packaging) => {
          const packagingData = saltData.salt_forms_json[saltForm][strength];
          const currentKey = packagingData ? packaging : null;
          const currentKeyData = currentKey ? packagingData[currentKey] : null;
          const price = medicinePrice(currentKeyData);
  
          if (price) {
            responseGenerator.isAvailable = true;
            strengthData.isAvailable = true;
            strengthData.packaging.push({
              packagingType: packaging,
              isAvailable: true,
              lowestPrice: price,
            });
          } else {
            strengthData.packaging.push({
              packagingType: packaging,
              isAvailable: false,
            });
          }
        });
  
        responseGenerator.strength.push(strengthData);
      });
  
      response.push(responseGenerator);
    });
  
    console.log("response", response);
  }, [saltData]);
  
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
  

//   useEffect(() => {
//     const response = [];
//     saltData.available_forms.map((saltForm) => {
//       const responseGenerator = {
//         saltType: saltForm,
//         isAvailable: false,
//         strength: [],
//       };
//       const strengths = Object.keys(saltData.salt_forms_json[saltForm]);
//       strengths.map((strength, index) => {
//         responseGenerator.strength.push({
//           strengthType: strength,
//           isAvailable: false,
//           packaging: [],
//         });
//         const packagings = Object.keys(
//           saltData.salt_forms_json?.[saltForm]?.[strengths[index]]
//         );
//         packagings.map((packaging, ind) => {
//           const packagingData =
//             saltData.salt_forms_json?.[saltForm]?.[strengths[index]];
//           const currentKey = packagingData
//             ? Object.keys(packagingData)[ind]
//             : null;
//           const currentKeyData = currentKey ? packagingData[currentKey] : null;
//           const price = medicinePrice(currentKeyData);
//           if (price) {
//             responseGenerator.isAvailable = true;
//             responseGenerator.strength.isAvailable = true;
//             responseGenerator.strength?.packaging?.push({
//               packagingType: packaging,
//               isAvailable: true,
//               lowestPrice: price,
//             });
//           } else {
//             responseGenerator.strength?.packaging?.push({
//               packagingType: packaging,
//               isAvailable: false,
//             });
//           }
//           console.log("response", responseGenerator);
//         });
//       });

//       //   console.log("strength", strengths);
//     });
//   }, []);

//   const medicinePrice = (stores) => {
//     let result = "No store have this medicine";
//     let lowestPrice = Infinity;
//     let allNull = true;

//     if (stores) {
//       Object.values(stores).forEach((value) => {
//         if (value !== null) {
//           allNull = false;
//           value.forEach((item) => {
//             if (item.selling_price < lowestPrice) {
//               lowestPrice = item.selling_price;
//               result = lowestPrice;
//             }
//           });
//         }
//       });
//     }

//     if (allNull) {
//       result = "";
//     }
//     return result;
//   };

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
              result = `From\u20B9${lowestPrice}`;
            }
          });
        }
      });
    }

    if (allNull) {
      result = "";
    }
    setResult(result);
  };

  const handleShow = (type) => {
    setShowMore((prev) => ({ ...prev, [type]: !showMore[type] }));
  };

  return (
    <Grid container my={10} sx={styles.container}>
      <Grid item xs={4} pl={2}>
        <Grid container>
          <Grid item xs={3}>
            <Typography pt={1}>Form : </Typography>
          </Grid>
          <Grid item xs={8} sx={styles.buttonContainer}>
            {saltData?.available_forms
              ?.slice(0, showMore.form ? saltData.length : 4)
              .map((form) => (
                <Button
                  key={form}
                  style={styles.button}
                  className="button"
                  onClick={() => handleFormChange(form)}
                >
                  {form}
                </Button>
              ))}
            {saltData.length > 4 && (
              <Button sx={styles.showHide} onClick={() => handleShow("form")}>
                {showMore.form ? "hide..." : "more..."}
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container my={1}>
          <Grid item xs={3}>
            <Typography pt={1}>Strength : </Typography>
          </Grid>
          <Grid item xs={8} sx={styles.buttonContainer}>
            {saltStrengthList
              ?.slice(0, showMore.strength ? saltStrengthList.length : 4)
              .map((strength) => (
                <Button
                  key={strength}
                  style={styles.button}
                  className="button"
                  onClick={() => handleStrengthChange(strength)}
                >
                  {strength}
                </Button>
              ))}
            {saltStrengthList.length > 4 && (
              <Button
                sx={styles.showHide}
                onClick={() => handleShow("strength")}
              >
                {showMore.strength ? "hide..." : "more..."}
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography pt={1}>Packaging : </Typography>
          </Grid>
          <Grid item xs={8} sx={styles.buttonContainer}>
            {saltPackingList
              .slice(0, showMore.packaging ? saltPackingList.length : 4)
              .map((packaging) => (
                <Button
                  key={packaging}
                  style={styles.button}
                  className="button"
                  onClick={() => handlePackagingChange(packaging)}
                >
                  {packaging}
                </Button>
              ))}
            {saltPackingList.length > 4 && (
              <Button
                sx={styles.showHide}
                onClick={() => handleShow("packaging")}
              >
                {showMore.packaging ? "hide..." : "more..."}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4} sx={styles.infoContainer}>
        <Typography sx={styles.saltName}>{saltData?.salt}</Typography>
        <Typography pt={0.6} sx={styles.selectedDetails}>
          {currentSelected.saltForm} | {currentSelected.saltStrength} |{" "}
          {currentSelected.saltPacking}{" "}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={styles.infoContainer}>
        {result ? (
          <Typography sx={styles.price}>{result}</Typography>
        ) : (
          <Typography sx={styles.notAvailable}>
            No stores selling this product near you
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default SaltCard;
