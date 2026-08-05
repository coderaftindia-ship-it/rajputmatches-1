// Home.jsx
import React from "react";
import Banner from "./Banner";
import MatchMakingSection from "./MatchMakingSection";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";
import LandingPage from "./LandingPage";
import RecentAddedPage from "./RecentAddedPage";
import HappyClients from "./HappyClients";
import VideoSection from "./VideoSection";

function Home() {
  return (
    <>
      <Banner />
      <MatchMakingSection /> 
      <FeatureSection /> 
      <RecentAddedPage />
      <LandingPage />
      <VideoSection />
      <HappyClients />
      <Footer />
    </>
  );
}

export default Home;
