import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  submitButton?: {
    text: string;
    variant?: string;
    loading?: boolean;
    onClick: () => void;
  };
}

const Modal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  children,
  size,
  submitButton
}) => {
  return (
    <BootstrapModal
      show={show}
      onHide={onHide}
      size={size}
      centered
      backdrop="static"
      keyboard={false}
    >
      <BootstrapModal.Header closeButton className="border-bottom">
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>

      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>

      <BootstrapModal.Footer className="border-top">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
        >
          Закрити
        </Button>
        
        {submitButton && (
          <Button
            variant={submitButton.variant || 'primary'}
            onClick={submitButton.onClick}
            disabled={submitButton.loading}
          >
            {submitButton.loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                />
                Завантаження...
              </>
            ) : (
              submitButton.text
            )}
          </Button>
        )}
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;