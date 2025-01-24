import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function BusinessSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [userData, setUserData] = useState({
    businessAddress: "",
    businessPostalCode: "",
    businessName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/Business`,
          { withCredentials: true }
        );
        setData(response.data);
        setUserData({
          businessAddress: response.data?.businessAddress || "",
          businessPostalCode: response.data?.businessPostalCode || "",
          businessName: response.data?.businessName || "",
        });
      } catch (err) {
        setError(err.message || "Failed to fetch business data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setValidationError("");

    const updatedUserData = {
      businessId: data.businessId,
      businessAddress: userData.businessAddress,
      businessPostalCode: userData.businessPostalCode,
      businessName: userData.businessName,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/Business/updateBusiness`,
        updatedUserData,
        { withCredentials: true }
      );
      alert("Business data succesfully updated!")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update business data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet u zeker dat u uw account wilt verwijderen?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/Business/delete-business/${id}`,
        { withCredentials: true }
      );
      
      handleLogout(); // Assuming the business has been deleted, log the user out
      alert("Business successfully deleted!");
    } catch (error) {
      console.error("Error during business deletion:", error);
      alert("Failed to delete business.");
    }
  };

  const handleLogout = () => {
    axios
      .delete(`${import.meta.env.VITE_APP_API_URL}/Logout`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Logout successful", response);
        localStorage.clear();

        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found!</div>;

  return (
    <>
      <header></header>
      <div className="businesssettings-box">
        <section className="as-container">
          <h2> Account Bewerken Bedrijf </h2>
          <form onSubmit={handleSubmit}>
            <div className="as-group">
              <div>
                <label>BedrijfsAdres:</label>
                <input
                  type="text"
                  className="as-adress"
                  placeholder={
                    data?.businessAddress || "Business Address not available"
                  }
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
                  placeholder={
                    data?.businessPostalCode || "Postal Code not available"
                  }
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
                  className="as-businessname"
                  placeholder={
                    data?.businessName || "Business Name not available"
                  }
                  name="businessName"
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
                <button onClick={handleSubmit} className="SignupButton">
                  Opslaan
                </button>
              </div>
              <div>
  
              </div>
            </div>
          </form>
          <button
                  className="delete-button"
                  onClick={() => handleDelete(data.businessId)}
                >
                  Bedrijf Verwijderen
                </button>
        </section>
      </div>
      <footer></footer>
    </>
  );
}

export default BusinessSettings;
