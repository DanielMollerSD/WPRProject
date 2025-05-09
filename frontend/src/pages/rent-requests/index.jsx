import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss"; // Zorg ervoor dat je de juiste SCSS file importeert

const Rentrequests = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/rent/requests`, {
          withCredentials: true,
        });

        setRents(response.data.$values || []);
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, []);

  const updateStatus = async (rentId, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/rent/${rentId}/status`,
        newStatus,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setRents((prevRents) =>
        prevRents.map((rent) =>
          rent.id === response.data.id ? response.data : rent
        )
      );

      alert(`Rent status updated to: ${response.data.status}`);
    } catch (err) {
      alert(
        "Error updating rent status: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page page-rent-requests">
      <div className="container">
        <h1>Huur Verzoeken</h1>
        <table className="rent-table">
          <thead>
            <tr>
              <th>Voertuig</th>
              <th>Start Datum</th>
              <th>Eind Datum</th>
              <th>Voornaam</th>
              <th>Achternaam</th>
              <th>Status</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {rents.length > 0 ? (
              rents
                .filter(
                  (rent) =>
                    rent.status === "pending" &&
                    new Date(rent.startDate) >= new Date()
                )
                .map((rent) => (
                  <tr key={rent.id}>
                    <td>{rent.vehicle?.brand + " " + rent.vehicle?.model || "Unknown"}</td>
                    <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                    <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                    <td>{rent.customer?.firstName}</td>
                    <td>{rent.customer?.lastName}</td>
                    <td>{rent.status}</td>
                    <td>
                      <button
                        className="approve-button"
                        onClick={() => updateStatus(rent.id, "accepted")}
                      >
                        Approve
                      </button>
                      <button
                        className="decline-button"
                        onClick={() => updateStatus(rent.id, "declined")}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="8">No rent requests available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rentrequests;
