import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss"; // Zorg ervoor dat je de juiste SCSS file importeert

const RentOverview = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/rent/requests`, {
          withCredentials: true,
        });

        setRents(response.data.$values || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rent details:", err);
        setError(err.response?.data?.message || "An error occurred while fetching data");
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
      setEditMode(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred while updating the status.";
      alert(errorMessage);
      console.error(err);
    }
  };

  const toggleEditMode = (rentId) => {
    setEditMode(editMode === rentId ? null : rentId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page page-rent-overview">
      <div className="container">
        <h1>Rent Overview</h1>
        <table>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rents.length > 0 ? (
              rents.map((rent) => (
                <tr key={rent.id}>
                  <td>{rent.id}</td>
                  <td>{rent.vehicle?.brand + " " + rent.vehicle?.model || "Unknown"}</td>
                  <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                  <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                  <td>{rent.customer?.firstName}</td>
                  <td>{rent.customer?.lastName}</td>
                  <td>{rent.customer?.email}</td>
                  <td>{rent.customer?.phoneNumber || "Not set"}</td>
                  <td>{rent.totalPrice}</td>
                  <td>{rent.status}</td>
                  <td>
                    <button
                      className="status-button"
                      onClick={() => toggleEditMode(rent.id)}
                    >
                      {editMode === rent.id ? "Cancel" : "Edit"}
                    </button>

                    {editMode === rent.id && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                        <button
                          className="pending-button"
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
                <td colSpan="11">No rent requests available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentOverview;
