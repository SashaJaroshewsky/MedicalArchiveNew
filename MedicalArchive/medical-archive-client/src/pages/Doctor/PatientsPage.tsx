import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import DoctorAccessAPI from '../../api/doctor-access.api';
import { User } from '../../models/user.model';
import { format } from 'date-fns';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<User[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await DoctorAccessAPI.getPatientsWithAccess();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = patients.filter(patient => 
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower)
    );
    setFilteredPatients(filtered);
  };

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-0">Мої пацієнти</h1>
            </div>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Form.Group>
                  <Form.Label>Пошук пацієнта</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Пошук за ім'ям, прізвищем або email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
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
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3 mb-2">Пацієнтів не знайдено</h4>
                    <p className="text-muted mb-0">
                      {searchTerm 
                        ? 'Спробуйте змінити параметри пошуку'
                        : 'У вас поки немає пацієнтів, які надали вам доступ до своїх даних'}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>ПІБ</th>
                          <th>Email</th>
                          <th>Дата народження</th>
                          <th>Дії</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id}>
                            <td>
                              {`${patient.lastName} ${patient.firstName} ${patient.middleName}`}
                            </td>
                            <td>{patient.email}</td>
                            <td>{format(new Date(patient.dateOfBirth), 'dd.MM.yyyy')}</td>
                            <td>
                              <Link
                                to={`/patients/${patient.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-folder-check me-1"></i>
                                Переглянути архів
                              </Link>
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
    </Layout>
  );
};

export default PatientsPage;