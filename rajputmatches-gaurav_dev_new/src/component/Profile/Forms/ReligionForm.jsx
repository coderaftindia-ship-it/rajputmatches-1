import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import styles from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";

const ReligionForm = ({
  handleCancelClick,
  handleSaveClick,
  formData,
  handleInputChange,
  setFormData,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch all countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (formData.birthCountry) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.birthCountry
      );

      if (selectedCountry) {
        setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [formData.birthCountry, countries]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (formData.birthState) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.birthCountry
      );
      const selectedState = states.find(
        (state) => state.name === formData.birthState
      );

      if (selectedCountry && selectedState) {
        setCities(
          City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
        );
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData.birthState, countries, states]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h4 className={styles.headerTitle}>
            Birth/ Religious/ Astro Details
          </h4>
          <div>
            <MdOutlineCancelPresentation
              onClick={handleCancelClick}
              className={styles.closeIcon}
              size="22"
            />
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="row">
              {/* <div className="col-sm-6">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  className="form-control rounded-0"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleInputChange}
                  required
                />
              </div> */}

              <div className="col-sm-6">
                <label htmlFor="birthTime" className="form-label">
                  Birth Time
                </label>
                <div className="input-group">
                  <select
                    className="form-select rounded-0"
                    name="birthHour"
                    value={formData.birthHour || ""}
                    onChange={handleInputChange}
                    style={{ width: "20%" }}
                  >
                    <option value="">Hour</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select rounded-0"
                    name="birthMinute"
                    value={formData.birthMinute || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Min</option>
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select rounded-0"
                    name="birthTimePeriod"
                    value={formData.birthTimePeriod || "AM"}
                    onChange={handleInputChange}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 col-sm-6">
                <label htmlFor="birthplace" className="form-label">
                  Birthplace
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="birthplace"
                  name="birthplace"
                  placeholder="Exact Place"
                  value={formData.birthplace || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              {/* Birth Country */}
              <div className="col-md-4">
                <label htmlFor="birthCountry" className="form-label">
                  Birth Country
                </label>
                <select
                  className="form-select rounded-0"
                  id="birthCountry"
                  name="birthCountry"
                  value={formData.birthCountry || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      birthCountry: e.target.value, // Store country name
                      birthState: "",
                      birthCity: "",
                    });
                  }}
                >
                  <option value="">Enter Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Birth State */}
              <div className="col-md-4">
                <label htmlFor="birthState" className="form-label">
                  Birth State
                </label>
                <select
                  className="form-select rounded-0"
                  id="birthState"
                  name="birthState"
                  value={formData.birthState || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      birthState: e.target.value, // Store state name
                      birthCity: "",
                    });
                  }}
                  disabled={!formData.birthCountry}
                >
                  <option value="">Enter State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Birth City */}
              <div className="col-md-4">
                <label htmlFor="birthCity" className="form-label">
                  Birth City
                </label>
                <select
                  className="form-select rounded-0"
                  id="birthCity"
                  name="birthCity"
                  value={formData.birthCity || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      birthCity: e.target.value,
                    });
                  }}
                  disabled={!formData.birthState}
                >
                  <option value="">Enter City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              {/* Birth Country */}
              <div className="col-12">
                <label htmlFor="" className="form-label">
                  Manglik
                </label>
                <select
                  className="form-select rounded-0"
                  id="maglik"
                  name="maglik"
                  value={formData.maglik || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      maglik: e.target.value,
                    });
                  }}
                >
                  <option value="">Select Manglik</option>

                  <option key={1} value="Yes">
                    Yes
                  </option>
                  <option key={2} value="No">
                    No
                  </option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="clan" className="form-label">
                  Clan / Vansh
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="clan"
                  name="clan"
                  placeholder="Enter Clan"
                  value={formData.clan || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="subclan" className="form-label">
                  Subclan / Upvansh
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="subclan"
                  name="subclan"
                  placeholder="Enter Subclan"
                  value={formData.subclan || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="gotra" className="form-label">
                  Enter Gotra / Tribe
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="gotra"
                  name="gotra"
                  placeholder="Enter Gotra/Tribe"
                  value={formData.gotra || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="additionalInfo" className="form-label">
                Additional Info
              </label>
              <textarea
                className="form-control rounded-0"
                id="additionalInfo"
                name="additionalInfo"
                rows="3"
                placeholder="Enter text"
                value={formData.additionalInfo || ""}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`btn btn-primary ${styles.saveButton}`}
              onClick={handleSaveClick}
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReligionForm;
