import React, { useState } from "react";
import { copyToClipboard } from "../utils/clipboard";
import {
  ChevronLeft,
  Plus,
  Link2,
  Trash2,
  Pencil,
  ExternalLink,
  Copy,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface PaymentLink {
  id: string;
  label: string;
  url: string;
  createdAt: Date;
}

interface ConnectPaymentLinksProps {
  onBack: () => void;
  onSave?: () => void;
}

export function ConnectPaymentLinks({
  onBack,
  onSave,
}: ConnectPaymentLinksProps) {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(() => {
    const saved = localStorage.getItem('paymentLinksSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse paymentLinksSettings:', e);
        return [];
      }
    }
    return [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formLabel, setFormLabel] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formErrors, setFormErrors] = useState({ label: "", url: "" });

  const validateForm = (): boolean => {
    const errors = { label: "", url: "" };

    if (!formLabel.trim()) {
      errors.label = "Please enter a label for this payment link";
    }

    if (!formUrl.trim()) {
      errors.url = "Please paste a payment link";
    } else {
      try {
        new URL(formUrl.trim());
      } catch {
        errors.url = "Please enter a valid URL (e.g. https://...)";
      }
    }

    setFormErrors(errors);
    return !errors.label && !errors.url;
  };

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormLabel("");
    setFormUrl("");
    setFormErrors({ label: "", url: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: PaymentLink) => {
    setEditingLink(link);
    setFormLabel(link.label);
    setFormUrl(link.url);
    setFormErrors({ label: "", url: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingLink) {
      const updatedLinks = paymentLinks.map((l) =>
        l.id === editingLink.id
          ? { ...l, label: formLabel.trim(), url: formUrl.trim() }
          : l
      );
      setPaymentLinks(updatedLinks);
      localStorage.setItem('paymentLinksSettings', JSON.stringify(updatedLinks));
      toast.success("Payment link updated");
    } else {
      const newLink: PaymentLink = {
        id: crypto.randomUUID(),
        label: formLabel.trim(),
        url: formUrl.trim(),
        createdAt: new Date(),
      };
      const updatedLinks = [...paymentLinks, newLink];
      setPaymentLinks(updatedLinks);
      localStorage.setItem('paymentLinksSettings', JSON.stringify(updatedLinks));
      toast.success("Payment link added");
      
      // Trigger UI update in main page
      if (onSave) onSave();
    }

    setIsModalOpen(false);
    setEditingLink(null);
    setFormLabel("");
    setFormUrl("");
  };

  const handleDelete = (link: PaymentLink) => {
    const updatedLinks = paymentLinks.filter((l) => l.id !== link.id);
    setPaymentLinks(updatedLinks);
    localStorage.setItem('paymentLinksSettings', JSON.stringify(updatedLinks));
    toast.success("Payment link removed");
    
    // Trigger UI update in main page
    if (onSave) onSave();
  };

  const handleCopy = async (link: PaymentLink) => {
    await copyToClipboard(link.url);
    setCopiedId(link.id);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div
        onClick={onBack}
        style={{
          paddingTop: "0.6rem",
          paddingBottom: "0.6rem",
        }}
        className="flex items-center justify-between px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <div className="flex items-center">
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Connect Payment Links
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 py-3">
        {/* Add Payment Method Button */}
        <div
          onClick={handleOpenAdd}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="w-full mb-6 flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">Add Payment Method</span>
        </div>

        {/* Payment Links List */}
        {paymentLinks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900/50 flex items-center justify-center">
              <Link2 className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No payment links added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-2">
              Add your payment links so the AI can share them with customers when they're ready to pay.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              Paste any payment URL — Stripe, PayPal, Square, or any checkout link you use.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all animate-in fade-in duration-200"
              >
                {/* Left Side */}
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {link.label}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate pl-6">
                    {link.url}
                  </p>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(link)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Open link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleOpenEdit(link)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {paymentLinks.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">How it works:</span> When a customer indicates they want to pay, the AI will automatically share the relevant payment link from your list above.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Payment Link Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[520px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Payment Link" : "Add Payment Link"}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update your payment link details below."
                : "Paste the payment link you use to collect payments from customers. The AI will send this link when a customer is ready to pay."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Label */}
            <div className="space-y-2">
              <Label
                htmlFor="link-label"
                className="text-gray-900 dark:text-gray-100"
              >
                Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="link-label"
                type="text"
                value={formLabel}
                onChange={(e) => {
                  setFormLabel(e.target.value);
                  if (formErrors.label) setFormErrors((p) => ({ ...p, label: "" }));
                }}
                placeholder="e.g. Main checkout, Deposit payment, Consultation fee"
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
              {formErrors.label && (
                <p className="text-red-500 text-sm">{formErrors.label}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label
                htmlFor="link-url"
                className="text-gray-900 dark:text-gray-100"
              >
                Payment Link <span className="text-red-500">*</span>
              </Label>
              <Input
                id="link-url"
                type="url"
                value={formUrl}
                onChange={(e) => {
                  setFormUrl(e.target.value);
                  if (formErrors.url) setFormErrors((p) => ({ ...p, url: "" }));
                }}
                placeholder="https://pay.stripe.com/... or any payment URL"
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              />
              {formErrors.url && (
                <p className="text-red-500 text-sm">{formErrors.url}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Paste any payment URL — Stripe, PayPal, Square, or any checkout link you use
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingLink(null);
                setFormLabel("");
                setFormUrl("");
                setFormErrors({ label: "", url: "" });
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
            >
              {editingLink ? "Update Link" : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}