import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaCrown } from "react-icons/fa";

const SubCaste = () => {
  const [subCastes, setSubCastes] = useState([]);
  const [newSubCaste, setNewSubCaste] = useState("");
  const [editingSubCaste, setEditingSubCaste] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { fetchUserData, updateData } = useAuth();

  const fetchSubCastes = async () => {
    try {
      setLoading(true);
      const data = await fetchUserData("attributes/sub-caste");
      setSubCastes(data?.subCastes || []);
    } catch (error) {
      console.error("Error fetching sub-castes:", error);
      setSubCastes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCastes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddSubCaste = async () => {
    if (newSubCaste.trim() === "") {
      alert("Sub-Caste name cannot be empty.");
      return;
    }

    try {
      await updateData("attributes/sub-caste", { name: newSubCaste });
      setNewSubCaste("");
      fetchSubCastes();
    } catch (error) {
      console.error("Error adding sub-caste:", error);
      alert("Failed to add sub-caste");
    }
  };

  const handleDeleteSubCaste = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-caste?")) {
      try {
        await updateData(`attributes/sub-caste/${id}`, {}, "DELETE");
        fetchSubCastes();
      } catch (error) {
        console.error("Error deleting sub-caste:", error);
        alert("Failed to delete sub-caste");
      }
    }
  };

  const handleEditSubCaste = (subCaste) => {
    setEditingSubCaste(subCaste);
    setNewSubCaste(subCaste.name);
  };

  const handleUpdateSubCaste = async () => {
    if (!editingSubCaste || newSubCaste.trim() === "") {
      alert("Sub-Caste name cannot be empty.");
      return;
    }

    try {
      await updateData(`attributes/sub-caste/${editingSubCaste._id}`, { name: newSubCaste }, "PUT");
      setEditingSubCaste(null);
      setNewSubCaste("");
      fetchSubCastes();
    } catch (error) {
      console.error("Error updating sub-caste:", error);
      alert("Failed to update sub-caste");
    }
  };

  const filteredSubCastes = subCastes.filter(subCaste =>
    subCaste?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#59123B', marginBottom: '8px' }}>
          <FaCrown className="me-2" /> Sub-Caste Management
        </h2>
        <p style={{ color: '#7A5C66', margin: 0 }}>Manage and monitor all sub-caste categories</p>
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
                    {editingSubCaste ? 'Edit Sub-Caste' : 'Add New Sub-Caste'}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label style={{ color: '#EDB139', fontWeight: 600 }}>Sub-Caste Name</label>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Enter sub-caste name"
                      value={newSubCaste}
                      onChange={(e) => setNewSubCaste(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #EDB139',
                        color: '#EDB139'
                      }}
                    />
                  </div>
                </div>
                <div className="card-footer text-right" style={{ borderTop: '2px solid #EDB139' }}>
                  {editingSubCaste ? (
                    <>
                      <button
                        className="btn btn-royal-outline mr-1"
                        onClick={() => {
                          setEditingSubCaste(null);
                          setNewSubCaste("");
                        }}
                        style={{ borderColor: '#EDB139', color: '#EDB139' }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-royal"
                        onClick={handleUpdateSubCaste}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-royal"
                      onClick={handleAddSubCaste}
                    >
                      <FaPlus className="me-2" /> Add Sub-Caste
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-Caste List Section */}
            <div className="col-12 col-md-7">
              <div className="card" style={{
                background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
                border: '2px solid #EDB139',
                borderRadius: '12px'
              }}>
                <div className="card-header" style={{ borderBottom: '2px solid #EDB139' }}>
                  <h4 style={{ color: '#EDB139', fontFamily: 'Playfair Display, serif' }}>
                    All Sub-Castes ({filteredSubCastes.length})
                  </h4>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Search sub-castes..."
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
                  ) : filteredSubCastes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#EDB139' }}>
                      <FaCrown style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }} />
                      <p>No sub-castes found. Add a new one!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-royal">
                        <thead>
                          <tr>
                            <th style={{ color: '#EDB139' }}>#</th>
                            <th style={{ color: '#EDB139' }}>Sub-Caste Name</th>
                            <th style={{ color: '#EDB139' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSubCastes.map((subCaste, index) => (
                            <tr key={subCaste._id || index}>
                              <td style={{ color: '#EDB139' }}>{index + 1}</td>
                              <td style={{ color: '#EDB139', fontWeight: 600 }}>{subCaste.name}</td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-royal-gold"
                                    onClick={() => handleEditSubCaste(subCaste)}
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-royal-outline"
                                    onClick={() => handleDeleteSubCaste(subCaste._id)}
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

export default SubCaste;
