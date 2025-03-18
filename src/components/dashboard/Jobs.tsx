
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

const Jobs = () => {
  const { role } = useUserRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
        <Button>
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
                  <TableRow>
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
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
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
    </div>
  );
};

export default Jobs;
