import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function BusinessSettings() {

  const [data, setData] = useState(null); // Changed from [] to null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [userData, setUserData] = useState({
    businessAddress: "",
    businessPostalCode: "",
    businessName: "",
    password: "",
    repeatPassword: "",
  });


  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setError(null);

      axios
        .get("https://localhost:7265/api/Business", {
          withCredentials: true,
        })
        .then((response) => {
          setData(response.data);
          setUserData({
            businessAddress: response.data?.businessAddress || "",
            businessPostalCode: response.data?.businessPostalCode || "",
            businessName: response.data?.businessName || "",
            password: "", // Set to empty or any default value
        
          });
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userData.password !== userData.repeatPassword) {
      setValidationError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationError("");

    const updatedUserData = {
      businessAddress: userData.businessAddress,
      businessPostalCode: userData.businessPostalCode,
      businessName: userData.businessName,
      password: userData.password,
    };

    axios
      .put("https://localhost:7265/api/Business/updateBusiness", updatedUserData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("User data updated:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  if (!data) return <div>No data found!</div>;

  return (
    <>
      <header></header>
      <div className="accountsettings-box">
        <section className="as-container">
          <h2> Account Bewerken Bedrijf </h2>
          <form onSubmit={handleSubmit}>
            <div className="as-group">
              <div>
                <label>BedrijfsAdres:</label>
                <input
                  type="text"
                  className="as-adress"
                  placeholder={data?.businessAddress || "Business Address not available"}
                  name="adres"
                  value={userData.businessAddress}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessAddress: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Postcode:</label>
                <input
                  type="text"
                  className="as-postalcode"
                  placeholder={data?.businessPostalCode || "Postal Code not available"}
                  name="postcode"
                  value={userData.businessPostalCode}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessPostalCode: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Bedrijfsnaam:</label>
                <input
                  type="text"
                  className="as-phonenumber"
                  placeholder={data?.businessName || "Business Name not available"}
                  name="phoneNumber"
                  value={userData.businessName}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessName: e.target.value,
                    })
                  }
                />
              </div>

              {validationError && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {validationError}
                </div>
              )}

              <div>
                <button type="submit" className="SignupButton">
                  Opslaan
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
      <footer></footer>
    </>
  );
}

export default BusinessSettings;
