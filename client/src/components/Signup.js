import React, {useState} from 'react'
import "../registerStyle.css"
import { NavLink, useHistory } from 'react-router-dom'


const Signup = () => {

    const history = useHistory();
    const [user, setUser] = useState({
        name : "",
        email : "",
        phone : "",
        password : "",
        cPassword : ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    let name, value;

    const handleInputs = (e) =>{
        name = e.target.name;
        value = e.target.value;

        setUser({...user, [name]:value});

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({...errors, [name]: ""});
        }
        setMessage("");
    }

    const validateForm = () => {
        const newErrors = {};

        if (!user.name.trim()) newErrors.name = "Name is required";
        if (!user.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Email is invalid";
        if (!user.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(user.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
        if (!user.password) newErrors.password = "Password is required";
        else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!user.cPassword) newErrors.cPassword = "Confirm password is required";
        else if (user.password !== user.cPassword) newErrors.cPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const postData = async (e) =>{
        e.preventDefault();

        if (!validateForm()) {
            setMessage("Please fix the errors above");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const {name, phone, email, password, cPassword} = user;

            const res = await fetch("/signup", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    name, phone, email, password, cPassword
                })
            });

            const data = await res.json();

            if(res.status === 422 || !data){
                setMessage(data.error || "Registration failed. Please try again.");
            }
            else{
                setMessage("Registration successful! Redirecting to home...");
                setTimeout(() => {
                    history.push("/signin");
                }, 2000);
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
<>
<header className="header">

<div id="menu-btn" className="fas fa-bars"></div>

<NavLink className="logo" to="/"> <span>Bike</span>Book </NavLink>

<nav className="navbar">
    <NavLink  to="/">Home</NavLink>
    <NavLink  to="/exploreRentBikes">Bike Showcase</NavLink>
</nav>

<div id="login-btn">
    <button className="btn"><NavLink className="nav-link" to="/signin">login</NavLink></button>
</div>

</header>

      
      <div className="maincontainer" >
  <div className="firstcontainer" >
    <div className="titled" >Registration</div>
    <div  className="content" >
      <form method="POST">
        <div className="user-details">
          <div className="input-box">
            <span className="details">Full Name</span>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleInputs}
              placeholder="Enter your name"
              className={errors.name ? 'error' : ''}
              disabled={loading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="input-box">
            <span className="details">Email</span>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
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
              id="phone"
              value={user.phone}
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
              name="password"
              id="password"
              value={user.password}
              onChange={handleInputs}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="input-box">
            <span className="details">Confirm Password</span>
            <input
              type="password"
              name="cPassword"
              id="cPassword"
              value={user.cPassword}
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
            name="signup"
            id="signup"
            value={loading ? "Registering..." : "Register"}
            onClick={postData}
            disabled={loading}
            className={loading ? 'loading' : ''}
          />
        </div>
      </form>
    </div>
  </div>

  </div>

</>
    )
}

export default Signup
