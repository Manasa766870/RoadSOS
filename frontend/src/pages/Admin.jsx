import React from 'react';

const Admin = () => {
  return (
    <div className="page-container px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Data Dashboard (Admin)</h1>
      <div className="card text-center py-10">
        <h3 className="mb-2">Service Management</h3>
        <p className="text-muted text-sm max-w-sm mx-auto mb-4">
          This dashboard allows system administrators to add, verify, and update emergency service locations in the database.
        </p>
        <button className="btn btn-primary">Sign In as Admin</button>
      </div>
    </div>
  );
};

export default Admin;
