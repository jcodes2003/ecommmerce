"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export function AuthForm() {
    const [type, setType] = useState("signIn");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {type === "signIn" ? "Welcome back" : "Create an account"}
                </h2>

                {/* Social Login */}
                <div className="flex gap-2">
                    <button className="flex items-center justify-center w-1/2 border p-2 rounded-lg hover:bg-gray-100">
                        <FcGoogle className="mr-2" /> Log in with Google
                    </button>
                    <button className="flex items-center justify-center w-1/2 border p-2 rounded-lg hover:bg-gray-100">
                        <FaApple className="mr-2" /> Log in with Apple
                    </button>
                </div>

                <div className="my-4 flex items-center">
                    <div className="border-b w-full"></div>
                    <span className="px-2 text-gray-500 text-sm">or</span>
                    <div className="border-b w-full"></div>
                </div>

                {type === "signIn" ? (
                    // Sign-in Form
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-2 border rounded mt-1" 
                                placeholder="Enter your email" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input 
                                type="password" 
                                className="w-full p-2 border rounded mt-1" 
                                placeholder="Enter your password" 
                                required 
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                &nbsp; Remember me
                            </label>
                            <a href="#" className="text-blue-500">Forgot password?</a>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-2">
                            Sign in to your account
                        </button>
                    </form>
                ) : (
                    // Sign-up Form
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input type="text" className="w-full p-2 border rounded mt-1" placeholder="Enter your name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" className="w-full p-2 border rounded mt-1" placeholder="Enter your email" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input type="password" className="w-full p-2 border rounded mt-1" placeholder="Create a password" required />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-2">
                            Sign Up
                        </button>
                    </form>
                )}

                <div className="text-center mt-4">
                    <p>
                        {type === "signIn" ? "Don't have an account?" : "Already have an account?"} 
                        <button onClick={() => setType(type === "signIn" ? "signUp" : "signIn")} className="text-blue-500 underline ml-1">
                            {type === "signIn" ? "Sign up here" : "Sign in here"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
