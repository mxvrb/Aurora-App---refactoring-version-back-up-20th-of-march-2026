import React, { useState, useContext } from "react";
import { CreditCard, ChevronRight } from "lucide-react";
import { ServiceItemsList } from "./ServiceItemsList";
import { ConnectPaymentLinks } from "./ConnectPaymentLinks";
import { GenerateInvoice } from "./GenerateInvoice";
import { FilterContext } from "../contexts/FilterContext";

type ViewType = "main" | "services" | "payment-links" | "invoices";

interface PaymentsProps {
  onBack: () => void;
  onSave?: () => void;
}

export function Payments({ onBack, onSave }: PaymentsProps) {
  const { getFilterClasses } = useContext(FilterContext);
  const [currentView, setCurrentView] = useState<ViewType>("main");

  if (currentView === "services") {
    return <ServiceItemsList onBack={() => setCurrentView("main")} onSave={onSave} />;
  }

  if (currentView === "payment-links") {
    return <ConnectPaymentLinks onBack={() => setCurrentView("main")} onSave={onSave} />;
  }

  if (currentView === "invoices") {
    return <GenerateInvoice onBack={() => setCurrentView("main")} onSave={onSave} />;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Header Section */}
      <div className="relative bg-white dark:bg-gray-800">
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
          <span className="font-medium opacity-0">Spacer</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4 shadow-xl">
            <CreditCard className="w-[34px] h-[34px] text-white drop-shadow-lg" />
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">
            Payments
          </span>
          <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md px-4">
            Configure payment links for easy and secure customer transactions such as invoices and checkout links.
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 space-y-3">
        {/* Connect Payment Links */}
        <div
          onClick={() => setCurrentView("payment-links")}
          style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
          className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Connect Payment Links')}`}
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Connect Payment Links</span>
          <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>

        {/* Enter Service/Items Pricing List */}
        <div
          onClick={() => setCurrentView("services")}
          style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
          className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Enter Service / Items Pricing List')}`}
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Enter Service / Items Pricing List</span>
          <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>

        {/* Generate Invoice */}
        <div
          onClick={() => setCurrentView("invoices")}
          style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
          className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Generate Invoice')}`}
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Generate Invoice</span>
          <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>
      </div>
    </div>
  );
}