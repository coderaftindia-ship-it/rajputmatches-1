import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const Contactus = () => {
  const { fetchUserData, updateData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const route = "contact-requests";
    const data = await fetchUserData(route);
    setLoading(false);
    setMessages(data && data.length > 0 ? data : []);
  };

  const changeStatus = async (contactReqId, status) => {
    try {
      setLoading(true);
      console.log(contactReqId);
      console.log(status);
      const route = "Edit-request";
      const data = await updateData(route, { contactReqId, status });
      console.log("Status updated:", data);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-body">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4>Contact Us Messages</h4>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                      }}
                    >
                      <div
                        className="spinner-border"
                        style={{ width: "3rem", height: "3rem" }}
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-hover"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Additional Info</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages?.map((message, index) => (
                            <tr key={message._id}>
                              <td>{index + 1}</td>
                              <td>
                                {message.firstName} {message.lastName}
                              </td>
                              <td>{message.email}</td>
                              <td>{message.mobile}</td>
                              <td>{message.additionalInfo || "N/A"}</td>
                              <td>
                                {new Date(message.createdAt).toLocaleString()}
                              </td>
                              <td>
                                <div
                                  className={`badge badge-${
                                    message.status === "completed"
                                      ? "success"
                                      : message.status === "remark"
                                      ? "warning"
                                      : "secondary"
                                  } badge-shadow`}
                                >
                                  {message.status}
                                </div>
                              </td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-warning dropdown-toggle btn-sm"
                                    type="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    Options
                                  </button>
                                  <div className="dropdown-menu">
                                    <a
                                      className="dropdown-item"
                                      onClick={() =>
                                        changeStatus(message._id, "remark")
                                      }
                                    >
                                      Mark as Remark
                                    </a>
                                    <a
                                      className="dropdown-item"
                                      onClick={() =>
                                        changeStatus(message._id, "completed")
                                      }
                                    >
                                      Mark as Completed
                                    </a>
                                  </div>
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

export default Contactus;
