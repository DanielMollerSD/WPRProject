import './styles.scss';
import React, { useState, useEffect } from 'react';

function VehicleCRUD() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        licensePlate: '',
        brand: '',
        model: '',
        color: '',
        status: '',
        note: '',
        price: 0,
        purchaseYear: 0,
        vehicleType: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false); // Manage the visibility of the form

    // Fetch all vehicles
    async function fetchVehicles() {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle`);
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Create or Update vehicle
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting vehicle data:', form);

        // Validate form fields
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
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${import.meta.env.VITE_APP_API_URL}/Vehicle/${form.id}`
                : `${import.meta.env.VITE_APP_API_URL}/Vehicle`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error('Failed to save vehicle');

            setForm({ id: null, licensePlate: '', brand: '', model: '', color: '', status: '', note: '', price: 0, purchaseYear: 0, vehicleType: '' });
            setIsEditing(false);
            setIsFormVisible(false); // Hide the form after submission
            fetchVehicles();
        } catch (error) {
            console.error(error);
            alert('Er is iets misgegaan bij het opslaan van het voertuig');
        }
    };

    // Edit vehicle
    const handleEdit = (vehicle) => {
        setForm(vehicle);
        setIsEditing(true);
        setIsFormVisible(true); // Show form when editing
    };

    // Delete vehicle
    const handleDelete = async (id) => {
        if (!window.confirm('Weet je zeker dat je dit voertuig wilt verwijderen?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Vehicle/${id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Failed to delete vehicle');

            fetchVehicles();
        } catch (error) {
            console.error(error);
        }
    };

    // Show the form for adding a new vehicle
    const handleAddNewVehicle = () => {
        setIsFormVisible(true);
        setIsEditing(false);
        setForm({ licensePlate: '', brand: '', model: '', color: '', status: '', note: '', price: 0, purchaseYear: 0, vehicleType: '' });
    };

    // Hide the form (cancel button or after submission)
    const handleCancel = () => {
        setIsFormVisible(false);
        setForm({ licensePlate: '', brand: '', model: '', color: '', status: '', note: '', price: 0, purchaseYear: 0, vehicleType: '' });
    };

    return (
        <div className="page page-vehicle-crud">
            <div className="container">
                <div className="crud-content">
                    {/* Add New Vehicle Button */}
                    {!isFormVisible && (
                        <button onClick={handleAddNewVehicle} className="add-vehicle-button">
                            <span>+</span> Voeg Voertuig Toe
                        </button>
                    )}

                    {/* Vehicle Form */}
                    {isFormVisible && (
                        <div>
                            <h2>{isEditing ? 'Bewerk Voertuig' : 'Nieuw Voertuig Toevoegen'}</h2>
                            <form className="vehicle-form" onSubmit={handleSubmit}>
                                <input type="text" name="licensePlate" placeholder="Kenteken" value={form.licensePlate} onChange={handleChange} required />
                                <input type="text" name="brand" placeholder="Merk" value={form.brand} onChange={handleChange} required />
                                <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
                                <input type="text" name="color" placeholder="Kleur" value={form.color} onChange={handleChange} />
                                <input type="text" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
                                <textarea name="note" placeholder="Notitie" value={form.note} onChange={handleChange}></textarea>
                                <input type="number" name="price" placeholder="Prijs" value={form.price} onChange={handleChange} required />
                                <input type="number" name="purchaseYear" placeholder="Koop Jaar" value={form.purchaseYear} onChange={handleChange} required />
                                <input type="text" name="vehicleType" placeholder="Type" value={form.vehicleType} onChange={handleChange} required />
                                <button type="submit" className="save-button">
                                    {isEditing ? 'Bewerk Opslaan' : 'Nieuw Opslaan'}
                                </button>
                                <button type="button" className="cancel-button" onClick={handleCancel}>
                                    Annuleren
                                </button>
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
                                            <button className="edit-button" onClick={() => handleEdit(vehicle)}>
                                                Bewerk
                                            </button>
                                            <button className="delete-button" onClick={() => handleDelete(vehicle.id)}>
                                                Verwijder
                                            </button>
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
