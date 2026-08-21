import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import "./adminProfile.css";

export default function AdminRejectReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm Rejection",
  reasonLabel = "Rejection reason",
  reasonPlaceholder = "Explain why this is being rejected...",
  loading = false,
  error = "",
  reason = "",
  onReasonChange,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="profile-logout-modal" showCloseButton={false}>
        <DialogHeader className="profile-logout-modal-header">
          <DialogTitle className="profile-logout-modal-title">{title}</DialogTitle>
          <DialogDescription className="profile-logout-modal-description">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="admin-profile-dialog-fields">
          <label className="admin-profile-form-label" htmlFor="admin-reject-reason">
            {reasonLabel}
          </label>
          <Textarea
            id="admin-reject-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            rows={4}
            placeholder={reasonPlaceholder}
          />
          {error ? (
            <p className="admin-profile-message admin-profile-message--error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="profile-logout-modal-actions">
          <Button
            type="button"
            variant="ghost"
            className="profile-logout-cancel-btn"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="profile-delete-confirm-btn"
            disabled={loading || !reason.trim()}
            onClick={onConfirm}
          >
            {loading ? "Saving..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
