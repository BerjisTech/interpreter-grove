
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const requirementFormSchema = z.object({
  specialization: z.string().min(2, "Specialization must be at least 2 characters"),
  certificationName: z.string().min(2, "Certification name must be at least 2 characters"),
  issuingAuthority: z.string().min(2, "Issuing authority must be at least 2 characters"),
  requiredFor: z.string().min(2, "Required for must be at least 2 characters")
});

type RequirementFormData = z.infer<typeof requirementFormSchema>;

interface AddRequirementDialogProps {
  onRequirementAdded: (requirement: any) => void;
}

export function AddRequirementDialog({ onRequirementAdded }: AddRequirementDialogProps) {
  const { toast } = useToast();
  const form = useForm<RequirementFormData>({
    resolver: zodResolver(requirementFormSchema),
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: RequirementFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequirement = {
        id: Math.random().toString(36).substring(7),
        ...data,
        dateAdded: new Date().toISOString()
      };
      
      onRequirementAdded(newRequirement);
      setOpen(false);
      toast({
        title: "Success",
        description: "Certification requirement has been added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add certification requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Requirement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Certification Requirement</DialogTitle>
          <DialogDescription>Add a new certification requirement for interpreters</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Medical Interpreter Certification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuingAuthority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Authority</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization that issues this certification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required For</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. All medical interpreters" {...field} />
                  </FormControl>
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
