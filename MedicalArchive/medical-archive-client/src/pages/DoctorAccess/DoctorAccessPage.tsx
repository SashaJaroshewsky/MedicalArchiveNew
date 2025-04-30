import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import Layout from '../../components/common/Layout';
import DoctorAccessAPI from '../../api/doctor-access.api';
import { User } from '../../models/user.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

const DoctorAccessPage: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await DoctorAccessAPI.getDoctorsWithAccess();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setFormError(null);
      await DoctorAccessAPI.grantAccess({ doctorEmail });
      await loadDoctors();
      setShowModal(false);
      setDoctorEmail('');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при наданні доступу');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeAccess = async (doctorId: number) => {
    if (!window.confirm('Ви впевнені, що хочете відкликати доступ цього лікаря?')) {
      return;
    }

    try {
      await DoctorAccessAPI.revokeAccess(doctorId);
      await loadDoctors();
    } catch (err) {
      setError('Помилка відкликання доступу. Спробуйте пізніше.');
    }
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-0">Доступ лікарів</h1>
              <Button 
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Надати доступ
              </Button>
            </div>

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
                ) : doctors.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-shield-lock text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3 mb-2">Немає лікарів з доступом</h4>
                    <p className="text-muted mb-4">
                      Надайте доступ лікарю для перегляду ваших медичних даних
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Надати доступ
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Лікар</th>
                          <th>Email</th>
                          <th>Дата надання</th>
                          <th>Дії</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map((doctor) => (
                          <tr key={doctor.id}>
                            <td>{`${doctor.lastName} ${doctor.firstName}`}</td>
                            <td>{doctor.email}</td>
                           
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRevokeAccess(doctor.id)}
                              >
                                <i className="bi bi-shield-x me-1"></i>
                                Відкликати доступ
                              </Button>
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

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setDoctorEmail('');
          setFormError(null);
        }}
        title="Надати доступ лікарю"
        size="lg"
        submitButton={{
          text: "Надати доступ",
          loading: isSubmitting,
          onClick: () => {
            const form = document.querySelector('form');
            if (form) form.requestSubmit();
          }
        }}
      >
        <Form onSubmit={handleGrantAccess}>
          {formError && <Alert variant="danger" className="mb-3">{formError}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Email лікаря</Form.Label>
            <Form.Control
              type="email"
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              required
              placeholder="Введіть email лікаря"
            />
            <Form.Text className="text-muted">
              Введіть email лікаря, якому ви хочете надати доступ до ваших медичних даних
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal>
    </Layout>
  );
};

export default DoctorAccessPage;