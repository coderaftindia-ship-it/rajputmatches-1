import React, { useState } from "react";
import { Link } from "react-router-dom";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { AiOutlineRight } from "react-icons/ai";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { publicApi } from "../../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import contactBg from "../../assets/images/stories/SS2.jpg";

function ContactUs() {
  return (
    <div style={{ backgroundColor: "#fcfaf9", minHeight: "100vh" }} className="pb-bottom-nav">
      <Profilenavbar />
      
      {/* Cinematic Hero Section */}
      <section className="position-relative overflow-hidden d-flex align-items-center justify-content-center" style={{ minHeight: "65vh", width: "100%", marginTop: 0 }}>
        
   

        {/* Background Image */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
        >
            {/* Using a rich background image */}
            <img src={contactBg} alt="Contact Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        {/* Maroon/Gold Theme Overlay */}
        <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(135deg, rgba(80, 0, 0, 0.7) 0%, rgba(20, 0, 0, 0.95) 100%)",
            zIndex: 1
        }}></div>

        {/* Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
          style={{ zIndex: 10, position: "relative", padding: "0 20px", maxWidth: "800px" }}
        >
          <p style={{ fontSize: "clamp(14px, 16px, 18px)", fontWeight: 600, fontFamily: "var(--font-body)", color: "#e8c371", textTransform: "uppercase", letterSpacing: "4px", marginBottom: "1rem", textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}>
            At Your Service
          </p>
          <h1 style={{ fontSize: "clamp(36px, 48px, 60px)", fontWeight: 600, fontFamily: "var(--font-heading)", lineHeight: 1.2, color: "#ffffff", textShadow: "2px 2px 10px rgba(0,0,0,0.6)", marginBottom: "1.5rem" }}>
            Premium Support & <br/> Concierge
          </h1>
          <p style={{ fontSize: "clamp(16px, 18px, 20px)", fontFamily: "var(--font-body)", color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, textShadow: "1px 1px 4px rgba(0,0,0,0.8)", maxWidth: "650px", margin: "0 auto" }}>
            Experience personalized assistance from our dedicated team. Whether you need help with your profile or wish to learn more about our exclusive services, we are here for you.
          </p>
        </motion.div>
      </section>

      <div className="container" style={{ position: "relative", zIndex: 10, marginTop: "-80px", paddingBottom: "5rem" }}>
        
        {/* Floating Contact Info Cards */}
        <div className="row g-4 mb-5 justify-content-center">
          
          <div className="col-12 col-md-4">
            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} className="card h-100 text-center border-0 p-4 shadow-lg" style={{ borderRadius: "20px", backgroundColor: "#fff" }}>
              <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "rgba(128, 0, 0, 0.05)", color: "var(--royal-maroon-dark)" }}>
                <MdLocationOn size={32} />
              </div>
              <h5 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}>Headquarters</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                Flat No. 203, Green Heights,<br/> Near Kunal Tower, Sector 47,<br/> Gurugram, Haryana, 122018
              </p>
            </motion.div>
          </div>

          <div className="col-12 col-md-4">
            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} className="card h-100 text-center border-0 p-4 shadow-lg" style={{ borderRadius: "20px", backgroundColor: "#fff" }}>
              <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "rgba(128, 0, 0, 0.05)", color: "var(--royal-maroon-dark)" }}>
                <MdEmail size={32} />
              </div>
              <h5 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}>Email Concierge</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                support@rajputmatch.com<br/><br/>parakram125@gmail.com
              </p>
            </motion.div>
          </div>

          <div className="col-12 col-md-4">
            <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} className="card h-100 text-center border-0 p-4 shadow-lg" style={{ borderRadius: "20px", backgroundColor: "#fff" }}>
              <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "rgba(128, 0, 0, 0.05)", color: "var(--royal-maroon-dark)" }}>
                <MdPhone size={32} />
              </div>
              <h5 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}>Direct Lines</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                +91 123 456 7892<br/><br/>+1 565 2145 962
              </p>
            </motion.div>
          </div>

        </div>

        {/* Contact Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="row justify-content-center mt-5"
        >
          <div className="col-12 col-lg-8">
            <div className="p-5 rounded-4 shadow-lg bg-white" style={{ borderTop: "4px solid var(--royal-gold)" }}>
              <div className="text-center mb-5">
                <h3 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}>Send a Message</h3>
                <p className="text-secondary">Fill out the form below and our team will get back to you promptly.</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </motion.div>

      </div>
      
      <Footer />
    </div>
  );
}

export default ContactUs;

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    additionalInfo: "",
    countryCode: "+91",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value.trimStart();

    const nameRegex = /^[a-zA-Z\s]{0,20}$/;
    const mobileRegex = /^\d*$/;

    if (name === "firstName" || name === "lastName") {
      if (!nameRegex.test(value)) return;
    } else if (name === "mobile") {
      if (!mobileRegex.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required.";
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile is required.";
    } else if (!/^\+?\d{8,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await publicApi.submitContact(formData);
      if (response.data?.message) {
        toast.success("Thank you! Our concierge will contact you shortly.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
      setFormData({ firstName: "", lastName: "", mobile: "", email: "", additionalInfo: "", countryCode: "+91" });
    } catch (error) {
      console.error("Submission Error:", error.message);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    padding: "0.8rem 1rem",
    fontSize: "1rem"
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <label className="fw-semibold mb-2" style={{ color: "#4a4a4a", fontSize: "0.9rem" }}>FIRST NAME</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Vikram" className={`form-control rounded-3 shadow-none ${errors.firstName ? "is-invalid" : ""}`} style={inputStyle} />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>
        <div className="col-md-6">
          <label className="fw-semibold mb-2" style={{ color: "#4a4a4a", fontSize: "0.9rem" }}>LAST NAME</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Singh" className={`form-control rounded-3 shadow-none ${errors.lastName ? "is-invalid" : ""}`} style={inputStyle} />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <label className="fw-semibold mb-2" style={{ color: "#4a4a4a", fontSize: "0.9rem" }}>MOBILE NUMBER</label>
          <div className="input-group rounded-3 overflow-hidden shadow-none" style={{ border: "1px solid #e9ecef" }}>
            <select className="form-select border-0 shadow-none" name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ maxWidth: "110px", backgroundColor: "#f1f3f5", color: "#495057", fontWeight: "500" }}>
              <option value="+91">IN (+91)</option>
              <option value="+1">US (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+971">AE (+971)</option>
            </select>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className={`form-control border-0 shadow-none ${errors.mobile ? "is-invalid" : ""}`} style={{ backgroundColor: "#f8f9fa", padding: "0.8rem 1rem" }} />
          </div>
          {errors.mobile && <div className="text-danger mt-1 small">{errors.mobile}</div>}
        </div>
        <div className="col-md-6">
          <label className="fw-semibold mb-2" style={{ color: "#4a4a4a", fontSize: "0.9rem" }}>EMAIL ADDRESS</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. vikram@example.com" className={`form-control rounded-3 shadow-none ${errors.email ? "is-invalid" : ""}`} style={inputStyle} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
      </div>

      <div className="mb-5">
        <label className="fw-semibold mb-2" style={{ color: "#4a4a4a", fontSize: "0.9rem" }}>HOW CAN WE ASSIST YOU?</label>
        <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Please provide any additional details..." className="form-control rounded-3 shadow-none" rows="5" style={{...inputStyle, resize: "none"}}></textarea>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={isSubmitting}
        className="btn w-100 rounded-3 text-white fw-bold shadow"
        style={{
          background: "linear-gradient(90deg, var(--royal-gold) 0%, #d4af37 100%)",
          padding: "1rem",
          letterSpacing: "1px",
          border: "none",
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
      </motion.button>
    </form>
  );
}
