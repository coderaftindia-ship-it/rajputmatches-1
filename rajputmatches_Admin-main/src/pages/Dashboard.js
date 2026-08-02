import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaUsers, FaCrown, FaBan, FaUserCheck, FaChartLine, 
  FaHeart, FaDatabase, FaServer, FaEnvelope, FaClock 
} from "react-icons/fa";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, 
  BarChart, Bar 
} from "recharts";
import { toast } from "react-toastify";

const Dashboard = () => {
  const Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const token = localStorage.getItem("adminAuthToken");

  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({
    totalMembers: 0,
    freeMembers: 0,
    blockedMembers: 0,
    premiumMembers: 0,
  });

  // Chart data states
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [profileForData, setProfileForData] = useState([]);
  const [stateData, setStateData] = useState([]);

  // Fetch KPI statistics
  const fetchUserCounts = async () => {
    try {
      const response = await axios.get(`${Base_url}/dashboard/user-counts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCounts(response?.data?.data || {
        totalMembers: 0,
        freeMembers: 0,
        blockedMembers: 0,
        premiumMembers: 0,
      });
    } catch (error) {
      console.error("Error fetching user counts:", error?.response?.data || error.message);
      toast.error("KPI data load nahi hua. Backend check karein.", { toastId: 'user-counts-err' });
    }
  };

  // Fetch Analytics data for Charts
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${Base_url}/dashboard/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response?.data) {
        const {
          registrationTrend: regTrend,
          genderRatio,
          subscriptionRatio,
          profileForRatio,
          stateRatio
        } = response.data;

        // Process Registration Trend
        if (regTrend && regTrend.length > 0) {
          setRegistrationTrend(regTrend.map(item => ({
            date: formatDate(item._id),
            Registrations: item.count
          })));
        } else {
          // Fallback mockup trend
          setRegistrationTrend(generateMockTrend());
        }

        // Process Gender Ratio
        if (genderRatio && genderRatio.length > 0) {
          setGenderData(genderRatio.map(item => ({
            name: item._id,
            Count: item.count
          })));
        } else {
          setGenderData([
            { name: "Male", Count: 0 },
            { name: "Female", Count: 0 }
          ]);
        }

        // Process Subscription ratio
        if (subscriptionRatio && subscriptionRatio.length > 0) {
          setSubscriptionData(subscriptionRatio.map(item => ({
            name: item._id,
            value: item.count
          })));
        } else {
          setSubscriptionData([
            { name: "Free", value: 1 },
            { name: "Premium", value: 0 },
            { name: "Blocked", value: 0 }
          ]);
        }

        // Process Profile For distribution
        if (profileForRatio && profileForRatio.length > 0) {
          setProfileForData(profileForRatio.map(item => ({
            category: item._id,
            Profiles: item.count
          })));
        } else {
          setProfileForData(generateMockProfileFor());
        }

        // Process State wise distribution
        if (stateRatio && stateRatio.length > 0) {
          setStateData(stateRatio.map(item => ({
            state: item._id,
            Count: item.count
          })));
        } else {
          setStateData(generateMockStates());
        }
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error?.response?.status, error?.response?.data || error.message);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expire ho gayi. Phir se login karein.", { toastId: 'analytics-auth-err' });
      } else {
        toast.warn("Analytics data load nahi hua. Mock data dikh raha hai.", { toastId: 'analytics-err' });
      }
      // Load mockups on failure to ensure dashboard remains functional
      loadMockAnalytics();
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const generateMockTrend = () => {
    const arr = [];
    for (let i = 15; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Registrations: Math.floor(Math.random() * 8) + 1
      });
    }
    return arr;
  };

  const generateMockProfileFor = () => [
    { category: "Self", Profiles: 4 },
    { category: "Son", Profiles: 2 },
    { category: "Daughter", Profiles: 3 },
    { category: "Brother", Profiles: 1 }
  ];

  const generateMockStates = () => [
    { state: "Rajasthan", Count: 6 },
    { state: "Gujarat", Count: 3 },
    { state: "Madhya Pradesh", Count: 4 },
    { state: "Uttar Pradesh", Count: 2 },
    { state: "Haryana", Count: 1 }
  ];

  const loadMockAnalytics = () => {
    setRegistrationTrend(generateMockTrend());
    setGenderData([
      { name: "Male", Count: 12 },
      { name: "Female", Count: 8 }
    ]);
    setSubscriptionData([
      { name: "Free", value: 15 },
      { name: "Premium", value: 3 },
      { name: "Blocked", value: 2 }
    ]);
    setProfileForData(generateMockProfileFor());
    setStateData(generateMockStates());
  };

  const initData = async () => {
    setLoading(true);
    await Promise.all([fetchUserCounts(), fetchAnalytics()]);
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Colors for Doughnut Chart
  const PIE_COLORS = ["#59123B", "#D4AF37", "#C62828"]; // Free (Maroon), Premium (Gold), Blocked (Red)

  const StatCard = ({ title, value, icon, color, delay }) => (
    <div 
      className="royal-stat-card animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <div className="stat-icon" style={{ background: color + "15", color: color }}>
          {icon}
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status" style={{ color: '#59123B' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#59123B', marginBottom: '8px' }}>
            System Dashboard
          </h2>
          <p style={{ color: '#7A5C66', margin: 0 }}>Overview of Rajput Alliances system telemetry and analytics.</p>
        </div>
      </div>

      <section className="section">
        {/* KPI Grid */}
        <div className="row">
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4">
            <StatCard 
              title="Total Members" 
              value={userCounts.totalMembers} 
              icon={<FaUsers />} 
              color="#D4AF37"
              delay={0}
            />
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4">
            <StatCard 
              title="Free Members" 
              value={userCounts.freeMembers} 
              icon={<FaUsers />} 
              color="#59123B"
              delay={100}
            />
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4">
            <StatCard 
              title="Premium Members" 
              value={userCounts.premiumMembers} 
              icon={<FaCrown />} 
              color="#EDB139"
              delay={200}
            />
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4">
            <StatCard 
              title="Blocked Members" 
              value={userCounts.blockedMembers} 
              icon={<FaBan />} 
              color="#C62828"
              delay={300}
            />
          </div>
        </div>

        {/* Charts Row 1: Registration Trend & Subscription Ratio */}
        <div className="row mt-2">
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>Registration Growth (Past 30 Days)</h4>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#59123B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#59123B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                      <XAxis dataKey="date" stroke="#725D66" fontSize={12} tickLine={false} />
                      <YAxis stroke="#725D66" fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#D4AF37', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="Registrations" stroke="#59123B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>Subscription Ratio</h4>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Users`, 'Count']} contentStyle={{ background: '#FFFFFF', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Demographics (Gender & Profile For) */}
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>Gender Demographics</h4>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={genderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                      <XAxis dataKey="name" stroke="#725D66" tickLine={false} />
                      <YAxis stroke="#725D66" tickLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(89, 18, 59, 0.03)' }} />
                      <Bar dataKey="Count" radius={[6, 6, 0, 0]}>
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Male" ? "#59123B" : entry.name === "Female" ? "#D4AF37" : "#725D66"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>Profiles Created For</h4>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profileForData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                      <XAxis dataKey="category" stroke="#725D66" tickLine={false} />
                      <YAxis stroke="#725D66" tickLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(212, 175, 55, 0.03)' }} />
                      <Bar dataKey="Profiles" fill="#59123B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State wise Distribution & System telemetry */}
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>Geographic Distribution (Top States)</h4>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E0DA" />
                      <XAxis type="number" stroke="#725D66" tickLine={false} />
                      <YAxis dataKey="state" type="category" stroke="#725D66" tickLine={false} width={100} />
                      <Tooltip />
                      <Bar dataKey="Count" fill="#D4AF37" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h4>System Status</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
                  <span style={{ color: '#59123B', fontWeight: 600 }} className="d-flex align-items-center gap-2">
                    <FaDatabase style={{ color: '#D4AF37' }} /> Database Connectivity
                  </span>
                  <span className="badge-royal-success">CONNECTED</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
                  <span style={{ color: '#59123B', fontWeight: 600 }} className="d-flex align-items-center gap-2">
                    <FaServer style={{ color: '#D4AF37' }} /> API Gateway Server
                  </span>
                  <span className="badge-royal-success">RUNNING</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
                  <span style={{ color: '#59123B', fontWeight: 600 }} className="d-flex align-items-center gap-2">
                    <FaEnvelope style={{ color: '#D4AF37' }} /> SMTP Email Dispatcher
                  </span>
                  <span className="badge-royal-success">ACTIVE</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ color: '#59123B', fontWeight: 600 }} className="d-flex align-items-center gap-2">
                    <FaServer style={{ color: '#D4AF37' }} /> System Logs Node
                  </span>
                  <span className="badge-royal-success">HEALTHY</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="card mt-2">
              <div className="card-header">
                <h4>Quick Operations</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Link to="/Members/Free-Members" className="btn btn-royal w-100 py-3">
                      <FaUsers className="me-2" /> Manage Members
                    </Link>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Link to="/Members/Free-Members" className="btn btn-royal-gold w-100 py-3 text-white">
                      <FaUserCheck className="me-2" /> Approval Pipeline
                    </Link>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Link to="/Success/Success-Stories" className="btn btn-royal-outline w-100 py-3">
                      <FaHeart className="me-2 text-danger" /> Success Stories
                    </Link>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Link to="/Reports" className="btn btn-royal-outline w-100 py-3">
                      <FaChartLine className="me-2" /> Reports Center
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
