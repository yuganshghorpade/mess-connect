import Link from 'next/link';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Mess Owner Dashboard</h1>
      <nav>
        <ul style={navStyle}>
          <li><Link href="/mess-owner" style={linkStyle}>Profile</Link></li>
          <li><Link href="/mess-owner/thali" style={linkStyle}>ADD Thalis</Link></li>
          <li><Link href="/mess-owner/daily-menu" style={linkStyle}>Update Daily Menu</Link></li>
        </ul>
      </nav>
    </header>
  );
};

// Light green color theme with modern improvements
const headerStyle = {
  background: '#e0f2e9', // Light green background
  padding: '20px',
  color: '#2e7d32', // Darker green for text
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  borderRadius: '8px',
  fontFamily: "'Roboto', sans-serif", // Modern font
};

const titleStyle = {
  fontWeight: 'bold', // Bold font for title
  fontSize: '2rem',   // Large font size for title
  margin: '0',        // Remove extra margin
};

const navStyle = {
  listStyle: 'none',
  display: 'flex',
  justifyContent: 'space-around',
  padding: 0,
  margin: '20px 0 0 0'
};

const linkStyle = {
  color: '#2e7d32', // Dark green for links
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  fontWeight: 'bold',  // Bold font for links
  fontSize: '1.1rem',  // Slightly larger font for better readability
  transition: 'background 0.3s ease',
};

// Hover effect for links
const hoverStyle = {
  ':hover': {
    background: '#c8e6c9' // Lighter green on hover
  }
};

export default Header;
