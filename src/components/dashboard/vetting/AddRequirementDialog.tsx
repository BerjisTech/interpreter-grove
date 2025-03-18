
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const requirementFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["documentation", "verification", "screening", "assessment", "training", "other"]),
  isRequired: z.boolean().default(true),
  applicableTo: z.array(z.string()).min(1, "Select at least one applicable role")
});

type RequirementFormData = z.infer<typeof requirementFormSchema>;

interface AddRequirementDialogProps {
  onRequirementAdded: (requirement: any) => void;
}

export function AddRequirementDialog({ onRequirementAdded }: AddRequirementDialogProps) {
  const { toast } = useToast();
  const form = useForm<RequirementFormData>({
    resolver: zodResolver(requirementFormSchema),
    defaultValues: {
      isRequired: true,
      applicableTo: []
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: RequirementFormData) => {
    try {
      // Here you would typically make an API call to add the requirement
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequirement = {
        id: Math.random().toString(36).substring(7),
        ...data,
        dateAdded: new Date().toISOString(),
        status: 'active'
      };
      
      onRequirementAdded(newRequirement);
      setOpen(false);
      toast({
        title: "Success",
        description: "Requirement has been added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <FilePlus className="w-4 h-4" />
          Add Requirement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Requirement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirement Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Background Check" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the requirement details and process" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select requirement category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicableTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable To</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicable roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interpreter">Interpreters</SelectItem>
                      <SelectItem value="agency">Agencies</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="vendor">Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((role) => (
                        <Button
                          key={role}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value.filter((r) => r !== role));
                          }}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)} ×
                        </Button>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Requirement</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
