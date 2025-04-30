import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Alert, Badge, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import DoctorAppointmentsAPI from '../../api/doctor-appointments.api';
import PrescriptionsAPI from '../../api/prescriptions.api';
import ReferralsAPI from '../../api/referrals.api';
import VaccinationsAPI from '../../api/vaccinations.api';
import MedicalCertificatesAPI from '../../api/medical-certificates.api';
import { DoctorAppointment } from '../../models/doctor-appointment.model';
import { Prescription } from '../../models/prescription.model';
import { Referral } from '../../models/referral.model';
import { Vaccination } from '../../models/vaccination.model';
import { MedicalCertificate } from '../../models/medical-certificate.model';
import { format } from 'date-fns';
import { getFileUrl } from '../../utils/file-utils';

const PatientArchivePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);

  useEffect(() => {
    loadData();
  }, [patientId, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'appointments':
          const appointmentsData = await DoctorAppointmentsAPI.getPatientAppointments(Number(patientId));
          setAppointments(appointmentsData);
          break;
        case 'prescriptions':
          const prescriptionsData = await PrescriptionsAPI.getPatientPrescriptions(Number(patientId));
          setPrescriptions(prescriptionsData);
          break;
        case 'referrals':
          const referralsData = await ReferralsAPI.getPatientReferrals(Number(patientId));
          setReferrals(referralsData);
          break;
        case 'vaccinations':
          const vaccinationsData = await VaccinationsAPI.getPatientVaccinations(Number(patientId));
          setVaccinations(vaccinationsData);
          break;
        case 'certificates':
          const certificatesData = await MedicalCertificatesAPI.getPatientCertificates(Number(patientId));
          setCertificates(certificatesData);
          break;
      }
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'appointments':
        return renderAppointments();
      case 'prescriptions':
        return renderPrescriptions();
      case 'referrals':
        return renderReferrals();
      case 'vaccinations':
        return renderVaccinations();
      case 'certificates':
        return renderCertificates();
      default:
        return null;
    }
  };

  const renderAppointments = () => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Назва</th>
          <th>Лікар</th>
          <th>Діагноз</th>
          <th>Документ</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment.id}>
            <td>{format(new Date(appointment.appointmentDate), 'dd.MM.yyyy')}</td>
            <td>{appointment.title}</td>
            <td>{appointment.doctorName}</td>
            <td>{appointment.diagnosis}</td>
            <td>
              {appointment.documentFilePath ? (
                <Badge 
                  bg="success" 
                  className="cursor-pointer"
                  onClick={() => appointment.documentFilePath && window.open(getFileUrl(appointment.documentFilePath), '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  Переглянути
                </Badge>
              ) : (
                <Badge bg="secondary">Немає</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPrescriptions = () => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Назва ліків</th>
          <th>Дозування</th>
          <th>Документ</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions.map((prescription) => (
          <tr key={prescription.id}>
            <td>{format(new Date(prescription.issueDate), 'dd.MM.yyyy')}</td>
            <td>{prescription.medicationName}</td>
            <td>{prescription.dosage}</td>
            <td>
              {prescription.documentFilePath ? (
                <Badge 
                  bg="success" 
                  className="cursor-pointer"
                  onClick={() => prescription.documentFilePath && window.open(getFileUrl(prescription.documentFilePath), '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  Переглянути
                </Badge>
              ) : (
                <Badge bg="secondary">Немає</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderReferrals = () => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Назва</th>
          <th>Тип</th>
          <th>Документ</th>
        </tr>
      </thead>
      <tbody>
        {referrals.map((referral) => (
          <tr key={referral.id}>
            <td>{format(new Date(referral.issueDate), 'dd.MM.yyyy')}</td>
            <td>{referral.title}</td>
            <td>{referral.referralType}</td>
            <td>
              {referral.documentFilePath ? (
                <Badge 
                  bg="success" 
                  className="cursor-pointer"
                  onClick={() => referral.documentFilePath && window.open(getFileUrl(referral.documentFilePath), '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  Переглянути
                </Badge>
              ) : (
                <Badge bg="secondary">Немає</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderVaccinations = () => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Назва вакцини</th>
          <th>Виробник</th>
          <th>Доза</th>
          <th>Документ</th>
        </tr>
      </thead>
      <tbody>
        {vaccinations.map((vaccination) => (
          <tr key={vaccination.id}>
            <td>{format(new Date(vaccination.vaccinationDate), 'dd.MM.yyyy')}</td>
            <td>{vaccination.vaccineName}</td>
            <td>{vaccination.manufacturer}</td>
            <td>{vaccination.doseNumber}</td>
            <td>
              {vaccination.documentFilePath ? (
                <Badge 
                  bg="success" 
                  className="cursor-pointer"
                  onClick={() => vaccination.documentFilePath && window.open(getFileUrl(vaccination.documentFilePath), '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  Переглянути
                </Badge>
              ) : (
                <Badge bg="secondary">Немає</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderCertificates = () => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Назва</th>
          <th>Опис</th>
          <th>Документ</th>
        </tr>
      </thead>
      <tbody>
        {certificates.map((certificate) => (
          <tr key={certificate.id}>
            <td>{format(new Date(certificate.issueDate), 'dd.MM.yyyy')}</td>
            <td>{certificate.title}</td>
            <td>{certificate.description}</td>
            <td>
              {certificate.documentFilePath ? (
                <Badge 
                  bg="success" 
                  className="cursor-pointer"
                  onClick={() => certificate.documentFilePath && window.open(getFileUrl(certificate.documentFilePath), '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  Переглянути
                </Badge>
              ) : (
                <Badge bg="secondary">Немає</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <Link to="/patients" className="btn btn-outline-secondary mb-3">
                  <i className="bi bi-arrow-left me-2"></i>
                  Повернутися до списку
                </Link>
                <h1 className="h3 mb-0">Медичний архів пацієнта</h1>
              </div>
            </div>

            <Card className="shadow-sm">
              <Card.Header>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
                  <Nav.Item>
                    <Nav.Link eventKey="appointments">Прийоми</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="prescriptions">Рецепти</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="referrals">Направлення</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="vaccinations">Вакцинації</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="certificates">Довідки</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                {renderContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default PatientArchivePage;