
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
const withdrawFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  accountType: z.enum(["bank", "paypal", "venmo"]),
  withdrawDate: z.date({
    required_error: "Please select a date",
  }),
});

type WithdrawFormData = z.infer<typeof withdrawFormSchema>;

interface WithdrawFormProps {
  onCancel: () => void;
  prefilledData?: Record<string, any>;
}

export function WithdrawForm({ onCancel, prefilledData = {} }: WithdrawFormProps) {
  const { toast } = useToast();

  // Parse prefilled data to match the form schema
  const parsedPrefilledData: Partial<WithdrawFormData> = {
    amount: prefilledData.amount as string || "",
    accountType: (prefilledData.accountType as "bank" | "paypal" | "venmo") || "bank",
    withdrawDate: prefilledData.withdrawDate instanceof Date 
      ? prefilledData.withdrawDate 
      : new Date(),
  };

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: parsedPrefilledData.amount,
      accountType: parsedPrefilledData.accountType,
      withdrawDate: parsedPrefilledData.withdrawDate,
    },
  });

  function onSubmit(values: WithdrawFormData) {
    const message = `Withdrawal of $${values.amount} via ${values.accountType} scheduled for ${format(values.withdrawDate, 'PP')}`;
    
    toast({
      title: "Withdrawal Successful",
      description: message,
    });

    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
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
                    className="p-3 pointer-events-auto"
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
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="animate-scale-in">
            Withdraw Funds
          </Button>
        </div>
      </form>
    </Form>
  );
}
