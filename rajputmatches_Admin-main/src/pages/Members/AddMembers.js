import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useAuth } from "../AuthContext";

function AddMembers() {
  const { register } = useAuth();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    email: "",
    country: "",
    state: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (formData.country) {
      const stateList = State.getStatesOfCountry(formData.country);
      setStates(stateList);
    } else {
      setStates([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      const cityList = City.getCitiesOfState(formData.country, formData.state);
      setCities(cityList);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const route = "signup";
    // console.log("Form Data Submitted:", formData);
    try {
      await register(route, formData);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-body">
          <div className="row">
            <div className="col-md-8 col-10 m-auto">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-4">User Registration Form</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>First Name:</label>
                        <input
                          type="text"
                          name="firstName"
                          className="form-control"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Middle Name:</label>
                        <input
                          type="text"
                          name="middleName"
                          className="form-control"
                          value={formData.middleName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Last Name:</label>
                        <input
                          type="text"
                          name="lastName"
                          className="form-control"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Password:</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Date of Birth:</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Gender:</label>
                        <select
                          name="gender"
                          className="form-control"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Mobile:</label>
                        <input
                          type="text"
                          name="mobile"
                          className="form-control"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                          pattern="^\+?[1-9]\d{1,14}$"
                          title="Please use a valid mobile number"
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Email:</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          pattern="^\S+@\S+\.\S+$"
                          title="Please use a valid email address"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Country:</label>
                        <select
                          name="country"
                          className="form-control"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 form-group">
                        <label>State:</label>
                        <select
                          name="state"
                          className="form-control"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>City:</label>
                        <select
                          name="city"
                          className="form-control"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddMembers;
