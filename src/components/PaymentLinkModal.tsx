import React, { useState } from "react";
import { X } from "lucide-react";
import CustomButton from "./Button";
import CustomInput from "./Input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PaymentLinkData) => void;
}

interface PaymentLinkData {
  amount: string;
  currency: string;
  productName: string;
  description: string;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
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

export function PaymentLinkModal({ isOpen, onClose, onSave }: PaymentLinkModalProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleSave = () => {
    if (!amount || !productName) {
      return;
    }

    onSave({
      amount,
      currency,
      productName,
      description,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Create Payment Link
          </h2>
          <CustomButton
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </CustomButton>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-gray-900 dark:text-gray-100">
                Currency *
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product/Service Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-gray-900 dark:text-gray-100">
              Product / Service Name *
            </Label>
            <CustomInput
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Premium Subscription"
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
              Description (Optional)
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this payment..."
              rows={3}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Recurring Payment Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <Label htmlFor="recurring" className="text-gray-900 dark:text-gray-100 font-medium">
                Recurring Payment
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Charge customer automatically
              </p>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {/* Recurring Interval (shown only when recurring is enabled) */}
          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-gray-900 dark:text-gray-100">
                Billing Interval
              </Label>
              <Select value={recurringInterval} onValueChange={(value: any) => setRecurringInterval(value)}>
                <SelectTrigger className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          {amount && productName && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Preview
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Amount:</span> {currency} {amount}
                  {isRecurring && ` / ${recurringInterval}`}
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Product:</span> {productName}
                </p>
                {description && (
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Description:</span> {description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-300 dark:border-gray-700">
          <CustomButton
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={handleSave}
            disabled={!amount || !productName}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Create Payment Link
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
