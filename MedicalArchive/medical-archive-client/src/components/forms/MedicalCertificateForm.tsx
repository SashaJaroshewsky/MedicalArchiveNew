import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { MedicalCertificateCreateRequest, MedicalCertificateUpdateRequest } from '../../models/medical-certificate.model';
import FileUpload from '../common/FileUpload';

interface MedicalCertificateFormProps {
  initialData?: MedicalCertificateUpdateRequest;
  onSubmit: (data: MedicalCertificateCreateRequest | MedicalCertificateUpdateRequest) => Promise<void>;
  error?: string | null;
}

const MedicalCertificateForm: React.FC<MedicalCertificateFormProps> = ({
  initialData,
  onSubmit,
  error
}) => {
  const [formData, setFormData] = useState<MedicalCertificateCreateRequest>({
    title: initialData?.title || '',
    issueDate: initialData?.issueDate || '',
    description: initialData?.description || ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        <Form.Label>Назва довідки</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Введіть назву довідки"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Дата видачі</Form.Label>
        <Form.Control
          type="date"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Опис</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Введіть опис довідки"
        />
      </Form.Group>

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

export default MedicalCertificateForm;