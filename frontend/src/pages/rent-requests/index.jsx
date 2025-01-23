import React, { useEffect, useState } from "react";
import axios from "axios";

const Rentrequests = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = "https://localhost:7265/api/rent";

  // Fetch rent requests on component mount
  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const response = await axios.get(apiBaseUrl, {
          withCredentials: true,
        });

        console.log(response); // Debugging
        setRents(response.data.$values || []); // Gebruik fallback voor data
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, []);

  // Update the status of a rent request
  const updateStatus = async (rentId, newStatus) => {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/${rentId}/status`,
        newStatus, // Stuur de status direct als string
        {
          headers: {
            "Content-Type": "application/json", // Zorg voor juiste content type
          },
          withCredentials: true, // Verzend cookies indien nodig
        }
      );

      // Update the local rent list
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
    <div className="container">
      <h1>Rent Requests</h1>
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
              .filter(
                (rent) =>
                  rent.status === "pending" &&
                  new Date(rent.startDate) >= new Date()
              )
              .map((rent) => (
                <tr key={rent.id}>
                  <td>{rent.id}</td>
                  <td>{rent.vehicle?.name || "Unknown"}</td>
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
