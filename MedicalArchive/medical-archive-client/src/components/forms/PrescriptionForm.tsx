import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { PrescriptionCreateRequest, PrescriptionUpdateRequest } from '../../models/prescription.model';
import FileUpload from '../common/FileUpload';

interface PrescriptionFormProps {
  initialData?: PrescriptionUpdateRequest;
  onSubmit: (data: PrescriptionCreateRequest | PrescriptionUpdateRequest) => Promise<void>;
  error?: string | null;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialData,
  onSubmit,
  error
}) => {
  const [formData, setFormData] = useState<PrescriptionCreateRequest>({
    medicationName: initialData?.medicationName || '',
    issueDate: initialData?.issueDate || '',
    dosage: initialData?.dosage || '',
    instructions: initialData?.instructions || '',
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
        <Form.Label>Назва ліків</Form.Label>
        <Form.Control
          type="text"
          name="medicationName"
          value={formData.medicationName}
          onChange={handleChange}
          required
          placeholder="Введіть назву ліків"
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
        <Form.Label>Дозування</Form.Label>
        <Form.Control
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          required
          placeholder="Введіть дозування"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Інструкції по застосуванню</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          placeholder="Введіть інструкції по застосуванню"
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

export default PrescriptionForm;