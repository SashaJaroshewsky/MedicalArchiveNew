// src/components/common/Footer.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light py-4 mt-auto border-top">
      <Container>
        <Row className="align-items-center justify-content-between">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} Персональний архів медичних даних
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none">Про нас</a>
              </li>
              <li className="list-inline-item mx-3">
                <a href="#" className="text-muted text-decoration-none">Конфіденційність</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none">Умови використання</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;