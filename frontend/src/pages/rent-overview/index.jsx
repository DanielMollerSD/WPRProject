import React, { useEffect, useState } from "react";
import axios from "axios";

const RentOverview = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(null); // Keeps track of which rent request is in edit mode

  const apiBaseUrl = "https://localhost:7265/api/rent"; // Ensure this URL points to your API

  // Fetch all rent requests when the component loads
  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await axios.get(apiBaseUrl, {
          withCredentials: true, // Send cookies if required
        });

        console.log("API response:", response.data); // Log full API response for debugging
        if (response.data?.$values) {
          setRents(response.data.$values); // If data is in $values, use it
        } else {
          setRents(response.data); // Otherwise, use the data directly
        }

        setLoading(false); // Turn off loading state
      } catch (err) {
        console.error("Error fetching rent details:", err);
        setError(err.response?.data?.message || "An error occurred while fetching data");
        setLoading(false); // Turn off loading state
      }
    };

    fetchRentDetails();
  }, []);

  // Function to update the status of a rent request
  const updateStatus = async (rentId, newStatus) => {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/${rentId}/status`,
        JSON.stringify(newStatus), // Send the new status as a JSON string
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Update the rent list by replacing the updated item
      setRents((prevRents) =>
        prevRents.map((rent) =>
          rent.id === response.data.id ? response.data : rent
        )
      );

      alert(`Rent status updated to: ${response.data.status}`);
      setEditMode(null); // Exit edit mode after successful update
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred while updating the status.";
      alert(errorMessage);
      console.error(err);
    }
  };

  // Toggle edit mode for a specific rent request
  const toggleEditMode = (rentId) => {
    setEditMode(editMode === rentId ? null : rentId);
  };

  // Render loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if something goes wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  {/* Button to toggle edit mode */}
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleEditMode(rent.id)}
                  >
                    {editMode === rent.id ? "Cancel" : "Edit"}
                  </button>

                  {/* Show status update buttons only if in edit mode */}
                  {editMode === rent.id && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
