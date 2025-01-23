import "./styles.scss";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FrontofficeCRUD() {
  const navigate = useNavigate();
  const password1Ref = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Frontoffice",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const togglePassword = () => {
    const type = password1Ref.current.type === "password" ? "text" : "password";
    password1Ref.current.type = type;
  };

  // Fetch the current account data
  useEffect(() => {
    const fetchCurrentAccount = () => {
      setLoading(true);
      setError(null);

      axios
        .get("https://localhost:7265/api/Employee", {
          withCredentials: true,
        })
        .then((response) => {
          setData(response.data);
          setCurrentAccount(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          setLoading(false);
        });
    };

    fetchCurrentAccount();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/Employee`,
        {
          withCredentials: true,
        }
      );

      // Check if the response contains the $values key and that it's an array
      if (response.data && Array.isArray(response.data.$values)) {
        const frontofficeEmployees = response.data.$values.filter(
          (employee) => employee.role === "Frontoffice"
        );
        setEmployees(frontofficeEmployees); // Use the filtered array
      } else {
        console.error("Expected an array but received:", response.data);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
      alert("Je hebt geen toegang tot deze pagina!");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle Create or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentAccount) {
      alert("Accountgegevens laden nog. Probeer het opnieuw.");
      return;
    }

    const filledForm = {
      role: form.role,
      email: form.email,
      password: form.password,
    };

    if (!filledForm.email || !filledForm.password) {
      alert("Alle velden zijn verplicht!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        const response = await axios.put(
          "https://localhost:7265/api/Employee",
          filledForm,
          {
            withCredentials: true,
          }
        );
        console.log("User data updated:", response.data);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/Employee/register-carsandall`,
          filledForm,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Employee created:", response.data);
      }

      setForm({
        email: "",
        password: "",
        role: "Frontoffice",
      });
      setIsEditing(false);
      setIsFormVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Er is iets misgegaan bij het opslaan van de medewerker");
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (
      !window.confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/Employee/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete employee");

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  // Show the form for adding a new employee
  const handleAddNewEmployee = () => {
    setIsFormVisible(true);
    setIsEditing(false);
    setForm({
      email: "",
      password: "",
      role: "Frontoffice",
    });
  };

  // Hide the form
  const handleCancel = () => {
    setIsFormVisible(false);
    setForm({
      email: "",
      password: "",
      role: "Frontoffice",
    });
  };

  return (
    <div className="page page-frontoffice-crud">
      <div className="container">
        <div className="crud-content">
          {!isFormVisible && (
            <button
              onClick={handleAddNewEmployee}
              className="add-business-account-button"
            >
              <span>+</span> Voeg Frontofficemedewerker toe
            </button>
          )}

          {isFormVisible && (
            <div>
              <h2>
                {isEditing
                  ? "Bewerk Medewerker"
                  : "Nieuwe Medewerker Toevoegen"}
              </h2>
              <form className="employee-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Wachtwoord"
                  value={form.password}
                  onChange={handleChange}
                  ref={password1Ref}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="toggle-password-button"
                >
                  Toon wachtwoord
                </button>
                <div>
                  <button type="submit">
                    {isEditing ? "Bewerk Medewerker" : "Voeg Medewerker toe"}
                  </button>
                  <button type="button" onClick={handleCancel}>
                    Annuleren
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="cards-container">
            <h2>Frontoffice medewerkers:</h2>
            <div className="row">
              {Array.isArray(employees) && employees.length > 0 ? (
                employees.map((employee) => (
                  <div className="col-md-6 col-lg-4" key={employee.id}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-title">{employee.email}</p>
                        <div className="tags">
                          <div className="tag">
                            <strong>Rol:</strong> {employee.role}
                          </div>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Geen Frontofficemedewerkers gevonden.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontofficeCRUD;
