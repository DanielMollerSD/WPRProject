import './styles.scss';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VehicleCRUD() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        licensePlate: '',
        brand: '',
        model: '',
        color: '',
        status: '',
        note: '',
        price: '', // Leeg in plaats van 0
        purchaseYear: '', // Leeg in plaats van 0
        vehicleType: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    async function fetchVehicles() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Vehicle`, {
                withCredentials: true
            });
            setVehicles(response.data.$values || response.data);
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!isEditing || (name !== "status" && name !== "note")) { 
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.licensePlate || !form.brand || !form.model || !form.price || !form.purchaseYear || !form.vehicleType) {
            alert('Alle velden zijn verplicht!');
            return;
        }

        if (form.price <= 0) {
            alert('Prijs moet een geldig nummer zijn');
            return;
        }

        if (form.purchaseYear.toString().length !== 4) {
            alert('Voer een geldig jaar in');
            return;
        }

        try {
            const url = isEditing
                ? `${import.meta.env.VITE_APP_API_URL}/Vehicle/${form.id}`
                : `${import.meta.env.VITE_APP_API_URL}/Vehicle`;

            const method = isEditing ? axios.put : axios.post;
            await method(url, form, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            setForm({
                licensePlate: '',
                brand: '',
                model: '',
                color: '',
                status: '',
                note: '',
                price: '', // Leeg in plaats van 0
                purchaseYear: '', // Leeg in plaats van 0
                vehicleType: ''
            });
            setIsEditing(false);
            setIsFormVisible(false);
            fetchVehicles();
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert('Er is iets misgegaan bij het opslaan van het voertuig');
        }
    };

    const handleEdit = (vehicle) => {
        setForm(vehicle);
        setIsEditing(true);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Weet je zeker dat je dit voertuig wilt verwijderen?')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, {
                withCredentials: true
            });
            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleAddNewVehicle = () => {
        setIsFormVisible(true);
        setIsEditing(false);
        setForm({
            licensePlate: '',
            brand: '',
            model: '',
            color: '',
            status: '',
            note: '',
            price: '', // Leeg in plaats van 0
            purchaseYear: '', // Leeg in plaats van 0
            vehicleType: ''
        });
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setForm({
            licensePlate: '',
            brand: '',
            model: '',
            color: '',
            status: '',
            note: '',
            price: '', // Leeg in plaats van 0
            purchaseYear: '', // Leeg in plaats van 0
            vehicleType: ''
        });
    };

    return (
        <div className="page page-vehicle-crud">
            <div className="container">
                <div className="crud-content">
                    {!isFormVisible && (
                        <button onClick={handleAddNewVehicle} className="add-vehicle-button">
                            <span>+</span> Voeg Voertuig Toe
                        </button>
                    )}

                    {isFormVisible && (
                        <div className="form-container">
                            <h2>{isEditing ? 'Bewerk Voertuig' : 'Nieuw Voertuig Toevoegen'}</h2>
                            <form className="vehicle-form" onSubmit={handleSubmit}>
                                <input type="text" name="licensePlate" placeholder="Kenteken" value={form.licensePlate} onChange={handleChange} required />
                                <input type="text" name="brand" placeholder="Merk" value={form.brand} onChange={handleChange} required />
                                <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
                                <input type="text" name="color" placeholder="Kleur" value={form.color} onChange={handleChange} />
                                <select name="status" value={form.status} onChange={handleChange} disabled={isEditing} required>
                                    <option value="Beschikbaar">Beschikbaar</option>
                                    <option value="In service">In service</option>
                                </select>
                                <textarea name="note" placeholder="Notitie" value={form.note} onChange={handleChange} disabled={isEditing}></textarea>
                                <input type="number" name="price" placeholder="Vul prijs in" value={form.price} onChange={handleChange} required />
                                <input type="number" name="purchaseYear" placeholder="Kies koopjaar" value={form.purchaseYear} onChange={handleChange} required />
                                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                                    <option value="Auto">Auto</option>
                                    <option value="Caravan">Caravan</option>
                                    <option value="Camper">Camper</option>
                                </select>
                                <button type="submit" className="save-button">{isEditing ? 'Bewerk Opslaan' : 'Nieuw Opslaan'}</button>
                                <button type="button" className="cancel-button" onClick={handleCancel}>Annuleren</button>
                            </form>
                        </div>
                    )}

                    <div className="cards-container">
                        <h2>Voertuigen Lijst</h2>
                        <div className="row">
                            {vehicles.map((vehicle) => (
                                <div className="col-md-6 col-lg-4" key={vehicle.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{vehicle.brand} {vehicle.model}</h5>
                                            <p className="card-description">{vehicle.note}</p>
                                            <div className="tags">
                                                <div className="tag"><strong>Type:</strong> {vehicle.vehicleType}</div>
                                                <div className="tag"><strong>Prijs:</strong> €{vehicle.price}</div>
                                                <div className="tag"><strong>Status:</strong> {vehicle.status}</div>
                                            </div>
                                        </div>
                                        <div className="buttons-container">
                                            <Link to={`/backoffice-damage/${vehicle.id}`}>
                                                <button className="edit-button">Bekijk Schade</button>
                                            </Link>
                                            <button className="edit-button" onClick={() => handleEdit(vehicle)}>Bewerk</button>
                                            <button className="delete-button" onClick={() => handleDelete(vehicle.id)}>Verwijder</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleCRUD;
