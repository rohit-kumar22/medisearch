import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";

const styles = {
  button: {
    textTransform: "none",
    border: "2px solid #112d31",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    color: "#112d31",
    maxWidth: '7rem',
    height: '2.5rem',
    fontWeight: 600,
    boxShadow: 'rgba(183, 218, 212, 0.3) 0px 0px 29px 0px',
    textOverflow: 'ellipsis', // fixed typo here as well
    whiteSpace: 'nowrap',
    overflow: 'hidden' // corrected to lowercase
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
    textOverflow: 'ellipsis', // fixed typo here as well
    whiteSpace: 'nowrap',
    overflow: 'hidden' // corrected to lowercase
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
  notSelected: {
    textTransform: "none",
    border: "2px solid #ababab",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    color: "#555",
    maxWidth: '7rem',
    height: '2.5rem',
    textOverflow: 'ellipsis', // fixed typo here as well
    whiteSpace: 'nowrap',
    overflow: 'hidden' // corrected to lowercase
  },
  notAvailableButton: {
    textTransform: "none",
    border: "2px dashed #112d31",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    color: "#112d31",
    maxWidth: '7rem',
    height: '2.5rem',
    fontWeight: 600,
    boxShadow: 'rgba(183, 218, 212, 0.3) 0px 0px 29px 0px',
    textOverflow: 'ellipsis', // fixed typo here as well
    whiteSpace: 'nowrap',
    overflow: 'hidden' // corrected to lowercase
  },
  notAvailableNotSelected: {
    textTransform: "none",
    border: "2px dashed #ababab",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    color: "#555",
    maxWidth: '7rem',
    height: '2.5rem',
    textOverflow: 'ellipsis', // fixed typo here as well
    whiteSpace: 'nowrap',
    overflow: 'hidden' // corrected to lowercase
  },
};


const SaltCard = ({ saltData }) => {
  const [saltFormList, setSaltFormList] = useState([]);
  const [saltStrengthList, setSaltStrengthList] = useState([]);
  const [saltPackingList, setSaltPackingList] = useState([]);
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
      const firstForm = saltData.available_forms[0] || {};
      const firstStrength =
        saltData.salt_forms_json?.[firstForm.type]?.medicineStrength[0] || {};
      const firstPacking =
        saltData.salt_forms_json?.[firstForm.type]?.[firstStrength.type]
          ?.packagingList[0] || {};

      setSaltFormList(saltData.available_forms || []);
      setSaltStrengthList(
        saltData.salt_forms_json?.[firstForm.type]?.medicineStrength || []
      );
      setSaltPackingList(
        saltData.salt_forms_json?.[firstForm.type]?.[firstStrength.type]
          ?.packagingList || []
      );

      setCurrentSelected({
        saltForm: firstForm.type || "",
        saltStrength: firstStrength.type || "",
        saltPacking: firstPacking.type || "",
      });

      setResult(firstPacking.lowestPrice || null);
    }
  }, []);

  const handleFormChange = (form) => {
    const strengths = saltData.salt_forms_json?.[form.type]?.medicineStrength || [];
    const firstStrength = strengths[0] || {};
    const packagingData =
      saltData.salt_forms_json?.[form.type]?.[firstStrength.type]?.packagingList || [];
    const firstPacking = packagingData[0] || {};

    setSaltStrengthList(strengths);
    setSaltPackingList(packagingData);
    setCurrentSelected({
      saltForm: form.type,
      saltStrength: firstStrength.type,
      saltPacking: firstPacking.type,
    });
    setResult(firstPacking.lowestPrice);
  };

  const handleStrengthChange = (strength) => {
    const packagingData =
      saltData.salt_forms_json?.[currentSelected.saltForm]?.[strength.type]?.packagingList || [];
    const firstPacking = packagingData[0] || {};

    setSaltPackingList(packagingData);
    setCurrentSelected((prev) => ({
      ...prev,
      saltStrength: strength.type,
      saltPacking: firstPacking.type,
    }));
    setResult(firstPacking.lowestPrice);
  };

  const handlePackagingChange = (packaging) => {
    setCurrentSelected((prev) => ({
      ...prev,
      saltPacking: packaging.type,
    }));
    setResult(packaging.lowestPrice);
  };

  const handleShow = (type) => {
    setShowMore((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const renderButtons = (list, selected, handleChange, type) => (
    <Grid container>
      <Grid item xs={3}>
        <Typography pt={1}>{`${type.charAt(0).toUpperCase() + type.slice(1)} : `}</Typography>
      </Grid>
      <Grid item xs={9} sx={styles.buttonContainer}>
        {list.slice(0, showMore[type] ? list.length : 4).map((item) => (
          <Button
            key={item.type}
            style={
              item.isAvailable && item.type === selected
                ? styles.button
                : item.isAvailable && item.type !== selected
                ? styles.notSelected
                : !item.isAvailable && item.type === selected
                ? styles.notAvailableButton
                : styles.notAvailableNotSelected
            }
            className="button"
            onClick={() => handleChange(item)}
          >
            {item.type}
          </Button>
        ))}
        {list.length > 4 && (
          <Button sx={styles.showHide} onClick={() => handleShow(type)}>
            {showMore[type] ? "hide..." : "more..."}
          </Button>
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container my={5} sx={styles.container}>
      <Grid item xs={4} pl={2}>
        {renderButtons(saltFormList, currentSelected.saltForm, handleFormChange, "form")}
        {renderButtons(saltStrengthList, currentSelected.saltStrength, handleStrengthChange, "strength")}
        {renderButtons(saltPackingList, currentSelected.saltPacking, handlePackagingChange, "packaging")}
      </Grid>
      <Grid item xs={4} sx={styles.infoContainer}>
        <Typography sx={styles.saltName}>{saltData?.salt}</Typography>
        <Typography pt={0.6} sx={styles.selectedDetails}>
          {currentSelected.saltForm} | {currentSelected.saltStrength} | {currentSelected.saltPacking}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={styles.infoContainer}>
        {result ? (
          <Typography sx={styles.price}>{`From \u20B9${result}`}</Typography>
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
