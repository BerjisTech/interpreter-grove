
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
import { Eye, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

const Vetting = () => {
  const { role } = useUserRole();
  
  // Only admin and lsp should see this page
  if (role === 'client' || role === 'freelancer') {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground">
          Only administrators and LSPs have access to the vetting management page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {role === 'admin' ? 'Interpreter Vetting' : 'Interpreter Verification'}
        </h1>
        {role === 'lsp' && (
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Invite Interpreter
          </Button>
        )}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>
                {role === 'admin' 
                  ? 'Interpreters waiting for platform verification' 
                  : 'Your interpreters waiting for verification'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#I-5421</TableCell>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>English, Spanish</TableCell>
                    <TableCell>Medical, Legal</TableCell>
                    <TableCell>May 25, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500">Pending Review</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#I-5422</TableCell>
                    <TableCell>Carlos Rodriguez</TableCell>
                    <TableCell>Spanish, Portuguese</TableCell>
                    <TableCell>Business, Technical</TableCell>
                    <TableCell>May 24, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500">Document Check</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Interpreters</CardTitle>
              <CardDescription>
                Interpreters who have been verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Verified On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#I-5410</TableCell>
                    <TableCell>Maria Rodriguez</TableCell>
                    <TableCell>English, Spanish</TableCell>
                    <TableCell>Medical, General</TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Verified</Badge>
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
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                Interpreters whose applications were rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Rejected On</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#I-5405</TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>English, French</TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>Insufficient credentials</TableCell>
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

export default Vetting;
