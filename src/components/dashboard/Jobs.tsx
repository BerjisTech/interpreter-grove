import { useState } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Download, Calendar, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const jobSchema = z.object({
  jobType: z.enum(["medical", "legal", "business", "educational", "other"]),
  language: z.string().min(1, {
    message: "Please select a language",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  duration: z.string().min(1, {
    message: "Please enter a duration",
  }),
  notes: z.string().optional(),
});

const Jobs = () => {
  const { role } = useUserRole();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobType: "medical",
      language: "",
      date: new Date(),
      startTime: "09:00",
      duration: "60",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof jobSchema>) {
    toast({
      title: "Job Scheduled",
      description: `New ${values.language} ${values.jobType} interpretation scheduled for ${format(values.date, 'PP')} at ${values.startTime}`,
    });
    setIsDialogOpen(false);
  }

  const viewJobDetails = (jobId: string) => {
    setSelectedJob(jobId);
    toast({
      title: "Job Details",
      description: `Viewing details for job #${jobId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="transition-all hover:shadow-md hover:scale-105"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Job
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>
                Jobs that are currently in progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Client/Interpreter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/50 transition-colors">
                    <TableCell>#9872</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>May 26, 2023</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> 10:30 AM - 11:30 AM
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>Spanish</TableCell>
                    <TableCell>
                      {(role === 'client' || role === 'admin') ? 'Maria Rodriguez' : 'John Smith'}
                    </TableCell>
                    <TableCell>Medical</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewJobDetails("9872")}
                        className="hover:scale-110 transition-transform"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50 transition-colors">
                    <TableCell>#9873</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>May 26, 2023</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> 1:00 PM - 2:00 PM
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>Mandarin</TableCell>
                    <TableCell>
                      {(role === 'client' || role === 'admin') ? 'Wei Zhang' : 'Sarah Johnson'}
                    </TableCell>
                    <TableCell>Legal</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500">Starting Soon</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewJobDetails("9873")}
                        className="hover:scale-110 transition-transform"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Jobs</CardTitle>
              <CardDescription>Jobs scheduled in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Client/Interpreter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#9875</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>May 27, 2023</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> 9:00 AM - 10:30 AM
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>Russian</TableCell>
                    <TableCell>
                      {(role === 'client' || role === 'admin') ? 'Alexei Petrov' : 'Michael Brown'}
                    </TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>
                      <Badge>Scheduled</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Completed Jobs</CardTitle>
                <CardDescription>Past completed jobs</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Client/Interpreter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#9865</TableCell>
                    <TableCell>May 24, 2023</TableCell>
                    <TableCell>French</TableCell>
                    <TableCell>
                      {(role === 'client' || role === 'admin') ? 'Jean Dupont' : 'Lisa Anderson'}
                    </TableCell>
                    <TableCell>Medical</TableCell>
                    <TableCell>45 min</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Jobs</CardTitle>
              <CardDescription>Jobs that were cancelled</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Client/Interpreter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cancellation Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#9855</TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell>Arabic</TableCell>
                    <TableCell>
                      {(role === 'client' || role === 'admin') ? 'Ahmed Hassan' : 'Emily Clark'}
                    </TableCell>
                    <TableCell>Legal</TableCell>
                    <TableCell>Client request</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="animate-fade-in">Schedule New Interpretation Job</DialogTitle>
            <DialogDescription className="animate-fade-in">
              Fill in the details to schedule a new interpretation job.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="mandarin">Mandarin</SelectItem>
                          <SelectItem value="arabic">Arabic</SelectItem>
                          <SelectItem value="russian">Russian</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{animationDelay: "50ms"}}>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                          <CalendarComponent
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (24-hour format)</FormLabel>
                      <FormControl>
                        <Input placeholder="09:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="animate-fade-in" style={{animationDelay: "100ms"}}>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                          <SelectItem value="180">180 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="animate-fade-in" style={{animationDelay: "150ms"}}>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Any special requirements or information" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include any details that might help the interpreter prepare
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 animate-fade-in" style={{animationDelay: "200ms"}}>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="animate-scale-in">
                  Schedule Job
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
