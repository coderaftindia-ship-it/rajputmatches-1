import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

import FreeMembers from "./pages/Members/FreeMembers";
import BlockedMembers from "./pages/Members/BlockedMember";
import DeletedMembers from "./pages/Members/DeletedMembers";
import AddMembers from "./pages/Members/AddMembers";
import ViewMembers from "./pages/Members/ViewMember";
import CreateNewAdmin from "./pages/Members/CreateNewAdmin";

import Limits from "./pages/Attributes/Limits";
import SocialLinks from "./pages/Attributes/SocialLinks";
import FamilyStatuses from "./pages/Attributes/FamilyStatuses";
import Caste from "./pages/Attributes/Caste";
import SubCaste from "./pages/Attributes/SubCaste";
import MemberLanguage from "./pages/Attributes/MemberLanguage";
import Country from "./pages/Attributes/Country";
import State from "./pages/Attributes/State";
import City from "./pages/Attributes/City";
import MaritalStatuses from "./pages/Attributes/MaritalStatuses";

import PageNotFound from "./pages/Other/PageNotFound";
import View from "./pages/Packages/View";
import Addpackages from "./pages/Packages/AddPackages";
import EditPackage from "./pages/Packages/EditPackage";
import PaymentDeatils from "./pages/Payment/PaymentDeatils";
import SuccessStories from "./pages/Success/SuccessStories";
import EditStory from "./pages/Success/EditStory";
import AddStory from "./pages/Success/AddStory";
import Contactus from "./pages/Contact/Contactus";
import Reports from "./pages/Reports";
import HappyFace from "./pages/HappyFace/HappyFace";
import ManageAboutUs from "./pages/Other/ManageAboutUs";
import ManageHomeCMS from "./pages/Other/ManageHomeCMS";
import ManageContactCMS from "./pages/Other/ManageContactCMS";
import ManageStoriesCMS from "./pages/Other/ManageStoriesCMS";
import ManageSiteSettings from "./pages/Other/ManageSiteSettings";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./pages/AuthContext";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <>
      {authState && <Header />}
      <main>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ProtectedRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {authState && <Footer />}
      <ToastContainer />
    </>
  );
};

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    {/* <Route path="/" element={<Dashboard />} /> */}
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="Members/Free-Members" element={<FreeMembers />} />
    <Route path="Members/Deleted-Members" element={<DeletedMembers />} />
    <Route path="Members/Blocked-Members" element={<BlockedMembers />} />
    <Route path="Members/Add-Members" element={<AddMembers />} />
    <Route path="Members/View-Members/:profileId" element={<ViewMembers />} />
    <Route path="Members/Create-New-Admin" element={<CreateNewAdmin />} />

    <Route path="Attributes/Marital-Statuses" element={<MaritalStatuses />} />
    <Route path="Attributes/FamilyStatuses" element={<FamilyStatuses />} />
    <Route path="Attributes/Caste" element={<Caste />} />
    <Route path="Attributes/Sub-Caste" element={<SubCaste />} />
    <Route path="Attributes/Member-Language" element={<MemberLanguage />} />
    <Route path="Attributes/Country" element={<Country />} />
    <Route path="Attributes/State" element={<State />} />
    <Route path="Attributes/City" element={<City />} />
    <Route path="Attributes/limit" element={<Limits />} />
    <Route path="Attributes/Social-Links" element={<SocialLinks />} />

    <Route path="Packages/View" element={<View />} />
    <Route path="Packages/Add-Packages" element={<Addpackages />} />
    <Route path="Packages/Edit-Package" element={<EditPackage />} />

    <Route path="Payment/Payment-Details" element={<PaymentDeatils />} />

    <Route path="Success/Success-Stories" element={<SuccessStories />} />
    <Route path="Success/Add-Story" element={<AddStory />} />
    <Route path="Success/Edit-Story" element={<EditStory />} />

    <Route path="Contact/Contactus" element={<Contactus />} />
    <Route path="Reports" element={<Reports />} />
    <Route path="HappyFace" element={<HappyFace />} />
    <Route path="About/ManageAboutUs" element={<ManageAboutUs />} />
    <Route path="Home/ManageHomeCMS" element={<ManageHomeCMS />} />
    <Route path="Contact/ManageContactCMS" element={<ManageContactCMS />} />
    <Route path="Success/ManageStoriesCMS" element={<ManageStoriesCMS />} />
    <Route path="Settings/ManageSiteSettings" element={<ManageSiteSettings />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

const App = () => {
  return <AppLayout />;
};

export default App;
