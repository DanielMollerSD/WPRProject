import React, { useEffect, useState } from "react";

const CustomerRentOverview = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = "https://localhost:7265/api/rent/user"; // Endpoint voor ingelogde klant

  // Haal huurverzoeken op van de ingelogde klant
  useEffect(() => {
    const fetchCustomerRents = async () => {
      try {
        const token = localStorage.getItem("access_token"); // JWT ophalen
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await fetch(apiBaseUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Voeg de token toe in de headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customer rent requests.");
        }

        const data = await response.json();

        // Zorg ervoor dat we alleen de $values-array gebruiken
        const rentData = data.$values || [];
        setRents(rentData); // Data opslaan
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomerRents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Your Rent Requests</h1>
      <table className="rent-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Pickup Location</th>
          </tr>
        </thead>
        <tbody>
          {rents.length > 0 ? (
            rents.map((rent) => (
              <tr key={rent.id}>
                <td>{rent.id}</td>
                <td>
                  {rent.vehicle
                    ? `${rent.vehicle.brand} ${rent.vehicle.model}`
                    : "Unknown"}
                </td>
                <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                <td>{rent.status}</td>
                <td>{rent.pickupLocation || "Not specified"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No rent requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerRentOverview;
