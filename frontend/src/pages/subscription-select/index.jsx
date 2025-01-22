import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./styles.scss";

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({
        coverage: [],
        discount: [],
    });

    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track errors

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

                setSubscriptions({
                    coverage: coverageData || [],
                    discount: discountData || [],
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
            const token = Cookies.get("access_token");
            if (token) {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
            } else {
                console.log("No token found in cookies.");
            }
            
            console.log("Access token from cookies:", token);

            if (!token) {
                throw new Error("User is not authenticated. Please log in.");
            }

            const response = await axios.post(
                "https://localhost:7265/api/SubOrder",
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    status: "Pending",
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    subscriptionId,
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
            <header></header>

            <div className="page page-subscription-selection">
                <div className="SelectionBody">
                    <main className="SelectionName">
                        <section className="selection-container">
                            <h2>Subscriptions</h2>
                            {error && <p className="error">{error}</p>}
                            <div id="form-group-select">
                                {subscriptions.coverage.length > 0 ? (
                                    <button
                                        className="SelectionButtons coverage-icon"
                                        onClick={() =>
                                            handlePurchase(subscriptions.coverage[0].id)
                                        }
                                        disabled={loading}
                                    >
                                        <h3 className="buttonTitle">
                                            {subscriptions.coverage[0].name}
                                        </h3>
                                        <p className="buttonDescription">
                                            {subscriptions.coverage[0].description}
                                        </p>
                                    </button>
                                ) : (
                                    <p>No Coverage Subscriptions available.</p>
                                )}

                                {subscriptions.discount.length > 0 ? (
                                    <button
                                        className="SelectionButtons discount-icon"
                                        onClick={() =>
                                            handlePurchase(subscriptions.discount[0].id)
                                        }
                                        disabled={loading}
                                    >
                                        <h3 className="buttonTitle">
                                            {subscriptions.discount[0].name}
                                        </h3>
                                        <p className="buttonDescription">
                                            {subscriptions.discount[0].description}
                                        </p>
                                    </button>
                                ) : (
                                    <p>No Discount Subscriptions available.</p>
                                )}
                            </div>
                            {loading && <p>Processing your purchase...</p>}
                        </section>
                    </main>
                </div>
            </div>

            <footer></footer>
        </>
    );
}

export default SubscriptionSelection;
