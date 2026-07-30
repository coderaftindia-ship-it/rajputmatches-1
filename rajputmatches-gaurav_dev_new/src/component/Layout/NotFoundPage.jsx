import React, { useEffect } from "react";
import lottie from "lottie-web";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.querySelector(".lottie-animation"), // Target the container
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json", // Lottie animation URL
    });

    return () => {
      animation.destroy(); // Clean up animation on component unmount
    };
  }, []);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="lottie-animation mb-4"
        style={{ maxWidth: "400px" }}
      ></div>
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-4 text-muted">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
