import React, { useEffect, useState } from "react";

const RentOverview = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(null); // Houdt bij welk huurverzoek in bewerkingsmodus is

  const apiBaseUrl = "https://localhost:7265/api/rent"; // Zorg ervoor dat je het juiste API endpoint gebruikt

  // Haal alle huurverzoeken op bij het laden van de pagina
  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rent details");
        }
        const data = await response.json();
        setRents(data); // Zet de data in de state
        setLoading(false); // Zet de laadstatus uit
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, []);

  // Functie om de status van een huurverzoek bij te werken
  const updateStatus = async (rentId, newStatus) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${rentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus), // stuur de nieuwe status (bijv. "accepted", "declined" of "pending")
      });

      if (!response.ok) {
        throw new Error("Failed to update rent status");
      }

      const updatedRent = await response.json();
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

  // Laadindicator tonen
  if (loading) {
    return <div>Loading...</div>;
  }

  // Toon foutmelding als er een probleem is
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Functie om editmode in of uit te schakelen
  const toggleEditMode = (rentId) => {
    setEditMode(editMode === rentId ? null : rentId); // Zet editmode aan of uit
  };

  return (
    <div className="container">
      <h1>Rent Overview</h1>
      <table className="rent-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rents.length > 0 ? (
            rents.map((rent) => (
              <tr key={rent.id}>
                <td>{rent.id}</td>
                <td>{rent.vehicle ? rent.vehicle.name : "Unknown"}</td>
                <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                <td>{rent.firstName}</td>
                <td>{rent.lastName}</td>
                <td>{rent.email}</td>
                <td>{rent.phone}</td>
                <td>{rent.totalPrice ? `€${rent.totalPrice}` : "Not set"}</td>
                <td>{rent.status}</td>
                <td>{rent.pickupLocation || "Not specified"}</td>
                <td>{rent.dropoffLocation || "Not specified"}</td>
                <td>
                  {/* Voeg een knop toe om editmode aan te zetten */}
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleEditMode(rent.id)}
                  >
                    {editMode === rent.id ? "Cancel" : "Edit"}
                  </button>

                  {/* Toon de andere knoppen alleen als editmode is ingeschakeld */}
                  {editMode === rent.id && (
                    <div>
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
                      <button
                        className="btn btn-warning"
                        onClick={() => updateStatus(rent.id, "pending")}
                      >
                        Pending
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13">No rent requests available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RentOverview;
