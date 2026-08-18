// Home.jsx
import React, { lazy, Suspense, useRef, useState, useEffect } from "react";
import Banner from "./Banner";
import MatchMakingSection from "./MatchMakingSection";
import FeatureSection from "./FeatureSection";

// Below-fold sections: lazy-loaded when user scrolls near them
const Footer = lazy(() => import("./Footer"));
const LandingPage = lazy(() => import("./LandingPage"));
const RecentAddedPage = lazy(() => import("./RecentAddedPage"));
const HappyClients = lazy(() => import("./HappyClients"));
const VideoSection = lazy(() => import("./VideoSection"));

/**
 * LazySection: Only renders children when they come within 200px of the viewport.
 * This eliminates the JS parsing cost of below-fold components on initial load.
 */
function LazySection({ children, fallback = null }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        // Placeholder to maintain scroll position
        <div style={{ minHeight: "100px" }} />
      )}
    </div>
  );
}

function Home() {
  return (
    <>
      {/* Above-fold: loads immediately */}
      <Banner />
      <MatchMakingSection />
      {/* <FeatureSection /> */}

      {/* Below-fold: deferred until near viewport */}
      <LazySection><RecentAddedPage /></LazySection>
      <LazySection><LandingPage /></LazySection>
      <LazySection><VideoSection /></LazySection>
      <LazySection><HappyClients /></LazySection>
      <LazySection><Footer /></LazySection>
    </>
  );
}

export default Home;
