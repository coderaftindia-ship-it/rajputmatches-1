import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaCrown } from "react-icons/fa";

const Caste = () => {
  const [castes, setCastes] = useState([]);
  const [newCaste, setNewCaste] = useState("");
  const [editingCaste, setEditingCaste] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { fetchUserData, updateData } = useAuth();

  const fetchCastes = async () => {
    try {
      setLoading(true);
      const data = await fetchUserData("attributes/caste");
      setCastes(data?.castes || []);
    } catch (error) {
      console.error("Error fetching castes:", error);
      setCastes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCastes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddCaste = async () => {
    if (newCaste.trim() === "") {
      alert("Caste name cannot be empty.");
      return;
    }

    try {
      await updateData("attributes/caste", { name: newCaste });
      setNewCaste("");
      fetchCastes();
    } catch (error) {
      console.error("Error adding caste:", error);
      alert("Failed to add caste");
    }
  };

  const handleDeleteCaste = async (id) => {
    if (window.confirm("Are you sure you want to delete this caste?")) {
      try {
        await updateData(`attributes/caste/${id}`, {}, "DELETE");
        fetchCastes();
      } catch (error) {
        console.error("Error deleting caste:", error);
        alert("Failed to delete caste");
      }
    }
  };

  const handleEditCaste = (caste) => {
    setEditingCaste(caste);
    setNewCaste(caste.name);
  };

  const handleUpdateCaste = async () => {
    if (!editingCaste || newCaste.trim() === "") {
      alert("Caste name cannot be empty.");
      return;
    }

    try {
      await updateData(`attributes/caste/${editingCaste._id}`, { name: newCaste }, "PUT");
      setEditingCaste(null);
      setNewCaste("");
      fetchCastes();
    } catch (error) {
      console.error("Error updating caste:", error);
      alert("Failed to update caste");
    }
  };

  const filteredCastes = castes.filter(caste =>
    caste?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#59123B', marginBottom: '8px' }}>
          <FaCrown className="me-2" /> Caste Management
        </h2>
        <p style={{ color: '#7A5C66', margin: 0 }}>Manage and monitor all caste categories</p>
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
                    {editingCaste ? 'Edit Caste' : 'Add New Caste'}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label style={{ color: '#EDB139', fontWeight: 600 }}>Caste Name</label>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Enter caste name"
                      value={newCaste}
                      onChange={(e) => setNewCaste(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #EDB139',
                        color: '#EDB139'
                      }}
                    />
                  </div>
                </div>
                <div className="card-footer text-right" style={{ borderTop: '2px solid #EDB139' }}>
                  {editingCaste ? (
                    <>
                      <button
                        className="btn btn-royal-outline mr-1"
                        onClick={() => {
                          setEditingCaste(null);
                          setNewCaste("");
                        }}
                        style={{ borderColor: '#EDB139', color: '#EDB139' }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-royal"
                        onClick={handleUpdateCaste}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-royal"
                      onClick={handleAddCaste}
                    >
                      <FaPlus className="me-2" /> Add Caste
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Caste List Section */}
            <div className="col-12 col-md-7">
              <div className="card" style={{
                background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
                border: '2px solid #EDB139',
                borderRadius: '12px'
              }}>
                <div className="card-header" style={{ borderBottom: '2px solid #EDB139' }}>
                  <h4 style={{ color: '#EDB139', fontFamily: 'Playfair Display, serif' }}>
                    All Castes ({filteredCastes.length})
                  </h4>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Search castes..."
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
                  ) : filteredCastes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#EDB139' }}>
                      <FaCrown style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }} />
                      <p>No castes found. Add a new one!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-royal">
                        <thead>
                          <tr>
                            <th style={{ color: '#EDB139' }}>#</th>
                            <th style={{ color: '#EDB139' }}>Caste Name</th>
                            <th style={{ color: '#EDB139' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCastes.map((caste, index) => (
                            <tr key={caste._id || index}>
                              <td style={{ color: '#EDB139' }}>{index + 1}</td>
                              <td style={{ color: '#EDB139', fontWeight: 600 }}>{caste.name}</td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-royal-gold"
                                    onClick={() => handleEditCaste(caste)}
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-royal-outline"
                                    onClick={() => handleDeleteCaste(caste._id)}
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

export default Caste;
