import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function BackofficeSubscription() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/SubOrder`,
                    { withCredentials: true }
                );
                
                console.log("Fetched orders:", response.data);
    
                const orders = response.data?.$values || response.data;
                setOrders(Array.isArray(orders) ? orders : []);
            } catch (err) {
                console.error("Error fetching orders:", err.message);
                setError("Failed to load subscription orders.");
            } finally {
                setLoading(false);
            }
        }
    
        fetchOrders();
    }, []);
    

    async function approveOrder(orderId) {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/SubOrder/${orderId}/approve`,
                {},
                { withCredentials: true }
            );
            console.log("Order approved:", response.data);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: "Approved" } : order
                )
            );
            alert("Order approved successfully!");
        } catch (err) {
            console.error("Error approving order:", err.message);
            alert("Failed to approve the order. Please try again.");
        }
    }

    async function declineOrder(orderId) {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/SubOrder/${orderId}/decline`,
                {},
                { withCredentials: true }
            );
            console.log("Order declined:", response.data);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: "Declined" } : order
                )
            );
            alert("Order declined successfully!");
        } catch (err) {
            console.error("Error declining order:", err.message);
            alert("Failed to decline the order. Please try again.");
        }
    }

    if (loading) return <p>Loading subscription orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="page page-subscription-orders">
            <div className="container">
                <h1>Abonnement Aanvragen</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Gebruiker</th>
                            <th>Abonnement</th>
                            <th>Status</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.businessName || "N/A"}</td>
                                    <td>{order.subscriptionName}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.status !== "Approved" &&
                                            order.status !== "Declined" && (
                                                <>
                                                    <button
                                                        className="approve-button"
                                                        onClick={() => approveOrder(order.id)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="decline-button"
                                                        onClick={() => declineOrder(order.id)}
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No orders available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BackofficeSubscription;