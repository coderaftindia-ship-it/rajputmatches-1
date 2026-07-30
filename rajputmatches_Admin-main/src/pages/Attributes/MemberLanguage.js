import React, { useState } from "react";

const MemberLanguage = () => {
  const predefinedLanguages = [
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Odia",
    "Assamese",
    "Urdu",
    "Sanskrit",
    "Konkani",
    "Maithili",
    "Sindhi",
    "Manipuri",
    "Bodo",
    "Dogri",
    "Santali",
    "Kashmiri",
    "Nepali",
    "Tulu",
    "Bhili",
    "Garhwali",
    "English",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Italian",
    "Russian",
    "Mandarin Chinese",
    "Cantonese",
    "Japanise",
  ];
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleSelectChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleAddLanguage = () => {
    if (selectedLanguage.trim() === "") {
      alert("Please select a language.");
      return;
    }

    // Check for duplicates
    if (languages.some((language) => language.name === selectedLanguage)) {
      alert("This language is already added.");
      return;
    }

    const newEntry = { id: languages.length + 1, name: selectedLanguage };
    setLanguages([...languages, newEntry]);
    setSelectedLanguage(""); // Reset the selection
  };

  const handleDeleteLanguage = (id) => {
    setLanguages(languages.filter((language) => language.id !== id));
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-body">
          <div className="row">
            {/* Form Section */}
            <div className="col-6 col-md-6 m-auto">
              <div className="card">
                <div className="card-header">
                  <h4>Add New Language</h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Select Language</label>
                    <select
                      className="form-control"
                      value={selectedLanguage}
                      onChange={handleSelectChange}
                    >
                      <option value="">-- Select Language --</option>
                      {predefinedLanguages.map((language, index) => (
                        <option key={index} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="card-footer text-right">
                  <button
                    className="btn btn-primary mr-1"
                    onClick={handleAddLanguage}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Language List Section */}
            <div className="col-12 col-md-6 m-auto">
              <div className="card">
                <div className="card-header">
                  <h4>All Languages</h4>
                </div>
                <div className="card-body">
                  {languages.length === 0 ? (
                    <p>No languages available. Add a new one!</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {languages.map((language) => (
                            <tr key={language.id}>
                              <td>{language.id}</td>
                              <td>{language.name}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleDeleteLanguage(language.id)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberLanguage;
