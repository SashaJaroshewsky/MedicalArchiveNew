import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Alert } from 'react-bootstrap';
import Layout from '../../components/common/Layout';
import PrescriptionsAPI from '../../api/prescriptions.api';
import { Prescription, PrescriptionCreateRequest } from '../../models/prescription.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import PrescriptionForm from '../../components/forms/PrescriptionForm';
import { useAuth } from '../../context/AuthContext';

const PrescriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await PrescriptionsAPI.getAllPrescriptions();
      setPrescriptions(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      await loadPrescriptions();
      return;
    }

    try {
      setLoading(true);
      const data = await PrescriptionsAPI.searchPrescriptions(searchTerm);
      setPrescriptions(data);
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
      const data = await PrescriptionsAPI.getPrescriptionsByDateRange(startDate, endDate);
      setPrescriptions(data);
      setError(null);
    } catch (err) {
      setError('Помилка фільтрації за датою. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: PrescriptionCreateRequest) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await PrescriptionsAPI.createPrescription(data);
      await loadPrescriptions();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при створенні рецепту');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей рецепт?')) {
      return;
    }

    try {
      await PrescriptionsAPI.deletePrescription(id);
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    } catch (err) {
      setError('Помилка видалення рецепту. Спробуйте пізніше.');
    }
  };

  const handleDownload = (prescription: Prescription) => {
    if (!prescription.documentFilePath) return;
    
    // Створюємо URL для завантаження файлу
    const fileUrl = `${process.env.REACT_APP_API_URL || 'https://localhost:7066'}/api/Files/${prescription.documentFilePath}`;
    
    // Відкриваємо файл у новій вкладці
    window.open(fileUrl, '_blank');
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-0">Рецепти</h1>
              <Button 
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Додати рецепт
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
                          placeholder="Пошук за назвою ліків"
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
                ) : prescriptions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-medical text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3 mb-2">Рецептів ще немає</h4>
                    <p className="text-muted mb-4">
                      Додайте свій перший рецепт
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Додати перший рецепт
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Назва ліків</th>
                          <th>Дозування</th>
                          <th>Документ</th>
                          <th>Дії</th>
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
                                  onClick={() => handleDownload(prescription)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  Переглянути
                                </Badge>
                              ) : (
                                <Badge bg="secondary">Немає</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(prescription.id)}
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

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setFormError(null);
        }}
        title="Новий рецепт"
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
        <PrescriptionForm
          onSubmit={handleCreate}
          error={formError}
        />
      </Modal>
    </Layout>
  );
};

export default PrescriptionsPage;