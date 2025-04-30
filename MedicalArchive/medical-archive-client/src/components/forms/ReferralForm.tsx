import React, { useState } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { ReferralCreateRequest, ReferralUpdateRequest } from '../../models/referral.model';
import FileUpload from '../common/FileUpload';

interface ReferralFormProps {
  initialData?: ReferralUpdateRequest;
  onSubmit: (data: ReferralCreateRequest | ReferralUpdateRequest) => Promise<void>;
  error?: string | null;
}

const ReferralForm: React.FC<ReferralFormProps> = ({
  initialData,
  onSubmit,
  error
}) => {
  const [formData, setFormData] = useState<ReferralCreateRequest>({
    title: initialData?.title || '',
    issueDate: initialData?.issueDate || '',
    expirationDate: initialData?.expirationDate || '',
    referralType: initialData?.referralType || '',
    referralNumber: initialData?.referralNumber || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      document: file || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Назва направлення</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Введіть назву направлення"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Дата видачі</Form.Label>
            <Form.Control
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Дата закінчення терміну дії</Form.Label>
            <Form.Control
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Тип направлення</Form.Label>
            <Form.Select
              name="referralType"
              value={formData.referralType}
              onChange={handleChange}
              required
            >
              <option value="">Виберіть тип</option>
              <option value="Консультація">Консультація</option>
              <option value="Обстеження">Обстеження</option>
              <option value="Госпіталізація">Госпіталізація</option>
              <option value="Аналізи">Аналізи</option>
              <option value="Інше">Інше</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Номер направлення</Form.Label>
            <Form.Control
              type="text"
              name="referralNumber"
              value={formData.referralNumber}
              onChange={handleChange}
              required
              placeholder="Введіть номер направлення"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Документ</Form.Label>
        <FileUpload
          onChange={handleFileChange}
          accept="application/pdf,image/*"
          currentFileName={initialData?.document?.name}
        />
        <Form.Text className="text-muted">
          Підтримувані формати: PDF, зображення
        </Form.Text>
      </Form.Group>
    </Form>
  );
};

export default ReferralForm;