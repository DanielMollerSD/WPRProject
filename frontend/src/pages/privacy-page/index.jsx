import React, { useEffect, useState } from 'react';
import './styles.scss';

function PrivacyPage() {
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/Privacy`);
                if (!response.ok) {
                    throw new Error('Failed to fetch privacy description');
                }
                const data = await response.json();

                if (data.$values && data.$values.length > 0) {
                    setDescription(data.$values[0].description);
                } else {
                    setDescription('No privacy description available.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPrivacy();
    }, []);

    return (
        <div className="privacy-page">
            <h1>Privacy Policy</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <p>{description}</p>
            )}
        </div>
    );
}

export default PrivacyPage;
