
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const certificationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  issuingBody: z.string().min(2, "Issuing body must be at least 2 characters"),
  validityPeriod: z.string().min(1, "Validity period is required")
});

type CertificationFormData = z.infer<typeof certificationFormSchema>;

interface AddCertificationTypeDialogProps {
  onCertificationAdded: (certification: any) => void;
}

export function AddCertificationTypeDialog({ onCertificationAdded }: AddCertificationTypeDialogProps) {
  const { toast } = useToast();
  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      validityPeriod: "1 year"
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: CertificationFormData) => {
    try {
      // Here you would typically make an API call to add the certification type
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCertification = {
        id: Math.random().toString(36).substring(7),
        ...data,
        dateAdded: new Date().toISOString()
      };
      
      onCertificationAdded(newCertification);
      setOpen(false);
      toast({
        title: "Success",
        description: "Certification type has been added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add certification type. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <BookmarkPlus className="w-4 h-4" />
          Add New Certification Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Certification Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the certification purpose and requirements" 
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
              name="issuingBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization that issues this certification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validityPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Certification</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
