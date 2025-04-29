// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { LoginRequest } from '../../models/auth.model';
import AuthAPI from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await AuthAPI.login(formData);
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка під час входу. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
   
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Вхід в систему</h2>
                <p className="text-muted">Введіть ваші облікові дані</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email адреса</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введіть email"
                    required
                    autoComplete="email"
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введіть пароль"
                    required
                    autoComplete="current-password"
                    className="py-2"
                  />
                  <Form.Text className="text-end d-block mt-2">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Забули пароль?
                    </Link>
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100 py-2 mb-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Вхід...
                    </>
                  ) : (
                    'Увійти'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Немає облікового запису?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Зареєструватися
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
  
  );
};

export default LoginForm;