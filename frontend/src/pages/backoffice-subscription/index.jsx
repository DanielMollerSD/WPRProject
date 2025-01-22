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
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err.message);
                setError("Failed to load subscription orders.");
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    //approving
    async function approveOrder(orderId) {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/SubOrder/${orderId}/approve`,
                {},
                { withCredentials: true }
            );
            console.log("Order approved:", response.data);

            // update order status
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

    //declining
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
            <h2>Subscription Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Subscription Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userEmail || "N/A"}</td>
                            <td>{order.subscriptionName}</td>
                            <td>{order.status}</td>
                            <td>
                                {order.status !== "Approved" && order.status !== "Declined" && (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BackofficeSubscription;
