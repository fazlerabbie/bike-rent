import React, {useState, useContext} from 'react'
import {NavLink} from "react-router-dom";
import "../../registerStyle.css";
import LoadingButton from "../common/LoadingButton";
import Message from "../common/Message";

import { AdminContext } from "../../App"

const Addbikes = () => {

  const {adminState} = useContext(AdminContext)
    const [rentLoading, setRentLoading] = useState(false);
    const [rentMessage, setRentMessage] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);


    const [rentFile, setRentFile] = useState();
    const [rentbike, setRentBike] = useState({
        brand : "",
        model : "",
        year : "",
        color : "",
        seats : "",
        price : "",
        rent : ""
    });

    let rentName, rentValue;

    const handleRentInputs = (e) =>{
        rentName = e.target.name;
        rentValue = e.target.value;

        setRentBike({...rentbike, [rentName]:rentValue});
        setRentMessage("");

        // Clear specific field error when user starts typing
        if (formErrors[rentName]) {
            setFormErrors(prev => ({
                ...prev,
                [rentName]: ""
            }));
        }
    }

    const validateRentForm = () => {
        const newErrors = {};

        if (!rentbike.brand.trim()) newErrors.brand = "Brand is required";
        if (!rentbike.model.trim()) newErrors.model = "Model is required";
        if (!rentbike.year.trim()) newErrors.year = "Year is required";
        else if (parseInt(rentbike.year) < 1990 || parseInt(rentbike.year) > 2024) {
            newErrors.year = "Year must be between 1990 and 2024";
        }
        if (!rentbike.color.trim()) newErrors.color = "Color is required";
        if (!rentbike.seats.trim()) newErrors.seats = "Seats is required";
        else if (parseInt(rentbike.seats) < 1 || parseInt(rentbike.seats) > 10) {
            newErrors.seats = "Seats must be between 1 and 10";
        }
        if (!rentbike.price.trim()) newErrors.price = "Price is required";
        else if (parseFloat(rentbike.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }
        if (!rentbike.rent.trim()) newErrors.rent = "Rent per hour is required";
        else if (parseFloat(rentbike.rent) <= 0) {
            newErrors.rent = "Rent must be greater than 0";
        }
        if (!rentFile) newErrors.image = "Bike image is required";

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    
    
    const handleRentFile = (e) =>{
        const file = e.target.files[0];
        setRentFile(file);
        setRentMessage("");

        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear file error
            if (formErrors.image) {
                setFormErrors(prev => ({
                    ...prev,
                    image: ""
                }));
            }
        } else {
            setPreviewImage(null);
        }
    }
    
    
    const postRentData = async (e) =>{
        e.preventDefault();

        if (!validateRentForm()) {
            setRentMessage("Please fill all required fields");
            return;
        }

        if (!rentFile) {
            setRentMessage("Please select an image file");
            return;
        }

        setRentLoading(true);
        setRentMessage("");

        try {
            let rentData = new FormData();
            rentData.append('brand', rentbike.brand)
            rentData.append('model', rentbike.model)
            rentData.append('year', rentbike.year)
            rentData.append('color', rentbike.color)
            rentData.append('seats', rentbike.seats)
            rentData.append('price', rentbike.price)
            rentData.append('rent', rentbike.rent)
            rentData.append('myrentfile', rentFile)


            const res = await fetch("/addrentbikes", {
                method: "POST",
                body: rentData
            });

            const data = await res.json();

            if (res.status === 200) {
                setRentMessage("Rent bike added successfully!");
                // Reset form completely
                setRentBike({
                    brand: "", model: "", year: "", color: "", seats: "", price: "", rent: ""
                });
                setRentFile(null);
                setFormErrors({});
                setPreviewImage(null);
                // Reset file input
                const fileInput = document.getElementById('image');
                if (fileInput) fileInput.value = '';
            } else {
                setRentMessage(data.error || "Failed to add rent bike. Please try again.");
            }
        } catch (error) {
            setRentMessage("Network error. Please check your connection and try again.");
            console.error("Add rent bike error:", error);
        } finally {
            setRentLoading(false);
        }
    }



    
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
            <NavLink className="nav-link" to="/signin" style={{color: 'inherit', textDecoration: 'none'}}>
              Login
            </NavLink>
          </LoadingButton>

          </div>
  }
}


    return (
        <>
            
            <div className="sidebar">
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
            <i className="fa-sharp fa-solid fa-square-plus"></i>
            <span className="allLinks_name">Add Bikes</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/getrentbikesforadmin">
            <i className="fa-sharp fa-solid fa-motorcycle"></i>
            <span className="allLinks_name">Available Rent Bikes</span>
            </NavLink>
        </li>
        <li>
            <NavLink className="dashlinks" to="/rentbikesreports">
            <i className="fa-solid fa-sack-dollar"></i>
            <span className="allLinks_name">Rent Bikes Income</span>
            </NavLink>
        </li>
        <li>
          <NavLink className="dashlinks" to="/availableusers">
          <i className="fa-solid fa-users"></i>
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
        <span className="dashboard">Dashboard</span>
      </div>
      
      <div className="profile-details">
        <span className="admin_name">Admin</span>
      </div>
    </nav>

    <div className="modern-add-bikes-content">
      <div className="add-bikes-header">
        <h1 className="page-title">
          <i className="fas fa-plus-circle"></i>
          Add New Bike
        </h1>
        <p className="page-subtitle">Expand your fleet with new rental bikes</p>
      </div>

      {rentMessage && (
        <Message
          type={rentMessage.includes('successfully') ? 'success' : 'error'}
          message={rentMessage}
          onClose={() => setRentMessage("")}
          autoClose={true}
        />
      )}

      <div className="add-bike-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>
              <i className="fas fa-motorcycle"></i>
              Bike Information
            </h2>
            <p>Fill in the details for the new rental bike</p>
          </div>

          <form className="modern-bike-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="brand" className="form-label">
                  <i className="fas fa-tag"></i>
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={rentbike.brand}
                  onChange={handleRentInputs}
                  placeholder="e.g., Honda, Yamaha, Suzuki"
                  disabled={rentLoading}
                  className={`form-input ${formErrors.brand ? 'error' : ''}`}
                  required
                />
                {formErrors.brand && <span className="error-message">{formErrors.brand}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="model" className="form-label">
                  <i className="fas fa-cog"></i>
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  value={rentbike.model}
                  onChange={handleRentInputs}
                  placeholder="e.g., CBR 150R, FZ-S"
                  disabled={rentLoading}
                  className={`form-input ${formErrors.model ? 'error' : ''}`}
                  required
                />
                {formErrors.model && <span className="error-message">{formErrors.model}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  <i className="fas fa-calendar-alt"></i>
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  name="year"
                  id="year"
                  value={rentbike.year}
                  onChange={handleRentInputs}
                  placeholder="2024"
                  disabled={rentLoading}
                  min="1990"
                  max="2024"
                  className={`form-input ${formErrors.year ? 'error' : ''}`}
                  required
                />
                {formErrors.year && <span className="error-message">{formErrors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="color" className="form-label">
                  <i className="fas fa-palette"></i>
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  id="color"
                  value={rentbike.color}
                  onChange={handleRentInputs}
                  placeholder="e.g., Red, Blue, Black"
                  disabled={rentLoading}
                  className={`form-input ${formErrors.color ? 'error' : ''}`}
                  required
                />
                {formErrors.color && <span className="error-message">{formErrors.color}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="seats" className="form-label">
                  <i className="fas fa-chair"></i>
                  Seating Capacity
                </label>
                <input
                  type="number"
                  name="seats"
                  id="seats"
                  value={rentbike.seats}
                  onChange={handleRentInputs}
                  placeholder="2"
                  disabled={rentLoading}
                  min="1"
                  max="10"
                  className={`form-input ${formErrors.seats ? 'error' : ''}`}
                  required
                />
                {formErrors.seats && <span className="error-message">{formErrors.seats}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  <i className="fas fa-dollar-sign"></i>
                  Purchase Price (৳)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={rentbike.price}
                  onChange={handleRentInputs}
                  placeholder="150000"
                  disabled={rentLoading}
                  min="0"
                  step="0.01"
                  className={`form-input ${formErrors.price ? 'error' : ''}`}
                  required
                />
                {formErrors.price && <span className="error-message">{formErrors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rent" className="form-label">
                  <i className="fas fa-clock"></i>
                  Rental Rate (৳/hour)
                </label>
                <input
                  type="number"
                  name="rent"
                  id="rent"
                  value={rentbike.rent}
                  onChange={handleRentInputs}
                  placeholder="500"
                  disabled={rentLoading}
                  min="0"
                  step="0.01"
                  className={`form-input ${formErrors.rent ? 'error' : ''}`}
                  required
                />
                {formErrors.rent && <span className="error-message">{formErrors.rent}</span>}
              </div>

              <div className="form-group file-upload-group">
                <label htmlFor="image" className="form-label">
                  <i className="fas fa-camera"></i>
                  Bike Image
                </label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleRentFile}
                    disabled={rentLoading}
                    accept="image/*"
                    className="file-input"
                    required
                  />
                  <label htmlFor="image" className={`file-upload-label ${formErrors.image ? 'error' : ''}`}>
                    {previewImage ? (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                        <div className="preview-overlay">
                          <i className="fas fa-edit"></i>
                          <span>Change image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Choose bike image</span>
                        <small>PNG, JPG up to 10MB</small>
                      </>
                    )}
                  </label>
                  {formErrors.image && <span className="error-message">{formErrors.image}</span>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setRentBike({
                    brand: "", model: "", year: "", color: "", seats: "", price: "", rent: ""
                  });
                  setRentFile(null);
                  setRentMessage("");
                  setFormErrors({});
                  setPreviewImage(null);
                  // Reset file input
                  const fileInput = document.getElementById('image');
                  if (fileInput) fileInput.value = '';
                }}
                disabled={rentLoading}
              >
                <i className="fas fa-undo"></i>
                Reset Form
              </button>

              <LoadingButton
                type="submit"
                loading={rentLoading}
                onClick={postRentData}
                variant="primary"
                size="large"
                className="btn-primary"
              >
                {rentLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding Bike...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Add Bike to Fleet
                  </>
                )}
              </LoadingButton>
            </div>
          </form>
        </div>

        <div className="form-sidebar">
          <div className="info-card">
            <h3>
              <i className="fas fa-info-circle"></i>
              Quick Tips
            </h3>
            <ul>
              <li>
                <i className="fas fa-check"></i>
                Use high-quality images for better visibility
              </li>
              <li>
                <i className="fas fa-check"></i>
                Set competitive rental rates
              </li>
              <li>
                <i className="fas fa-check"></i>
                Double-check all specifications
              </li>
              <li>
                <i className="fas fa-check"></i>
                Ensure bike is in good condition
              </li>
            </ul>
          </div>

          <div className="stats-card">
            <h3>
              <i className="fas fa-chart-line"></i>
              Fleet Overview
            </h3>
            <div className="stat-item">
              <span className="stat-label">Total Bikes</span>
              <span className="stat-value">--</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value">--</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rented</span>
              <span className="stat-value">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
        </>
    )
}

export default Addbikes
