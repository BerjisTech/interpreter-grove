
import React from "react";
import { WithdrawForm } from "./forms/WithdrawForm";
import { AdjustFeesForm } from "./forms/AdjustFeesForm";
import { ExportDataForm } from "./forms/ExportDataForm";

type ActionType = "withdraw" | "adjustFees" | "export";

interface RevenueActionFormProps {
  actionType: ActionType;
  onCancel: () => void;
  prefilledData?: Record<string, any>;
}

export function RevenueActionForm({
  actionType,
  onCancel,
  prefilledData = {},
}: RevenueActionFormProps) {
  // Render the appropriate form based on the action type
  switch (actionType) {
    case "withdraw":
      return (
        <WithdrawForm 
          onCancel={onCancel} 
          prefilledData={prefilledData}
        />
      );
    case "adjustFees":
      return (
        <AdjustFeesForm 
          onCancel={onCancel} 
          prefilledData={prefilledData}
        />
      );
    case "export":
      return (
        <ExportDataForm 
          onCancel={onCancel} 
          prefilledData={prefilledData}
        />
      );
    default:
      return null;
  }
}
