import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";

function PrivacyPage() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/Privacy`
        );
        const data = response.data;

        if (data.$values && data.$values.length > 0) {
          const text = data.$values[0].description;
          const formattedText = text.replace(/\n/g, "<br/>"); // Voeg een <br/> in plaats van newline
          setDescription(formattedText);
        } else {
          setDescription("No privacy description available.");
        }
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      }
    };

    fetchPrivacy();
  }, []);

  return (
    <div className="page page-privacy-page">
      <div className="container">
        <h1>Privacy Verklaring</h1>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
    </div>
  );
}

export default PrivacyPage;
