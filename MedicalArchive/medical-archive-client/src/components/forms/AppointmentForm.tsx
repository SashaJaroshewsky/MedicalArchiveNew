import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { DoctorAppointmentCreateRequest, DoctorAppointmentUpdateRequest } from '../../models/doctor-appointment.model';
import FileUpload from '../common/FileUpload';

interface AppointmentFormProps {
  initialData?: DoctorAppointmentUpdateRequest;
  onSubmit: (data: DoctorAppointmentCreateRequest | DoctorAppointmentUpdateRequest) => Promise<void>;
  error?: string | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  error
}) => {
  const [formData, setFormData] = useState<DoctorAppointmentCreateRequest>({
    title: initialData?.title || '',
    appointmentDate: initialData?.appointmentDate || '',
    doctorName: initialData?.doctorName || '',
    complaints: initialData?.complaints || '',
    procedureDescription: initialData?.procedureDescription || '',
    diagnosis: initialData?.diagnosis || '',
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
        <Form.Label>Назва прийому</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Введіть назву прийому"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Дата прийому</Form.Label>
        <Form.Control
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Лікар</Form.Label>
        <Form.Control
          type="text"
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          required
          placeholder="Введіть ім'я лікаря"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Скарги</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="complaints"
          value={formData.complaints}
          onChange={handleChange}
          required
          placeholder="Опишіть скарги"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Опис процедури</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="procedureDescription"
          value={formData.procedureDescription}
          onChange={handleChange}
          required
          placeholder="Опишіть проведені процедури"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Діагноз</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
          placeholder="Введіть діагноз"
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

export default AppointmentForm;