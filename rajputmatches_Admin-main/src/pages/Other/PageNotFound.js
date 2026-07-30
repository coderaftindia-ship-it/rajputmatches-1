import React, { useEffect } from "react";
import lottie from "lottie-web";
import { Link } from "react-router-dom";

const PageNotFound = () => {
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
    <>
      <div className="main-content">
        <section className="section">
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header text-center">
                    <h4 className="display-4 text-danger text-center">404</h4>
                  </div>
                  <div className="card-body text-center">
                    <div
                      className="lottie-animation mx-auto mb-4"
                      style={{ maxWidth: "400px" }}
                    ></div>
                    <p className="fs-5 text-muted">
                      Oops! The page you're looking for doesn't exist.
                    </p>
                    <Link to="/" className="btn btn-primary">
                      Go to Homepage
                    </Link>
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

export default PageNotFound;
