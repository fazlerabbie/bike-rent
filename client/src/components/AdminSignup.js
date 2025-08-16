import React, {useState} from 'react'
import { NavLink, useHistory } from "react-router-dom";
import "../registerStyle.css";

const AdminSignup = () => {

    const history = useHistory();
    const [admin, setAdmin] = useState({
        adminName: "", email: "", phone: "", adminPassword: "", cPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    let name, value;
    const handleInputs = (e) =>{
        name = e.target.name;
        value = e.target.value;

        setAdmin({...admin, [name]:value});

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({...errors, [name]: ""});
        }
        setMessage("");
    }

    const validateForm = () => {
        const newErrors = {};

        if (!admin.adminName.trim()) newErrors.adminName = "Admin name is required";
        if (!admin.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(admin.email)) newErrors.email = "Email is invalid";
        if (!admin.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(admin.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
        if (!admin.adminPassword) newErrors.adminPassword = "Password is required";
        else if (admin.adminPassword.length < 6) newErrors.adminPassword = "Password must be at least 6 characters";
        if (!admin.cPassword) newErrors.cPassword = "Confirm password is required";
        else if (admin.adminPassword !== admin.cPassword) newErrors.cPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const PostData = async (e) =>{
        e.preventDefault();

        if (!validateForm()) {
            setMessage("Please fix the errors above");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const {adminName, email, phone, adminPassword, cPassword} = admin;

            const res = await fetch('/signupAdmin', {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    adminName, email, phone, adminPassword, cPassword
                })
            });
            const data = await res.json();

            if(res.status === 422 || !data){
                setMessage(data.error || "Registration failed. Please try again.");
            }
            else{
                setMessage("Admin registration successful! Redirecting to login...");
                setTimeout(() => {
                    history.push("/adminsignin");
                }, 2000);
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Admin registration error:", error);
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

                        <div id = "signup" className="content">
                            <h2>Admin Registration</h2>
                            <form method="POST">
                                <div className="user-details">

                                    <div className="input-box">
                                        <span className="details">Admin Name</span>
                                        <input
                                            type="text"
                                            name="adminName"
                                            value={admin.adminName}
                                            onChange={handleInputs}
                                            placeholder="Enter your admin name"
                                            className={errors.adminName ? 'error' : ''}
                                            disabled={loading}
                                        />
                                        {errors.adminName && <span className="error-message">{errors.adminName}</span>}
                                    </div>

                                    <div className="input-box">
                                        <span className="details">Email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={admin.email}
                                            onChange={handleInputs}
                                            placeholder="Enter your email"
                                            className={errors.email ? 'error' : ''}
                                            disabled={loading}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="input-box">
                                        <span className="details">Phone Number</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={admin.phone}
                                            onChange={handleInputs}
                                            placeholder="Enter your number"
                                            className={errors.phone ? 'error' : ''}
                                            disabled={loading}
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                    </div>

                                    <div className="input-box">
                                        <span className="details">Password</span>
                                        <input
                                            type="password"
                                            name="adminPassword"
                                            value={admin.adminPassword}
                                            onChange={handleInputs}
                                            placeholder="Enter your password"
                                            className={errors.adminPassword ? 'error' : ''}
                                            disabled={loading}
                                        />
                                        {errors.adminPassword && <span className="error-message">{errors.adminPassword}</span>}
                                    </div>

                                    <div className="input-box">
                                        <span className="details">Confirm Password</span>
                                        <input
                                            type="password"
                                            name="cPassword"
                                            value={admin.cPassword}
                                            onChange={handleInputs}
                                            placeholder="Confirm your password"
                                            className={errors.cPassword ? 'error' : ''}
                                            disabled={loading}
                                        />
                                        {errors.cPassword && <span className="error-message">{errors.cPassword}</span>}
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
                                        value={loading ? "Registering..." : "Register"}
                                        onClick={PostData}
                                        disabled={loading}
                                        className={loading ? 'loading' : ''}
                                    />
                                </div>
                            </form>
                            <button className="btn"><NavLink className="nav-link" to="/adminsignin">Already have an account? Sign In</NavLink></button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default AdminSignup
