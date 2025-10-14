import React, { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import styles from './Modal.module.scss';

export interface ModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Título del modal */
  title?: string;
  /** Contenido del modal */
  children: ReactNode;
  /** Tamaño del modal */
  size?: 'small' | 'medium' | 'large' | 'full';
  /** Si se puede cerrar haciendo clic fuera del modal */
  closeOnOverlayClick?: boolean;
  /** Si se puede cerrar con la tecla Escape */
  closeOnEscape?: boolean;
  /** Texto del botón de cerrar */
  closeButtonText?: string;
  /** Si mostrar el botón de cerrar */
  showCloseButton?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** ID del modal para accesibilidad */
  id?: string;
  /** Si el modal debe enfocarse automáticamente */
  autoFocus?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  closeButtonText = 'Cerrar',
  showCloseButton = true,
  className = '',
  id,
  autoFocus = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Manejar tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Manejar foco y scroll
  useEffect(() => {
    if (!isOpen) return;

    // Guardar elemento activo anterior
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Enfocar el modal
    if (autoFocus && modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      // Restaurar scroll del body
      document.body.style.overflow = '';
      
      // Restaurar foco al elemento anterior
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, autoFocus]);

  // Manejar clic en overlay
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Manejar clic en botón cerrar
  const handleCloseClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`${styles.modal__overlay}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id || 'modal'}-title` : undefined}
      aria-describedby={id ? `${id}-content` : undefined}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles[`modal--${size}`]} ${className}`}
        tabIndex={-1}
        id={id}
      >
        {(title || showCloseButton) && (
          <div className={styles.modal__header}>
            {title && (
              <h2 
                id={`${id || 'modal'}-title`}
                className={styles.modal__title}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseClick}
                className={styles.modal__close}
                aria-label={closeButtonText}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}
        
        <div 
          className={styles.modal__content}
          id={id ? `${id}-content` : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );

  // Renderizar en portal para evitar problemas de z-index
  return createPortal(modalContent, document.body);
};