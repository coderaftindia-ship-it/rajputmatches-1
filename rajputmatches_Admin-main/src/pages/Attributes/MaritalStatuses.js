import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaHeart } from "react-icons/fa";

const MaritalStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { fetchUserData, updateData } = useAuth();

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await fetchUserData("attributes/marital-status");
      setStatuses(data?.statuses || []);
    } catch (error) {
      console.error("Error fetching marital statuses:", error);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddStatus = async () => {
    if (newStatus.trim() === "") {
      alert("Marital status cannot be empty.");
      return;
    }

    try {
      await updateData("attributes/marital-status", { name: newStatus });
      setNewStatus("");
      fetchStatuses();
    } catch (error) {
      console.error("Error adding marital status:", error);
      alert("Failed to add marital status");
    }
  };

  const handleDeleteStatus = async (id) => {
    if (window.confirm("Are you sure you want to delete this marital status?")) {
      try {
        await updateData(`attributes/marital-status/${id}`, {}, "DELETE");
        fetchStatuses();
      } catch (error) {
        console.error("Error deleting marital status:", error);
        alert("Failed to delete marital status");
      }
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setNewStatus(status.name);
  };

  const handleUpdateStatus = async () => {
    if (!editingStatus || newStatus.trim() === "") {
      alert("Marital status cannot be empty.");
      return;
    }

    try {
      await updateData(`attributes/marital-status/${editingStatus._id}`, { name: newStatus }, "PUT");
      setEditingStatus(null);
      setNewStatus("");
      fetchStatuses();
    } catch (error) {
      console.error("Error updating marital status:", error);
      alert("Failed to update marital status");
    }
  };

  const filteredStatuses = statuses.filter(status =>
    status?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#59123B', marginBottom: '8px' }}>
          <FaHeart className="me-2" /> Marital Status Management
        </h2>
        <p style={{ color: '#7A5C66', margin: 0 }}>Manage and monitor all marital status categories</p>
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
                    {editingStatus ? 'Edit Marital Status' : 'Add New Marital Status'}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label style={{ color: '#EDB139', fontWeight: 600 }}>Status Name</label>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Enter marital status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #EDB139',
                        color: '#EDB139'
                      }}
                    />
                  </div>
                </div>
                <div className="card-footer text-right" style={{ borderTop: '2px solid #EDB139' }}>
                  {editingStatus ? (
                    <>
                      <button
                        className="btn btn-royal-outline mr-1"
                        onClick={() => {
                          setEditingStatus(null);
                          setNewStatus("");
                        }}
                        style={{ borderColor: '#EDB139', color: '#EDB139' }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-royal"
                        onClick={handleUpdateStatus}
                      >
                        <FaEdit className="me-2" /> Update
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-royal"
                      onClick={handleAddStatus}
                    >
                      <FaPlus className="me-2" /> Add Status
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Marital Status List Section */}
            <div className="col-12 col-md-7">
              <div className="card" style={{
                background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
                border: '2px solid #EDB139',
                borderRadius: '12px'
              }}>
                <div className="card-header" style={{ borderBottom: '2px solid #EDB139' }}>
                  <h4 style={{ color: '#EDB139', fontFamily: 'Playfair Display, serif' }}>
                    All Marital Statuses ({filteredStatuses.length})
                  </h4>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                      type="text"
                      className="form-control form-control-royal"
                      placeholder="Search statuses..."
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
                  ) : filteredStatuses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#EDB139' }}>
                      <FaHeart style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }} />
                      <p>No marital statuses found. Add a new one!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-royal">
                        <thead>
                          <tr>
                            <th style={{ color: '#EDB139' }}>#</th>
                            <th style={{ color: '#EDB139' }}>Status Name</th>
                            <th style={{ color: '#EDB139' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStatuses.map((status, index) => (
                            <tr key={status._id || index}>
                              <td style={{ color: '#EDB139' }}>{index + 1}</td>
                              <td style={{ color: '#EDB139', fontWeight: 600 }}>{status.name}</td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-royal-gold"
                                    onClick={() => handleEditStatus(status)}
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-royal-outline"
                                    onClick={() => handleDeleteStatus(status._id)}
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

export default MaritalStatuses;
