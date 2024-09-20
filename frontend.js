import React, { useState, useEffect } from 'react';

// Utility function to get the current date in dd/mm/yyyy format
const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
};

const PanchangDisplay = () => {
    // Use the current date as the default value
    const [date, setDate] = useState(getCurrentDate());
    const [time, setTime] = useState("05:20"); // You can set the current time if needed
    const [cityName, setCityName] = useState("Delhi");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://astro-c3p2.onrender.com/panchang/panchang?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&cityName=${encodeURIComponent(cityName)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        fetchData();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Panchang Display</h1>

            {/* Input fields for date, time, and city */}
            <div>
                <label>
                    Date:
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="DD/MM/YYYY"
                    />
                </label>
            </div>
            <div>
                <label>
                    Time:
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="HH:MM"
                    />
                </label>
            </div>
            <div>
                <label>
                    City Name:
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Enter city name"
                    />
                </label>
            </div>

            {/* Button to fetch data based on input */}
            <button onClick={handleFetch}>Fetch Panchang</button>

            {/* Display fetched data if available */}
            {data && data.status === 200 && (
                <div>
                    <h2>Panchang Details</h2>
                    <p>Day: {data.response.day.name}</p>
                    {/* Other details... */}
                    {/* Include other details as per your original code */}
                </div>
            )}

            {/* Message if no data is available */}
            {!loading && data && data.status !== 200 && <p>No data available</p>}
        </div>
    );
};

export default PanchangDisplay;
