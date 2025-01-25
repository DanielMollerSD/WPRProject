import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss"; // Zorg ervoor dat je de juiste SCSS file importeert

const IndividualRentOverview = () => {
  const [rents, setRents] = useState([]); // Huurgegevens
  const [loading, setLoading] = useState(true); // Laadindicator
  const [error, setError] = useState(""); // Foutmelding

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        // Nieuwe API-oproep zonder businessId in de URL
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/rent/individual`, // Endpoint zonder businessId
          {
            withCredentials: true, // Nodig voor authenticatiecookies
          }
        );

        // Response loggen om te zien hoe data eruitziet
        console.log("Rent data:", response.data);

        // Huurgegevens extraheren uit de $values array
        setRents(response.data.$values || []); // Zorg ervoor dat we de juiste array pakken
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rent details:", err);
        // Foutmelding weergeven met fallback
        setError(err.response?.data?.message || "An error occurred while fetching data");
        setLoading(false);
      }
    };

    // Ophalen van de gegevens
    fetchRentDetails();
  }, []); // Alleen uitvoeren bij de eerste render

  // Render loading-indicator
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Render foutmelding als iets misgaat
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="page individual-rent-overview">
      <div className="container">
        <h1>Huur Overzicht</h1>
        <div className="vehicle-list">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Voertuig</th>
                <th>Start Datum</th>
                <th>Eind Datum</th>
              </tr>
            </thead>
            <tbody>
              {rents.length > 0 ? (
                rents.map((rent) => (
                  <tr key={rent.id}>
                    <td>
                      {rent.vehicle?.brand && rent.vehicle?.model
                        ? rent.vehicle.brand + " " + rent.vehicle.model
                        : "Unknown Vehicle"}
                    </td>
                    <td>{rent.startDate ? new Date(rent.startDate).toLocaleDateString() : "N/A"}</td>
                    <td>{rent.endDate ? new Date(rent.endDate).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No rent requests available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndividualRentOverview;
