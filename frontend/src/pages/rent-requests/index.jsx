import React, { useEffect, useState } from "react";

const Rentrequests = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = "https://localhost:7265/api/rent"; // Zorg ervoor dat je het juiste API endpoint gebruikt

  // Gebruik van useEffect om de huurverzoeken op te halen zodra de component is geladen
  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rent details");
        }
        const data = await response.json();
        setRents(data); // Zet de gegevens in de state
        setLoading(false); // Zet de laadstatus uit
      } catch (err) {
        setError(err.message); // Stel de foutmelding in
        setLoading(false); // Zet de laadstatus uit
      }
    };

    fetchRentDetails(); // Roep de functie aan
  }, []); // Lege dependency array betekent dat de useEffect slechts eenmaal wordt uitgevoerd

  // Functie om de status van een huurverzoek bij te werken
  const updateStatus = async (rentId, newStatus) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${rentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        throw new Error("Failed to update rent status");
      }

      const updatedRent = await response.json();

      // Update de lijst door de status van het item bij te werken
      setRents((prevRents) =>
        prevRents.map((rent) =>
          rent.id === updatedRent.id ? updatedRent : rent
        )
      );

      alert(`Rent status updated to: ${updatedRent.status}`);
    } catch (err) {
      alert("Error updating rent status");
      console.error(err);
    }
  };

  // Laadindicator weergeven
  if (loading) {
    return <div>Loading...</div>;
  }

  // Foutmelding weergeven als er een probleem is
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Rent requests</h1>
      <table className="rent-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rents.length > 0 ? (
            rents
              .filter((rent) => rent.status === "pending") // Alleen items met status "pending"
              .map((rent) => (
                <tr key={rent.id}>
                  <td>{rent.id}</td>
                  <td>{rent.vehicle ? rent.vehicle.name : "Unknown"}</td>
                  <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                  <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                  <td>{rent.firstName}</td>
                  <td>{rent.lastName}</td>
                  <td>{rent.status}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => updateStatus(rent.id, "accepted")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
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
  );
};

export default Rentrequests;
