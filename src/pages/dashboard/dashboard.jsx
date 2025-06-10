import { useEffect, useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // 1. Fetch user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) setUserData(JSON.parse(storedUserData));
        else console.error('No user data found in localStorage');

    }, []);

    return (
        <div className="page">
            <h1>User Dashboard</h1>
            <p>Welcome to your private dashboard!</p>
            <p>Welcome Mr,{userData && userData.name}</p>
        </div>
    );
};

export default Dashboard;