import "./styles.scss";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function BusinessCRUD() {
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null); // To store logged-in account info
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    tussenVoegsel: "",
    email: "",
    password: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const togglePassword = () => {
    const type1 =
      password1Ref.current.type === "password" ? "text" : "password";
    password1Ref.current.type = type1;
  };

  // Fetch the current account data
  useEffect(() => {
    const fetchCurrentAccount = () => {
      setLoading(true);
      setError(null);

      axios
        .get("https://localhost:7265/api/Customer", {
          withCredentials: true, // Include cookies with the request
        })
        .then((response) => {
          setData(response.data); // Set the fetched data
          setCurrentAccount(response.data); // Store the logged-in account info
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message); // Handle the error
          setLoading(false);
        });
    };

    fetchCurrentAccount();
  }, []);

  // Fetch all employees
  async function fetchEmployees() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/Business`
      );
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  // Handle Create or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the account data is fetched before proceeding
    if (!currentAccount) {
      alert("Accountgegevens laden nog. Probeer het opnieuw.");
      return;
    }

    const filledForm = {
      businessName: currentAccount.businessName,
      businessAddress: currentAccount.businessAddress,
      businessPostalCode: currentAccount.businessPostalCode,
      kvk: currentAccount.kvk,
      firstName: form.firstName,
      lastName: form.lastName,
      tussenVoegsel: form.tussenVoegsel,
      role: form.role,
      email: form.email,
      password: form.password,
    };
    console.log("currentAccount:", currentAccount);
    console.log("form:", form);

    if (
      !filledForm.firstName ||
      !filledForm.lastName ||
      !filledForm.email ||
      !filledForm.password
    ) {
      alert("Alle velden zijn verplicht!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Update Employee (PUT request)
        const response = await axios.put(
          "https://localhost:7265/api/Customer/updateBusiness",
          filledForm,
          {
            withCredentials: true,
          }
        );

        console.log("User data updated:", response.data);
      } else {
        // Create Employee (POST request)
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/Business/register`,
          filledForm,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Employee created:", response.data);
      }

      setForm({
        firstName: "",
        lastName: "",
        tussenVoegsel: "",
        email: "",
        password: "",
        role: "",
      });
      setIsEditing(false);
      setIsFormVisible(false);
      fetchEmployees(); // Refresh the employee list after successful operation
    } catch (error) {
      console.error(error);
      alert("Er is iets misgegaan bij het opslaan van de medewerker");
    } finally {
      setLoading(false);
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setForm(employee);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (
      !window.confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/Business/${id}`,
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
      firstName: "",
      lastName: "",
      tussenVoegsel: "",
      email: "",
      password: "",
      role: "",
    });
  };

  // Hide the form (cancel button or after submission)
  const handleCancel = () => {
    setIsFormVisible(false);
    setForm({
      firstName: "",
      lastName: "",
      tussenVoegsel: "",
      email: "",
      password: "",
      role: "",
    });
  };

  return (
    <div className="page page-business-crud">
      <div className="container">
        <div className="crud-content">
          {!isFormVisible && (
            <button
              onClick={handleAddNewEmployee}
              className="add-business-account-button"
            >
              <span>+</span> Voeg Medewerker toe
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
                  type="text"
                  name="firstName"
                  placeholder="Voornaam"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Achternaam"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="tussenVoegsel"
                  placeholder="Tussenvoegsel"
                  value={form.tussenVoegsel}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <select
                  name="role"
                  className="role-select"
                  onChange={handleChange}
                  value={form.role}
                >
                  <option value="Medewerker">Medewerker</option>
                  <option value="Wagenparkbeheerder">Wagenparkbeheerder</option>
                </select>
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
            <h2>Medewerkers:</h2>
            <div className="row">
              {employees.map((employee) => (
                <div className="col-md-6 col-lg-4" key={employee.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {employee.firstName} {employee.tussenVoegsel}{" "}
                        {employee.lastName}
                      </h5>
                      <p className="card-description">{employee.email}</p>
                      <div className="tags">
                        <div className="tag">
                          <strong>Rol:</strong> {employee.role}
                        </div>
                        <div className="tag">
                          <strong>Bedrijfsnaam:</strong> {employee.businessName}
                        </div>
                      </div>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(employee)}
                      >
                        Bewerken
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCRUD;
