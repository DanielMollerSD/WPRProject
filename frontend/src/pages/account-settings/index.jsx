import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

function AccountSettings() {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [error, setError] = useState(null);
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const navigate = useNavigate();

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch("https://localhost:7265/api/Customer/account-details", {
            method: "GET",
            credentials: "include", // Ensure cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              // Check if response is valid
              if (!response || !response.ok) {
                
                 console.log(response);
                throw new Error(`HTTP error! status: ${response ? response.status : 'No response'}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log(data); // Handle data
            })
            .catch((error) => {
              console.error("Fetch error:", error); // Handle error
            });
          


        if (response.ok) {
          const data = await response.json();
          setCurrentData(data);
          setEmail(data.Email);
          setAddress(data.Address);
          setPostalCode(data.PostalCode);

        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch account details.");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching account details.");
      }
    };

    fetchData();
  }, []);

  // Toggle password visibility
  const togglePassword = () => {
    const type1 = password1Ref.current.type === "password" ? "text" : "password";
    const type2 = password2Ref.current.type === "password" ? "text" : "password";
    password1Ref.current.type = type1;
    password2Ref.current.type = type2;
  };

  // Handle form submission
  const handleUpdate = async (event) => {
    event.preventDefault();

    const updatedData = {};
    if (email) updatedData.email = email;
    if (address) updatedData.address = address;
    if (postalCode) updatedData.postalCode = postalCode;
    if (password1Ref.current.value) {
      if (password1Ref.current.value === password2Ref.current.value) {
        updatedData.password = password1Ref.current.value;
      } else {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      const response = await fetch("https://localhost:7265/api/Customer/update-account", {
        method: "PUT", // Use PATCH for partial updates
        credentials: "include", // Include the token
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Account updated successfully!");
        navigate("/account-settings"); // Redirect after successful update
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update account.");
      }
    } catch (error) {
      setError("An error occurred while updating the account.");
    }
  };

  return (
    <>
      <header></header>
      <div className="accountsettings-box">
        <section className="as-container">
          <h2>Account Bewerken</h2>
          <form onSubmit={handleUpdate}>
            <div className="as-group">
              {error && <p className="error-message">{error}</p>}
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  className="as-email"
                  placeholder={currentData?.email || "Laden..."}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
              </div>
              <div>
                <label>Woonadres:</label>
                <input
                  type="text"
                  className="as-address"
                  placeholder={currentData?.address || "Laden..."}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  name="address"
                />
              </div>
              <div>
                <label>Postcode:</label>
                <input
                  type="text"
                  className="as-postalcode"
                  placeholder={currentData?.postalCode || "Laden..."}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  name="postalCode"
                />
              </div>
              <div>
                <label>Wachtwoord:</label>
                <input
                  type="password"
                  ref={password1Ref}
                  placeholder="Voer wachtwoord in"
                  name="password"
                />
              </div>
              <div>
                <label>Herhaal Wachtwoord:</label>
                <input
                  type="password"
                  ref={password2Ref}
                  placeholder="Herhaal wachtwoord"
                  name="repeat_password"
                />
              </div>
              <div>
                <input type="checkbox" className="chkbx" onChange={togglePassword} />
                Toon wachtwoord
              </div>
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

export default AccountSettings;
