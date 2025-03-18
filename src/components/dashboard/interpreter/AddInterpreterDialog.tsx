
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const interpreterFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type InterpreterFormData = z.infer<typeof interpreterFormSchema>;

interface AddInterpreterDialogProps {
  onInterpreterAdded: (interpreter: any) => void;
}

export function AddInterpreterDialog({ onInterpreterAdded }: AddInterpreterDialogProps) {
  const { toast } = useToast();
  const form = useForm<InterpreterFormData>({
    resolver: zodResolver(interpreterFormSchema),
    defaultValues: {
      languages: [],
      specialties: [],
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: InterpreterFormData) => {
    try {
      // Here you would typically make an API call to add the interpreter
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInterpreter = {
        id: Math.random().toString(36).substring(7),
        ...data,
        status: 'pending',
        lastActivity: 'Never'
      };
      
      onInterpreterAdded(newInterpreter);
      setOpen(false);
      toast({
        title: "Success",
        description: "Interpreter has been added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add interpreter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Interpreter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Interpreter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interpreter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter interpreter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Mandarin">Mandarin</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((language) => (
                        <Button
                          key={language}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value.filter((l) => l !== language));
                          }}
                        >
                          {language} ×
                        </Button>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Immigration">Immigration</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((specialty) => (
                        <Button
                          key={specialty}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value.filter((s) => s !== specialty));
                          }}
                        >
                          {specialty} ×
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
              <Button type="submit">Add Interpreter</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
