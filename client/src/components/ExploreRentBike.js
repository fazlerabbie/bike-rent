import React, {useState, useEffect, useContext} from 'react'
import { NavLink } from "react-router-dom";
import LoadingButton from "./common/LoadingButton";
import Message from "./common/Message";

import { UserContext } from "../App"

const ExploreRentBike = () => {

    const {state, dispatch} = useContext(UserContext)
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


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



    const [renttbikesData, setrenttbikesData] = useState([]);

    const exploreRentBike = async () =>{
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch ('/exploreRentBikeData', {
                method: 'GET',
            });

            const data = await res.json();

            if(res.status === 200){
                setrenttbikesData(data);
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
    }

    useEffect(() => {
        exploreRentBike();
    }, [])

    

    const alertDiv = document.getElementById("alertDiv")
    const handleClick = () =>{
        if(alertDiv.style.display === "none"){
            alertDiv.style.display = "flex"
            window.alert("Please signin to rent the bike!");
        }
        else{
            alertDiv.style.display = "flex"
        }
    }


    const hideAlert = () => {
        if(alertDiv.style.display === "flex"){
            alertDiv.style.display = "none"
        }
        else{
            alertDiv.style.display = "none"
        }
    }


    return (
        <>

            <header className="header">
            <div id="menu-btn" className="fas fa-bars"></div>
            <NavLink className="logo" to="/"> <span>Bike</span>Book </NavLink>

            <nav className="navbar">
                <NavLink  to="/">Home</NavLink>
                <NavLink to="/rentbike">Rent Bike</NavLink>
            </nav>
            <div id="login-btn">
                <Loginbutton />
            </div>
            </header>

            <div id="alertDiv" >
            <p>Have you liked it?</p>
            <button className='btn' onClick={hideAlert}><NavLink to="/rentbike" className="nav-link">Rent Now</NavLink></button>
        </div>


        <div className="exploreBikesDiv">

        {renttbikesData.map((renttbikesData, index) =>  
        
        <div className = "exploreBikesImg"  key={renttbikesData._id}>    

            <img src={renttbikesData.filePath} alt="" style={{width: "80%", height: "70%"}} onClick={handleClick}/>
            <h4><b>{renttbikesData.brand}</b></h4>
            <p>{renttbikesData.model}</p>
            </div>
        )}

        </div>
        </>
    )
}

export default ExploreRentBike