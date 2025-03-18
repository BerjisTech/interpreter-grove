
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, MessageSquare } from 'lucide-react';

const Complaints = () => {
  const { role } = useUserRole();
  
  // Only admin, lsp, and client should see this page
  if (role === 'freelancer') {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground">
          Individual interpreters don't have access to the complaints management page.
        </p>
      </div>
    );
  }

  const pageTitle = role === 'admin' 
    ? 'Complaints Management' 
    : role === 'lsp' 
      ? 'Complaints Against Interpreters' 
      : 'My Filed Complaints';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        {role === 'client' && (
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            File New Complaint
          </Button>
        )}
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Complaints</CardTitle>
              <CardDescription>
                {role === 'admin' 
                  ? 'Complaints requiring attention' 
                  : role === 'lsp'
                    ? 'Complaints against your interpreters'
                    : 'Your active complaints'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Filed By/Against</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#C-2354</TableCell>
                    <TableCell>May 25, 2023</TableCell>
                    <TableCell>#9865</TableCell>
                    <TableCell>Interpreter was late</TableCell>
                    <TableCell>
                      {role === 'client' ? 'Against: Maria Rodriguez' : 'By: John Smith'}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500">Under Review</Badge>
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
        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Complaints</CardTitle>
              <CardDescription>
                Complaints that have been resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Filed By/Against</TableHead>
                    <TableHead>Resolved On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#C-2345</TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell>#9855</TableCell>
                    <TableCell>Poor audio quality</TableCell>
                    <TableCell>
                      {role === 'client' ? 'Against: Ahmed Hassan' : 'By: Emily Clark'}
                    </TableCell>
                    <TableCell>May 22, 2023</TableCell>
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
        <TabsContent value="dismissed">
          <Card>
            <CardHeader>
              <CardTitle>Dismissed Complaints</CardTitle>
              <CardDescription>
                Complaints that were dismissed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Filed By/Against</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#C-2340</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>#9830</TableCell>
                    <TableCell>Inaccurate translation</TableCell>
                    <TableCell>
                      {role === 'client' ? 'Against: Wei Zhang' : 'By: Sarah Johnson'}
                    </TableCell>
                    <TableCell>No evidence found</TableCell>
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

export default Complaints;
