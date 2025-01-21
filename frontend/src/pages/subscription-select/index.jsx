import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./styles.scss";

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({
        coverage: [],
        discount: [],
    });

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
            }
        }

        fetchSubscriptions();
    }, []);

    
    async function handlePurchase(subscriptionId) {
        try {
    
            const response = await axios.post("https://localhost:7265/api/SubOrder",
                {
                    withCredentials: true,
                },
                {
                    subscriptionId,
                }
            );
    
            console.log("Subscription order created successfully:", response.data);
            alert("Subscription purchased successfully!");
        } catch (error) {
            console.error("Error purchasing subscription:", error.message);
            alert("Failed to purchase subscription. Please try again.");
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
                            <div id="form-group-select">
                                {subscriptions.coverage.length > 0 ? (
                                    <button
                                        className="SelectionButtons coverage-icon"
                                        onClick={() =>
                                            handlePurchase(subscriptions.coverage[0].id)
                                        }
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
                        </section>
                    </main>
                </div>
            </div>

            <footer></footer>
        </>
    );
}

export default SubscriptionSelection;
