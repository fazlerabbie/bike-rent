import React, {useEffect, useContext, useState, useCallback} from 'react';
import "../dashboard.css";
import {NavLink, useHistory} from "react-router-dom";
import LoadingButton from "./common/LoadingButton";
import Message from "./common/Message";

import { AdminContext } from "../App"

const Dashboard = () => {

  const {adminState, dispatchadmin} = useContext(AdminContext)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);

  const history = useHistory();

  const callDashboard = useCallback(async () => {
      setLoading(true);
      try {
          const res = await fetch('/dashboard', {
            method: "GET",
            headers: {
              Accept : "application/json",
              "Content-Type" : "application/json"
            },
            credentials: "include"
          });

          const data = await res.json();

          if(res.status !== 200){
            const error = new Error(res.error);
            throw error;
          }

          setMessage("Dashboard loaded successfully");

      } catch (error) {
        console.log(error)
        setMessage("Authentication failed. Redirecting to login...");
        setTimeout(() => {
          history.push("/adminsignin");
        }, 2000);
      } finally {
        setLoading(false);
      }
  }, [history]);


  useEffect(() => {
    callDashboard();
  }, [callDashboard])



const Loginbutton= () =>{

  if(adminState){
      return <div>
          <LoadingButton variant="danger" size="small" className="logoutbtnDash">
            <NavLink className="nav-link" to="/adminsignout" style={{color: 'inherit', textDecoration: 'none'}}>
              Logout
            </NavLink>
          </LoadingButton>
      </div>
  }
  else{
      return <div>
          <LoadingButton variant="primary" size="small" className="logoutbtnDash">
            <NavLink to="/signin" style={{color: 'inherit', textDecoration: 'none'}}>
              Login
            </NavLink>
          </LoadingButton>
          </div>
  }
}



    return (
        <>
            

  <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
    <div className="logo-details">
      <i className=''></i>
      <span className='logo_name1'>Bike</span><span className="logo_name">Book</span>
    </div>
      <ul className="nav-links">
        <li>
            <NavLink className="dashlinks" to="/dashboard">
            <i className='bx bx-grid-alt' ></i>
            <span className="allLinks_name">Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/addbikes">
            <i class="fa-sharp fa-solid fa-square-plus"></i>
            <span className="allLinks_name">Add Bikes</span>
            </NavLink>
        </li>

        <li>
            <NavLink className="dashlinks" to="/getrentbikesforadmin">
            <i class="fa-sharp fa-solid fa-motorcycle"></i>
            <span className="allLinks_name">Available Rent Bikes</span>
            </NavLink>
        </li>

        <li>
            <NavLink className="dashlinks" to="/rentbikesreports">
            <i class="fa-solid fa-sack-dollar"></i>
            <span className="allLinks_name">Rent Bikes Income</span>
            </NavLink>
        </li>
        <li>
          <NavLink className="dashlinks" to="/availableusers">
          <i class="fa-solid fa-users"></i>
            <span className="allLinks_name">Available Users</span>
          </NavLink>
        </li>
      </ul>

      <div className="logoutbtnDashDiv">
        <Loginbutton/>
      </div>
  </div>



  <section className="home-section">
    <nav>
      <div className="sidebar-button">
        <button
          className="menu-toggle"
          onClick={() => setSidebarActive(!sidebarActive)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <span className="dashboard">Dashboard</span>
      </div>

      <div className="profile-details">
        <span className="admin_name">Admin</span>
      </div>

    </nav>

    <div className="home-content">
      {loading && (
        <Message type="info" message="Loading dashboard..." />
      )}
      {message && !loading && (
        <Message
          type={message.includes('successfully') ? 'success' : 'error'}
          message={message}
          onClose={() => setMessage("")}
          autoClose={true}
        />
      )}

      <div className="dashboard-header">
        <h1>Welcome to BikeBook Dashboard</h1>
        <p>Manage your bike rental business with ease</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-sharp fa-solid fa-motorcycle"></i>
          </div>
          <div className="stat-content">
            <h3>Total Bikes</h3>
            <p>Manage your fleet</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p>Track your income</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Users</h3>
            <p>Manage customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-sharp fa-solid fa-square-plus"></i>
          </div>
          <div className="stat-content">
            <h3>Add Bikes</h3>
            <p>Expand your fleet</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <NavLink to="/addbikes" className="action-card">
            <i className="fa-sharp fa-solid fa-square-plus"></i>
            <h3>Add New Bikes</h3>
            <p>Add bikes to your rental fleet</p>
          </NavLink>

          <NavLink to="/getrentbikesforadmin" className="action-card">
            <i className="fa-sharp fa-solid fa-motorcycle"></i>
            <h3>Manage Bikes</h3>
            <p>View and manage available bikes</p>
          </NavLink>

          <NavLink to="/rentbikesreports" className="action-card">
            <i className="fa-solid fa-sack-dollar"></i>
            <h3>Income Reports</h3>
            <p>View rental income and analytics</p>
          </NavLink>

          <NavLink to="/availableusers" className="action-card">
            <i className="fa-solid fa-users"></i>
            <h3>User Management</h3>
            <p>Manage registered users</p>
          </NavLink>
        </div>
      </div>
    </div>

  </section>



        </>
    )
}

export default Dashboard
