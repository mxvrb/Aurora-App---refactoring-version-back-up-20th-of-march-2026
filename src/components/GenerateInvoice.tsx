import React, { useState } from "react";
import {
  ChevronLeft,
  Plus,
  FileText,
  Download,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";
import CustomButton from "./Button";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  notes: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: "Paid" | "Unpaid" | "Overdue";
  createdAt: Date;
}

interface LineItem {
  id: string;
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface GenerateInvoiceProps {
  onBack: () => void;
  onSave?: () => void;
}

export function GenerateInvoice({
  onBack,
  onSave,
}: GenerateInvoiceProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('generatedInvoicesSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse generatedInvoicesSettings:', e);
        return [];
      }
    }
    return [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Paid" | "Unpaid" | "Overdue"
  >("All");
  const [selectedCurrency, setSelectedCurrency] = useState("AED");

  const CURRENCIES = [
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
    { code: "BHD", symbol: "BD", name: "Bahraini Dinar" },
    { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
    { code: "OMR", symbol: "﷼", name: "Omani Rial" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  ];

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.symbol || code;
  };

  // Form state
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      service: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (
    id: string,
    field: string,
    value: string | number,
  ) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total =
              updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        service: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems((prev) =>
        prev.filter((item) => item.id !== id),
      );
    }
  };

  const calculateSummary = () => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    const taxRate = 5; // UAE VAT rate
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxRate, taxAmount, total };
  };

  const handleGenerateInvoice = () => {
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please fill in required fields");
      return;
    }

    const summary = calculateSummary();
    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientAddress: formData.clientAddress,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      lineItems: lineItems,
      notes: formData.notes,
      subtotal: summary.subtotal,
      taxRate: summary.taxRate,
      taxAmount: summary.taxAmount,
      total: summary.total,
      currency: selectedCurrency,
      status: "Unpaid",
      createdAt: new Date(),
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('generatedInvoicesSettings', JSON.stringify(updatedInvoices));
    toast.success("Invoice generated successfully");
    
    // Trigger UI update in main page
    if (onSave) onSave();
    
    handleCancel();
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setFormData({
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
    });
    setLineItems([
      {
        id: crypto.randomUUID(),
        service: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const formatPrice = (price: number, currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency;
    return `${getCurrencySymbol(code)} ${price.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Unpaid":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "Overdue":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus === "All") return true;
    return invoice.status === filterStatus;
  });

  const summary = calculateSummary();

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div
        onClick={onBack}
        style={{
          paddingTop: "0.6rem",
          paddingBottom: "0.6rem",
        }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          Generate Invoice
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 py-3">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsFormOpen(true);
          }}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="w-full mb-6 flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium"> Generate Invoice</span>
        </div>
        {/* Filter Tabs */}
        {invoices.length > 0 && (
          <div className="flex gap-2 mb-6">
            {(
              ["All", "Paid", "Unpaid", "Overdue"] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {/* Invoice List */}
        {filteredInvoices.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900/50 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No invoices generated yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first invoice
            </p>
          </div>
        ) : (
          // Invoice Items
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-start justify-between px-6 py-5 bg-white dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {invoice.invoiceNumber}
                    </h3>
                    <span className="text-gray-500 dark:text-gray-500">
                      |
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {invoice.clientName}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        invoice.status,
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Date:{" "}
                      {new Date(
                        invoice.invoiceDate,
                      ).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      Total: {formatPrice(invoice.total, invoice.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Due:{" "}
                    {new Date(
                      invoice.dueDate,
                    ).toLocaleDateString()}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new invoice
              for your client.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-4">
            <div className="grid grid-cols-1 gap-5 px-1 pb-4">
              {/* Client Information */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Client Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="clientName"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Client Name{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="clientName"
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        handleFormChange(
                          "clientName",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. ABC Corporation"
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="clientEmail"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Client Email{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        handleFormChange(
                          "clientEmail",
                          e.target.value,
                        )
                      }
                      placeholder="contact@abccorp.com"
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="clientAddress"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Client Address
                    </Label>
                    <textarea
                      id="clientAddress"
                      value={formData.clientAddress}
                      onChange={(e) =>
                        handleFormChange(
                          "clientAddress",
                          e.target.value,
                        )
                      }
                      placeholder="Office 123, Al Quoz, Dubai, UAE"
                      rows={2}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="invoiceNumber"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      type="text"
                      value={`INV-${String(invoices.length + 1).padStart(3, "0")}`}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="currency"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Currency
                    </Label>
                    <select
                      id="currency"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol}) — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="invoiceDate"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Invoice Date
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) =>
                        handleFormChange(
                          "invoiceDate",
                          e.target.value,
                        )
                      }
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="dueDate"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleFormChange(
                          "dueDate",
                          e.target.value,
                        )
                      }
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                    Line Items
                  </h3>
                  <CustomButton
                    onClick={addLineItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </CustomButton>
                </div>
                <div className="space-y-3">
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">
                            Service/Item
                          </Label>
                          <Input
                            type="text"
                            value={item.service}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "service",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Website Design"
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">
                            Quantity
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">
                            Unit Price ({selectedCurrency})
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleLineItemChange(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) ||
                                    0,
                                )
                              }
                              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 pt-5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice(item.total)}
                        </span>
                        {lineItems.length > 1 && (
                          <button
                            onClick={() =>
                              removeLineItem(item.id)
                            }
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatPrice(summary.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      VAT ({summary.taxRate}%):
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatPrice(summary.taxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">
                      Total:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatPrice(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Notes (Optional)
                </Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    handleFormChange("notes", e.target.value)
                  }
                  placeholder="Thank you for your business!"
                  rows={3}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
            >
              Generate Invoice
            </Button>
          </DialogFooter>
          {/* <DialogFooter className="flex justify-end gap-3">
            <CustomButton
              onClick={handleCancel}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleGenerateInvoice}
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
            >
              Generate Invoice
            </CustomButton>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}