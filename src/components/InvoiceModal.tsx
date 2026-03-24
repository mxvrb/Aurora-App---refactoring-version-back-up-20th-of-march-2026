import React, { useState, useEffect } from "react";
import { X, Download, Send } from "lucide-react";
import CustomButton from "./Button";
import CustomInput from "./Input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  onSave: (data: InvoiceFormData) => void;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  createdDate: string;
}

interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  amount: string;
  currency: string;
  description: string;
  dueDate: string;
  taxRate: string;
  notes: string;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export function InvoiceModal({ isOpen, onClose, invoice, onSave }: InvoiceModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");

  // Initialize form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setClientName(invoice.clientName);
      setAmount(invoice.amount.toString());
      setCurrency(invoice.currency);
      setDueDate(invoice.dueDate);
    } else {
      // Reset form for new invoice
      setClientName("");
      setClientEmail("");
      setAmount("");
      setCurrency("USD");
      setDescription("");
      setDueDate("");
      setTaxRate("0");
      setNotes("");
    }
  }, [invoice]);

  const calculateTotal = () => {
    const subtotal = parseFloat(amount) || 0;
    const tax = (subtotal * parseFloat(taxRate)) / 100;
    return (subtotal + tax).toFixed(2);
  };

  const handleSave = () => {
    if (!clientName || !amount || !dueDate) {
      return;
    }

    onSave({
      clientName,
      clientEmail,
      amount,
      currency,
      description,
      dueDate,
      taxRate,
      notes,
    });
  };

  const handleDownload = () => {
    // In production, this would generate and download PDF
    alert("Downloading invoice PDF...");
  };

  const handleSendEmail = () => {
    // In production, this would send invoice via email
    alert(`Sending invoice to ${clientEmail}...`);
  };

  if (!isOpen) return null;

  const isViewing = !!invoice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-700">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {isViewing ? `Invoice ${invoice.invoiceNumber}` : "Create New Invoice"}
            </h2>
            {isViewing && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Status: <span className={`font-medium ${
                  invoice.status === 'paid' ? 'text-green-600 dark:text-green-400' :
                  invoice.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isViewing && (
              <>
                <CustomButton
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </CustomButton>
                <CustomButton
                  onClick={handleSendEmail}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Send via Email"
                >
                  <Send className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </CustomButton>
              </>
            )}
            <CustomButton
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </CustomButton>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-gray-900 dark:text-gray-100">
                  Client Name *
                </Label>
                <CustomInput
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Smith"
                  disabled={isViewing}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-gray-900 dark:text-gray-100">
                  Client Email
                </Label>
                <CustomInput
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isViewing}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Invoice Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                Description / Service
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the products or services..."
                rows={3}
                disabled={isViewing}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-900 dark:text-gray-100">
                  Amount *
                </Label>
                <CustomInput
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isViewing}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-900 dark:text-gray-100">
                  Currency *
                </Label>
                <Select value={currency} onValueChange={setCurrency} disabled={isViewing}>
                  <SelectTrigger className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-gray-900 dark:text-gray-100">
                  Tax Rate (%)
                </Label>
                <CustomInput
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="0"
                  disabled={isViewing}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-gray-900 dark:text-gray-100">
                Due Date *
              </Label>
              <CustomInput
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isViewing}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-900 dark:text-gray-100">
                Notes (Optional)
              </Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or payment terms..."
                rows={2}
                disabled={isViewing}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Invoice Summary */}
          {amount && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {currency} {parseFloat(amount).toFixed(2)}
                  </span>
                </div>
                {parseFloat(taxRate) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax ({taxRate}%):
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {currency} {((parseFloat(amount) * parseFloat(taxRate)) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {currency} {calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isViewing && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-300 dark:border-gray-700">
            <CustomButton
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleSave}
              disabled={!clientName || !amount || !dueDate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Create Invoice
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
}
