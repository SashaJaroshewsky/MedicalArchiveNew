// src/components/common/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      fixed="top" 
      className="shadow-sm"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          Медичний Архів
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" onClick={() => setExpanded(false)}>
                  Головна
                </Nav.Link>

                {user?.role === 'Doctor' ? (
                  <Nav.Link as={Link} to="/patients" onClick={() => setExpanded(false)}>
                    Мої пацієнти
                  </Nav.Link>
                ) : (
                  <NavDropdown title="Медичні записи" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/doctor-appointments" onClick={() => setExpanded(false)}>
                      Прийоми у лікаря
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/prescriptions" onClick={() => setExpanded(false)}>
                      Рецепти
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/referrals" onClick={() => setExpanded(false)}>
                      Направлення
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/vaccinations" onClick={() => setExpanded(false)}>
                      Щеплення
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/medical-certificates" onClick={() => setExpanded(false)}>
                      Довідки
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/doctor-access" onClick={() => setExpanded(false)}>
                      Доступ лікарів
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.firstName}
                    </span>
                  } 
                  id="user-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    Мій профіль
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { handleLogout(); setExpanded(false); }}>
                    Вийти
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Увійти
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={() => setExpanded(false)}>
                  <Button variant="primary" size="sm">
                    Зареєструватися
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;