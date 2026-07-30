import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaCity } from "react-icons/fa";

const City = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { fetchUserData, updateData } = useAuth();

  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await fetchUserData("attributes/city");
      setCities(data?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddCity = async () => {
    if (newCity.trim() === "") {
      alert("City name cannot be empty.");
      return;
    }

    try {
      await updateData("attributes/city", { name: newCity });
      setNewCity("");
      fetchCities();
    } catch (error) {
      console.error("Error adding city:", error);
      alert("Failed to add city");
    }
  };

  const handleDeleteCity = async (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        await updateData(`attributes/city/${id}`, {}, "DELETE");
        fetchCities();
      } catch (error) {
        console.error("Error deleting city:", error);
        alert("Failed to delete city");
      }
    }
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setNewCity(city.name);
  };

  const handleUpdateCity = async () => {
    if (!editingCity || newCity.trim() === "") {
      alert("City name cannot be empty.");
      return;
    }

    try {
      await updateData(`attributes/city/${editingCity._id}`, { name: newCity }, "PUT");
      setEditingCity(null);
      setNewCity("");
      fetchCities();
    } catch (error) {
      console.error("Error updating city:", error);
      alert("Failed to update city");
    }
  };

  const filteredCities = cities.filter(city =>
    city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#59123B', marginBottom: '8px' }}>
          <FaCity className="me-2" /> City Management
        </h2>
        <p style={{ color: '#7A5C66', margin: 0 }}>Manage and monitor all city locations</p>
      </div>

      <section className="section">
        <div className="section-body">
          <div className="row">
            {/* Form Section */}
            <div className="col-12 col-md-5">
              <div className="card" style={{
                background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
                border: '2px solid #EDB139',
                borderRadius: '12px'
              }}>
                <div className="card-header" style={{ borderBottom: '2px solid #EDB139' }}>
                  <h4 style={{ color: '#EDB139', fontFamily: 'Playfair Display, serif' }}>
                    {editingCity ? 'Edit City' : 'Add New City'}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label style={{ color: '#EDB139', fontWeight: 600 }}>City Name</label>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Enter city name"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #EDB139',
                        color: '#EDB139'
                      }}
                    />
                  </div>
                </div>
                <div className="card-footer text-right" style={{ borderTop: '2px solid #EDB139' }}>
                  {editingCity ? (
                    <>
                      <button
                        className="btn btn-royal-outline mr-1"
                        onClick={() => {
                          setEditingCity(null);
                          setNewCity("");
                        }}
                        style={{ borderColor: '#EDB139', color: '#EDB139' }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-royal"
                        onClick={handleUpdateCity}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-royal"
                      onClick={handleAddCity}
                    >
                      <FaPlus className="me-2" /> Add City
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* City List Section */}
            <div className="col-12 col-md-7">
              <div className="card" style={{
                background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
                border: '2px solid #EDB139',
                borderRadius: '12px'
              }}>
                <div className="card-header" style={{ borderBottom: '2px solid #EDB139' }}>
                  <h4 style={{ color: '#EDB139', fontFamily: 'Playfair Display, serif' }}>
                    All Cities ({filteredCities.length})
                  </h4>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Search cities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #EDB139',
                        color: '#EDB139'
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" style={{ background: '#EDB139', border: '2px solid #EDB139' }}>
                        <FaSearch />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                      <div className="spinner-border" style={{ color: '#EDB139' }} role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : filteredCities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#EDB139' }}>
                      <FaCity style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }} />
                      <p>No cities found. Add a new one!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-royal">
                        <thead>
                          <tr>
                            <th style={{ color: '#EDB139' }}>#</th>
                            <th style={{ color: '#EDB139' }}>City Name</th>
                            <th style={{ color: '#EDB139' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCities.map((city, index) => (
                            <tr key={city._id || index}>
                              <td style={{ color: '#EDB139' }}>{index + 1}</td>
                              <td style={{ color: '#EDB139', fontWeight: 600 }}>{city.name}</td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-royal-gold"
                                    onClick={() => handleEditCity(city)}
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-royal-outline"
                                    onClick={() => handleDeleteCity(city._id)}
                                    title="Delete"
                                    style={{ borderColor: '#dc3545', color: '#dc3545' }}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
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

export default City;
