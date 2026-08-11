import React from "react";
import { Link } from "react-router-dom";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { FaFileSignature, FaUserShield, FaExclamationTriangle, FaGavel, FaEnvelope, FaStar } from "react-icons/fa";

export default function TermsOfUse() {
  return (
    <>
      <Profilenavbar />
      <div 
        className="pb-bottom-nav pt-5" 
        style={{ 
          backgroundColor: "var(--royal-cream)", 
          minHeight: "100vh",
          fontFamily: "var(--font-body)"
        }}
      >
        <div className="container py-5">
          {/* Header Banner */}
          <div className="text-center mb-5">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid var(--royal-gold)",
                background: "linear-gradient(135deg, var(--royal-maroon-dark), var(--royal-maroon))",
                boxShadow: "0 8px 24px rgba(128, 0, 0, 0.15)"
              }}
            >
              <FaFileSignature size={36} color="var(--royal-gold)" />
            </div>
            <h1 
              className="section-title-gold fw-bold mb-3" 
              style={{ 
                fontFamily: "var(--font-heading)", 
                color: "var(--royal-maroon)",
                fontSize: "2.8rem"
              }}
            >
              Terms of Use
            </h1>
            <p 
              className="mx-auto" 
              style={{ 
                maxWidth: "750px", 
                color: "var(--royal-text-light)",
                fontSize: "1.1rem",
                lineHeight: "1.8"
              }}
            >
              Please read the following User Agreement. When you sign up for any service within Rajput Alliances.com, 
              all of which are hereinafter referred to collectively as the "Website", you agree to all of the terms and conditions of this Agreement.
            </p>
          </div>

          {/* Main Content Layout */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-10">
              <div 
                className="glass-panel p-4 p-md-5 rounded-4 shadow-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(212, 175, 55, 0.3)"
                }}
              >
                {/* 1. Introduction & User Agreement */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    1. User Agreement
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    This Agreement constitutes your agreement with Rajput Alliances.com with respect to your use of the Website. 
                    You must agree to abide by all of the terms and conditions contained in this Agreement in order to become or remain 
                    an authorized user of the Website. As used in this Agreement, "we" and "us" means Rajput Alliances.com, 
                    or any successor or assignee of Rajput Alliances.com.
                  </p>
                  
                  <div className="mt-4 p-3 rounded-3" style={{ borderLeft: "4px solid var(--royal-gold)", background: "rgba(252, 245, 234, 0.5)" }}>
                    <h6 className="fw-bold mb-1" style={{ color: "var(--royal-maroon)" }}>Important Notice:</h6>
                    <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>
                      IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, YOU MAY NOT USE THE WEBSITE, AND SHOULD NOT PROCEED TO REGISTER. 
                      BY USING THE WEBSITE YOU ARE AGREEING TO BE BOUND BY THIS USER AGREEMENT, INCLUDING ALL AMENDMENTS MADE TO DATE.
                    </p>
                  </div>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 2. Right to Use / Adult Requirement */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    2. Age & Right to Use
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    You represent, warrant and covenant that you are at least 18 years old. This Website is addressed to adults only. 
                    By using the Website you agree that you are 18 years of age and older. Failure to comply with this Agreement may result in legal actions.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 3. Code of Conduct */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    3. Code of Conduct
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    You agree to use the Website in accordance with the following Code of Conduct:
                  </p>
                  
                  <div className="d-flex flex-column gap-3">
                    {[
                      "You are solely responsible for any information that you display when using the Website or to other members. You will keep all information provided to you through the Website as private and confidential and will not give such information to anyone without the permission of the person who provided it to you.",
                      "You will not use the Website to engage in any form of harassment or offensive behavior, including but not limited to the posting of communications, pictures or recordings, which contain libelous, slanderous, abusive or defamatory statements, or racist, pornographic, obscene, or offensive language.",
                      "You will not forward chain letters through the Website.",
                      "You will not use the Website to infringe the privacy rights, property rights, or other civil rights of any person.",
                      "You will not post messages, pictures or recordings or use the Website in any way which violates, plagiarizes or infringes upon the rights of any third party, including but not limited to any copyright or trademark law, privacy or other personal or proprietary rights, or is fraudulent or otherwise unlawful or violates any law. Your use of the Website is for your own personal use. You may not authorize others to use the Website and you may not transfer your accounts with other users.",
                      "You will not use the Website to distribute, promote or otherwise publish any material containing any solicitation for funds, advertising or solicitation for goods or websites."
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-3 bg-light border border-light d-flex gap-3">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "var(--royal-maroon)",
                            color: "var(--royal-gold)",
                            border: "1.5px solid var(--royal-gold)",
                            flexShrink: 0
                          }}
                        >
                          <FaStar size={14} color="var(--royal-gold)" />
                        </div>
                        <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 4. Privacy and Use of Information */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    4. Privacy and Use of Information
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    You acknowledge and agree that:
                  </p>
                  
                  <ul className="list-unstyled d-flex flex-column gap-3 ps-2">
                    {[
                      "We cannot ensure the security or privacy of information you provide through the Internet and your email messages, and you release us from any and all liability in connection with the use of such information by other parties.",
                      "We are not responsible for, and cannot control, the use by others of any information which you provide to them and you should use caution in selecting the personal information you provide to others through the Website.",
                      "We cannot assume any responsibility for the content of messages sent by other users of the Website, and you release us from any and all liability in connection with the contents of any communications you may receive from other users.",
                      "You acknowledge that you cannot sue Rajput Alliances.com or any of its employees for any damages done to you through the site. We cannot guarantee, and assume no responsibility for verifying, the accuracy of the information provided by other users of the Website. You may not use the Website for any unlawful purpose."
                    ].map((item, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-3 mb-2">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1"
                          style={{
                            width: "22px",
                            height: "22px",
                            backgroundColor: "rgba(128, 0, 0, 0.08)",
                            border: "1px solid #D4AF37",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                          }}
                        >
                          <FaStar size={10} color="#D4AF37" />
                        </div>
                        <span style={{ color: "var(--royal-text)", lineHeight: "1.75", fontSize: "0.98rem" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 5. Monitoring & Removal of Information */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    5. Monitoring and Removal of Information
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We reserve the right to monitor all advertisements, public postings and messages to ensure that they conform to the content guidelines, 
                    which may be applicable from time to time. We also reserve the right to monitor all messages and chats that take place through the site.
                  </p>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    While we do not and cannot review every message or other material posted or sent by users of the Website, and are not responsible for 
                    any content of these messages or materials, we reserve the right, but are not obligated, to delete, move, or edit messages or materials, 
                    that we, in our sole discretion, deem to violate the Code of Conduct set out above or any applicable content guidelines, or to be otherwise 
                    unacceptable. You shall remain solely responsible for the content of advertisements, public postings, messages and other materials you 
                    may upload to the Website or users of the Website.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 6. Termination & Cancellation */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    6. Termination of Access and Online Cancellation
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We may, in our sole discretion, terminate or suspend your access to all or part of the Website at any time, with or without notice, 
                    for any reason, including, without limitation, breach of this Agreement. Any fraudulent, abusive, or otherwise illegal activity 
                    may be grounds for termination of your access to all or part of the Website at our sole discretion, and you may be referred to 
                    appropriate law enforcement agencies.
                  </p>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    Any request for cancellation will be met with written support as fast as possible. 
                    You accept that when you cancel your membership with The Website you are automatically locked out of the site and your access is 
                    immediately terminated. You also agree and accept the complete and final loss of your profile, mail, and any other membership information 
                    that you should have. This information cannot be reclaimed or transferred to any third party.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 7. Proprietary Information & No Responsibility */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    7. Proprietary Information & Limitation of Liability
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    The Website contains information, which is proprietary to us and to our users. We assert full copyright protection in the website. 
                    You agree not to modify, copy or distribute any such information in any manner whatsoever without having first received the express 
                    permission of the owner of such information.
                  </p>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We are not responsible for any incidental, consequential, special, punitive, exemplary, direct or indirect damages of any kind 
                    whatsoever, which may arise out of or relate to your use of the Website, including but not limited to lost revenues, profits, business or data, 
                    or damages resulting from any viruses, worms, "Trojan horses" or other destructive software or materials, or communications by you or other 
                    users of the Website, or any interruption or suspension of the Website, regardless of the cause of the interruption or suspension.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 8. Warranties & Indemnity */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    8. Indemnity & No Warranties
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    You agree to indemnify us, our officers, directors, employees and agents, from any loss or damages, including without limitation 
                    reasonable legal fees, which we may suffer from your activities on or use of the Website, including without limitation any breach 
                    by you of this Agreement.
                  </p>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    The Website is distributed on an "as is" basis. We do not warrant that this Website will be uninterrupted or error-free. 
                    There may be delays, omissions, and interruptions in the availability of the Website. Where permitted by law, you acknowledge 
                    that the Website is provided without any warranties of any kind whatsoever, either express or implied. You acknowledge that use 
                    of the Website is at your own risk.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 9. Dispute Jurisdiction */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    9. Governing Law and Jurisdiction
                  </h3>
                  <p style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    If there is any dispute about or involving the Site and/or the Service, by using the Site, you unconditionally agree that 
                    all such disputes and/or differences will be governed by the laws of India and shall be subject to the exclusive jurisdiction 
                    of the Competent Courts in Udaipur, India only.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* Contact Card for Complaints */}
                <div 
                  className="p-4 text-center rounded-4"
                  style={{
                    background: "linear-gradient(135deg, var(--royal-maroon-dark) 0%, var(--royal-maroon) 100%)",
                    border: "2px solid var(--royal-gold)",
                    color: "var(--royal-cream)",
                    boxShadow: "0 10px 25px rgba(128,0,0,0.15)"
                  }}
                >
                  <div className="d-inline-block p-2 mb-3 bg-white bg-opacity-10 rounded-circle">
                    <FaEnvelope size={24} color="var(--royal-gold)" />
                  </div>
                  <h4 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold-light)" }}>Complaints & Support</h4>
                  <p className="mb-3 small" style={{ color: "rgba(255,255,255,0.85)" }}>
                    To resolve or report a complaint regarding the Website or members who use the Website, please write to our support email:
                  </p>
                  <h5 className="fw-bold mb-0">
                    <a href="mailto:info.rajputalliances@gmail.com" style={{ color: "var(--royal-gold-light)", textDecoration: "none" }}>
                      info.rajputalliances@gmail.com
                    </a>
                  </h5>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
