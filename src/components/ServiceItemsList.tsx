import React, { useState } from "react";
import {
  ChevronLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
} from "lucide-react";
import { toast } from "sonner";
import CustomButton from "./Button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CustomInput from "./Input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

// TypeScript Interface
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "Service" | "Product" | "Subscription" | "Custom";
  customCategory?: string;
  taxRate: number;
  createdAt: Date;
}

interface ServiceItemsListProps {
  onBack: () => void;
  onSave?: () => void;
}

export function ServiceItemsList({
  onBack,
  onSave,
}: ServiceItemsListProps) {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('serviceItemsPricingSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse serviceItemsPricingSettings:', e);
        return [];
      }
    }
    return [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<ServiceItem | null>(null);
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
    name: "",
    price: "",
    description: "",
    category: "Service" as
      | "Service"
      | "Product"
      | "Subscription"
      | "Custom",
    customCategory: "",
    taxRate: "0",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
  });

  // Validate form
  const validateForm = (): boolean => {
    const errors = {
      name: "",
      price: "",
    };

    if (!formData.name || formData.name.trim().length < 3) {
      errors.name =
        "Service name must be at least 3 characters";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      errors.price = "Price must be 0 or greater";
    }

    setFormErrors(errors);
    return !errors.name && !errors.price;
  };

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user types
    if (field === "name" || field === "price") {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Open form for adding new service
  const handleAddClick = () => {
    setEditingService(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "Service",
      customCategory: "",
      taxRate: "0",
    });
    setFormErrors({ name: "", price: "" });
    setIsFormOpen(true);
  };

  // Open form for editing existing service
  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      description: service.description,
      category: service.category,
      customCategory: service.customCategory || "",
      taxRate: service.taxRate.toString(),
    });
    setFormErrors({ name: "", price: "" });
    setIsFormOpen(true);
  };

  // Save service (add or update)
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const serviceData: ServiceItem = {
      id: editingService
        ? editingService.id
        : crypto.randomUUID(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      customCategory:
        formData.category === "Custom"
          ? formData.customCategory
          : undefined,
      taxRate: parseFloat(formData.taxRate) || 0,
      createdAt: editingService
        ? editingService.createdAt
        : new Date(),
    };

    if (editingService) {
      // Update existing service
      const updatedServices = services.map((s) =>
        s.id === editingService.id ? serviceData : s,
      );
      setServices(updatedServices);
      localStorage.setItem('serviceItemsPricingSettings', JSON.stringify(updatedServices));
      toast.success("Service updated successfully");
    } else {
      // Add new service
      const updatedServices = [...services, serviceData];
      setServices(updatedServices);
      localStorage.setItem('serviceItemsPricingSettings', JSON.stringify(updatedServices));
      toast.success("Service added successfully");
      
      // Trigger UI update in main page
      if (onSave) onSave();
    }

    // Close form and reset
    setIsFormOpen(false);
    setEditingService(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "Service",
      customCategory: "",
      taxRate: "0",
    });
  };

  // Delete service
  const handleDelete = (service: ServiceItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`,
    );

    if (confirmed) {
      const updatedServices = services.filter((s) => s.id !== service.id);
      setServices(updatedServices);
      localStorage.setItem('serviceItemsPricingSettings', JSON.stringify(updatedServices));
      toast.success("Service deleted successfully");
      
      // Trigger UI update in main page
      if (onSave) onSave();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingService(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "Service",
      customCategory: "",
      taxRate: "0",
    });
    setFormErrors({ name: "", price: "" });
  };

  // Format price as currency
  const formatPrice = (price: number): string => {
    return `${getCurrencySymbol(selectedCurrency)}${price.toFixed(2)}`;
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Service":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "Product":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Subscription":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
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
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          Service / Items Pricing List
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 py-3">
        {/* Add Service/Item Button */}
        <div
          onClick={handleAddClick}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="w-full mb-6 flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">Add Service / Item</span>
        </div>
        {/* <div className="mb-6 flex justify-center">
          <CustomButton
            onClick={handleAddClick}
            className="flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500 font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service/Item
          </CustomButton>
        </div> */}

        {/* Service List */}
        {services.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900/50 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No services or items added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the "+ Add Service / Item" button to create
              your first pricing entry
            </p>
          </div>
        ) : (
          // Service Items
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between px-6 py-5 bg-white dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all animate-in fade-in duration-200"
              >
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {service.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
                        service.category,
                      )}`}
                    >
                      {service.category === "Custom" && service.customCategory
                        ? service.customCategory
                        : service.category}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Tax Rate: {service.taxRate}%</span>
                    <span>•</span>
                    <span>
                      Added{" "}
                      {service.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 ml-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(service.price)}
                    </p>
                    {service.taxRate > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        +
                        {formatPrice(
                          (service.price * service.taxRate) /
                            100,
                        )}{" "}
                        tax
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(service)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>
              {editingService
                ? "Edit Service / Item"
                : "Add Service / Item"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the details of your service or item."
                : "Fill in the details below to add a new service or item to your pricing list."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-4">
            <div className="grid grid-cols-1 gap-5 px-1 pb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Service/Item Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  placeholder="Enter item name…"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              {/* Service/Item Name */}
              {/* <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Service/Item Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <CustomInput
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  placeholder="e.g. Website Design"
                  className={`bg-white dark:bg-gray-900 border ${
                    formErrors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div> */}

              {/* Price and Tax Rate Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    Price ({selectedCurrency}){" "}
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      handleFormChange("price", e.target.value)
                    }
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                {/* Currency */}
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
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tax Rate */}
                <div className="space-y-2">
                  <Label
                    htmlFor="taxRate"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    Tax Rate (%) <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
                  </Label>

                  <Input
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    id="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) =>
                      handleFormChange(
                        "taxRate",
                        e.target.value,
                      )
                    }
                    placeholder="0"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label
                    htmlFor="taxRate"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    Tax Rate (%)
                  </Label>
                  <div className="relative">
                    <CustomInput
                      id="taxRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.taxRate}
                      onChange={(e) =>
                        handleFormChange(
                          "taxRate",
                          e.target.value,
                        )
                      }
                      placeholder="10"
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      %
                    </span>
                  </div>
                </div> */}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleFormChange(
                      "category",
                      e.target.value as
                        | "Service"
                        | "Product"
                        | "Subscription"
                        | "Custom",
                    )
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="Service">Service</option>
                  <option value="Product">Product</option>
                  <option value="Subscription">
                    Subscription
                  </option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Custom Category */}
              {formData.category === "Custom" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="customCategory"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    Custom Category
                  </Label>
                  <Input
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    id="customCategory"
                    type="text"
                    value={formData.customCategory}
                    onChange={(e) =>
                      handleFormChange(
                        "customCategory",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Custom Service"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange(
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Describe the service or item..."
                  rows={4}
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
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
            >
              {editingService
                ? "Update Service / Item"
                : "Add Service / Item"}
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
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
            >
              {editingService ? "Update Service/Item" : "Add Service/Item"}
            </CustomButton>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}