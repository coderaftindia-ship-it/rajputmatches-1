import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaQuoteLeft, FaHeart, FaUsers, FaRing, FaSmile } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../../api";
import "./HappyClients.css";

/* ── Static Data ── */
const STATS = [
  { icon: <FaUsers />,  value: 12500, suffix: "+", label: "Registered Members" },
  { icon: <FaRing />,   value: 3200,  suffix: "+", label: "Successful Matches" },
  { icon: <FaHeart />,  value: 980,   suffix: "+", label: "Happy Marriages" },
  { icon: <FaSmile />,  value: 98,    suffix: "%", label: "Satisfaction Rate" },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya & Arjun Singh",
    location: "Jaipur, Rajasthan",
    date: "Married Nov 2024",
    stars: 5,
    avatar: "PS",
    color: "#8B1A4A",
    text: "We found each other on Rajput Matches and knew instantly it was meant to be. The platform respected our family values and made the process seamless. Forever grateful!",
  },
  {
    id: 2,
    name: "Kavita & Vikram Rathore",
    location: "Udaipur, Rajasthan",
    date: "Married Mar 2024",
    stars: 5,
    avatar: "KR",
    color: "#5B1A70",
    text: "The privacy features gave our families confidence. Within 3 months of joining, we were engaged. Rajput Matches truly understands our culture and traditions.",
  },
  {
    id: 3,
    name: "Sunita & Ajay Chauhan",
    location: "Jodhpur, Rajasthan",
    date: "Married Jan 2025",
    stars: 5,
    avatar: "SC",
    color: "#1A4A5B",
    text: "Best matrimonial platform for Rajputs! The profiles were verified and genuine. We felt safe throughout the entire journey. Highly recommended to every Rajput family.",
  },
  {
    id: 4,
    name: "Meena & Ranjit Shekhawat",
    location: "Sikar, Rajasthan",
    date: "Married Sep 2024",
    stars: 5,
    avatar: "MS",
    color: "#4A5B1A",
    text: "Our parents were skeptical about online matrimony, but Rajput Matches won their trust completely. The team's support and genuine profiles made all the difference.",
  },
  {
    id: 5,
    name: "Deepa & Harish Bhati",
    location: "Delhi, India",
    date: "Married Feb 2025",
    stars: 5,
    avatar: "DB",
    color: "#5B3A1A",
    text: "I found my soulmate here! The detailed profile matching and horoscope compatibility features helped us make the right decision. A truly royal experience.",
  },
  {
    id: 6,
    name: "Rekha & Sunil Tanwar",
    location: "Bikaner, Rajasthan",
    date: "Married Dec 2024",
    stars: 5,
    avatar: "RT",
    color: "#1A5B4A",
    text: "Simple, elegant, and trustworthy. Rajput Matches gave us exactly what we were looking for — a genuine platform that honors our Rajput heritage and values.",
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
          const increment = target / steps;
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Main Component ── */
const HappyClients = () => {
  const { fetchUserData } = useAuth();
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetchUserData("profile/reviews");
        const list = Array.isArray(response)
          ? response
          : (response?.user || response?.reviews || response?.data || []);
        if (list && list.length > 0) {
          // Normalize DB reviews to match the rendering shape
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

  const activeStories = dynamicStories.length > 0 ? dynamicStories : TESTIMONIALS;
  const total = activeStories.length;

  const prev = () => setActive((a) => (a === 0 ? total - 1 : a - 1));
  const next = () => setActive((a) => (a === total - 1 ? 0 : a + 1));

  // Auto-play slider
  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show 3 visible cards (center + sides)
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
        <span className="hc-eyebrow">✦ Our Community ✦</span>
        <h2 className="hc-title">Happy Clients, <span>Real Stories</span></h2>
        <p className="hc-subtitle">
          Thousands of Rajput families have found their perfect match through our platform.
          Here are their heartfelt stories.
        </p>
      </div>

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
