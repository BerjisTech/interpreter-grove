
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

// Form schema
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

type AdjustFeesFormData = z.infer<typeof adjustFeesFormSchema>;

interface AdjustFeesFormProps {
  onCancel: () => void;
  prefilledData?: Record<string, any>;
}

export function AdjustFeesForm({ onCancel, prefilledData = {} }: AdjustFeesFormProps) {
  const { toast } = useToast();

  // Parse prefilled data to match the form schema
  const parsedPrefilledData: Partial<AdjustFeesFormData> = {
    feeType: (prefilledData.feeType as "platform" | "transaction" | "subscription") || "platform",
    adjustmentType: (prefilledData.adjustmentType as "percentage" | "fixed") || "percentage",
    value: prefilledData.value as string || "",
    effectiveDate: prefilledData.effectiveDate instanceof Date 
      ? prefilledData.effectiveDate 
      : new Date(),
  };

  const form = useForm<AdjustFeesFormData>({
    resolver: zodResolver(adjustFeesFormSchema),
    defaultValues: {
      feeType: parsedPrefilledData.feeType,
      adjustmentType: parsedPrefilledData.adjustmentType,
      value: parsedPrefilledData.value,
      effectiveDate: parsedPrefilledData.effectiveDate,
    },
  });

  function onSubmit(values: AdjustFeesFormData) {
    const message = `${values.feeType} fees adjusted to ${values.value}${values.adjustmentType === 'percentage' ? '%' : ' USD'} effective ${format(values.effectiveDate, 'PP')}`;
    
    toast({
      title: "Fee Adjustment Successful",
      description: message,
    });

    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
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
                    className="p-3 pointer-events-auto"
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
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="animate-scale-in">
            Apply Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
