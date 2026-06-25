import React, { use, useState } from 'react';
import {login} from "../services/auth";
import "./Login.css";

//import './Login.css'; // optional for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  //  const [name, setname] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Replace this with your backend API call
        console.log("Login submitted", { email, password });

        try {
            setIsSubmitting(true);
            await login({ email, password });
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setIsSubmitting(false);
        }

       
    };

    return (
        <div className="login-container">
            
            <form onSubmit={handleSubmit} className="login-page-form">

                <h1 className="text-2xl font-bold mb-3">Login to CMS</h1>
                

                <h2></h2>
                {/* <input
                    type="name"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    required
                /> */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
           
        </div>
    );
};

export default Login;

