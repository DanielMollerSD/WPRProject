import "./styles.scss";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpBackoffice() {
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const navigate = useNavigate();

  const togglePassword = () => {
    const type1 =
      password1Ref.current.type === "password" ? "text" : "password";
    const type2 =
      password2Ref.current.type === "password" ? "text" : "password";
    password1Ref.current.type = type1;
    password2Ref.current.type = type2;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      Email: e.target.email.value,
      Password: e.target.password.value,
      Role: "Backoffice",
    };

    console.log("Sending request to backend...");
    console.log("Request URL:", `${import.meta.env.VITE_APP_API_URL}/Employee/register-carsandall`);
    console.log("Request Body:", JSON.stringify(formData));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/Employee/register-carsandall`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (response.status === 200 || response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        console.error("Error Response:", response.data);
        alert(`Error: ${response.data?.message || "Unknown error occurred."}`);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <header></header>
      <div className="page page-signup-carsandall">
        <div className="SignUpBody">
          <main className="SignUpMain">
            <section className="signup-container">
              <h2>Registreren Backoffice</h2>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label className="nameLabel">Email</label>
                  <input
                    type="email"
                    className="LargeInput"
                    name="email"
                    placeholder="Voer uw email in"
                    required
                  />
                </div>
                <div>
                  <label className="passwordLabel">Wachtwoord</label>
                  <input
                    type="password"
                    className="LargeInput"
                    name="password"
                    placeholder="Voer uw wachtwoord in"
                    ref={password1Ref}
                    required
                  />
                </div>
                <div>
                  <label className="passwordLabel">Herhaal Wachtwoord</label>
                  <input
                    type="password"
                    className="LargeInput"
                    name="password-repeat"
                    placeholder="Herhaal uw wachtwoord in"
                    ref={password2Ref}
                    required
                  />
                </div>

                <div className="nameLabel">
                  <input
                    type="checkbox"
                    className="chkbx"
                    onClick={togglePassword}
                  />
                  Toon wachtwoord
                </div>

                <div>
                  <button type="submit" className="SignupButton">
                    Registreren
                  </button>
                </div>
              </form>

              <Link to="/vehicle-overview">
                <button>next page</button>
              </Link>
              <Link to="/vehicle-crud">
                <button>crud page</button>
              </Link>
            </section>
          </main>
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default SignUpBackoffice;