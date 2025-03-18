import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schemas
const withdrawFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  accountType: z.enum(["bank", "paypal", "venmo"]),
  withdrawDate: z.date({
    required_error: "Please select a date",
  }),
});

const adjustFeesFormSchema = z.object({
  feeType: z.enum(["platform", "transaction", "subscription"]),
  adjustmentType: z.enum(["percentage", "fixed"]),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Value must be a non-negative number",
  }),
  effectiveDate: z.date({
    required_error: "Please select a date",
  }),
});

const exportFormSchema = z.object({
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  format: z.enum(["csv", "pdf", "excel"]),
  includeDetails: z.boolean().default(true),
});

type WithdrawFormData = z.infer<typeof withdrawFormSchema>;
type AdjustFeesFormData = z.infer<typeof adjustFeesFormSchema>;
type ExportFormData = z.infer<typeof exportFormSchema>;

type ActionType = "withdraw" | "adjustFees" | "export";

interface RevenueActionFormProps {
  actionType: ActionType;
  onCancel: () => void;
  prefilledData?: Partial<WithdrawFormData | AdjustFeesFormData | ExportFormData>;
}

export function RevenueActionForm({
  actionType,
  onCancel,
  prefilledData = {},
}: RevenueActionFormProps) {
  const { toast } = useToast();

  // Get the appropriate schema and default values based on action type
  const getFormConfig = () => {
    switch (actionType) {
      case "withdraw":
        return {
          schema: withdrawFormSchema,
          defaultValues: {
            amount: "",
            accountType: "bank",
            withdrawDate: new Date(),
            ...prefilledData as Partial<WithdrawFormData>,
          } as WithdrawFormData,
        };
      case "adjustFees":
        return {
          schema: adjustFeesFormSchema,
          defaultValues: {
            feeType: "platform",
            adjustmentType: "percentage",
            value: "",
            effectiveDate: new Date(),
            ...prefilledData as Partial<AdjustFeesFormData>,
          } as AdjustFeesFormData,
        };
      case "export":
        return {
          schema: exportFormSchema,
          defaultValues: {
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
            endDate: new Date(),
            format: "csv",
            includeDetails: true,
            ...prefilledData as Partial<ExportFormData>,
          } as ExportFormData,
        };
    }
  };

  const formConfig = getFormConfig();
  const form = useForm({
    resolver: zodResolver(formConfig.schema),
    defaultValues: formConfig.defaultValues,
  });

  function onSubmit(values: WithdrawFormData | AdjustFeesFormData | ExportFormData) {
    let message: string;

    switch (actionType) {
      case "withdraw":
        const withdrawValues = values as WithdrawFormData;
        message = `Withdrawal of $${withdrawValues.amount} via ${withdrawValues.accountType} scheduled for ${format(withdrawValues.withdrawDate, 'PP')}`;
        break;
      case "adjustFees":
        const feeValues = values as AdjustFeesFormData;
        message = `${feeValues.feeType} fees adjusted to ${feeValues.value}${feeValues.adjustmentType === 'percentage' ? '%' : ' USD'} effective ${format(feeValues.effectiveDate, 'PP')}`;
        break;
      case "export":
        const exportValues = values as ExportFormData;
        message = `Data exported in ${exportValues.format.toUpperCase()} format from ${format(exportValues.startDate, 'PP')} to ${format(exportValues.endDate, 'PP')}`;
        break;
    }

    toast({
      title: `${actionType === "withdraw" ? "Withdrawal" : actionType === "adjustFees" ? "Fee Adjustment" : "Export"} Successful`,
      description: message,
    });

    onCancel();
  }

  // Render form fields based on action type
  const renderFormFields = () => {
    if (actionType === "withdraw") {
      return (
        <>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input className="pl-7" placeholder="0.00" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the amount you wish to withdraw
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your preferred payment method
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="withdrawDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Withdrawal Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select when you want the withdrawal to be processed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    } else if (actionType === "adjustFees") {
      return (
        <>
          <FormField
            control={form.control}
            name="feeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="platform">Platform Fee</SelectItem>
                    <SelectItem value="transaction">Transaction Fee</SelectItem>
                    <SelectItem value="subscription">Subscription Fee</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of fee to adjust
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adjustmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjustment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select adjustment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose between percentage or fixed amount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {form.watch("adjustmentType") === "percentage" ? "%" : "$"}
                    </span>
                    <Input className="pl-7" placeholder="0.00" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the {form.watch("adjustmentType") === "percentage" ? "percentage" : "amount"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select when this fee adjustment should take effect
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    } else {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < form.getValues("startDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Export Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred export format
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        {renderFormFields()}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="animate-scale-in">
            {actionType === "withdraw"
              ? "Withdraw Funds"
              : actionType === "adjustFees"
              ? "Apply Changes"
              : "Export Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
