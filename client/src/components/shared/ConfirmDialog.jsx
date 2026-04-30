import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-sm font-semibold text-brand-muted">{message}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
