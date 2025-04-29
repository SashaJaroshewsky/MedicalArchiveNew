// src/pages/Dashboard/DashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <h1 className="display-5 mb-4 text-primary">
              Вітаємо, {user?.firstName || 'Користувач'}!
            </h1>
            
            {user?.role === 'Doctor' ? (
              // Вміст для лікаря
              <>
                <h2 className="h3 mb-4">Панель лікаря</h2>
                <Row className="g-4">
                  <Col md={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Мої пацієнти</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Перегляд архівів пацієнтів, які надали доступ
                        </Card.Text>
                        <Link to="/patients" className="btn btn-primary mt-auto">
                          Перейти до пацієнтів
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Мій профіль</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Перегляд та редагування особистих даних
                        </Card.Text>
                        <Link to="/profile" className="btn btn-primary mt-auto">
                          Перейти до профілю
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              // Вміст для звичайного користувача
              <>
                <h2 className="h3 mb-4">Ваш медичний архів</h2>
                <Row className="g-4">
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Прийоми у лікаря</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Записи про візити до лікарів
                        </Card.Text>
                        <Link to="/doctor-appointments" className="btn btn-primary mt-auto">
                          Перейти до прийомів
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Рецепти</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Призначені ліки та рекомендації
                        </Card.Text>
                        <Link to="/prescriptions" className="btn btn-primary mt-auto">
                          Перейти до рецептів
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Направлення</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Направлення на аналізи та обстеження
                        </Card.Text>
                        <Link to="/referrals" className="btn btn-primary mt-auto">
                          Перейти до направлень
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Щеплення</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Історія вакцинації
                        </Card.Text>
                        <Link to="/vaccinations" className="btn btn-primary mt-auto">
                          Перейти до щеплень
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Медичні довідки</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Медичні довідки та висновки
                        </Card.Text>
                        <Link to="/medical-certificates" className="btn btn-primary mt-auto">
                          Перейти до довідок
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h4 mb-3">Доступ лікарів</Card.Title>
                        <Card.Text className="text-muted mb-4">
                          Керування доступом лікарів до ваших даних
                        </Card.Text>
                        <Link to="/doctor-access" className="btn btn-primary mt-auto">
                          Перейти до налаштувань доступу
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default DashboardPage;