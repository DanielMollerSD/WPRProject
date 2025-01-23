import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({
        coverage: [],
        discount: [],
    });

    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                const coverageResponse = await fetch(
                    `${import.meta.env.VITE_APP_API_URL}/SubCoverage`
                );
                if (!coverageResponse.ok)
                    throw new Error("Coverage subscriptions not found");

                const coverageData = await coverageResponse.json();

                const discountResponse = await fetch(
                    `${import.meta.env.VITE_APP_API_URL}/SubDiscount`
                );
                if (!discountResponse.ok)
                    throw new Error("Discount subscriptions not found");

                const discountData = await discountResponse.json();

                // Extract values
                const extractedSubscriptions = {
                    coverage: coverageData?.$values || [],
                    discount: discountData?.$values || [],
                };

                setSubscriptions(extractedSubscriptions);

                console.log({
                    coverage: extractedSubscriptions.coverage,
                    discount: extractedSubscriptions.discount,
                });
            } catch (error) {
                console.error("Error fetching subscriptions:", error.message);
                setError("Failed to load subscriptions. Please try again.");
            }
        }

        fetchSubscriptions();
    }, []);

    async function handlePurchase(subscriptionId) {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "https://localhost:7265/api/SubOrder",
                {
                    status: "Pending",
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    subscriptionId,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Subscription order created successfully:", response.data);
            alert("Subscription purchased successfully!");
        } catch (error) {
            console.error("Error purchasing subscription:", error.message);
            setError("Failed to purchase subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="page page-subscription-selection">
                <div className="SelectionBody">
                    <main className="SelectionName">
                        <section className="selection-container">
                            <h2>Subscriptions</h2>
                            {error && <p className="error">{error}</p>}
                            <div id="form-group-select">
                                {subscriptions.coverage.length > 0 ? (
                                    subscriptions.coverage.map((sub) => (
                                        <button
                                            key={sub.id}
                                            className="SelectionButtons coverage-icon"
                                            onClick={() => handlePurchase(sub.id)}
                                            disabled={loading}
                                        >
                                            <h3 className="buttonTitle">{sub.name}</h3>
                                            <p className="buttonDescription">{sub.description}</p>
                                        </button>
                                    ))
                                ) : (
                                    <p>No Coverage Subscriptions available.</p>
                                )}

                                {subscriptions.discount.length > 0 ? (
                                    subscriptions.discount.map((sub) => (
                                        <button
                                            key={sub.id}
                                            className="SelectionButtons discount-icon"
                                            onClick={() => handlePurchase(sub.id)}
                                            disabled={loading}
                                        >
                                            <h3 className="buttonTitle">{sub.name}</h3>
                                            <p className="buttonDescription">{sub.description}</p>
                                        </button>
                                    ))
                                ) : (
                                    <p>No Discount Subscriptions available.</p>
                                )}
                            </div>
                            {loading && <p>Processing your purchase...</p>}
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}

export default SubscriptionSelection;
