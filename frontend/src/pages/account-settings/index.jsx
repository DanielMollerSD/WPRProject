import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles.scss";

function AccountSettings() {

    const password1Ref = useRef(null);
    const password2Ref = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        email: '',
        address: '',
        postalCode: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const togglePassword = () => {
        const type1 = password1Ref.current.type === "password" ? "text" : "password";
        const type2 = password2Ref.current.type === "password" ? "text" : "password";
        password1Ref.current.type = type1;
        password2Ref.current.type = type2;
    };
    useEffect(() => {

        const fetchData = () => {
            setLoading(true);
            setError(null);


            axios.get('https://localhost:7265/api/Customer', {
                withCredentials: true, // Include cookies with the request
            })
                .then(response => {
                    setData(response.data); // Set the fetched data
                    setLoading(false);
                    
                })
                .catch(error => {
                    setError(error.message); // Handle the error
                    setLoading(false);
                });
        };

        console.log(error)
        fetchData();
    }, []);


    if (loading){
        return <><div>Loading...</div></>
    }

    if(error){
        return<><div>Error!</div></>
    }

    if(!data) {
        return <><div>No data found!</div></>
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        setLoading(true);
        setError(null);

        // Prepare updated user data
        const updatedUserData = {
            email: userData.email,
            address: userData.address,
            postalCode: userData.postalCode,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password
        };

     
        axios.put('https://localhost:7265/api/Customer', updatedUserData, { withCredentials: true })
            .then(response => {
                
                console.log('User data updated:', response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    console.log(data)

    return (
        <>
            <header></header>
            <div className="accountsettings-box">
                <section className="as-container">
                    <h2> Account Bewerken </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="as-group">
                            <div>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="as-email"
                                    placeholder={data.email}
                                    name="email"
                                    value={userData.email} // Controlled input
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })} // Update on change
                                />
                            </div>
                            <div>
                                <label>Woonadres:</label>
                                <input
                                    type="text"
                                    className="as-adress"
                                    placeholder={data.address}
                                    name="adres"
                                    value={userData.address}  // Controlled input
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })} // Update on change
                                />
                            </div>
                            <div>
                                <label>Postcode:</label>
                                <input
                                    type="text"
                                    className="as-postalcode"
                                    placeholder={data.postalCode}
                                    name="postcode"
                                    value={userData.postalCode}  // Controlled input
                                    onChange={(e) => setUserData({ ...userData, postalCode: e.target.value })} // Update on change
                                />
                            </div>
                            <div>
                                <label>Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password1Ref}
                                    placeholder="Voer wachtwoord in"
                                    name="password"
                                />
                            </div>
                            <div>
                                <label>Herhaal Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password2Ref}
                                    placeholder="Herhaal wachtwoord"
                                    name="repeat_password"
                                />
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    className="chkbx"
                                    onChange={togglePassword}
                                />
                                Toon wachtwoord
                            </div>
                            <div>
                                <button type="submit" className="SignupButton">Opslaan</button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
            <footer></footer>
        </>
    );
}

export default AccountSettings;