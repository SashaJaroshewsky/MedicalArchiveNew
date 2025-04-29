import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import DoctorAppointmentsAPI from '../../api/doctor-appointments.api';
import { DoctorAppointment, DoctorAppointmentUpdateRequest } from '../../models/doctor-appointment.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<DoctorAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await DoctorAppointmentsAPI.getAppointmentById(Number(id));
      setAppointment(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: DoctorAppointmentUpdateRequest) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await DoctorAppointmentsAPI.updateAppointment(Number(id), data);
      await loadAppointment();
      setShowEditModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при оновленні запису');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
      return;
    }

    try {
      await DoctorAppointmentsAPI.deleteAppointment(Number(id));
      navigate('/doctor-appointments', { 
        state: { message: 'Запис успішно видалено' }
      });
    } catch (err) {
      setError('Помилка видалення запису. Спробуйте пізніше.');
    }
  };

  const renderDocument = (documentPath: string) => {
    const fileExtension = documentPath.split('.').pop()?.toLowerCase();
    
    // Якщо це PDF
    if (fileExtension === 'pdf') {
      return (
        <div className="ratio ratio-16x9">
          <embed
            src={`${process.env.REACT_APP_API_URL}${documentPath}`}
            type="application/pdf"
            className="w-100 h-100 rounded"
          />
        </div>
      );
    } 
    // Якщо це зображення
    else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      return (
        <div className="text-center">
          <img
            src={`${process.env.REACT_APP_API_URL}${documentPath}`}
            alt="Документ прийому"
            className="img-fluid rounded"
            style={{ maxHeight: '500px' }}
          />
        </div>
      );
    }
    
    // Для інших типів файлів
    return (
      <div className="text-center">
        <Button 
          variant="link" 
          href={`${process.env.REACT_APP_API_URL}${documentPath}`}
          target="_blank"
        >
          Відкрити документ в новій вкладці
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <Container fluid className="py-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </div>
          </div>
        </Container>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <Container fluid className="py-4">
          <Alert variant="danger">
            Запис не знайдено
          </Alert>
          <Link to="/doctor-appointments" className="btn btn-primary">
            Повернутися до списку
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h1 className="h3 mb-0">{appointment.title}</h1>
                    <p className="text-muted mb-0">
                      Дата прийому: {format(new Date(appointment.appointmentDate), 'dd.MM.yyyy')}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Редагувати
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Видалити
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Row className="g-4">
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="card-title mb-3">Інформація про прийом</h5>
                        <dl className="mb-0">
                          <dt>Лікар</dt>
                          <dd className="mb-3">{appointment.doctorName}</dd>
                          
                          <dt>Скарги</dt>
                          <dd className="mb-3">{appointment.complaints}</dd>
                          
                          <dt>Діагноз</dt>
                          <dd className="mb-3">{appointment.diagnosis}</dd>
                          
                          <dt>Опис процедури</dt>
                          <dd>{appointment.procedureDescription}</dd>
                        </dl>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="card-title mb-3">Документи</h5>
                        {appointment.documentFilePath ? (
                          <>
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg="success" className="me-2">Є документ</Badge>
                              <Button 
                                variant="link" 
                                href={`${process.env.REACT_APP_API_URL}${appointment.documentFilePath}`}
                                target="_blank"
                                className="p-0"
                              >
                                Відкрити в новій вкладці
                              </Button>
                            </div>
                            <div className="document-preview">
                              {renderDocument(appointment.documentFilePath)}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <Badge bg="secondary">Документи відсутні</Badge>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Link 
                    to="/doctor-appointments" 
                    className="btn btn-outline-secondary"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Повернутися до списку
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setFormError(null);
        }}
        title="Редагування прийому"
        size="lg"
        submitButton={{
          text: "Зберегти зміни",
          loading: isSubmitting,
          onClick: () => {
            const form = document.querySelector('form');
            if (form) form.requestSubmit();
          }
        }}
      >
        <AppointmentForm
          initialData={appointment}
          onSubmit={handleUpdate}
          error={formError}
        />
      </Modal>
    </Layout>
  );
};

export default AppointmentDetailPage;