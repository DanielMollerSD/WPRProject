import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

function SubscriptionSelection() {
    const [subscriptions, setSubscriptions] = useState({
        coverage: [],
        discount: [],
    });

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                // Fetch coverage subscriptions from API
                const coverageResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/SubCoverage`);
                if (!coverageResponse.ok) throw new Error("Coverage subscriptions not found");

                const coverageData = await coverageResponse.json();

                // Fetch discount sub from API
                const discountResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/SubDiscount`);
                if (!discountResponse.ok) throw new Error("Discount subscriptions not found");

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
                                    <Link to="/subscription-coverage">
                                        <button className="SelectionButtons coverage-icon">
                                            <h3 className="buttonTitle">{subscriptions.coverage[0].name}</h3>
                                            <p className="buttonDescription">
                                                {subscriptions.coverage[0].description}
                                            </p>
                                        </button>
                                    </Link>
                                ) : (
                                    <p>No Coverage Subscriptions available.</p>
                                )}

                                {subscriptions.discount.length > 0 ? (
                                    <Link to="/subscription-discount">
                                        <button className="SelectionButtons discount-icon">
                                            <h3 className="buttonTitle">{subscriptions.discount[0].name}</h3>
                                            <p className="buttonDescription">
                                                {subscriptions.discount[0].description}
                                            </p>
                                        </button>
                                    </Link>
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
