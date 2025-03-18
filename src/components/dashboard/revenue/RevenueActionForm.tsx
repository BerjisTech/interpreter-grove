
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
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
import { useUserRole } from "@/contexts/UserRoleContext";

// Different form schemas based on action type
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

type ActionType = "withdraw" | "adjustFees" | "export";

interface RevenueActionFormProps {
  actionType: ActionType;
  onCancel: () => void;
  prefilledData?: Record<string, any>;
}

export function RevenueActionForm({ 
  actionType, 
  onCancel, 
  prefilledData = {} 
}: RevenueActionFormProps) {
  const { toast } = useToast();
  const { role } = useUserRole();
  
  // Select the appropriate schema based on action type
  const formSchema = 
    actionType === "withdraw" 
      ? withdrawFormSchema 
      : actionType === "adjustFees" 
        ? adjustFeesFormSchema 
        : exportFormSchema;
  
  // Set up form with prefilled data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...prefilledData,
      // Default values for dates if not provided
      ...(actionType === "export" && {
        startDate: prefilledData.startDate || new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: prefilledData.endDate || new Date(),
        format: prefilledData.format || "csv",
        includeDetails: prefilledData.includeDetails !== undefined ? prefilledData.includeDetails : true,
      }),
      ...(actionType === "withdraw" && {
        withdrawDate: prefilledData.withdrawDate || new Date(),
      }),
      ...(actionType === "adjustFees" && {
        effectiveDate: prefilledData.effectiveDate || new Date(),
      }),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Show success message with form values
    let message;
    
    if (actionType === "withdraw") {
      message = `Withdrawal of $${values.amount} via ${values.accountType} scheduled for ${format(values.withdrawDate, 'PP')}`;
    } else if (actionType === "adjustFees") {
      message = `${values.feeType} fees adjusted to ${values.value}${values.adjustmentType === 'percentage' ? '%' : ' USD'} effective ${format(values.effectiveDate, 'PP')}`;
    } else {
      message = `Data exported in ${values.format.toUpperCase()} format from ${format(values.startDate, 'PP')} to ${format(values.endDate, 'PP')}`;
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
