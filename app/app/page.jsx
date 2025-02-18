"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import SignInForm from "@/component/signIn";
import SignUpForm from "@/component/signUp";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function App() {
    const router = useRouter();
    const [type, setType] = useState("signIn");
    const [isMobile, setIsMobile] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        const roleID = sessionStorage.getItem('roleID');

        // If user is logged in, redirect accordingly based on roleID
        if (userId) {
            if (roleID === '1') { // Admin
                router.push('/dashboard'); // Or wherever you want to redirect admin users
            } else if (roleID === '3') { // Buyer
                router.push('/buyer');
            }
        }

        // Prevent the user from going back to LoginPage if not logged in
        const handleBackButton = (event) => {
            // If no session data is present (not logged in)
            if (!userId || !roleID) {
                event.preventDefault();  // Prevent back navigation
                router.push('/page'); // Redirect to the page where users should go if not logged in
            }
        };

        // Listen to the back button click
        window.addEventListener('popstate', handleBackButton);

        return () => {
            // Cleanup the event listener
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            // Handle login logic (e.g., API call)
            // console.log('Logging in with', email, password);
        } else {
            setErrorMessage('Please enter both email and password');
        }
    };

    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
    };

    const login = async () => {
        console.log('Logging in with', email, password);
        const url = "http://localhost/map/app/api/login.php";
        const jsonData = { username: email, password: password };
    
        try {
            const response = await axios.get(url, {
                params: { json: JSON.stringify(jsonData), operation: "login" }
            });
    
            if (response.data.success) {
                const userData = response.data.user;
    
                // Check if the user's account is active
                if (userData.status === 1) {
                    // Store user info in sessionStorage
                    sessionStorage.setItem('userId', userData.user_id);
                    sessionStorage.setItem('userName', userData.username);
                    sessionStorage.setItem('userFname', userData.fname);
                    sessionStorage.setItem('userLname', userData.lname);
                    sessionStorage.setItem('userBranch', userData.branch_id);
                    sessionStorage.setItem('roleID', userData.roleID); // Save roleID for future use
    
                    // Redirect based on roleID and reload the page
                    if (userData.roleID === 1) {
                        window.location.href = '/dashboard'; // Redirects and reloads immediately
                    } else if (userData.roleID === 3) {
                        window.location.href = '/buyer';
                    } else if (userData.roleID === 2) {
                        window.location.href = '/branchOwn';
                    } else {
                        alert("Role not recognized. Please contact support.");
                    }
                } else {
                    alert("Your account is not active. Please contact support.");
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setErrorMessage(error.response ? error.response.data.message : "Network error. Please check your connection and try again.");
        }
    };
    

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) {
                window.location.href = '/mobile'; // Redirect to /mobile page
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleOnClick = text => {
        if (text !== type) {
            setType(text);
            return;
        }
    };

    const containerClass =
        "container " + (type === "signUp" ? "right-panel-active" : "");



    return (
        <div className="App">
            <div className={containerClass} id="container">
                <SignUpForm />
                <SignInForm 
                    login={login}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>
                                To keep connected with us please login with your personal info
                            </p>
                            <button
                                className="ghost"
                                id="signIn"
                                onClick={() => handleOnClick("signIn")}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button
                                className="ghost "
                                id="signUp"
                                onClick={() => handleOnClick("signUp")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
