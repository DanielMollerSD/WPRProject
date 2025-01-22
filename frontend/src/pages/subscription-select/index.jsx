import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({ coverage: [], discount: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                const coverageResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/SubCoverage`);
                if (!coverageResponse.ok) throw new Error("Coverage subscriptions not found");
                const coverageData = await coverageResponse.json();

                const discountResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/SubDiscount`);
                if (!discountResponse.ok) throw new Error("Discount subscriptions not found");
                const discountData = await discountResponse.json();

                setSubscriptions({
                    coverage: coverageData?.$values || [],
                    discount: discountData?.$values || [],
                });
            } catch (err) {
                console.error("Error fetching subscriptions:", err.message);
                setError("Failed to load subscriptions. Please try again.");
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
