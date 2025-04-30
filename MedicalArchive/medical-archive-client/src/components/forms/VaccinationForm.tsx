import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { VaccinationCreateRequest, VaccinationUpdateRequest } from '../../models/vaccination.model';
import FileUpload from '../common/FileUpload';

interface VaccinationFormProps {
  initialData?: VaccinationUpdateRequest;
  onSubmit: (data: VaccinationCreateRequest | VaccinationUpdateRequest) => Promise<void>;
  error?: string | null;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  initialData,
  onSubmit,
  error
}) => {
  const [formData, setFormData] = useState<VaccinationCreateRequest>({
    vaccineName: initialData?.vaccineName || '',
    vaccinationDate: initialData?.vaccinationDate || '',
    manufacturer: initialData?.manufacturer || '',
    doseNumber: initialData?.doseNumber || '',
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
        <Form.Label>Назва вакцини</Form.Label>
        <Form.Control
          type="text"
          name="vaccineName"
          value={formData.vaccineName}
          onChange={handleChange}
          required
          placeholder="Введіть назву вакцини"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Дата вакцинації</Form.Label>
        <Form.Control
          type="date"
          name="vaccinationDate"
          value={formData.vaccinationDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Виробник</Form.Label>
        <Form.Control
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          required
          placeholder="Введіть виробника вакцини"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Номер дози</Form.Label>
        <Form.Control
          type="text"
          name="doseNumber"
          value={formData.doseNumber}
          onChange={handleChange}
          required
          placeholder="Введіть номер дози"
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

export default VaccinationForm;