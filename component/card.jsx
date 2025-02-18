import React from 'react';

// Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ children, className }) => {
  return (
    <div className={`border-b p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardTitle Component
export const CardTitle = ({ children, className }) => {
  return (
    <h3 className={`text-lg font-bold ${className}`}>
      {children}
    </h3>
  );
};