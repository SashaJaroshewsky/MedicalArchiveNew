import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import PrescriptionsAPI from '../../api/prescriptions.api';
import { Prescription, PrescriptionUpdateRequest } from '../../models/prescription.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import PrescriptionForm from '../../components/forms/PrescriptionForm';
import { getFileUrl, getFileExtension } from '../../utils/file-utils';

const PrescriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPrescription();
  }, [id]);

  const loadPrescription = async () => {
    try {
      setLoading(true);
      const data = await PrescriptionsAPI.getPrescriptionById(Number(id));
      setPrescription(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: PrescriptionUpdateRequest) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await PrescriptionsAPI.updatePrescription(Number(id), data);
      await loadPrescription();
      setShowEditModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при оновленні запису');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей рецепт?')) {
      return;
    }

    try {
      await PrescriptionsAPI.deletePrescription(Number(id));
      navigate('/prescriptions', { 
        state: { message: 'Рецепт успішно видалено' }
      });
    } catch (err) {
      setError('Помилка видалення рецепту. Спробуйте пізніше.');
    }
  };

  const renderDocument = (documentPath: string) => {
    if (!documentPath) return null;
    
    const fileExtension = getFileExtension(documentPath);
    const fileUrl = getFileUrl(documentPath);
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <div className="text-center">
          <img
            src={fileUrl}
            alt="Документ рецепту"
            className="img-fluid rounded"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        </div>
      );
    }
    
    if (fileExtension === 'pdf') {
      return (
        <div className="ratio ratio-16x9">
          <embed
            src={fileUrl}
            type="application/pdf"
            className="w-100 h-100 rounded"
          />
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <Button 
          variant="link" 
          onClick={() => window.open(fileUrl, '_blank')}
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

  if (!prescription) {
    return (
      <Layout>
        <Container fluid className="py-4">
          <Alert variant="danger">
            Рецепт не знайдено
          </Alert>
          <Link to="/prescriptions" className="btn btn-primary">
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
                    <h1 className="h3 mb-0">{prescription.medicationName}</h1>
                    <p className="text-muted mb-0">
                      Дата видачі: {format(new Date(prescription.issueDate), 'dd.MM.yyyy')}
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
                        <h5 className="card-title mb-3">Інформація про рецепт</h5>
                        <dl className="mb-0">
                          <dt>Назва ліків</dt>
                          <dd className="mb-3">{prescription.medicationName}</dd>
                          
                          <dt>Дозування</dt>
                          <dd className="mb-3">{prescription.dosage}</dd>
                          
                          <dt>Інструкції по застосуванню</dt>
                          <dd className="mb-3">{prescription.instructions}</dd>
                        </dl>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="card-title mb-3">Документи</h5>
                        {prescription.documentFilePath ? (
                          <>
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg="success" className="me-2">Є документ</Badge>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  if (prescription.documentFilePath) {
                                    window.open(getFileUrl(prescription.documentFilePath), '_blank');
                                  }
                                }}
                                className="p-0"
                              >
                                Відкрити в новій вкладці
                              </Button>
                            </div>
                            <div className="document-preview">
                              {renderDocument(prescription.documentFilePath)}
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
                    to="/prescriptions" 
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
        title="Редагування рецепту"
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
        <PrescriptionForm
          initialData={prescription}
          onSubmit={handleUpdate}
          error={formError}
        />
      </Modal>
    </Layout>
  );
};

export default PrescriptionDetailPage;