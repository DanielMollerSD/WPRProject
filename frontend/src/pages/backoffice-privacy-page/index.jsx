import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.scss';

function PrivacyEditPage() {
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Privacy`, {
                    withCredentials: true, 
                });
                const data = response.data.$values;

                if (data.length > 0) {
                    setDescription(data[0].description);
                } else {
                    setDescription('');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch privacy description');
            }
        };

        fetchPrivacy();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/Privacy/1`,
                {
                    id: 1,
                    description: description,
                },
                {
                    withCredentials: true, 
                }
            );

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update privacy description');
        }
    };

    return (
        <div className="page page-backoffice-privacy-page">
            <div className="container">
                <h1>Edit Privacy Verklaring</h1>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">Description updated successfully!</p>}
                <form onSubmit={handleUpdate}>
                    <textarea className='privacy-textarea'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Edit privacy description"
                        rows="10"
                    ></textarea>
                    <button className='privacy-submit' type="submit">Update</button>
                </form>
            </div>
        </div>
    );
}

export default PrivacyEditPage;