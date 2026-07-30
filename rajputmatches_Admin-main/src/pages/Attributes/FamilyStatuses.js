import React, { useState } from "react";

const FamilyStatuses = () => {
  const [statuses, setStatuses] = useState([
    { id: 1, name: "Middle Class" },
    { id: 2, name: "Upper Middle Class" },
  ]);
  const [newStatus, setNewStatus] = useState(""); // For the new status input

  const predefinedStatuses = [
    "Lower Class",
    "Middle Class",
    "Upper Middle Class",
    "Upper Class",
  ];

  // Handle adding new status
  const addStatus = () => {
    if (newStatus) {
      setStatuses([...statuses, { id: statuses.length + 1, name: newStatus }]);
      setNewStatus(""); // Clear the input field
    }
  };

  // Handle deleting a status by id
  const deleteStatus = (id) => {
    const updatedStatuses = statuses.filter((status) => status.id !== id);
    setStatuses(updatedStatuses);
  };

  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="section-body">
            <div className="row">
              <div className="col-12 col-md-6 m-auto">
                <div className="card">
                  <div className="card-header">
                    <h4>All Family Statuses</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-hover"
                        id="save-stage"
                      >
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statuses.map((status) => (
                            <tr key={status.id}>
                              <td>{status.id}</td>
                              <td>{status.name}</td>
                              <td>
                                <a
                                  href=""
                                  className="btn btn-danger"
                                  onClick={() => deleteStatus(status.id)}
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h4>Add New Family Status</h4>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Select Family Status</label>
                      <select
                        className="form-control"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {predefinedStatuses.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="card-footer text-right">
                    <button
                      className="btn btn-primary mr-1"
                      type="button"
                      onClick={addStatus}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FamilyStatuses;
