
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RevenueActionForm } from "./RevenueActionForm";

type ActionType = "withdraw" | "adjustFees" | "export";

interface RevenueActionDialogProps {
  actionType: ActionType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledData?: Record<string, any>;
}

export function RevenueActionDialog({
  actionType,
  isOpen,
  onOpenChange,
  prefilledData,
}: RevenueActionDialogProps) {
  const titles = {
    withdraw: "Withdraw Funds",
    adjustFees: "Adjust Fees",
    export: "Export Data",
  };

  const descriptions = {
    withdraw: "Complete the form below to withdraw funds to your preferred payment method.",
    adjustFees: "Adjust platform fees and set when changes will take effect.",
    export: "Select date range and format for your financial data export.",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{titles[actionType]}</DialogTitle>
          <DialogDescription>{descriptions[actionType]}</DialogDescription>
        </DialogHeader>
        <RevenueActionForm
          actionType={actionType}
          onCancel={() => onOpenChange(false)}
          prefilledData={prefilledData}
        />
      </DialogContent>
    </Dialog>
  );
}
