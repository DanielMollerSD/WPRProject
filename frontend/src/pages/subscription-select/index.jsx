import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({ coverage: [], discount: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSubscriptions() {
            setLoading(true);
            try {
                const coverageResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/SubCoverage`, {
                    withCredentials: true, 
                });
                const discountResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/SubDiscount`, {
                    withCredentials: true,
                });

                setSubscriptions({
                    coverage: coverageResponse.data?.$values || [],
                    discount: discountResponse.data?.$values || [],
                });
            } catch (err) {
                console.error("Error fetching subscriptions:", err.message);
                setError("Failed to load subscriptions. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchSubscriptions();
    }, []);

    const handleSelection = (subscription) => {
        navigate("/subscription-payment", { state: { subscription } });
    };

    return (
        <div className="page page-subscription-selection">
            <div className="SelectionBody">
                <main className="SelectionName">
                    <section className="selection-container">
                        <h2>Subscriptions</h2>
                        {error && <p className="error">{error}</p>}
                        <div id="form-group-select">
                            {subscriptions.coverage.map((sub) => (
                                <button
                                    key={sub.id}
                                    className="SelectionButtons coverage-icon"
                                    onClick={() => handleSelection(sub)}
                                    disabled={loading}
                                >
                                    <h3 className="buttonTitle">{sub.name}</h3>
                                    <p className="buttonDescription">{sub.description}</p>
                                </button>
                            ))}

                            {subscriptions.discount.map((sub) => (
                                <button
                                    key={sub.id}
                                    className="SelectionButtons discount-icon"
                                    onClick={() => handleSelection(sub)}
                                    disabled={loading}
                                >
                                    <h3 className="buttonTitle">{sub.name}</h3>
                                    <p className="buttonDescription">{sub.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default SubscriptionSelection;