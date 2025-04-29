import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../context/AuthContext';
import AuthAPI from '../../api/auth.api';
import { User, UserUpdateRequest } from '../../models/user.model';
import { ChangePasswordRequest } from '../../models/auth.model';

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Стан для зміни пароля
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await AuthAPI.getProfile();
      setProfileData(userData);
    } catch (err) {
      setError('Помилка завантаження профілю');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!profileData) return;

      const updateData: UserUpdateRequest = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
      };

      const updatedProfile = await AuthAPI.updateProfile(updateData);
      setProfileData(updatedProfile);
      setIsEditing(false);
      setSuccess('Профіль успішно оновлено');
    } catch (err) {
      setError('Помилка оновлення профілю');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (passwordData.newPassword !== confirmNewPassword) {
      setError('Паролі не співпадають');
      setLoading(false);
      return;
    }

    try {
      await AuthAPI.changePassword(passwordData);
      setSuccess('Пароль успішно змінено');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setConfirmNewPassword('');
    } catch (err) {
      setError('Помилка зміни пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!profileData) {
    return <Layout><div className="text-center p-5">Завантаження...</div></Layout>;
  }

  return (
    <Layout>
      <Container className="py-5">
        <h1 className="text-center mb-4">Мій профіль</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleProfileUpdate}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Прізвище</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ім'я</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>По батькові</Form.Label>
                    <Form.Control
                      type="text"
                      name="middleName"
                      value={profileData.middleName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Дата народження</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Стать</Form.Label>
                        <Form.Select
                          name="gender"
                          value={profileData.gender}
                          onChange={e => setProfileData(prev => prev ? { ...prev, gender: e.target.value } : null)}
                          disabled={!isEditing}
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
                      value={profileData.email}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Адреса</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="secondary" 
                          onClick={() => setIsEditing(false)}
                          disabled={loading}
                        >
                          Скасувати
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Збереження...' : 'Зберегти зміни'}
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        onClick={() => setIsEditing(true)}
                      >
                        Редагувати профіль
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mt-4">
              <Card.Body>
                <h4 className="mb-4">Зміна пароля</h4>
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group className="mb-3">
                    <Form.Label>Поточний пароль</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Новий пароль</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Підтвердження нового пароля</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Зміна пароля...' : 'Змінити пароль'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default ProfilePage;