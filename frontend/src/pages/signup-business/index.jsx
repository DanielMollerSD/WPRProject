import "./styles.scss";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpBusiness() {
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
      BusinessName: e.target.naam.value,
      BusinessAddress: e.target.adres.value,
      BusinessPostalCode: e.target.postcode.value,
      Kvk: e.target.kvk.value,
      businessEmployee: {
        FirstName: e.target.voornaam.value,
        LastName: e.target.achternaam.value,
        TussenVoegsel: e.target.tussenvoegsel.value || undefined,
        Email: e.target.email.value,
        Password: e.target.password.value,
        Role: "Owner",
      },
    };

    if (formData.businessEmployee.Password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
  }

    console.log("Sending request to backend...");
    console.log("Request URL:", `${import.meta.env.VITE_APP_API_URL}/Business/register`);
    console.log("Request Body:", JSON.stringify(formData));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/Business/register`,
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
      <div className="page page-signup-business">
        <div id="SignUpBody">
          <main className="SignUpMain">
            <section className="signup-container">
              <b id="title-signup-bus"> Zakelijk Account Registreren</b>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label className="nameLabel">Voornaam</label>
                  <input
                    type="text"
                    className="LargeInput"
                    name="voornaam"
                    placeholder="Voer uw voornaam"
                    required
                  />
                </div>
                <div>
                  <label className="nameLabel">Achternaam</label>
                  <input
                    type="text"
                    className="LargeInput"
                    name="achternaam"
                    placeholder="Voer uw achternaam in"
                    required
                  />
                </div>
                <div>
                  <label className="nameLabel">Tussenvoegsel</label>
                  <input
                    type="text"
                    className="SignUpInput"
                    name="tussenvoegsel"
                    placeholder="Voer uw tussenvoegsel in"
                  />
                </div>
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
                  <label className="nameLabel">Bedrijfsnaam</label>
                  <input
                    type="text"
                    name="naam"
                    className="LargeInput"
                    placeholder="Voer uw bedrijfsnaam in"
                    required
                  />
                </div>
                <div>
                  <label className="nameLabel">Bedrijfsadres</label>
                  <input
                    type="adres"
                    className="LargeInput"
                    name="adres"
                    placeholder="Voer uw straatnaam + huisnummer in"
                    required
                  />
                </div>
                <div className="form-group">
                  <div>
                    <label className="nameLabel">Postcode</label>
                    <input
                      type="text"
                      className="SignUpInput"
                      name="postcode"
                      placeholder="Voer uw postcode in"
                      required
                    />
                  </div>
                  <div>
                    <label className="nameLabel">KVK-nummer</label>
                    <input
                      type="text"
                      className="SignUpInput"
                      name="kvk"
                      placeholder="Voer het KVK-nummer in"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="passwordLabel">Wachtwoord</label>
                  <input
                    type="password"
                    className="LargeInput"
                    placeholder="Voer uw wachtwoord in"
                    ref={password1Ref}
                    pattern="^(?=.*[!@#$%^&*(),.?:{}|<>\-+=;'/~`\[\]^])[A-Za-z\d!@#$%^&*(),.?:{}|<>\-+=;'/~`\[\]^]$"
                    name="password"
                    required
                  />
                </div>
                <div>
                  <label className="passwordLabel"> Herhaal Wachtwoord</label>
                  <input
                    type="password"
                    className="LargeInput"
                    name="password-repeat"
                    placeholder="Herhaal uw wachtwoord"
                    ref={password2Ref}
                    pattern="^(?=.*[!@#$%^&*(),.?:{}|<>\-+=;'/~`\[\]^])[A-Za-z\d!@#$%^&*(),.?:{}|<>\-+=;'/~`\[\]^]$"
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
                  <button
                    htmlFor="signup button"
                    className="SignupButton"
                    type="submit"
                  >
                    Registreren
                  </button>
                </div>
              </form>

              <script src="togglePassword.js"></script>
            </section>

          </main>
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default SignUpBusiness;