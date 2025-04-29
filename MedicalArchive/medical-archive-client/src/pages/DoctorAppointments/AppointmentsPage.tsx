import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import DoctorAppointmentsAPI from '../../api/doctor-appointments.api';
import { DoctorAppointment, DoctorAppointmentCreateRequest, DoctorAppointmentUpdateRequest } from '../../models/doctor-appointment.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await DoctorAppointmentsAPI.getAllAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      await loadAppointments();
      return;
    }

    try {
      setLoading(true);
      const data = await DoctorAppointmentsAPI.searchAppointments(searchTerm);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Помилка пошуку. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async () => {
    if (!startDate || !endDate) {
      setError('Виберіть обидві дати');
      return;
    }

    try {
      setLoading(true);
      const data = await DoctorAppointmentsAPI.getAppointmentsByDateRange(startDate, endDate);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Помилка фільтрації за датою. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
      return;
    }

    try {
      await DoctorAppointmentsAPI.deleteAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));
      setError(null);
    } catch (err) {
      setError('Помилка видалення запису. Спробуйте пізніше.');
    }
  };

  const handleCreateAppointment = async (data: DoctorAppointmentCreateRequest) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await DoctorAppointmentsAPI.createAppointment(data);
      await loadAppointments();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при створенні запису');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: DoctorAppointmentUpdateRequest) => {
    if (!selectedAppointment) return;
    
    try {
      setIsSubmitting(true);
      setFormError(null);
      await DoctorAppointmentsAPI.updateAppointment(selectedAppointment.id, data);
      await loadAppointments();
      setShowEditModal(false);
      setSelectedAppointment(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при оновленні запису');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-0">Прийоми у лікаря</h1>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Додати запис
              </Button>
            </div>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Пошук</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="text"
                          placeholder="Пошук за назвою або лікарем"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-primary" onClick={handleSearch}>
                          Шукати
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Фільтр за датою</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Button variant="outline-primary" onClick={handleDateFilter}>
                        Фільтрувати
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Завантаження...</span>
                    </div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-medical text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3 mb-2">Записів про прийоми ще немає</h4>
                    <p className="text-muted mb-4">
                      Додайте свій перший запис про відвідування лікаря
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Додати перший запис
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Назва</th>
                          <th>Лікар</th>
                          <th>Діагноз</th>
                          <th>Документи</th>
                          <th>Дії</th>
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
                                <Badge bg="success">Є документ</Badge>
                              ) : (
                                <Badge bg="secondary">Немає</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  to={`/doctor-appointments/${appointment.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Переглянути
                                </Link>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowEditModal(true);
                                  }}
                                >
                                  <i className="bi bi-pencil me-1"></i>
                                  Редагувати
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(appointment.id)}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Видалити
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <>
        {/* Existing create modal */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setFormError(null);
          }}
          title="Новий прийом"
          size="lg"
          submitButton={{
            text: "Зберегти",
            loading: isSubmitting,
            onClick: () => {
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }
          }}
        >
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            error={formError}
          />
        </Modal>

        {/* Edit modal */}
        <Modal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
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
            initialData={selectedAppointment || undefined}
            onSubmit={handleEdit}
            error={formError}
          />
        </Modal>
      </>
    </Layout>
  );
};

export default AppointmentsPage;