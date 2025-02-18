'use client'
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";

function SignInForm({ login, email, setEmail, password, setPassword }) {
    const [state, setState] = useState({ email: "", password: "" });

    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = evt => {
        evt.preventDefault();
        login(email, password);
        setState({ email: "", password: "" });
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>
                <div className="social-container">
                    <a href="#" className="social">
                        <FaFacebookF />
                    </a>
                    <a href="#" className="social">
                    <FaGoogle />
                    </a>
                    <a href="#" className="social">
                         <FaLinkedinIn />
                    </a>
                </div>
                <span>or use your account</span>
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <a href="#">Forgot your password?</a>
                <button onClick={login}>Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;
