import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaQuoteLeft, FaHeart, FaUsers, FaRing, FaSmile } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { publicApi, BASE_URL } from "../../api";
import "./HappyClients.css";

/* ── Fallback Testimonials ── */
const TESTIMONIALS = [
  {
    id: 1,
    name: "Karan Pratap Singh",
    location: "Software Engineer",
    date: "Aug 2026",
    stars: 5,
    avatar: "KS",
    color: "#8B1A4A",
    text: "The best Rajput matrimonial platform we've experienced. Verified profiles, excellent support, and a commitment to preserving our heritage make it stand out.",
  },
  {
    id: 2,
    name: "Avantika Singh",
    location: "Business Owner",
    date: "Aug 2026",
    stars: 5,
    avatar: "AV",
    color: "#5B1A70",
    text: "We felt respected, secure, and confident throughout the matchmaking journey. Highly recommended for every Rajput family.",
  },
  {
    id: 3,
    name: "Yogeshwari Rathore",
    location: "Teacher",
    date: "Aug 2026",
    stars: 5,
    avatar: "YR",
    color: "#1A4A5B",
    text: "Elegant, trustworthy, and easy to use. Found a perfect match for our family in just two months!",
  },
  {
    id: 4,
    name: "Vikramaditya Shekhawat",
    location: "Architect",
    date: "Jul 2026",
    stars: 5,
    avatar: "VS",
    color: "#4A5B1A",
    text: "Outstanding community privacy and authentic verified profiles. A truly dignified matchmaking experience.",
  },
  {
    id: 5,
    name: "Ragini & Harish Bhati",
    location: "Chartered Accountant",
    date: "Jul 2026",
    stars: 5,
    avatar: "RB",
    color: "#5B3A1A",
    text: "We found our soulmates through Rajput Alliances. The horoscope and clan filter features were extremely helpful.",
  },
  {
    id: 6,
    name: "Sunil Singh Tanwar",
    location: "Civil Services",
    date: "Jun 2026",
    stars: 5,
    avatar: "ST",
    color: "#1A5B4A",
    text: "Honors Rajput traditions while providing a modern, smooth user experience. Exceptional platform!",
  },
];

/* ── Animated Counter ── */
function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = (target || 0) / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{(count || 0).toLocaleString()}{suffix}</span>;
}

/* ── Main Component ── */
const HappyClients = () => {
  const { fetchUserData } = useAuth();
  const [cmsData, setCmsData] = useState(null);
  const [dynamicStories, setDynamicStories] = useState([]);
  const [active, setActive] = useState(0);

  const getImageSrc = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return image;
    if (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    const cleanPath = image.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${BASE_URL}${formattedPath}`;
  };

  // Fetch Home CMS Data for Heading, Subheading & Community Stats
  useEffect(() => {
    publicApi
      .getHomeCMS()
      .then((res) => {
        if (res?.data?.data) {
          setCmsData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching Home CMS for HappyClients:", err);
      });
  }, []);

  // Fetch Dynamic User Reviews/Testimonials
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetchUserData("profile/reviews");
        const list = Array.isArray(response)
          ? response
          : (response?.user || response?.reviews || response?.data || []);
        if (list && list.length > 0) {
          const normalized = list.map((item) => ({
            id: item._id || item.id,
            name: item.name,
            text: item.review,
            image: item.image,
            location: item.designation || "Verified Match",
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : "Verified Match",
            stars: item.rating || 5,
            avatar: item.name ? item.name.substring(0, 2).toUpperCase() : "RM",
            color: "#8B1D5A",
          }));
          setDynamicStories(normalized);
        }
      } catch (err) {
        console.error("Error fetching reviews for testimonial slider:", err);
      }
    };
    fetchReviews();
  }, [fetchUserData]);

  // Compute Dynamic Stats Cards from CMS
  const statMembersValue = cmsData?.stat_members_value !== undefined ? Number(cmsData.stat_members_value) : 12500;
  const statMembersLabel = cmsData?.stat_members_label || "Registered Members";

  const statMatchesValue = cmsData?.stat_matches_value !== undefined ? Number(cmsData.stat_matches_value) : 3200;
  const statMatchesLabel = cmsData?.stat_matches_label || "Successful Matches";

  const statMarriagesValue = cmsData?.stat_marriages_value !== undefined ? Number(cmsData.stat_marriages_value) : 980;
  const statMarriagesLabel = cmsData?.stat_marriages_label || "Happy Marriages";

  const statSatisfactionValue = cmsData?.stat_satisfaction_value !== undefined ? Number(cmsData.stat_satisfaction_value) : 98;
  const statSatisfactionLabel = cmsData?.stat_satisfaction_label || "Satisfaction Rate";

  const dynamicStats = [
    { icon: <FaUsers className="hc-stat-icon" />,  value: statMembersValue,     suffix: "+", label: statMembersLabel },
    { icon: <FaRing className="hc-stat-icon" />,   value: statMatchesValue,     suffix: "+", label: statMatchesLabel },
    { icon: <FaHeart className="hc-stat-icon" />,  value: statMarriagesValue,   suffix: "+", label: statMarriagesLabel },
    { icon: <FaSmile className="hc-stat-icon" />,  value: statSatisfactionValue, suffix: "%", label: statSatisfactionLabel },
  ];

  const activeStories = dynamicStories.length > 0 ? dynamicStories : TESTIMONIALS;
  const total = activeStories.length;

  const prev = () => setActive((a) => (a === 0 ? total - 1 : a - 1));
  const next = () => setActive((a) => (a === total - 1 ? 0 : a + 1));

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [total]);

  const getVisible = () => {
    if (total === 0) return [];
    if (total === 1) return [0, 0, 0];
    if (total === 2) return [0, 1, 0];
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((active + i + total) % total);
    }
    return indices;
  };
  const visible = getVisible();

  if (total === 0) return null;

  return (
    <section className="hc-section">
      {/* ── Background decorations ── */}
      <div className="hc-bg-orb hc-orb1" />
      <div className="hc-bg-orb hc-orb2" />

      {/* ── Heading ── */}
      <div className="hc-header">
        <span className="hc-eyebrow">✦ Community & Testimonials ✦</span>
        <h2 className="hc-title">
          {cmsData?.statsHeading || "Happy Clients, Real Stories"}
        </h2>
        <p className="hc-subtitle">
          {cmsData?.statsSubheading ||
            "Thousands of Rajput families have found their perfect match through our platform. Here are their heartfelt stories."}
        </p>
      </div>

      {/* ── Dynamic 4 Stats Cards ── */}
      

      {/* ── Testimonial Slider ── */}
      <div className="hc-slider-wrap">
        <button className="hc-nav hc-prev" onClick={prev} aria-label="Previous">&#8249;</button>

        <div className="hc-slider">
          {visible.map((idx, pos) => {
            const t = activeStories[idx];
            const isCenter = pos === 1;
            return (
              <div
                key={t.id || idx}
                className={`hc-card ${isCenter ? "hc-card--active" : "hc-card--side"}`}
                onClick={() => setActive(idx)}
              >
                <FaQuoteLeft className="hc-quote-icon" />
                <p className="hc-card-text">{t.text}</p>
                <div className="hc-stars">
                  {[...Array(t.stars)].map((_, si) => <FaStar key={si} />)}
                </div>
                <div className="hc-card-footer">
                  {t.image ? (
                    <img 
                      src={getImageSrc(t.image)} 
                      alt={t.name} 
                      className="hc-avatar" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                      style={{ objectFit: "cover", width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  ) : null}
                  <div 
                    className="hc-avatar" 
                    style={{ 
                      background: t.color, 
                      display: t.image ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="hc-name">{t.name}</p>
                    <p className="hc-meta">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="hc-nav hc-next" onClick={next} aria-label="Next">&#8250;</button>
      </div>

      {/* ── Dots ── */}
      <div className="hc-dots">
        {activeStories.map((_, i) => (
          <button
            key={i}
            className={`hc-dot ${i === active ? "hc-dot--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HappyClients;
