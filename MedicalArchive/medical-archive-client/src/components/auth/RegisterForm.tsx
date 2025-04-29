// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { RegisterRequest } from '../../models/auth.model';
import AuthAPI from '../../api/auth.api';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Чоловіча',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    role: 'User'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    setLoading(true);

    try {
      await AuthAPI.register(formData);
      navigate('/login', { state: { message: 'Реєстрація успішна! Тепер ви можете увійти.' } });
    } catch (err: any) {
      setError(err.response?.data || 'Помилка під час реєстрації. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-center mb-4">Реєстрація</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Прізвище</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Введіть прізвище"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ім'я</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Введіть ім'я"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>По батькові</Form.Label>
          <Form.Control
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            required
            placeholder="Введіть по батькові"
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Дата народження</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Стать</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="Чоловіча">Чоловіча</option>
                <option value="Жіноча">Жіноча</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Введіть email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Введіть номер телефону"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Адреса</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Введіть адресу"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Тип користувача</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="User">Користувач</option>
            <option value="Doctor">Лікар</option>
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введіть пароль"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Підтвердження пароля</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder="Підтвердіть пароль"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-grid gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="py-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Завантаження...
              </>
            ) : (
              'Зареєструватися'
            )}
          </Button>
        </div>
      </Form>

      <div className="text-center mt-4">
        <p className="mb-0">
          Вже маєте обліковий запис?{' '}
          <Link to="/login" className="text-decoration-none">
            Увійти
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;