import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useHistory } from "react-router-dom";
import Stripe from "react-stripe-checkout";
import Message from "./common/Message";

import { UserContext } from "../App"

const Rentbikecart = () => {

    const {state, dispatch} = useContext(UserContext)

    const [cartUser, setCartUser] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    let itemsPrice, idOfRentedBike, reqHours;

    const getCartData = async () =>{
        try {
            const res = await fetch ('/getRentCartData', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setIsAuthenticated(false);
                    setMessage("Please log in to view your cart.");
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setCartUser(data.userById)
            setItems(data.cartItems)
          

            if(!res.status === 200){
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCartData();
    }, [])
    
    items.map(items =>{
        itemsPrice = items.totalbill;
        idOfRentedBike = items.rentbikeid;
        reqHours = items.requiredhours;
    })

    const handlePayMethod = (itemsPrice, token) =>{
            return fetch("/stripeRentPay", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    token: token.id,
                    amount: itemsPrice,
                    idRentedBike: idOfRentedBike,
                    hoursRequired: reqHours
                })
            })

    }

    const tokenHandler = (token) =>{
        handlePayMethod(itemsPrice, token);
        updateDataBase();
    }


    const updateDataBase = () =>{
        return fetch("/updateRentDataBase", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                items
            })
        })
    }


   
    
    const Loginbutton= () =>{
        
        if(state){
            return <div> 
                <button ><NavLink className="btn" to="/signout">logout</NavLink></button>      
            </div>
        }
        else{
            return <div>  
                    <button ><NavLink className="btn" to="/signin">login</NavLink></button>
                    
                </div>
        }
    }

    const deleteRentItem = async (e) => {
        const cartitemid = e.target.id;

        if (!window.confirm("Are you sure you want to remove this bike from your rental cart?")) {
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/deleteitemfromrentcart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    cartitemid
                })
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                setMessage("Item removed from cart successfully!");
                // Refresh the cart data
                getCartData();
            } else {
                setMessage(data.message || "Failed to remove item from cart");
            }
        } catch (error) {
            console.error("Delete error details:", error);
            if (error.message.includes('401')) {
                setMessage("Please log in to remove items from cart.");
            } else if (error.message.includes('404')) {
                setMessage("Item not found in cart.");
            } else if (error.message.includes('500')) {
                setMessage("Server error. Please try again later.");
            } else {
                setMessage("Network error. Please check your connection and try again.");
            }
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
                <NavLink to="/">Home</NavLink>
                <NavLink to="/rentbike">Rent Bikes</NavLink>
                </nav>

                <div id="login-btn">
                    <Loginbutton />
                </div>
            </header>

            <div className='modern-cart-container'>
                <div className="cart-header">
                    <h1 className="cart-title">
                        <i className="fas fa-clock"></i>
                        Rental Cart
                    </h1>
                    <p className="cart-subtitle">Review your bike rental bookings</p>
                </div>

                {message && (
                    <Message
                        type={message.includes('successfully') ? 'success' : 'error'}
                        message={message}
                        onClose={() => setMessage("")}
                        autoClose={true}
                    />
                )}

                {!isAuthenticated ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="fas fa-user-lock"></i>
                        </div>
                        <h2>Please Log In</h2>
                        <p>You need to be logged in to view your rental cart</p>
                        <NavLink to="/signin" className="btn btn-primary btn-lg">
                            <i className="fas fa-sign-in-alt"></i>
                            Log In
                        </NavLink>
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <h2>Your rental cart is empty</h2>
                        <p>Find the perfect bike for your next adventure!</p>
                        <NavLink to="/rentbike" className="btn btn-primary btn-lg">
                            <i className="fas fa-motorcycle"></i>
                            Browse Bikes
                        </NavLink>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {items.map((item) => (
                                <div className="modern-cart-item rental-item" key={item._id}>
                                    <div className="item-image">
                                        <i className="fas fa-motorcycle"></i>
                                    </div>
                                    <div className="item-details">
                                        <h3 className="item-title">{item.brand} {item.model}</h3>
                                        <div className="item-specs">
                                            <span className="spec-item">
                                                <i className="fas fa-tag"></i>
                                                Brand: {item.brand}
                                            </span>
                                            <span className="spec-item">
                                                <i className="fas fa-cog"></i>
                                                Model: {item.model}
                                            </span>
                                            <span className="spec-item">
                                                <i className="fas fa-clock"></i>
                                                Duration: {item.requiredhours} hours
                                            </span>
                                            <span className="spec-item">
                                                <i className="fas fa-money-bill-wave"></i>
                                                Rate: ৳{item.rentperhour}/hour
                                            </span>
                                        </div>
                                    </div>
                                    <div className="item-price">
                                        <span className="price-label">Total</span>
                                        <span className="price-value">৳{item.totalbill}</span>
                                        <span className="price-breakdown">
                                            {item.requiredhours}h × ৳{item.rentperhour}
                                        </span>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            id={item._id}
                                            onClick={deleteRentItem}
                                            className="delete-btn modern-delete-btn"
                                            disabled={loading}
                                            title="Remove from cart"
                                        >
                                            {loading ?
                                                <i className="fa fa-spinner fa-spin"></i> :
                                                <i className="fa fa-trash"></i>
                                            }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-card">
                                <h3>Rental Summary</h3>
                                <div className="summary-row">
                                    <span>Items ({items.length})</span>
                                    <span>{items.reduce((total, item) => total + parseInt(item.requiredhours), 0)} hours</span>
                                </div>
                                <div className="summary-row">
                                    <span>Total Amount</span>
                                    <span>৳{items.reduce((total, item) => total + parseInt(item.totalbill), 0)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Security Deposit</span>
                                    <span className="free">Included</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total Payment</span>
                                    <span>৳{items.reduce((total, item) => total + parseInt(item.totalbill), 0)}</span>
                                </div>

                                <div className="cart-actions">
                                    <NavLink to="/rentbike" className="btn btn-outline btn-lg">
                                        <i className="fas fa-arrow-left"></i>
                                        Continue Browsing
                                    </NavLink>
                                </div>

                                <div className="checkout-section">
                                    <h4>Payment Method</h4>
                                    <p>Secure payment for your bike rental</p>
                                    <Stripe
                                        stripeKey="pk_test_51Jyb5UBvc4Qazj8jy6qimLop4epxe5jziUD3ixj5ISycjjD6yYVGZhk688Pz9Lna32VTHbSHxRwkrvNNnnnr96P000M68u5jcd"
                                        token={tokenHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Rentbikecart
