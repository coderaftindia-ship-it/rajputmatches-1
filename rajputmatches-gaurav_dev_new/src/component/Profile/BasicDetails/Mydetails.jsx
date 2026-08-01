import React, { useState, useEffect } from "react";
import styles from "./Mydetails.module.css";
import { useAuth } from "../../Layout/AuthContext";
import { useProfileDetails } from "../../../context/ProfileDetailsContext";

// Import original edit forms
import FormCard from "../Forms/FormCard";
import ReligionForm from "../Forms/ReligionForm";
import EducationinfoForm from "../Forms/EducationinfoForm";
import FamilyinfoForm from "../Forms/FamilyinfoForm";
import DocumentForm from "../Forms/DocumentForm";
import PaternalfamilyinfoForm from "../Forms/PaternalfamilyinfoForm";

// Import premium react-icons
import {
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaRulerVertical,
  FaWeight,
  FaHeart,
  FaMapMarkerAlt,
  FaUserCheck,
  FaUser,
  FaStar,
  FaMoon,
  FaClock,
  FaSun,
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaBuilding,
  FaBriefcase,
  FaHome,
  FaUserFriends,
  FaShieldAlt,
  FaHandshake,
  FaLock,
  FaRegEdit,
  FaCamera,
  FaBook,
  FaPlane,
  FaPalette,
  FaMusic,
  FaUtensils,
  FaHeartbeat,
  FaTree
} from "react-icons/fa";

// Date formatting helper
const formatDob = (dobString) => {
  if (!dobString || dobString === "N/A") return "N/A";
  try {
    const date = new Date(dobString);
    if (isNaN(date.getTime())) return dobString;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    return dobString;
  }
};

// Slowly Spinning Mandala SVG Watermark
const MandalaSVG = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.4"
    strokeLinecap="round"
  >
    <circle cx="50" cy="50" r="46" strokeDasharray="1 3" />
    <circle cx="50" cy="50" r="42" />
    <circle cx="50" cy="50" r="28" />
    <circle cx="50" cy="50" r="14" />
    <path d="M 50,4 L 50,96 M 4,50 L 96,50 M 17.5,17.5 L 82.5,82.5 M 17.5,82.5 L 82.5,17.5" />
    <path d="M 50,4 C 43,18 57,18 50,4 Z M 50,96 C 43,82 57,82 50,96 Z M 4,50 C 18,43 18,57 4,50 Z M 96,50 C 82,43 82,57 96,50 Z" />
    <path d="M 17.5,17.5 C 24,30 30,24 17.5,17.5 Z M 82.5,82.5 C 76,70 70,76 82.5,82.5 Z M 17.5,82.5 C 24,70 30,76 17.5,82.5 Z M 82.5,17.5 C 76,30 70,24 82.5,17.5 Z" />
  </svg>
);

// Detail Item Subcomponent
const DetailRow = ({ icon, label, value }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailIconCircle}>{icon}</div>
    <div>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>{value || "—"}</div>
    </div>
  </div>
);

// Paternal Ancestry Row
const AncestryRow = ({ label, value }) => (
  <div className={styles.ancestryRow}>
    <span className={styles.ancestryLabel}>{label}:</span>
    <span className={styles.ancestryVal}>{value || "—"}</span>
  </div>
);

// Section Ribbon header wrapper with ornaments and inline edit button support
const SectionRibbon = ({ children, onEditClick, editTitle }) => (
  <div className={styles.sectionRibbon}>
    <div className={styles.ribbonTitleContainer}>
      <span className={`${styles.ribbonOrn} ${styles.ribbonOrnLeft}`}>✦</span>
      <span>{children}</span>
      <span className={`${styles.ribbonOrn} ${styles.ribbonOrnRight}`}>✦</span>
    </div>
    {onEditClick && (
      <div className={styles.inlineEditBtn} onClick={onEditClick} title={editTitle}>
        <FaRegEdit size={13} />
      </div>
    )}
  </div>
);

function Mydetails() {
  const { updateData } = useAuth();
  const { user, horoscope, family, professional, media, extendedFamily, refreshSection } = useProfileDetails();

  // Active modal status: 'basic' | 'religion' | 'education' | 'family' | 'media' | 'paternal' | null
  const [activeModal, setActiveModal] = useState(null);

  const [aboutText, setAboutText] = useState("");
  const [prefText, setPrefText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user && !isInitialized) {
      setAboutText(user.additionalInfo || "");
      setPrefText(user.partnerPreferences || "");
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const saveAboutMe = async (text) => {
    const payload = {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      height: user?.height || { feet: "", inches: "" },
      weight: user?.weight || "",
      maritalStatus: user?.maritalStatus || "",
      additionalInfo: text,
      countryCode: user?.countryCode || "",
    };
    try {
      await updateData("update-profile", payload, true);
      await refreshSection("user");
    } catch (err) {
      console.error(err);
    }
  };

  const savePartnerPref = async (text) => {
    try {
      await updateData("update-profile", { partnerPreferences: text }, true);
      await refreshSection("user");
    } catch (err) {
      console.error(err);
    }
  };

  // Form states matching original components
  const [basicFormData, setBasicFormData] = useState({});
  const [basicError, setBasicError] = useState("");

  const [religionFormData, setReligionFormData] = useState({});
  
  const [educationFormData, setEducationFormData] = useState({});

  const [familyFormData, setFamilyFormData] = useState({});

  const [paternalFormData, setPaternalFormData] = useState({});
  const [paternalError, setPaternalError] = useState("");

  const [mediaImages, setMediaImages] = useState([]);
  const [mediaDocs, setMediaDocs] = useState([]);
  const [mediaPrivate, setMediaPrivate] = useState(false);

  // Initialize and Open Forms
  const openBasicEdit = () => {
    setBasicError("");
    const formattedDob = user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "";
    setBasicFormData({
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      dateOfBirth: formattedDob,
      mobile: user?.mobile || "",
      email: user?.email || "",
      height: user?.height ? `${user.height.feet || 5} ft ${user.height.inches || 0} in` : "",
      weight: user?.weight ? `${user.weight} kg` : "",
      maritalStatus: (user?.maritalStatus === "Single") ? "Never Married" : (user?.maritalStatus || ""),
      clan: horoscope?.clan || "",
      subclan: horoscope?.subclan || "",
      currentCity: user?.city || user?.currentCity || "",
      nativePlace: user?.nativePlace || horoscope?.birthplace || "",
      birthplace: horoscope?.birthplace || "",
      birthTime: horoscope?.birthHour && horoscope?.birthMinute
        ? `${horoscope.birthHour}:${horoscope.birthMinute} ${horoscope.birthTimePeriod || ""}`
        : "",
      gotra: horoscope?.gotra || "",
      rashi: horoscope?.rashi || horoscope?.zodiac || "",
      manglik: horoscope?.maglik || horoscope?.manglik || "",
    });
    setActiveModal("basic");
  };

  const openReligionEdit = () => {
    setReligionFormData({
      birthHour: horoscope?.birthHour || "",
      birthMinute: horoscope?.birthMinute || "",
      birthTimePeriod: horoscope?.birthTimePeriod || "",
      birthplace: horoscope?.birthplace || "",
      birthCity: horoscope?.birthCity || "",
      birthState: horoscope?.birthState || "",
      birthCountry: horoscope?.birthCountry || "",
      maglik: horoscope?.maglik || "",
      clan: horoscope?.clan || "",
      subclan: horoscope?.subclan || "",
      gotra: horoscope?.gotra || "",
      additionalInfo: horoscope?.additionalInfo || "",
    });
    setActiveModal("religion");
  };

  const openEducationEdit = () => {
    const rawOccs = professional?.occupationsList || [];
    const normalizedOccs = rawOccs.map((o) => ({
      occupation: o.occupation || "",
      company: o.company || o.salary || "",
      salary: o.salary || o.company || "",
    }));

    setEducationFormData({
      qualifications: professional?.qualifications || "",
      institution: professional?.institution || "",
      professional: professional?.professional || "",
      company: professional?.company || professional?.annualIncome || "",
      annualIncome: professional?.company || professional?.annualIncome || "",
      hobbies: professional?.hobbies || [],
      additionalInfo: professional?.additionalInfo || "",
      class: professional?.class || "",
      qualificationsList: professional?.qualificationsList || [],
      occupationsList: normalizedOccs,
    });
    setActiveModal("education");
  };

  const openFamilyEdit = () => {
    setFamilyFormData({
      fatherName: family?.fatherName || "",
      occupation: family?.occupation || "",
      fatherNativePlace: family?.fatherNativePlace || "",
      motherName: family?.motherName || "",
      motherNativePlace: family?.motherNativePlace || "",
      motherOccupation: family?.motherOccupation || "",
      maternalGotra: family?.maternalGotra || "",
      siblings: family?.siblings || "",
      familyLocation: family?.familyLocation || "",
      additionalMaternal: family?.additionalMaternal || "",
      familyInfo: family?.familyInfo || "",
      elderBrother: family?.elderBrother?.length > 0 ? family.elderBrother : [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
      elderSister: family?.elderSister?.length > 0 ? family.elderSister : [{ name: "", marriedto: "", sonof: "", thikana: "" }],
      youngerBrother: family?.youngerBrother?.length > 0 ? family.youngerBrother : [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
      youngerSister: family?.youngerSister?.length > 0 ? family.youngerSister : [{ name: "", marriedto: "", sonof: "", thikana: "" }],
    });
    setActiveModal("family");
  };

  const handleSiblingChange = (arrayName, index, field, value) => {
    setFamilyFormData((prev) => {
      const currentList = prev[arrayName] ? [...prev[arrayName]] : [];
      if (!currentList[index]) {
        currentList[index] = { name: "", marriedto: "", daughterof: "", sonof: "", thikana: "" };
      }
      currentList[index] = { ...currentList[index], [field]: value };
      return { ...prev, [arrayName]: currentList };
    });
  };

  const handleAddSiblingRow = (arrayName) => {
    setFamilyFormData((prev) => {
      const currentList = prev[arrayName] ? [...prev[arrayName]] : [];
      const newRow = {
        name: "",
        marriedto: "",
        ...(arrayName.includes("Sister") ? { sonof: "" } : { daughterof: "" }),
        thikana: "",
      };
      return { ...prev, [arrayName]: [...currentList, newRow] };
    });
  };

  const handleRemoveSiblingRow = (arrayName, index) => {
    setFamilyFormData((prev) => {
      const currentList = prev[arrayName] ? [...prev[arrayName]] : [];
      const updated = currentList.filter((_, i) => i !== index);
      return { ...prev, [arrayName]: updated };
    });
  };

  const openPaternalEdit = () => {
    setPaternalError("");
    setPaternalFormData({
      grandFatherName: extendedFamily?.grandFatherName || "",
      grandFathersonOf: extendedFamily?.grandFathersonOf || "",
      grandFatheroccupation: extendedFamily?.grandFatheroccupation || "",
      grandFatherthikana: extendedFamily?.grandFatherthikana || "",
      grandMotherName: extendedFamily?.grandMotherName || "",
      grandMotherdaughterOf: extendedFamily?.grandMotherdaughterOf || "",
      grandmotherthikana: extendedFamily?.grandmotherthikana || "",
      badePapa: extendedFamily?.badePapa || [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
      kakosa: extendedFamily?.kakosa || [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
      bhuasa: extendedFamily?.bhuasa || [{ name: "", marriedto: "", sonof: "", thikana: "" }],
      maternalGrandFatherName: extendedFamily?.maternalGrandFatherName || "",
      maternalGrandFatherthikana: extendedFamily?.maternalGrandFatherthikana || "",
      maternalGrandFathersonOf: extendedFamily?.maternalGrandFathersonOf || "",
      maternalGrandFatheroccupation: extendedFamily?.maternalGrandFatheroccupation || "",
      maternalGrandMotherName: extendedFamily?.maternalGrandMotherName || "",
      maternalGrandMotherdaughterOf: extendedFamily?.maternalGrandMotherdaughterOf || "",
      maternalGrandMotherthikana: extendedFamily?.maternalGrandMotherthikana || "",
      mamosa: extendedFamily?.mamosa || [{ name: "", marriedto: "", daughterof: "", thikana: "" }],
      masisa: extendedFamily?.masisa || [{ name: "", marriedto: "", sonof: "", thikana: "" }],
    });
    setActiveModal("paternal");
  };

  const openMediaEdit = () => {
    setMediaImages(media?.photos || []);
    setMediaDocs(media?.documents || []);
    setMediaPrivate(media?.isPrivate || false);
    setActiveModal("media");
  };

  // Change Handlers with Validation matching originals
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    if (value.length > 25) {
      setBasicError("Input cannot exceed 25 characters.");
      return;
    } else {
      setBasicError("");
    }

    if (name === "heightFeet" || name === "heightInch") {
      setBasicFormData((prev) => ({
        ...prev,
        height: {
          ...prev.height,
          [name === "heightFeet" ? "feet" : "inches"]: parseInt(value, 10) || "",
        },
        [name]: value
      }));
    } else {
      setBasicFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReligionChange = (e) => {
    const { name, value } = e.target;
    const applyMaxLength = (val) => val.slice(0, 25);
    
    if (name === "birthHour" || name === "birthMinute") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 2);
      setReligionFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === "additionalInfo") {
      const validValue = value.replace(/[^a-zA-Z.,'"() ]/g, "");
      setReligionFormData(prev => ({ ...prev, [name]: applyMaxLength(validValue) }));
    } else {
      const validValue = value.replace(/[^a-zA-Z ]/g, "");
      setReligionFormData(prev => ({ ...prev, [name]: applyMaxLength(validValue) }));
    }
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    let validValue = value;
    
    const textRegex = /^[a-zA-Z0-9\s,./"'()-]*$/;
    const incomeRegex = /^(Below \d+ LPA|\d+-\d+ LPA|Above \d+ LPA)?$/;
    const hobbiesRegex = /^[a-zA-Z\s,]{1,40}$/;
    const additionalInfoRegex = /^[a-zA-Z0-9.,'"() ]{0,100}$/;

    if (["qualifications", "institution", "class"].includes(name)) {
      if (!/^[a-zA-Z\s,/'"]*$/.test(value)) return;
    } else if (name === "professional") {
      if (!textRegex.test(value)) return;
    } else if (name === "annualIncome") {
      if (!incomeRegex.test(value)) return;
    } else if (name === "hobbies") {
      if (!hobbiesRegex.test(value)) return;
      validValue = value.split(",").map((hobby) => hobby.trim());
    } else if (name === "additionalInfo") {
      if (!additionalInfoRegex.test(value)) return;
    }
    
    setEducationFormData(prev => ({ ...prev, [name]: validValue }));
  };

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setFamilyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaternalChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    const nameRegex = /^[a-zA-Z\s]{0,25}$/;
    const placeRegex = /^[a-zA-Z\s,.'\-]{0,25}$/;

    if (!nameRegex.test(value) && !placeRegex.test(value)) return;

    if (arrayName) {
      const updatedArray = [...paternalFormData[arrayName]];
      updatedArray[index] = { ...updatedArray[index], [name]: value };
      setPaternalFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
    } else {
      setPaternalFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRow = (arrayName) => {
    const newRow = {
      name: "",
      marriedto: "",
      ...(arrayName === "masisa" || arrayName === "bhuasa"
        ? { daughterof: "" }
        : { sonof: "" }),
      thikana: "",
    };
    setPaternalFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newRow],
    }));
  };

  const handleRemovePaternalRow = (index, arrayName) => {
    setPaternalFormData(prev => {
      const updated = (prev[arrayName] || []).filter((_, i) => i !== index);
      return { ...prev, [arrayName]: updated };
    });
  };

  // Save Handlers
  const handleBasicSave = async () => {
    try {
      // Map data to match backend schema format
      let mappedMaritalStatus = basicFormData.maritalStatus;
      if (mappedMaritalStatus === "Never Married") mappedMaritalStatus = "Single";
      if (mappedMaritalStatus === "Awaiting Divorce") mappedMaritalStatus = "Divorced";

      let heightObj = { feet: 5, inches: 5 };
      if (basicFormData.height) {
        const match = basicFormData.height.match(/(\d+)\s*ft\s*(\d+)\s*in/);
        if (match) {
          heightObj = { feet: parseInt(match[1], 10), inches: parseInt(match[2], 10) };
        }
      }

      let weightNum = 0;
      if (basicFormData.weight) {
        weightNum = parseInt(basicFormData.weight.replace(/\D/g, ""), 10);
      }

      const profilePayload = {
        ...basicFormData,
        maritalStatus: mappedMaritalStatus,
        height: heightObj,
        weight: weightNum,
        city: basicFormData.currentCity,
      };

      await updateData("update-profile", profilePayload, true);
      
      let birthHour = "";
      let birthMinute = "";
      let birthTimePeriod = "AM";
      if (basicFormData.birthTime) {
        const timeMatch = basicFormData.birthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          birthHour = timeMatch[1];
          birthMinute = timeMatch[2];
          birthTimePeriod = timeMatch[3] ? timeMatch[3].toUpperCase() : "AM";
        }
      }

      if (
        basicFormData.clan || 
        basicFormData.gotra || 
        basicFormData.manglik || 
        basicFormData.rashi || 
        basicFormData.birthplace || 
        basicFormData.birthTime
      ) {
        await updateData("update-religiondetails", {
          clan: basicFormData.clan,
          subclan: basicFormData.subclan,
          gotra: basicFormData.gotra,
          maglik: basicFormData.manglik,
          manglik: basicFormData.manglik,
          birthplace: basicFormData.birthplace,
          rashi: basicFormData.rashi,
          zodiac: basicFormData.rashi,
          birthHour: birthHour,
          birthMinute: birthMinute,
          birthTimePeriod: birthTimePeriod,
        }, false);
      }
      setActiveModal(null);
      await refreshSection("user");
      await refreshSection("horoscope");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReligionSave = async () => {
    try {
      await updateData("update-religiondetails", religionFormData, true);
      setActiveModal(null);
      await refreshSection("horoscope");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEducationSave = async (savedData) => {
    try {
      const payload = savedData || educationFormData;
      await updateData("save-professional-data", payload, true);
      setActiveModal(null);
      await refreshSection("professional");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFamilySave = async () => {
    try {
      await updateData("update-family-details", familyFormData, true);
      setActiveModal(null);
      await refreshSection("family");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaternalSave = async () => {
    for (const arrayName of ["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"]) {
      if (paternalFormData[arrayName]) {
        for (let index = 0; index < paternalFormData[arrayName].length; index++) {
          const item = paternalFormData[arrayName][index];
          if (index === 0) continue; // first row is optional
          for (const key in item) {
            if (key === "_id") continue; // skip Mongoose subdoc _id
            if (typeof item[key] === "string" && !item[key]?.trim()) {
              setPaternalError(`Please fill all fields in ${arrayName}, row ${index + 1}`);
              return;
            }
          }
        }
      }
    }

    try {
      await updateData("updatepaternal-details", paternalFormData, true);
      setActiveModal(null);
      await refreshSection("extendedFamily");
    } catch (err) {
      console.error(err);
    }

  };

  const handleMediaSave = async () => {
    try {
      setActiveModal(null);
      await refreshSection("media");
    } catch (err) {
      console.error(err);
    }
  };

  // Initialize display details
  const fullName = [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ");
  const heightDisplay = user?.height?.feet ? `${user?.height.feet}'${user?.height.inches}"` : "N/A";
  
  const birthTime = horoscope?.birthHour && horoscope?.birthMinute
    ? `${horoscope.birthHour}:${horoscope.birthMinute} ${horoscope.birthTimePeriod || ""}`
    : "N/A";

  const currentAvatar = media?.photos?.find(img => img.isAvatar)?.url ||
    user?.avatar ||
    (media?.photos?.[0]?.url) ||
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  // Hobby mapping to custom icons
  const getHobbyIcon = (hobby) => {
    const h = hobby.toLowerCase();
    if (h.includes("read") || h.includes("book")) return <FaBook />;
    if (h.includes("travel") || h.includes("explore") || h.includes("trip")) return <FaPlane />;
    if (h.includes("cook") || h.includes("food") || h.includes("bake")) return <FaUtensils />;
    if (h.includes("music") || h.includes("sing") || h.includes("song")) return <FaMusic />;
    if (h.includes("art") || h.includes("paint") || h.includes("draw")) return <FaPalette />;
    if (h.includes("yoga") || h.includes("gym") || h.includes("fit") || h.includes("sport")) return <FaHeartbeat />;
    return <FaStar />;
  };

  const userHobbies = Array.isArray(professional?.hobbies) ? professional.hobbies : [];

  return (
    <div className={styles.biodataWrapper}>
      
      {/* ── Main Elite Biodata Card ── */}
      <div className={styles.biodataCard}>
        
        {/* Background Spinning Mandala Decorative Element */}
        <MandalaSVG className={styles.spinningMandala} />

        {/* ── Top Header ── */}
        <div className={styles.biodataHeader}>
          <p className={styles.biodataSlogan}>Trusted Connections. Happy Futures.</p>
          <div className={styles.goldFlourish}>
            <span>❧</span>
            <span>✦</span>
            <span>❧</span>
          </div>
        </div>

        {/* ── Grid Columns (Left Profile, Right Picture) ── */}
        <div className={styles.biodataGrid}>
          
          {/* Left Column: Banners & Key Detail Fields */}
          <div>
            
            {/* PERSONAL INFORMATION SECTION */}
            <SectionRibbon onEditClick={openBasicEdit} editTitle="Edit Basic Details">
              Personal Information
            </SectionRibbon>
            
            <div className={styles.detailsList}>
              <DetailRow icon={<FaMapMarkerAlt />} label="Current City" value={user?.city || user?.currentCity || "N/A"} />
              <DetailRow icon={<FaHome />} label="Native Place" value={user?.nativePlace || horoscope?.birthplace || "N/A"} />
              <DetailRow icon={<FaCalendarAlt />} label="Date of Birth" value={formatDob(user?.dateOfBirth)} />
              <DetailRow icon={<FaMapMarkerAlt />} label="Place of Birth" value={horoscope?.birthplace || "N/A"} />
              <DetailRow icon={<FaClock />} label="Time of Birth" value={birthTime} />
              <DetailRow icon={<FaStar />} label="Gotra" value={horoscope?.gotra || "N/A"} />
              <DetailRow icon={<FaUsers />} label="Clan / Subclan" value={horoscope?.clan ? `${horoscope.clan} ${horoscope.subclan ? `(${horoscope.subclan})` : ""}` : "N/A"} />
              <DetailRow icon={<FaRulerVertical />} label="Height" value={heightDisplay} />
              <DetailRow icon={<FaWeight />} label="Weight" value={user?.weight ? `${user.weight} kg` : "N/A"} />
              <DetailRow icon={<FaMoon />} label="Zodiac (Rashi)" value={horoscope?.rashi || horoscope?.zodiac || "N/A"} />
              <DetailRow icon={<FaSun />} label="Manglik" value={horoscope?.maglik || horoscope?.manglik || "N/A"} />
              <DetailRow icon={<FaHeart />} label="Marital Status" value={user?.maritalStatus || "N/A"} />
            </div>

            {/* EDUCATION SECTION */}
            <SectionRibbon onEditClick={openEducationEdit} editTitle="Edit Academics & Profession">
              ✦ EDUCATION / CAREER ✦
            </SectionRibbon>
            
            <div className={styles.detailsList}>
              {professional?.qualificationsList && professional.qualificationsList.length > 0 ? (
                professional.qualificationsList.map((q, idx) => (
                  <React.Fragment key={idx}>
                    <DetailRow icon={<FaGraduationCap />} label={professional.qualificationsList.length > 1 ? `Qualifications #${idx + 1}` : "Qualifications"} value={q.qualification || "N/A"} />
                    <DetailRow icon={<FaBuilding />} label="Institution" value={q.institution || "N/A"} />
                  </React.Fragment>
                ))
              ) : (
                <>
                  <DetailRow icon={<FaGraduationCap />} label="Qualifications" value={professional?.qualifications || "N/A"} />
                  <DetailRow icon={<FaBuilding />} label="Institution" value={professional?.institution || "N/A"} />
                </>
              )}
            </div>
            <div className={styles.detailsList}>
              {professional?.occupationsList && professional.occupationsList.length > 0 ? (
                professional.occupationsList.map((o, idx) => (
                  <React.Fragment key={idx}>
                    <DetailRow icon={<FaBriefcase />} label={professional.occupationsList.length > 1 ? `Current Role #${idx + 1}` : "Current Role"} value={o.occupation || "N/A"} />
                    <DetailRow icon={<FaBuilding />} label={professional.occupationsList.length > 1 ? `Company #${idx + 1}` : "Company / Employer"} value={o.company || o.salary || "N/A"} />
                  </React.Fragment>
                ))
              ) : (
                <>
                  <DetailRow icon={<FaBriefcase />} label="Current Role" value={professional?.professional || "N/A"} />
                  <DetailRow icon={<FaBuilding />} label="Company / Employer" value={professional?.company || professional?.annualIncome || "N/A"} />
                </>
              )}
            </div>
          </div>

          {/* Right Column: Profile Picture & Short Bio */}
          <div className={styles.rightPanel}>
            
            <div className={styles.photoFrame} onClick={openMediaEdit} title="Upload / Edit Profile Images">
              <img src={currentAvatar} alt="Profile" className={styles.profileImage} />
              <div className={styles.photoEditOverlay}>
                <FaCamera size={20} />
                <span>Upload Photos</span>
              </div>
            </div>

            <h2 className={styles.profileName}>{fullName || "Your Name"}</h2>
            
            <div className={styles.nameDivider}>
              <span>❧ ✦ ❧</span>
            </div>

            <div className={styles.profileId}>
              PROFILE ID: {user?.martrId || "—"}
            </div>

            <div className={styles.inlineTextAreaContainer} style={{ marginTop: "12px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", width: "100%", display: "block" }}>
                About Me
              </label>
              <textarea
                className={styles.inlineBioTextArea}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Tell us about yourself..."
                rows="4"
              />
              {aboutText !== (user?.additionalInfo || "") && (
                <button
                  className={styles.inlineSaveBtn}
                  onClick={() => saveAboutMe(aboutText)}
                >
                  Save About Me
                </button>
              )}
            </div>

          </div>

        </div>

        {/* ── MY WORLD (Hobbies) ── */}
        <div className={styles.myWorldDivider}>
          <span>My World</span>
        </div>

        {userHobbies.length > 0 ? (
          <div className={styles.hobbiesContainer}>
            {userHobbies.map((hobby, index) => (
              <div className={styles.hobbyBadge} key={index}>
                <div className={styles.hobbyIconCircle}>
                  {getHobbyIcon(hobby)}
                </div>
                <span className={styles.hobbyLabel}>{hobby}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "20px" }}>
            Add hobbies to complete your profile
          </p>
        )}

        {/* ── Partner Preferences & Family Boxes ── */}
        <div className={styles.prefFamilyBox}>
          
          {/* Partner Preferences */}
          <div className={styles.premiumInfoCard}>
            <h4 className={styles.partnerPrefTitle}>
              <span>Partner Preferences</span>
            </h4>
            <div className={styles.partnerPrefContent}>
              <div className={styles.prefIconLeft}>
                <FaHeart />
              </div>
              <div className={styles.inlineTextAreaContainer}>
                <textarea
                  className={styles.inlinePrefTextArea}
                  value={prefText}
                  onChange={(e) => setPrefText(e.target.value)}
                  placeholder="Describe your ideal partner..."
                  rows="4"
                />
                {prefText !== (user?.partnerPreferences || "") && (
                  <button
                    className={styles.inlineSaveBtn}
                    onClick={() => savePartnerPref(prefText)}
                  >
                    Save Preferences
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Family Summary */}
          <div className={styles.premiumInfoCard}>
            <h4 className={styles.partnerPrefTitle}>
              <span>Family Background</span>
              <div className={styles.inlineEditBtn} onClick={openFamilyEdit} title="Edit Family Details">
                <FaRegEdit size={12} />
              </div>
            </h4>
            <div className={styles.partnerPrefContent}>
              <div className={styles.prefIconLeft}>
                <FaHome />
              </div>
              <div style={{ flexGrow: 1 }}>
                <AncestryRow label="Father" value={family?.fatherName} />
                <AncestryRow label="Father Occ." value={family?.occupation} />
                <AncestryRow label="Father Native Place" value={family?.fatherNativePlace} />
                <AncestryRow label="Mother" value={family?.motherName} />
                <AncestryRow label="Mother Occ." value={family?.motherOccupation} />
                <AncestryRow label="Mother Native Place" value={family?.motherNativePlace} />
                <AncestryRow label="Maternal Gotra" value={family?.maternalGotra} />
                <AncestryRow label="Family Thikana" value={family?.familyLocation} />
                <AncestryRow label="Family Info" value={family?.familyInfo} />
              </div>
            </div>
          </div>

        </div>

        {/* ── All Siblings Information ── */}
        {((Array.isArray(family?.elderBrother) && family.elderBrother.some(b => b?.name)) ||
          (Array.isArray(family?.elderSister) && family.elderSister.some(s => s?.name)) ||
          (Array.isArray(family?.youngerBrother) && family.youngerBrother.some(b => b?.name)) ||
          (Array.isArray(family?.youngerSister) && family.youngerSister.some(s => s?.name))) && (
          <div className={styles.fullWidthSection}>
            <SectionRibbon onEditClick={openFamilyEdit} editTitle="Edit Siblings Details">
              Siblings Information
            </SectionRibbon>

            <div className={styles.relGrid}>
              {[
                { key: "elderBrother", title: "Elder Brother" },
                { key: "elderSister", title: "Elder Sister" },
                { key: "youngerBrother", title: "Younger Brother" },
                { key: "youngerSister", title: "Younger Sister" },
              ].map(({ key, title }) =>
                Array.isArray(family?.[key]) && family[key].map((person, idx) => {
                  if (!person?.name) return null;
                  return (
                    <div className={styles.relCard} key={`sib-${key}-${idx}`}>
                      <span className={styles.relRelation}>{title}</span>
                      <h6 className={styles.relName}>{person.name}</h6>
                      <div className={styles.relDetail}>Married to: <strong>{person.marriedto || "—"}</strong></div>
                      {(person.daughterof || person.sonof) && (
                        <div className={styles.relDetail}>
                          {person.daughterof ? "Daughter of: " : "Son of: "}<strong>{person.daughterof || person.sonof}</strong>
                        </div>
                      )}
                      <div className={styles.relDetail}>Native Place: <strong>{person.thikana || "—"}</strong></div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── Ancestry Details ── */}
        <div className={styles.fullWidthSection}>
          <SectionRibbon onEditClick={openPaternalEdit} editTitle="Edit Paternal Details">
            Grand Ancestry &amp; Lineage
          </SectionRibbon>

          <div className={styles.ancestryGrid}>
            {/* Paternal Grandparents */}
            <div className={styles.ancestryCard}>
              <h5 className={styles.ancestryHeader}>
                <FaUserFriends /> Paternal Lineage
              </h5>
              <AncestryRow label="Grandfather" value={extendedFamily?.grandFatherName} />
              <AncestryRow label="Son Of" value={extendedFamily?.grandFathersonOf} />
              <AncestryRow label="Grandfather Occ." value={extendedFamily?.grandFatheroccupation} />
              <AncestryRow label="Native Place" value={extendedFamily?.grandFatherthikana} />
              <AncestryRow label="Grandmother" value={extendedFamily?.grandMotherName} />
            </div>

            {/* Maternal Grandparents */}
            <div className={styles.ancestryCard}>
              <h5 className={styles.ancestryHeader}>
                <FaTree /> Maternal Lineage
              </h5>
              <AncestryRow label="Maternal G.Father" value={extendedFamily?.maternalGrandFatherName} />
              <AncestryRow label="Son Of" value={extendedFamily?.maternalGrandFathersonOf} />
              <AncestryRow label="M.Grandfather Occ." value={extendedFamily?.maternalGrandFatheroccupation} />
              <AncestryRow label="Native Place" value={extendedFamily?.maternalGrandFatherthikana} />
              <AncestryRow label="Maternal G.Mother" value={extendedFamily?.maternalGrandMotherName} />
            </div>
          </div>
        </div>

        {/* Relatives Information if updated */}
        {["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"].some(k => Array.isArray(extendedFamily?.[k]) && extendedFamily[k].length > 0 && extendedFamily[k][0]?.name) && (
          <div className={styles.fullWidthSection}>
            <SectionRibbon onEditClick={openPaternalEdit} editTitle="Edit Relatives">
              Family Relatives &amp; Connections
            </SectionRibbon>

            <div className={styles.relGrid}>
              {["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"].map((rk) =>
                Array.isArray(extendedFamily?.[rk]) && extendedFamily[rk].map((person, idx) => {
                  if (!person?.name) return null;
                  return (
                    <div className={styles.relCard} key={`${rk}-${idx}`}>
                      <span className={styles.relRelation}>{rk.replace(/([A-Z])/g, " $1")}</span>
                      <h6 className={styles.relName}>{person.name}</h6>
                      <div className={styles.relDetail}>Married to: <strong>{person.marriedto || "—"}</strong></div>
                      {(person.sonof || person.daughterof) && (
                        <div className={styles.relDetail}>
                          Child of: <strong>{person.sonof || person.daughterof}</strong>
                        </div>
                      )}
                      <div className={styles.relDetail}>Thikana: <strong>{person.thikana || "—"}</strong></div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── Footer Banner ── */}
        <div className={styles.biodataFooterBanner}>
          <FaShieldAlt /> PROFILE VERIFICATION | PERSONAL ASSISTANCE | PRIVACY PROTECTION
        </div>

        <p className={styles.footerSubtext}>
          Trusted by Millions. Delivered by Rajput Matches.
        </p>

        {/* Footer Brand Logo Block */}
        <div className={styles.footerLogoBlock}>
          <div className={styles.footerLogoLeft}>
            <span className={styles.footerLogoTitle}>THE RAJPUT MATCHES</span>
            <span>Matrimony for Rajput Clans</span>
          </div>
          <div className={styles.footerLogoRight}>
            <span>www.rajputmatches.com</span>
            <span>connect@rajputmatches.com</span>
          </div>
        </div>

      </div>

      {/* ── Active Modal Rendering for Editing Details ── */}
      {activeModal === "basic" && (
        <FormCard
          handleCancelClick={() => setActiveModal(null)}
          details={basicFormData}
          handleInputChange={handleBasicChange}
          formData={basicFormData}
          handleSaveClick={handleBasicSave}
          error={basicError}
        />
      )}

      {activeModal === "religion" && (
        <ReligionForm
          handleCancelClick={() => setActiveModal(null)}
          details={religionFormData}
          handleInputChange={handleReligionChange}
          formData={religionFormData}
          setFormData={setReligionFormData}
          handleSaveClick={handleReligionSave}
        />
      )}

      {activeModal === "education" && (
        <EducationinfoForm
          handleCancelClick={() => setActiveModal(null)}
          handleInputChange={handleEducationChange}
          formData={educationFormData}
          handleSaveClick={handleEducationSave}
        />
      )}

      {activeModal === "family" && (
        <FamilyinfoForm
          handleCancelClick={() => setActiveModal(null)}
          handleInputChange={handleFamilyChange}
          handleSiblingChange={handleSiblingChange}
          handleAddSiblingRow={handleAddSiblingRow}
          handleRemoveSiblingRow={handleRemoveSiblingRow}
          formData={familyFormData}
          handleSaveClick={handleFamilySave}
        />
      )}

      {activeModal === "paternal" && (
        <PaternalfamilyinfoForm
          handleCancelClick={() => setActiveModal(null)}
          handleInputChange={handlePaternalChange}
          formData={paternalFormData}
          handleSaveClick={handlePaternalSave}
          handleAddRow={handleAddRow}
          handleRemoveRow={handleRemovePaternalRow}
          error={paternalError}
          setError={setPaternalError}
        />
      )}

      {activeModal === "media" && (
        <DocumentForm
          handleCancelClick={() => setActiveModal(null)}
          handleSaveClick={handleMediaSave}
          images={mediaImages}
          setImages={setMediaImages}
          setProfileImage={() => {}}
          setdocuments={setMediaDocs}
          documents={mediaDocs}
          fetchData={handleMediaSave}
          selectedOption={mediaPrivate}
          setSelectedOption={setMediaPrivate}
        />
      )}

    </div>
  );
}

export default Mydetails;
