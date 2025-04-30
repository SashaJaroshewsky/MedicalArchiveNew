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

// Doctor Access
import DoctorAccessPage from '../pages/DoctorAccess/DoctorAccessPage';

// // Doctor Routes
// import PatientsPage from '../pages/Doctor/PatientsPage';
// import PatientDetailPage from '../pages/Doctor/PatientDetailPage';

import PrescriptionsPage from '../pages/Prescriptions/PrescriptionsPage';
import PrescriptionDetailPage from '../pages/Prescriptions/PrescriptionDetailPage';
import ReferralsPage from '../pages/Referrals/ReferralsPage';
import ReferralDetailPage from '../pages/Referrals/ReferralDetailPage';
import VaccinationsPage from '../pages/Vaccinations/VaccinationsPage';
import VaccinationDetailPage from '../pages/Vaccinations/VaccinationDetailPage';
import MedicalCertificatesPage from '../pages/MedicalCertificates/MedicalCertificatesPage';
import MedicalCertificateDetailPage from '../pages/MedicalCertificates/MedicalCertificateDetailPage';
import PatientsPage from '../pages/Doctor/PatientsPage';
import PatientArchivePage from '../pages/Doctor/PatientArchivePage';

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
      <Route 
        path="/prescriptions/:id" 
        element={
          <PrivateRoute>
            <PrescriptionDetailPage />
          </PrivateRoute>
        } 
      />

      {/* Referrals Routes */}
      <Route 
        path="/referrals" 
        element={
          <PrivateRoute>
            <ReferralsPage />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/referrals/:id" 
        element={
          <PrivateRoute>
            <ReferralDetailPage />
          </PrivateRoute>
        } 
      />

      {/* Vaccinations Routes */}
      <Route 
        path="/vaccinations" 
        element={
          <PrivateRoute>
            <VaccinationsPage />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/vaccinations/:id" 
        element={
          <PrivateRoute>
            <VaccinationDetailPage />
          </PrivateRoute>
        } 
      />

      {/* Medical Certificates Routes */}
      <Route 
        path="/medical-certificates" 
        element={
          <PrivateRoute>
            <MedicalCertificatesPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/medical-certificates/:id" 
        element={
          <PrivateRoute>
            <MedicalCertificateDetailPage />
          </PrivateRoute>
        } 
      />

      {/* Doctor Access Route */}
      <Route 
        path="/doctor-access" 
        element={
          <PrivateRoute>
            <DoctorAccessPage />
          </PrivateRoute>
        } 
      />

      {/* Patients Route */}
      <Route 
        path="/patients" 
        element={
          <PrivateRoute>
            <PatientsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/patients/:patientId" 
        element={
          <PrivateRoute>
            <PatientArchivePage />
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