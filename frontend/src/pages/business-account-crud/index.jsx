import "./styles.scss";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function BusinessCRUD() {
  const password1Ref = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
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

  useEffect(() => {
    const fetchCurrentAccount = () => {
      setLoading(true);
      setError(null);

      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/Customer`, {
          withCredentials: true,
        })
        .then((response) => {
          if (!response.data) {
            throw new Error("No account data returned");
          }
          setData(response.data);
          setCurrentAccount(response.data); 
        })
        .catch((error) => {
          setError(error.message); 
        })
        .finally(() => setLoading(false));
    };

    fetchCurrentAccount();
  }, []);

  const fetchEmployees = async () => {
    if (!currentAccount) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/Business/employees`,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.employees) {
        const filteredEmployees = response.data.employees.$values.filter(
          (employee) =>
            employee.businessId === currentAccount.businessId &&
            employee.role !== currentAccount.role && employee.role !== "Owner"
        );
        setEmployees(filteredEmployees);
      }
    } catch (error) {
      setError("Failed to fetch employees. Please try again.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentAccount) {
      alert("Accountgegevens laden nog. Probeer het opnieuw.");
      return;
    }

    const filledForm = {
      firstName: form.firstName,
      lastName: form.lastName,
      tussenVoegsel: form.tussenVoegsel,
      role: form.role,
      email: form.email,
      password: form.password,
    };

    if (!filledForm.firstName || !filledForm.lastName || !filledForm.email || !filledForm.password) {
      alert("Alle velden zijn verplicht!");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {

        
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/Business/updateEmployee/${form.id}`,
          filledForm,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/Business/register-employee`,
          filledForm,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
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
      fetchEmployees(); // Refresh
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/Business/${id}`,
        { withCredentials: true }
      );
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

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
              + Voeg Medewerker toe
            </button>
          )}

          {isFormVisible && (
            <div>
              <h2>{isEditing ? "Bewerk Medewerker" : "Nieuwe Medewerker Toevoegen"}</h2>
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
                  <option value="">Selecteer een rol</option>
                  <option value="Medewerker">Medewerker</option>
                  <option value="Wagenparkbeheerder">Wagenparkbeheerder</option>
                </select>
                <input
                  type="password"
                  name="password"
                  placeholder="Wachtwoord"
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
                        {employee.firstName} {employee.tussenVoegsel} {employee.lastName}
                      </h5>
                      <p className="card-description">{employee.email}</p>
                      <div className="tags">
                        <div className="tag">
                          <strong>Rol:</strong> {employee.role}
                        </div>
                      </div>
                      <button className="edit-button" onClick={() => handleEdit(employee)}>
                        Bewerken
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(employee.id)}>
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