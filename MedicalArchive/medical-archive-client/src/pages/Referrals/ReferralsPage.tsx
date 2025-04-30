import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import ReferralsAPI from '../../api/referrals.api';
import { Referral, ReferralCreateRequest } from '../../models/referral.model';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import ReferralForm from '../../components/forms/ReferralForm';
import { getFileUrl } from '../../utils/file-utils';

const ReferralsPage: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const data = await ReferralsAPI.getAllReferrals();
      setReferrals(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      await loadReferrals();
      return;
    }

    try {
      setLoading(true);
      const data = await ReferralsAPI.searchReferrals(searchTerm);
      setReferrals(data);
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
      const data = await ReferralsAPI.getReferralsByDateRange(startDate, endDate);
      setReferrals(data);
      setError(null);
    } catch (err) {
      setError('Помилка фільтрації за датою. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: ReferralCreateRequest) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await ReferralsAPI.createReferral(data);
      await loadReferrals();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Помилка при створенні направлення');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це направлення?')) {
      return;
    }

    try {
      await ReferralsAPI.deleteReferral(id);
      setReferrals(referrals.filter(r => r.id !== id));
    } catch (err) {
      setError('Помилка видалення направлення. Спробуйте пізніше.');
    }
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-0">Направлення</h1>
              <Button 
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Додати направлення
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
                          placeholder="Пошук за назвою або номером"
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
                ) : referrals.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-file-earmark-medical text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3 mb-2">Направлень ще немає</h4>
                    <p className="text-muted mb-4">
                      Додайте своє перше направлення
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Додати перше направлення
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Дата видачі</th>
                          <th>Назва</th>
                          <th>Тип</th>
                          <th>Номер</th>
                          <th>Термін дії</th>
                          <th>Документ</th>
                          <th>Дії</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((referral) => (
                          <tr key={referral.id}>
                            <td>{format(new Date(referral.issueDate), 'dd.MM.yyyy')}</td>
                            <td>{referral.title}</td>
                            <td>{referral.referralType}</td>
                            <td>{referral.referralNumber}</td>
                            <td>{format(new Date(referral.expirationDate), 'dd.MM.yyyy')}</td>
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
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  to={`/referrals/${referral.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Переглянути
                                </Link>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(referral.id)}
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
        title="Нове направлення"
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
        <ReferralForm
          onSubmit={handleCreate}
          error={formError}
        />
      </Modal>
    </Layout>
  );
};

export default ReferralsPage;