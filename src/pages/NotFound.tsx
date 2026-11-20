import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound(): React.ReactElement {
  return (
    <div className="page-container py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-heading mb-4">404</h1>
      <p className="text-muted text-lg mb-8">Page not found</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}