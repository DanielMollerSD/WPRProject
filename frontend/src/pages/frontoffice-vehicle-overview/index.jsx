import './styles.scss';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

function FrontOfficeVehicleOverview() {
    const [vehicles, setVehicles] = useState([]);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [statusInput, setStatusInput] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteInput, setNoteInput] = useState("");

    async function fetchVehicles() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle`, {
                withCredentials: true
            });
            setVehicles(response.data.$values);
        } catch (e) {
            console.error(e.message);
        }
    }

    async function updateVehicleStatus(id, newStatus) {
        try {
            await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}/status`,
                newStatus,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            await fetchVehicles();
            setEditingStatusId(null);
        } catch (e) {
            console.error(e.message);
        }
    }

    async function updateVehicleNote(id, newNote) {
        try {
            console.log("Updating status with payload:", newNote);
            const response = await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}/note`,
                newNote,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("Response from server:", response.data);
            await fetchVehicles();
            setEditingNoteId(null);
        } catch (e) {
            console.error("Error updating status:", e.message);
        }
    }
    

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="page page-rent-screen">
            <div className="container">
                <div className="rent-screen-content">
                    <div className="vehicle-list">
                        <table className="vehicle-table">
                            <thead>
                                <tr>
                                    <th>Merk</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Koop Jaar</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>Prijs</th>
                                    <th>Schade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                            <td>{vehicle.brand}</td>
                                            <td>{vehicle.model}</td>
                                            <td>{vehicle.vehicleType}</td>
                                            <td>{vehicle.purchaseYear}</td>
                                            <td>
                                            {editingStatusId === vehicle.id ? (
                                                <div>
                                                    <select
                                                        //type="text"
                                                        value={statusInput}
                                                        onChange={(e) => setStatusInput(e.target.value)}
                                                    >
                                                        <option value="Beschikbaar">Beschikbaar</option>
                                                        <option value="In service">In service</option>
                                                    </select>
                                                    <button className='approve-button'
                                                        onClick={() => updateVehicleStatus(vehicle.id, statusInput)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button className='cancel-button' onClick={() => setEditingStatusId(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div>
                                                    {vehicle.status}{" "}
                                                    <button className='status-button'
                                                        onClick={() => {
                                                            setEditingStatusId(vehicle.id);
                                                            setStatusInput(vehicle.status);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {editingNoteId === vehicle.id ? (
                                                <div>
                                                    <textarea className='note-input'
                                                        type="text"
                                                        value={noteInput}
                                                        onChange={(e) => setNoteInput(e.target.value)}
                                                        placeholder="Edit Note"
                                                    />
                                                    <button className='approve-button'
                                                        onClick={() => updateVehicleNote(vehicle.id, noteInput )}
                                                    >
                                                        Save
                                                    </button>
                                                    <button className='cancel-button' onClick={() => setEditingNoteId(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div>
                                                    {vehicle.note}{" "}
                                                    <button className='status-button'
                                                        onClick={() => {
                                                            setEditingNoteId(vehicle.id);
                                                            setNoteInput(vehicle.note);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>€{vehicle.price} /dag</td>
                                        <td>
                                            <Link to={`/damage/${vehicle.id}`}>Voeg toe</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FrontOfficeVehicleOverview;