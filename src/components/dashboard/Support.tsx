
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  VideoIcon, 
  Send, 
  Paperclip, 
  Search,
  HelpCircle,
  Mail,
  FileText,
  BookOpen,
  Clock,
  Eye
} from 'lucide-react';

const Support = () => {
  const { role } = useUserRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {role === 'admin' ? 'Support Management' : 'Support Center'}
        </h1>
        {role !== 'admin' && (
          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call Support
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Open Tickets' : 'My Tickets'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '24' : '2'}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === 'admin' ? '5 high priority' : '1 awaiting response'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Response Time' : 'Avg. Response Time'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '1.8h' : '2h'}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === 'admin' ? 'Average first response' : 'For your tickets'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Resolved Today' : 'Knowledge Base Articles'}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '18' : '145'}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === 'admin' ? '+5 from yesterday' : 'Available for reference'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Customer Satisfaction' : 'Support Health'}
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '94%' : 'Good'}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === 'admin' ? 'Based on feedback' : 'All systems operational'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={role === 'admin' ? 'tickets' : 'my-tickets'}>
        <TabsList>
          {role === 'admin' ? (
            <>
              <TabsTrigger value="tickets">All Tickets</TabsTrigger>
              <TabsTrigger value="live-support">Live Support</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
              <TabsTrigger value="get-help">Get Help</TabsTrigger>
              <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
              <TabsTrigger value="live-help">Live Help</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {role === 'admin' ? (
          <>
            <TabsContent value="tickets" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>
                      Manage and respond to customer support tickets
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Search tickets..."
                        className="rounded-md border border-input pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#T-3842</TableCell>
                        <TableCell>Connection issues during video call</TableCell>
                        <TableCell>
                          <div className="font-medium">John Smith</div>
                          <div className="text-xs text-muted-foreground">Client</div>
                        </TableCell>
                        <TableCell>Technical</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">High</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>Open</Badge>
                        </TableCell>
                        <TableCell>
                          <div>25 min ago</div>
                          <div className="text-xs text-muted-foreground">By: System</div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#T-3841</TableCell>
                        <TableCell>Payment not received for job #9865</TableCell>
                        <TableCell>
                          <div className="font-medium">Maria Rodriguez</div>
                          <div className="text-xs text-muted-foreground">Interpreter</div>
                        </TableCell>
                        <TableCell>Billing</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500">Medium</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500">In Progress</Badge>
                        </TableCell>
                        <TableCell>
                          <div>1 hour ago</div>
                          <div className="text-xs text-muted-foreground">By: Admin</div>
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
            
            <TabsContent value="live-support">
              <Card>
                <CardHeader>
                  <CardTitle>Live Support Sessions</CardTitle>
                  <CardDescription>
                    Ongoing and scheduled live support sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Support Agent</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#LS-582</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <VideoIcon className="h-4 w-4 text-primary" />
                            <span>Video Call</span>
                          </div>
                        </TableCell>
                        <TableCell>Global Interpreters Inc.</TableCell>
                        <TableCell>David Wilson</TableCell>
                        <TableCell>10:15 AM (15 min ago)</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">In Progress</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Join</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#LS-583</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>Phone Call</span>
                          </div>
                        </TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Unassigned</TableCell>
                        <TableCell>Scheduled for 11:30 AM</TableCell>
                        <TableCell>
                          <Badge>Scheduled</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Assign</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Management</CardTitle>
                  <CardDescription>
                    Manage articles and resources for self-service support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button>Create New Article</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Getting Started with Video Interpretation</TableCell>
                        <TableCell>Guides</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>1,245</TableCell>
                        <TableCell>3 days ago</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Published</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Troubleshooting Audio Issues</TableCell>
                        <TableCell>Technical</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>876</TableCell>
                        <TableCell>1 week ago</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Published</Badge>
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
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Support Analytics</CardTitle>
                  <CardDescription>
                    Support performance metrics and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This section would display detailed analytics about support performance.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="my-tickets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Support Tickets</CardTitle>
                  <CardDescription>
                    Track and manage your support tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Response</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#T-3456</TableCell>
                        <TableCell>Question about payment processing</TableCell>
                        <TableCell>May 25, 2023</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500">In Progress</Badge>
                        </TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#T-3440</TableCell>
                        <TableCell>Help with scheduling feature</TableCell>
                        <TableCell>May 23, 2023</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Resolved</Badge>
                        </TableCell>
                        <TableCell>May 24, 2023</TableCell>
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
            
            <TabsContent value="get-help" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Get Help</CardTitle>
                  <CardDescription>
                    Choose how you'd like to receive support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Create a Ticket</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">
                          Submit a detailed help request and get a response from our support team.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          New Ticket
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Live Chat</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">
                          Connect with a support representative instantly through chat.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Start Chat
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Call Support</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">
                          Speak with our support team over the phone or through a video call.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          <Phone className="mr-2 h-4 w-4" />
                          Request Call
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">How do I schedule an interpreter?</h3>
                      <p className="text-sm">
                        You can schedule an interpreter by navigating to the "Jobs" section and clicking on "Schedule New Job". Follow the prompts to select your language, date, time, and interpreter preferences.
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">What payment methods are accepted?</h3>
                      <p className="text-sm">
                        We accept all major credit cards, PayPal, and bank transfers for business accounts.
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">How do I update my availability as an interpreter?</h3>
                      <p className="text-sm">
                        Interpreters can update their availability by going to the "Account" section and selecting the "Availability" tab. You can set your working hours and blocked time slots there.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">
                    View All FAQs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="knowledge-base">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>
                    Helpful articles, guides, and resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Search knowledge base..."
                        className="w-full rounded-md border border-input pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button variant="outline">
                      Browse Categories
                    </Button>
                  </div>
                  
                  <h3 className="font-medium mb-4">Popular Articles</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Getting Started with Video Interpretation</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        A beginner's guide to using our video interpretation platform.
                      </p>
                      <Button variant="link" className="p-0 h-auto">Read More</Button>
                    </div>
                    <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Payment and Billing FAQ</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Answers to common questions about payments, invoices, and billing.
                      </p>
                      <Button variant="link" className="p-0 h-auto">Read More</Button>
                    </div>
                    <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Troubleshooting Connection Issues</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Steps to resolve common connection problems during interpretation sessions.
                      </p>
                      <Button variant="link" className="p-0 h-auto">Read More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="live-help">
              <Card>
                <CardHeader>
                  <CardTitle>Live Support</CardTitle>
                  <CardDescription>
                    Connect with our support team in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6">
                  <Card className="md:w-1/2">
                    <CardHeader>
                      <CardTitle className="text-lg">Video Support</CardTitle>
                      <CardDescription>
                        Speak directly with a support agent through video
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        Available Monday-Friday, 9AM-5PM EST
                      </p>
                      <p className="text-sm mb-4">
                        Current wait time: ~5 minutes
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Start Video Call
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="md:w-1/2">
                    <CardHeader>
                      <CardTitle className="text-lg">Phone Support</CardTitle>
                      <CardDescription>
                        Get help from our support team over the phone
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        Available 24/7 for urgent issues
                      </p>
                      <p className="text-sm mb-4">
                        Current wait time: ~3 minutes
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Support
                      </Button>
                    </CardFooter>
                  </Card>
                </CardContent>
                
                <CardHeader className="pt-6">
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                  <CardDescription>
                    Chat with our support team in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md h-64 mb-4 overflow-auto p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          S
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm font-medium">Support Agent</p>
                          <p className="text-sm">Hello! How can I help you today?</p>
                          <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">I'm having trouble connecting to my scheduled interpretation session.</p>
                          <p className="text-xs text-muted-foreground mt-1">10:31 AM</p>
                        </div>
                        <div className="bg-background border rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          Y
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          S
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm font-medium">Support Agent</p>
                          <p className="text-sm">I'm sorry to hear that. Let me help you troubleshoot. Could you tell me what error message you're seeing?</p>
                          <p className="text-xs text-muted-foreground mt-1">10:32 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="flex-shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {role !== 'admin' && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Other ways to reach our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-muted-foreground">
                    support@interpreterapp.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Response within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">
                    +1 (800) 555-0123
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri, 9AM-5PM EST
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Live Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    Available 24/7 for urgent issues
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average response time: 5 minutes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Support;
