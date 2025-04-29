import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import LoginForm from '../../components/auth/LoginForm';
import Layout from '../../components/common/Layout';
import { useLocation } from 'react-router-dom';

interface LocationState {
  message?: string;
}

const LoginPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  return (
    <Layout>
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} className="px-3">
            <Card className="text-center border-0 bg-transparent">
              <Card.Body>
                <Row className="justify-content-center mb-4">
                  <Col xs={12} md={8} lg={6} xl={5}>
                    <div className="text-center mb-4">
                      <h1 className="display-4 fw-bold text-primary mb-2">
                        Medical Archive
                      </h1>
                      <p className="text-muted lead">
                        Увійдіть до системи електронних медичних карток
                      </p>
                    </div>

                    {state?.message && (
                      <Alert 
                        variant="success" 
                        className="mb-4 text-center shadow-sm"
                      >
                        {state.message}
                      </Alert>
                    )}

                    <Card className="shadow rounded-3">
                      <Card.Body className="p-3 p-md-4">
                        <LoginForm />
                      </Card.Body>
                    </Card>

                    <div className="mt-4 text-center">
                      <p className="text-muted small mb-0">
                        &copy; {new Date().getFullYear()} Medical Archive. 
                        Всі права захищені.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default LoginPage;