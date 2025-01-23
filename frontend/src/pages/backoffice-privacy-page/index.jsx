import React, { useEffect, useState } from 'react';
import './styles.scss';

function PrivacyEditPage() {
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Privacy`);
                if (!response.ok) {
                    throw new Error('Failed to fetch privacy description');
                }
                const data = await response.json();

                if (data.length > 0) {
                    setDescription(data[0].description); 
                } else {
                    setDescription('');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPrivacy();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
    
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Privacy/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 1,
                    description: description,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update privacy description: ${response.status}`);
            }
    
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <div className="privacy-edit-page">
            <h1>Edit Privacy Policy</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Description updated successfully!</p>}
            <form onSubmit={handleUpdate}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Edit privacy description"
                    rows="10"
                ></textarea>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default PrivacyEditPage;
