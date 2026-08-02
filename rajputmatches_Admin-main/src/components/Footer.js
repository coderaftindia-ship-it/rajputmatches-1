import React from 'react';

const Footer = () => (
    <footer style={{
        background: 'linear-gradient(135deg, #59123B, #3f0c2a)',
        borderTop: '3px solid #EDB139',
        padding: '20px',
        textAlign: 'center',
        color: '#EDB139',
        fontFamily: 'Playfair Display, serif'
    }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
            © 2024 Rajput Alliances. All Rights Reserved.
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
            Admin Panel - Royal Wedding Theme
        </p>
    </footer>
);

export default Footer;
