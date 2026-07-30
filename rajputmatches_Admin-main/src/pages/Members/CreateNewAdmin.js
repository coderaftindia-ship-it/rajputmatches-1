import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../AuthContext";

function CreateNewAdmin() {
  const { updateData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const route = "register";
    // console.log("Form Data Submitted:", formData);
    try {
      await updateData(route, formData);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="section-body">
          <div className="row">
            <div className="col-md-6 col-10 m-auto">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-4">Create New Admin</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group position-relative">
                      <label>Password:</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Role:</label>
                      <select
                        name="role"
                        className="form-control"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-primary">
                        Create Admin
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

export default CreateNewAdmin;
