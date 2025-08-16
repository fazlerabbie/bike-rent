import React, {useState, useEffect, useContext, useCallback} from 'react'
import { NavLink, useHistory } from "react-router-dom";
import LoadingButton from "./common/LoadingButton";
import Message from "./common/Message";
import "./BikeRental.css";

import { UserContext } from "../App"

const Rentabike = () => {

    const {state, dispatch} = useContext(UserContext)

    const history = useHistory();

    const [rentBikesData, setRentBikesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [bookingLoading, setBookingLoading] = useState({});
    const [bikeViews, setBikeViews] = useState({}); // Track which view is active for each bike
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const allRentBikes = useCallback(async () => {
        setLoading(true);
        setMessage("");

        try {

            if(!state){
                setMessage("Please sign in to see all available bikes for rent!");
                setTimeout(() => {
                    history.push('/signin');
                }, 2000);
                return;
            }

            const res = await fetch ('/getRentBikeData', {
                method: 'GET',
            });

            const data = await res.json();

            if(res.status === 200){
                setRentBikesData(data);
                setMessage(`Found ${data.length} bikes available for rent`);
            } else {
                setMessage("Failed to load bikes. Please try again.");
            }

        } catch (error) {
            console.log(error);
            setMessage("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, [state, history]);

    // Load cart data from localStorage
    const loadCartData = useCallback(() => {
        const savedCart = localStorage.getItem('bikeCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCartItems(cartData);
            setCartCount(cartData.length);
        }
    }, []);

    useEffect(() => {
        allRentBikes();
        loadCartData();
    }, [allRentBikes, loadCartData])

    // Save cart data to localStorage
    const saveCartData = (newCartItems) => {
        localStorage.setItem('bikeCart', JSON.stringify(newCartItems));
        setCartItems(newCartItems);
        setCartCount(newCartItems.length);
    };

    const showDetails = (bikeIndex) => {
        // Reset any form data when switching views
        setRentHours('');
        setMessage('');
        setBikeViews(prev => ({
            ...prev,
            [bikeIndex]: prev[bikeIndex] === 'details' ? 'bike' : 'details'
        }));
    };

    const showBike = (bikeIndex) => {
        // Reset any form data when going back to bike view
        setRentHours('');
        setMessage('');
        setBikeViews(prev => ({
            ...prev,
            [bikeIndex]: 'bike'
        }));
    };

    const [rentHours, setRentHours] = useState('')
    const handleInputs = (e) =>{
        let value = e.target.value;
        setRentHours(value);
    }

    const addToCart = (bikeIndex) => {
        // Clear any previous messages and reset form
        setMessage('');
        setRentHours('');
        setBikeViews(prev => ({
            ...prev,
            [bikeIndex]: prev[bikeIndex] === 'form' ? 'bike' : 'form'
        }));
    };

    const showBikeAgain = (bikeIndex) => {
        // Reset form data when going back
        setRentHours('');
        setMessage('');
        setBikeViews(prev => ({
            ...prev,
            [bikeIndex]: 'bike'
        }));
    };

    const proceedToCart = async (bikeData, bikeIndex) => {
        // Check if user is logged in
        if (!state) {
            setMessage("Please log in to add items to cart.");
            setTimeout(() => {
                history.push('/signin');
            }, 2000);
            return;
        }

        if (!rentHours || rentHours <= 0) {
            setMessage("Please enter valid rent hours (1-24)");
            return;
        }

        setBookingLoading({...bookingLoading, [bikeData._id]: true});

        try {
            const res = await fetch("/addrentcartocart", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    itemId: bikeData._id,
                    rentHours: parseInt(rentHours)
                })
            });

            const data = await res.json();

            if(res.status === 200 || res.status === 201) {
                if (data.success) {
                    // Add to local cart
                    const cartItem = {
                        id: bikeData._id,
                        brand: bikeData.brand,
                        model: bikeData.model,
                        rentHours: parseInt(rentHours),
                        pricePerHour: bikeData.rent,
                        totalPrice: bikeData.rent * parseInt(rentHours),
                        image: bikeData.filePath,
                        addedAt: new Date().toISOString()
                    };

                    const newCartItems = [...cartItems, cartItem];
                    saveCartData(newCartItems);

                    setMessage(data.message || `${bikeData.brand} ${bikeData.model} added to cart for ${rentHours} hours!`);
                    setRentHours('');
                    setBikeViews(prev => ({...prev, [bikeIndex]: 'bike'}));
                } else {
                    setMessage(data.error || "Something went wrong. Please try again.");
                }
            } else if (res.status === 401) {
                setMessage("Please log in to add items to cart.");
            } else if (res.status === 400) {
                setMessage(data.error || "Invalid request. Please check your input.");
            } else {
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Add to cart error:", error);
        } finally {
            setBookingLoading({...bookingLoading, [bikeData._id]: false});
        }
    };


   
    
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



    const [searchText, setSearchText] = useState('');

    const searchTextBtn = async () =>{
        if (!searchText.trim()) {
            setMessage("Please enter a search term");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/searchRentBike", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    searchText
                })
            });

            if (res.status === 200) {
                getSearchData();
            } else {
                setMessage("Search failed. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection and try again.");
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }



    const getSearchData = async () =>{
        try {
            const res = await fetch ('/rentbikesearchCategory', {
                method: 'GET',
            });

            const data = await res.json();
            
            setRentBikesData(data)                
          
            if(!res.status === 200){
                const error = new Error(res.error);
                throw error;
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        
            <header className="header">
                <div id="menu-btn" className="fas fa-bars"></div>
                <NavLink className="logo" to="/"> <span>Bike</span>Book </NavLink>
                <nav className="navbar">
                <NavLink className="nav-link" to="/">Home</NavLink>

                <NavLink className="nav-link cart-link" to="/rentbikecart">
                    🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </NavLink>
                
                <div className="search-container">
                    <input
                        type="text"
                        name="search"
                        placeholder="🔍 Search bikes..."
                        className="search-input"
                        value={searchText}
                        onChange={(e)=>setSearchText(e.target.value)}
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && searchTextBtn()}
                    />
                    <LoadingButton
                        type="submit"
                        onClick={searchTextBtn}
                        loading={loading}
                        variant="primary"
                        size="small"
                        className="search-btn"
                    >
                        {loading ? "..." : "🔍"}
                    </LoadingButton>
                    {searchText && (
                        <LoadingButton
                            onClick={() => {
                                setSearchText('');
                                allRentBikes();
                            }}
                            variant="secondary"
                            size="small"
                            className="clear-btn"
                        >
                            ✕ Clear
                        </LoadingButton>
                    )}
                </div>
                </nav>
                <div id="login-btn">
                <Loginbutton />
                </div>

            </header>

            {loading && (
                <Message type="info" message="Loading bikes..." />
            )}
            {message && !loading && (
                <Message
                    type={message.includes('successfully') || message.includes('Found') ? 'success' : 'error'}
                    message={message}
                    onClose={() => setMessage("")}
                    autoClose={true}
                />
            )}

            {!state && (
                <div style={{
                    background: "linear-gradient(135deg, #ff6a00 0%, #ee5a24 100%)",
                    color: "white",
                    padding: "20px",
                    textAlign: "center",
                    margin: "20px auto",
                    borderRadius: "15px",
                    maxWidth: "800px",
                    boxShadow: "0 10px 30px rgba(255, 106, 0, 0.3)"
                }}>
                    <h3 style={{margin: "0 0 10px 0", fontSize: "24px"}}>
                        🔒 Login Required
                    </h3>
                    <p style={{margin: "0 0 15px 0", fontSize: "16px", opacity: "0.9"}}>
                        Please log in to add bikes to your cart and make bookings
                    </p>
                    <NavLink
                        to="/signin"
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            color: "white",
                            padding: "12px 30px",
                            borderRadius: "25px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "16px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            display: "inline-block",
                            transition: "all 0.3s ease"
                        }}
                    >
                        🚀 Login Now
                    </NavLink>
                </div>
            )}

            <div className="rentbikebiked">
                {rentBikesData.map((bikeData, index) => {
                    const currentView = bikeViews[index] || 'bike';

                    return (
                        <div
                            key={bikeData._id}
                            className="bike-container"
                            style={{
                                minHeight: "450px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            {/* Main Bike View */}
                            {currentView === 'bike' && (
                                <div className="bikedivRentbike">
                                    <img
                                        src={bikeData.filePath}
                                        alt={`${bikeData.brand} ${bikeData.model}`}
                                        style={{
                                            width: "80%",
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                            marginBottom: "15px",
                                            transition: "transform 0.3s ease"
                                        }}
                                    />
                                    <h4 style={{
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        color: "#2c3e50",
                                        margin: "15px 0 8px 0",
                                        textTransform: "capitalize"
                                    }}>
                                        {bikeData.brand}
                                    </h4>
                                    <p style={{
                                        fontSize: "16px",
                                        color: "#7f8c8d",
                                        margin: "5px 0 15px 0",
                                        fontWeight: "500"
                                    }}>
                                        {bikeData.model}
                                    </p>
                                    <div style={{
                                        background: "linear-gradient(145deg, #27ae60, #229954)",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "25px",
                                        display: "inline-block",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        marginBottom: "15px",
                                        boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)"
                                    }}>
                                        ${bikeData.rent}/hour
                                    </div>

                                    <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px"}}>
                                        <LoadingButton
                                            variant="secondary"
                                            size="small"
                                            className='bikedbtn'
                                            onClick={() => showDetails(index)}
                                            style={{
                                                background: "linear-gradient(145deg, #6c757d, #5a6268)",
                                                border: "none",
                                                borderRadius: "25px",
                                                padding: "10px 18px",
                                                fontWeight: "600",
                                                fontSize: "13px",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            📋 View Details
                                        </LoadingButton>
                                        <LoadingButton
                                            variant="primary"
                                            size="small"
                                            className='bikedbtn'
                                            onClick={() => addToCart(index)}
                                            style={{
                                                background: "linear-gradient(145deg, #28a745, #218838)",
                                                border: "none",
                                                borderRadius: "25px",
                                                padding: "10px 18px",
                                                fontWeight: "600",
                                                fontSize: "13px",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            🛒 Rent Now
                                        </LoadingButton>
                                    </div>
                                </div>
                            )}

                            {/* Details View */}
                            {currentView === 'details' && (
                                <div className="specsDivRentbike">
                                    <div style={{textAlign: "center", marginBottom: "25px"}}>
                                        <img
                                            src={bikeData.filePath}
                                            alt={`${bikeData.brand} ${bikeData.model}`}
                                            style={{
                                                width: "200px",
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "12px",
                                                marginBottom: "15px",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                            }}
                                        />
                                        <h3 style={{
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            color: "#2c3e50",
                                            margin: "0 0 20px 0"
                                        }}>
                                            🚲 {bikeData.brand} {bikeData.model}
                                        </h3>
                                    </div>

                                    <div className="bike-specs" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                        gap: "15px",
                                        marginBottom: "25px"
                                    }}>
                                        <div style={{background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#3498db"}}>Brand:</strong> {bikeData.brand}
                                        </div>
                                        <div style={{background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#3498db"}}>Model:</strong> {bikeData.model}
                                        </div>
                                        <div style={{background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#3498db"}}>Year:</strong> {bikeData.year}
                                        </div>
                                        <div style={{background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#3498db"}}>Color:</strong> {bikeData.color}
                                        </div>
                                        <div style={{background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#3498db"}}>Seats:</strong> {bikeData.seats}
                                        </div>
                                        <div style={{background: "linear-gradient(145deg, #e8f5e8, #d4edda)", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
                                            <strong style={{color: "#27ae60"}}>Rent Per Hour:</strong> ${bikeData.rent}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "linear-gradient(145deg, #d4edda, #c3e6cb)",
                                        padding: "15px",
                                        borderRadius: "10px",
                                        marginBottom: "25px",
                                        textAlign: "center"
                                    }}>
                                        <p style={{color: "#27ae60", fontWeight: "bold", fontSize: "16px", margin: "0"}}>
                                            ✅ Available for {bikeData.availability} hours
                                        </p>
                                    </div>

                                    <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
                                        <LoadingButton
                                            variant="secondary"
                                            size="small"
                                            className='bikedbtn'
                                            style={{
                                                background: "linear-gradient(145deg, #17a2b8, #138496)",
                                                border: "none",
                                                borderRadius: "25px",
                                                padding: "10px 18px",
                                                fontWeight: "600",
                                                fontSize: "13px"
                                            }}
                                        >
                                            <NavLink
                                                className="nav-link"
                                                to={{pathname: '/rentbikereviews', state:{id: bikeData._id}}}
                                                style={{color: 'inherit', textDecoration: 'none'}}
                                            >
                                                ⭐ Reviews
                                            </NavLink>
                                        </LoadingButton>
                                        <LoadingButton
                                            variant="primary"
                                            size="small"
                                            className='bikedbtn'
                                            onClick={() => showBike(index)}
                                            style={{
                                                background: "linear-gradient(145deg, #6c757d, #5a6268)",
                                                border: "none",
                                                borderRadius: "25px",
                                                padding: "10px 18px",
                                                fontWeight: "600",
                                                fontSize: "13px"
                                            }}
                                        >
                                            🔙 Back to Bike
                                        </LoadingButton>
                                        <LoadingButton
                                            variant="success"
                                            size="small"
                                            className='bikedbtn'
                                            onClick={() => addToCart(index)}
                                            style={{
                                                background: "linear-gradient(145deg, #28a745, #218838)",
                                                border: "none",
                                                borderRadius: "25px",
                                                padding: "10px 18px",
                                                fontWeight: "600",
                                                fontSize: "13px"
                                            }}
                                        >
                                            🛒 Rent Now
                                        </LoadingButton>
                                    </div>
                                </div>
                            )}

                            {/* Booking Form View */}
                            {currentView === 'form' && (
                                <div className="formDivRentbike">
                                    <div style={{textAlign: "center", marginBottom: "25px"}}>
                                        <img
                                            src={bikeData.filePath}
                                            alt={`${bikeData.brand} ${bikeData.model}`}
                                            style={{
                                                width: "150px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "12px",
                                                marginBottom: "15px",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                                            }}
                                        />
                                        <h3 style={{
                                            fontSize: "22px",
                                            fontWeight: "700",
                                            color: "white",
                                            margin: "0 0 10px 0"
                                        }}>
                                            🚲 Rent {bikeData.brand} {bikeData.model}
                                        </h3>
                                        <div style={{
                                            background: "rgba(255,255,255,0.2)",
                                            padding: "10px 20px",
                                            borderRadius: "20px",
                                            display: "inline-block"
                                        }}>
                                            <p style={{
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                color: "white",
                                                margin: "0"
                                            }}>
                                                ${bikeData.rent} per hour
                                            </p>
                                        </div>
                                    </div>

                                    <form method="POST" onSubmit={(e) => {
                                        e.preventDefault();
                                        proceedToCart(bikeData, index);
                                    }}>
                                        <div style={{marginBottom: "25px"}}>
                                            <label
                                                htmlFor={`rentHours-${index}`}
                                                style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    color: "white",
                                                    fontWeight: "600",
                                                    fontSize: "16px"
                                                }}
                                            >
                                                How many hours do you want to rent?
                                            </label>
                                            <input
                                                id={`rentHours-${index}`}
                                                type="number"
                                                style={{
                                                    width: "100%",
                                                    padding: "15px",
                                                    border: "2px solid rgba(255,255,255,0.3)",
                                                    borderRadius: "10px",
                                                    fontSize: "16px",
                                                    background: "rgba(255,255,255,0.9)",
                                                    color: "#2c3e50",
                                                    fontWeight: "600",
                                                    textAlign: "center",
                                                    boxSizing: "border-box"
                                                }}
                                                name="rentforhours"
                                                value={rentHours}
                                                onChange={handleInputs}
                                                placeholder="Enter hours (1-24)"
                                                min="1"
                                                max="24"
                                                disabled={bookingLoading[bikeData._id]}
                                                required
                                            />
                                            {rentHours && (
                                                <div style={{
                                                    marginTop: "15px",
                                                    padding: "15px",
                                                    background: "rgba(255,255,255,0.2)",
                                                    borderRadius: "10px",
                                                    textAlign: "center"
                                                }}>
                                                    <p style={{
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: "18px",
                                                        margin: "0"
                                                    }}>
                                                        Total Cost: ${bikeData.rent * parseInt(rentHours || 0)} for {rentHours} hours
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap"}}>
                                            <LoadingButton
                                                variant="secondary"
                                                size="medium"
                                                onClick={() => showBikeAgain(index)}
                                                disabled={bookingLoading[bikeData._id]}
                                                style={{
                                                    background: "rgba(255,255,255,0.2)",
                                                    border: "2px solid rgba(255,255,255,0.5)",
                                                    borderRadius: "25px",
                                                    padding: "12px 24px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    color: "white"
                                                }}
                                            >
                                                🔙 Back
                                            </LoadingButton>
                                            <LoadingButton
                                                type="submit"
                                                variant="success"
                                                size="medium"
                                                loading={bookingLoading[bikeData._id]}
                                                disabled={!rentHours || rentHours <= 0 || !state}
                                                style={{
                                                    background: bookingLoading[bikeData._id] ? "rgba(255,255,255,0.3)" :
                                                               !state ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.9)",
                                                    border: "none",
                                                    borderRadius: "25px",
                                                    padding: "12px 24px",
                                                    fontWeight: "700",
                                                    fontSize: "14px",
                                                    color: bookingLoading[bikeData._id] ? "white" :
                                                           !state ? "#999" : "#ff6a00"
                                                }}
                                                title={!state ? "Please log in to add to cart" : ""}
                                            >
                                                {bookingLoading[bikeData._id] ? "Adding to Cart..." :
                                                 !state ? "🔒 Login Required" : "🛒 Add to Cart"}
                                            </LoadingButton>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


        </>
    )
}

export default Rentabike
