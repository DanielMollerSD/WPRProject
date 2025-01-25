import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./styles.scss";

function SubscriptionPayment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const subscription = state?.subscription;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/SubOrder`,
                {
                    status: "Pending",
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                    subscriptionId: subscription.id,
                },
                { withCredentials: true }
            );
    
            console.log("Subscription order created successfully:", response.data);
            alert("Subscription purchased successfully!");
            navigate("/subscription-select");
        } catch (err) {
            console.error("Error purchasing subscription:", err.message);
            setError("Failed to purchase subscription. Please try again.");
            navigate("/subscription-select");
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        navigate("/subscription-select");
    };
    
    return (
        <div className="page payment-page">
            <div className="container">
                <h2>Conformatie Betaling</h2>
                <p>
                    <strong>Abonnement: {subscription.name}</strong>
                    <br/>
                    <strong>Prijs: €{subscription.price}</strong>
                </p>
                <p>{subscription.description}</p>
                {error && <p className="error">{error}</p>}
                <div className="payment-actions">
                    <button className="approve-button" onClick={handleConfirm} disabled={loading}>
                        {loading ? "Processing..." : "Betaal"}
                    </button>
                    <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionPayment;