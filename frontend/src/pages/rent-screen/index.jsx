import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import './styles.scss';

function RentScreen() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const today = new Date();
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [formData, setFormData] = useState({
    travelPurpose: "",
    furthestDestination: "",
    expectedDistance: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, {
          withCredentials: true
        });

        const vehicleData = response.data;
        setVehicle(vehicleData || []);

        const unavailableDates = vehicleData.unavailableDates?.$values || [];
        const formattedUnavailableDates = unavailableDates.map(date => new Date(date));
        setUnavailableDates(formattedUnavailableDates);
      } catch (e) {
        console.error("Error fetching vehicle:", e.message);
      }
    }

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const rentData = {
      ...formData,
      vehicleId: parseInt(id, 10),
      expectedDistance: parseFloat(formData.expectedDistance),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    console.log("Rent data being sent:", rentData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/rent`,
        rentData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Rental successfully created!");
      } else {
        console.error("Server error details:", response.data);
        alert(`Error creating rental: ${response.data.message || "Check the payload"}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error details:", error.response.data);
        alert(`Error creating rental: ${error.response.data.message || "Check the payload"}`);
      } else {
        console.error("Request error:", error);
        alert("Error creating rental!");
      }
    }
  };

  const getMinAvailableDateStartInput = () => {

    if (!formData.endDate) {
      return today;
    }

    const unavailableBeforeEndDate = unavailableDates.filter(date => {
      return date instanceof Date && !isNaN(date) && date < new Date(formData.endDate);
    });

    if (unavailableBeforeEndDate.length > 0) {
      return new Date(Math.max(...unavailableBeforeEndDate.map(date => date.getTime())));
    }

    return today;

  };

  const getMaxAvailableDateEndInput = () => {

    if (!formData.startDate) {
      return undefined;
    }
  
    // Filter unavailable dates to find the first one after the start date
    const unavailableAfterStartDate = unavailableDates.filter(date => {
      return date instanceof Date && !isNaN(date) && date > new Date(formData.startDate);
    });
  
    // Return the earliest unavailable date after the start date
    if (unavailableAfterStartDate.length > 0) {
      return new Date(Math.min(...unavailableAfterStartDate.map(date => date.getTime())));
    }
  };

  return (
    <div className="rent-screen">
      <div className="form-container">
        {vehicle ? (
          <>
            <h1>Huur {vehicle.brand} {vehicle.model}</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Reisdoel:</label>
                <input type="text" name="travelPurpose" value={formData.travelPurpose} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Verste bestemming:</label>
                <input type="text" name="furthestDestination" value={formData.furthestDestination} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Verwachte Afstand (km):</label>
                <input type="number" name="expectedDistance" value={formData.expectedDistance} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Start Datum:</label>
                  <DatePicker
                  selected={formData.startDate}
                  minDate={getMinAvailableDateStartInput()}
                  maxDate={formData.endDate}
                  excludeDates={unavailableDates}
                  placeholderText="Selecteer start datum"
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                />
              </div>
              <div className="form-group">
                <label>Einde Datum:</label>
                <DatePicker
                  selected={formData.endDate}
                  minDate={formData.startDate || today}
                  maxDate={getMaxAvailableDateEndInput()}
                  excludeDates={unavailableDates}
                  placeholderText="Selecteer einde datum"
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                />
              </div>
              <div className="form-group">
                <div className="total-price">
                <label>Totale prijs:</label>
                  {formData.startDate && formData.endDate
                    ? "€" + vehicle.price * (new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)
                    : 0}
                </div>
              </div>
              <button type="submit" className="submit-btn">Huur</button>
            </form>
          </>
        ) : (
          <p>Loading vehicle details...</p>
        )}
      </div>
    </div>
  );
}

export default RentScreen;
