import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          backgroundColor: 'black',
          padding: '1rem',
          color: 'white',
          borderRadius: '10px',
          display: 'inline-block'
        }}
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;