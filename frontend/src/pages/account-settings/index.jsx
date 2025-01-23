import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function AccountSettings() {
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    address: "",
    postalCode: "",
    phoneNumber: "",
    password: "",
    repeatPassword: "",
  });

  const togglePassword = () => {
    const type1 =
      password1Ref.current.type === "password" ? "text" : "password";
    const type2 =
      password2Ref.current.type === "password" ? "text" : "password";
    password1Ref.current.type = type1;
    password2Ref.current.type = type2;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/Customer`,
          {
            withCredentials: true,
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.repeatPassword) {
      setValidationError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationError("");

    const updatedUserData = {
      email: userData.email,
      address: userData.address,
      postalCode: userData.postalCode,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/Customer/updateIndividual`,
        updatedUserData,
        { withCredentials: true }
      );
      console.log("User data updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data found!</div>;
  }

  return (
    <div className="accountsettings-box">
      <section className="as-container">
        <h2>Account Bewerken Individueel</h2>
        <form onSubmit={handleSubmit}>
          <div className="as-group">
            <div>
              <label className="inputFieldTitle" htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                className="inputField"
                id="email"
                placeholder={data.email}
                name="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="inputFieldTitle" htmlFor="address">
                Woonadres:
              </label>
              <input
                type="text"
                className="inputField"
                id="address"
                placeholder={data.address}
                name="address"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
              />
            </div>
            <div>
              <label className="inputFieldTitle" htmlFor="postalCode">
                Postcode:
              </label>
              <input
                type="text"
                className="inputField"
                id="postalCode"
                placeholder={data.postalCode}
                name="postalCode"
                value={userData.postalCode}
                onChange={(e) =>
                  setUserData({ ...userData, postalCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="inputFieldTitle" htmlFor="phoneNumber">
                Telefoonnummer:
              </label>
              <input
                type="text"
                className="inputField"
                id="phoneNumber"
                placeholder={data.phoneNumber}
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="inputFieldTitle" htmlFor="password">
                Wachtwoord:
              </label>
              <input
                type="password"
                id="password"
                className="inputField"
                ref={password1Ref}
                placeholder="Voer wachtwoord in"
                name="password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="inputFieldTitle" htmlFor="repeatPassword">
                Herhaal Wachtwoord:
              </label>
              <input
                type="password"
                className="inputField"
                id="repeatPassword"
                ref={password2Ref}
                placeholder="Herhaal wachtwoord"
                name="repeatPassword"
                value={userData.repeatPassword}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    repeatPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="show-password-container">
              <label htmlFor="showPassword">Toon wachtwoord</label>
              <input
                type="checkbox"
                id="showPassword"
                className="showPasswordBox"
                onChange={togglePassword}
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
  );
}

export default AccountSettings;