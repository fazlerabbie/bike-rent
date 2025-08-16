import React, {useState, useEffect, useContext, useCallback} from 'react'
import { NavLink } from "react-router-dom";
import LoadingButton from "./common/LoadingButton";
import Message from "./common/Message";

import { UserContext } from "../App"

const Home = () => {
    const [userData, setUserData] = useState({name:"", email:"", phone:"", message:""});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});


    const {state, dispatch} = useContext(UserContext)

    

    const userContact = useCallback(async () => {
        try {
            const res = await fetch ('/getdata', {
                method: 'GET',
                headers:{
                    "Content-Type" : "application/json"
                },
            });

            const data = await res.json();

            setUserData(prevData => ({...prevData, name:data.name, email:data.email, phone:data.phone}));


            if(!res.status === 200){
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error)
        }
    }, []);

    useEffect(() => {
       userContact();
    }, [userContact])

    const handleInputs = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        setUserData({...userData, [name]:value });

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({...errors, [name]: ""});
        }
        setMessage("");
    }

    const validateContactForm = () => {
        const newErrors = {};

        if (!userData.name.trim()) newErrors.name = "Name is required";
        if (!userData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = "Email is invalid";
        if (!userData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
        if (!userData.message.trim()) newErrors.message = "Message is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const sendMessage = async (e) =>{
        e.preventDefault();

        if (!validateContactForm()) {
            setMessage("Please fix the errors above");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const {name, email, phone, message}= userData;

            const res = await fetch('/contact',{
                method:'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    name, email, phone, message
                })
            });

            const data = await res.json();

            if(res.status === 200 && data){
                setMessage("Message sent successfully! We'll get back to you soon.");
                setUserData({name:"", email:"", phone:"", message:""});
            } else {
                setMessage(data.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Contact form error:", error);
        } finally {
            setLoading(false);
        }
    }

    
    
    const Loginbutton= () =>{

        if(state){
            return <div>
                <LoadingButton variant="secondary" size="small">
                    <NavLink className="nav-link" to="/signout" style={{color: 'inherit', textDecoration: 'none'}}>
                        Logout
                    </NavLink>
                </LoadingButton>
            </div>
        }
        else{
            return <div>
                <LoadingButton variant="primary" size="small">
                    <NavLink className="nav-link" to="/signin" style={{color: 'inherit', textDecoration: 'none'}}>
                        Login
                    </NavLink>
                </LoadingButton>

                </div>
        }

    }


    return (
        

        <>

        <header className="header">

            <div id="menu-btn" className="fas fa-bars"></div>

            <NavLink className="logo" to="/"> Bike<span>Book</span></NavLink>
        
            

            <nav className="navbar">
                <NavLink  to="/">Home</NavLink>
                <NavLink  to="/rentbike">Rent Bikes</NavLink>
                <a href="#services">Testimonial</a>
                <a href="#contact">Contact</a>
            </nav>
            <div id="login-btn">
                    <Loginbutton />
            </div>

        </header> 


        

<section className="home" id="home">

<h3 data-speed="-2" className="home-parallax">Rent a Bike</h3>

<img data-speed="5" className="home-parallax" src="/image/home.png" alt=""/>

<LoadingButton variant="primary" size="large">
    <NavLink to="/exploreRentBikes" style={{color: 'inherit', textDecoration: 'none'}}>
        Bike Showcase
    </NavLink>
</LoadingButton>

</section>

<section className="icons-container">

<div className="icons">
    <i className="fas fa-home"></i>
    <div className="content">
        <h3>150+</h3>
        <p>branches</p>
    </div>
</div>

<div className="icons">
  <i class="fa-sharp fa-solid fa-person-biking"></i>
    <div className="content">
        <h3>4770+</h3>
        <p>Bikes Rented</p>
    </div>
</div>

<div className="icons">
    <i className="fas fa-users"></i>
    <div className="content">
        <h3>320+</h3>
        <p>happy clients</p>
    </div>
</div>

<div className="icons">
<i class="fa-sharp fa-solid fa-motorcycle"></i>
    <div className="content">
        <h3>1500+</h3>
        <p>Available Bikes</p>
    </div>
</div>

</section>

<section className="services" id="services">

<h1 className="heading"> Our Customers <span>Thoughts</span> </h1>

<div className="box-container">

    <div className="box">
        <div className="rev-img">
            <img src="https://scontent.fdac136-1.fna.fbcdn.net/v/t39.30808-6/312703748_3478501779085230_1950780946585482384_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGkwHPUk95MDAfygYTyGWU7X3HO7w5t9apfcc7vDm31qpmla904Bn5UkCZ7ObAXeE6s97HwrxX59lb7HBl528sV&_nc_ohc=9c5en2xXM18AX-BdD7P&_nc_ht=scontent.fdac136-1.fna&oh=00_AfAzZsPJ2adgBqspzwz4T8kHfHPcm6E07csvy1wh1YMN-A&oe=63B51CB5" alt="" />
        </div>
        <h3>Sabbir Hossain Abir</h3>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis voluptate repellat eos, expedita culpa laboriosam vel fuga dolore unde quisquam earum explicabo aliquid, ducimus ullam saepe. Tempore, esse est. Possimus.</p>
    </div>

    <div className="box">
    <div className="rev-img">
            <img src="https://scontent.fdac136-1.fna.fbcdn.net/v/t39.30808-6/302145899_156532100373085_2010151763920459654_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHrbcdLZRWuaHsXyYUqG_jpdhVNC4mwOVF2FU0LibA5UT8iradxAwDYoNQF4d_Zqs77lKP1RnqwDQ1gm3jJy1wC&_nc_ohc=4iFR4J4vO6MAX87zxFw&tn=hr3FB-mU0E1Jjxz3&_nc_ht=scontent.fdac136-1.fna&oh=00_AfAZfiNQl5VvdFFbumJkgwpxKH1VD595Nrna4L9g10pnoA&oe=63B40E67" alt="" />
        </div>
        <h3>Zakaria Bin Moti</h3>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi modi quaerat accusantium consectetur eos soluta dolor quas nam quos veniam expedita architecto optio fugit possimus earum reiciendis rem, dicta nemo.</p>
    </div>


    <div className="box">
    <div className="rev-img">
            <img src="https://scontent.fdac136-1.fna.fbcdn.net/v/t39.30808-6/314706916_1532727437148345_5356733734063348288_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeGi-Fe-pxZvDOWFXu32V4tIyyC-tKKPgdHLIL60oo-B0Y4ywceIpFaJENe1ExTPOaLyzEPhnSs8fZXHFPDZJxy-&_nc_ohc=Q8a2pz_MnqoAX9hf_B4&_nc_ht=scontent.fdac136-1.fna&oh=00_AfA5j5ghvAIVLgdwNYNYvmYOqkk_07CFFrWeyXtKF0_w7A&oe=63B41F9C" alt="" />
        </div>
        <h3>Protick Saha</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia amet maiores magni commodi. Voluptatem aut aliquid mollitia sunt iusto sapiente numquam culpa illo recusandae sequi nam sed eaque, accusantium nesciunt!</p>
    </div>

</div>

</section>





<section className="contact" id="contact">

<h1 className="heading"><span>contact</span> us</h1>

<div className="row">

    <form method="POST">
        <h3>get in touch</h3>
        <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputs}
            placeholder="your name"
            className={`box ${errors.name ? 'error' : ''}`}
            disabled={loading}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}

        <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputs}
            placeholder="your email"
            className={`box ${errors.email ? 'error' : ''}`}
            disabled={loading}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleInputs}
            placeholder="your phone"
            className={`box ${errors.phone ? 'error' : ''}`}
            disabled={loading}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}

        <textarea
            placeholder="your message"
            name="message"
            value={userData.message}
            onChange={handleInputs}
            className={`box ${errors.message ? 'error' : ''}`}
            cols="30"
            rows="10"
            disabled={loading}
        ></textarea>
        {errors.message && <span className="error-message">{errors.message}</span>}

        {message && (
            <Message
                type={message.includes('successfully') ? 'success' : 'error'}
                message={message}
                onClose={() => setMessage("")}
            />
        )}

        <LoadingButton
            type="submit"
            loading={loading}
            onClick={sendMessage}
            variant="primary"
            size="large"
        >
            {loading ? "Sending..." : "Send Message"}
        </LoadingButton>
    </form>

</div>

</section>

<section className="footer" id="footer">
    <div className="footer-content">
        <div className="footer-top">
            <div className="footer-brand">
                <NavLink className="footer-logo" to="/">
                    <span>Bike</span>Book
                </NavLink>
                <p className="footer-description">
                    Your trusted partner for premium bike rentals. Experience the freedom of the road with our well-maintained fleet of motorcycles and bicycles.
                </p>
                <div className="footer-social">
                    <a href="#" className="social-link" aria-label="Facebook">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                </div>
            </div>

            <div className="footer-links">
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/rentbike">Rent Bikes</NavLink></li>
                        <li><NavLink to="/exploreRentBikes">Bike Showcase</NavLink></li>
                        <li><a href="#services">Testimonials</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Our Services</h3>
                    <ul>
                        <li><a href="#">Motorcycle Rental</a></li>
                        <li><a href="#">Bicycle Rental</a></li>
                        <li><a href="#">Long-term Lease</a></li>
                        <li><a href="#">Corporate Packages</a></li>
                        <li><a href="#">Insurance Coverage</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Our Locations</h3>
                    <ul>
                        <li><i className="fas fa-map-marker-alt"></i> Mirpur, Dhaka</li>
                        <li><i className="fas fa-map-marker-alt"></i> Farmgate, Dhaka</li>
                        <li><i className="fas fa-map-marker-alt"></i> Badda, Dhaka</li>
                        <li><i className="fas fa-map-marker-alt"></i> Aftabnagar, Dhaka</li>
                        <li><i className="fas fa-map-marker-alt"></i> Uttara, Dhaka</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Contact Info</h3>
                    <ul>
                        <li>
                            <i className="fas fa-phone"></i>
                            <div>
                                <span>+880 1234-567890</span>
                                <span>+880 1111-222333</span>
                            </div>
                        </li>
                        <li>
                            <i className="fas fa-envelope"></i>
                            <span>info@bikebook.com</span>
                        </li>
                        <li>
                            <i className="fas fa-clock"></i>
                            <div>
                                <span>Mon - Fri: 9:00 AM - 8:00 PM</span>
                                <span>Sat - Sun: 10:00 AM - 6:00 PM</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="footer-bottom-content">
                <div className="copyright">
                    <p>&copy; 2024 BikeBook. All rights reserved. Made with ❤️ by AH Milon</p>
                </div>
                <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </div>
    </div>
</section>





        </>
    )
    
}



export default Home
