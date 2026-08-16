import React from "react";
import style from "./Form.module.css";
import { MdOutlineCancelPresentation } from "react-icons/md";
import indiaStatesData from "../../../features/state";
import { Country, State } from "country-state-city";

const POPULAR_COUNTRIES = [
  "India", "United States", "United Arab Emirates", "United Kingdom", "Canada", "Australia",
  "Saudi Arabia", "Singapore", "Kuwait", "Qatar", "Oman", "Germany", "France"
];

const formattedStateMap = (() => {
  const map = {};
  if (indiaStatesData && typeof indiaStatesData === "object") {
    Object.keys(indiaStatesData).forEach((key) => {
      const readableName = key.replace(/([A-Z])/g, " $1").trim();
      map[readableName] = indiaStatesData[key] || [];
      map[key] = indiaStatesData[key] || [];
    });
  }
  map["Uttar Pradesh"] = map["UttarPradesh"] || map["Uttar Pradesh"] || [];
  map["Madhya Pradesh"] = map["MadhyaPradesh"] || map["Madhya Pradesh"] || [];
  map["West Bengal"] = map["WestBengal"] || map["West Bengal"] || [];
  map["Tamil Nadu"] = map["TamilNadu"] || map["Tamil Nadu"] || [];
  map["Andhra Pradesh"] = map["AndhraPradesh"] || map["Andhra Pradesh"] || [];
  return map;
})();

const INDIAN_STATES_LIST = Object.keys(formattedStateMap).filter(
  (s) => !s.match(/^[a-z]/) && !["UttarPradesh", "MadhyaPradesh", "WestBengal", "TamilNadu", "AndhraPradesh"].includes(s)
).sort();

const ReligionForm = ({
  handleCancelClick,
  handleSaveClick,
  formData,
  handleInputChange,
  setFormData,
}) => {
  const states = React.useMemo(() => {
    if (!formData.birthCountry) {
      return INDIAN_STATES_LIST;
    }
    const countryObj = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === formData.birthCountry.trim().toLowerCase()
    );
    if (countryObj) {
      const fetched = State.getStatesOfCountry(countryObj.isoCode).map((s) => s.name);
      return fetched.length > 0 ? fetched : (formData.birthCountry === "India" ? INDIAN_STATES_LIST : []);
    }
    return formData.birthCountry === "India" ? INDIAN_STATES_LIST : [];
  }, [formData.birthCountry]);

  const cities = React.useMemo(() => {
    if (formData.birthState) {
      return formattedStateMap[formData.birthState] || [];
    }
    return [];
  }, [formData.birthState]);

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "740px", borderRadius: "12px" }}>
        {/* Header */}
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>
            Birth, Religious &amp; Astro Details
          </h4>
          <MdOutlineCancelPresentation
            onClick={handleCancelClick}
            className={style.closeIcon}
            size="22"
          />
        </div>

        {/* Modal Body */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ overflowY: "auto", flex: 1, padding: "14px 18px" }}>
            <form onSubmit={(e) => e.preventDefault()}>
          <div className="row g-2 mb-2">
            {/* Birth Time */}
            <div className="col-md-6 col-12">
              <label>BIRTH TIME</label>
              <div className="d-flex gap-1">
                <select
                  name="birthHour"
                  value={formData.birthHour || ""}
                  onChange={handleInputChange}
                  style={{ flex: 1 }}
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  name="birthMinute"
                  value={formData.birthMinute || ""}
                  onChange={handleInputChange}
                  style={{ flex: 1 }}
                >
                  <option value="">Min</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  name="birthTimePeriod"
                  value={formData.birthTimePeriod || "AM"}
                  onChange={handleInputChange}
                  style={{ flex: 1 }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Birthplace */}
            <div className="col-md-6 col-12">
              <label>EXACT BIRTHPLACE</label>
              <input
                type="text"
                name="birthplace"
                placeholder="Exact Birthplace"
                value={formData.birthplace || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row g-2 mb-2">
            {/* Birth Country */}
            <div className="col-md-4 col-6">
              <label>BIRTH COUNTRY</label>
              <select
                name="birthCountry"
                value={formData.birthCountry || "India"}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                {POPULAR_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Birth State */}
            <div className="col-md-4 col-6">
              <label>BIRTH STATE</label>
              <select
                name="birthState"
                value={formData.birthState || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    birthState: e.target.value,
                    birthCity: "",
                  });
                }}
                disabled={!formData.birthCountry}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Birth City */}
            <div className="col-md-4 col-12">
              <label>BIRTH CITY</label>
              <select
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
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-md-4 col-6">
              <label>MANGLIK STATUS</label>
              <select
                name="maglik"
                value={formData.maglik || formData.manglik || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    maglik: e.target.value,
                    manglik: e.target.value,
                  });
                }}
              >
                <option value="">Select Manglik</option>
                <option value="Non Manglik">Non Manglik</option>
                <option value="Manglik">Manglik</option>
                <option value="Anshik Manglik">Anshik Manglik</option>
                <option value="Don't Know">Don't Know</option>
              </select>
            </div>

            <div className="col-md-4 col-6">
              <label>CLAN / VANSH</label>
              <input
                type="text"
                name="clan"
                placeholder="Enter Clan"
                value={formData.clan || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-4 col-12">
              <label>SUBCLAN / UPVANSH</label>
              <input
                type="text"
                name="subclan"
                placeholder="Enter Subclan"
                value={formData.subclan || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-md-6 col-12">
              <label>GOTRA / TRIBE</label>
              <input
                type="text"
                name="gotra"
                placeholder="Enter Gotra"
                value={formData.gotra || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 col-12">
              <label>ADDITIONAL ASTRO INFO</label>
              <textarea
                name="additionalInfo"
                rows="2"
                placeholder="Additional details..."
                value={formData.additionalInfo || ""}
                onChange={handleInputChange}
                style={{ minHeight: "40px" }}
              ></textarea>
            </div>
          </div>

            </form>
          </div>

          {/* Footer Actions — always visible */}
          <div className={style.modalFooter}>
            <button
              type="button"
              className={style.cancelBtn}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="button"
              className={style.saveBtn}
              onClick={handleSaveClick}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligionForm;
