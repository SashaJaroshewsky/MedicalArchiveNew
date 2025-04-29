import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/common/PrivateRoute';

// Auth Pages
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

// Main Pages
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';

// Doctor Appointments
import AppointmentsPage from '../pages/DoctorAppointments/AppointmentsPage';
import AppointmentDetailPage from '../pages/DoctorAppointments/AppointmentDetailPage';
// import AppointmentFormPage from '../pages/DoctorAppointments/AppointmentFormPage';

// // Doctor Access
// import DoctorAccessPage from '../pages/DoctorAccess/DoctorAccessPage';

// // Doctor Routes
// import PatientsPage from '../pages/Doctor/PatientsPage';
// import PatientDetailPage from '../pages/Doctor/PatientDetailPage';

import PrescriptionsPage from '../pages/Prescriptions/PrescriptionsPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
      />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />

      <Route 
        path="/doctor-appointments" 
        element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/doctor-appointments/:id" 
        element={
          <PrivateRoute>
            <AppointmentDetailPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/prescriptions" 
        element={
          <PrivateRoute>
            <PrescriptionsPage />
          </PrivateRoute>
        } 
      />

      {/* Default Routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;