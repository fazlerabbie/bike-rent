import React, {useState, useContext} from 'react'
import { NavLink, useHistory } from "react-router-dom";
import "../registerStyle.css";

import { AdminContext } from "../App"

const AdminSignin = () => {

    const {adminstate, dispatchadmin} = useContext(AdminContext)

    const adminHistory = useHistory();
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const signinAdmin =  async (e) =>{
        e.preventDefault();

        if (!adminName.trim() || !adminPassword.trim()) {
            setMessage("Please enter both admin name and password");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch('/signinAdmin', {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    adminName,
                    adminPassword
                })
            });
            const data = await res.json();

            if(res.status === 400 || !data){
                setMessage(data.error || "Invalid credentials. Please try again.");
            }
            else{
                dispatchadmin({type: "ADMIN", payload:true})
                setMessage("Login successful! Redirecting to dashboard...");
                setTimeout(() => {
                    adminHistory.push("/dashboard");
                }, 1500);
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Admin login error:", error);
        } finally {
            setLoading(false);
        }
    }




    return (
        <>

<header className="header">

<div id="menu-btn" className="fas fa-bars"></div>

<a href="#" className="logo"> <span>Bike</span>Book </a>

<nav className="navbar">
<NavLink className="nav-link" to="/">Home</NavLink>
    <a href="/#contact">Contact</a>
</nav>

<div id="login-btn">
    <button className="btn"><NavLink className="nav-link" to="/signin">login</NavLink></button>
</div>

</header>

            <div className="maincontainer">
                <div className="firstcontainer">
                    <div className="titled"></div>

                        <div id = "adminsignin" className="content">
                            <h2>Signin As Admin</h2>
                            <form method="POST">
                                <div className="user-details">

                                    <div className="input-box">
                                        <span className="details">Admin Name</span>
                                        <input
                                            type="text"
                                            value={adminName}
                                            onChange={(e)=>{setAdminName(e.target.value); setMessage("");}}
                                            placeholder="Enter your admin name"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="input-box">
                                        <span className="details">Password</span>
                                        <input
                                            type="password"
                                            value={adminPassword}
                                            onChange={(e)=>{setAdminPassword(e.target.value); setMessage("");}}
                                            placeholder="Enter your password"
                                            disabled={loading}
                                        />
                                    </div>

                                </div>

                                {message && (
                                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                                <div className="button">
                                    <input
                                        type="submit"
                                        value={loading ? "Signing in..." : "Sign In"}
                                        onClick={signinAdmin}
                                        disabled={loading}
                                        className={loading ? 'loading' : ''}
                                    />
                                </div>
                            </form>
                            <button className="btn"><NavLink className="nav-link" to="/signin">Signin As User</NavLink></button>
                            <button className="btn"><NavLink className="nav-link" to="/adminsignup">Create Admin Account</NavLink></button>
                        </div>
                    </div>
                </div>


        </>
    )
}

export default AdminSignin
