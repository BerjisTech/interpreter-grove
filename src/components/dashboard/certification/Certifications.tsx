import { useUserRole } from '@/contexts/UserRoleContext';
import { AddCertificationTypeDialog } from './AddCertificationTypeDialog';
import { AddRequirementDialog } from './AddRequirementDialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  Eye, 
  Download 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export function Certifications() {
  const { role } = useUserRole();
  
  const handleCertificationAdded = (certification: any) => {
    // Here you would typically update your certifications list
    console.log('New certification added:', certification);
  };

  const handleRequirementAdded = (requirement: any) => {
    // Here you would typically update your requirements list
    console.log('New requirement added:', requirement);
  };

  // Only admin, lsp, and freelancer should see this page
  if (role === 'client') {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground">
          Clients don't have access to the certifications management page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {role === 'admin' 
            ? 'Certification Management' 
            : role === 'lsp' 
              ? 'Interpreter Certifications' 
              : 'My Certifications'}
        </h1>
        {role !== 'admin' && (
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Certification
          </Button>
        )}
      </div>

      {(role === 'freelancer' || role === 'lsp') && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> 
              Certification Status
            </CardTitle>
            <CardDescription>
              Summary of your certification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Valid</Badge>
                  <h3 className="font-medium">Your certifications are up to date</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {role === 'freelancer' 
                    ? 'All required certifications for your specialization are current.' 
                    : 'Most of your interpreters have valid certifications.'}
                </p>
              </div>
              {role === 'lsp' && (
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">18</div>
                    <div className="text-xs text-muted-foreground">Valid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600">3</div>
                    <div className="text-xs text-muted-foreground">Expiring Soon</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">1</div>
                    <div className="text-xs text-muted-foreground">Expired</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {role === 'admin' 
              ? 'Platform Certifications' 
              : role === 'lsp' 
                ? 'Interpreter Certifications' 
                : 'My Certifications'}
          </CardTitle>
          <CardDescription>
            {role === 'admin' 
              ? 'Manage certification types and requirements' 
              : role === 'lsp' 
                ? 'Manage your interpreters\' certifications' 
                : 'Manage your professional certifications'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certification</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issuing Authority</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {role === 'freelancer' ? (
                <>
                  <TableRow>
                    <TableCell>Medical Interpreter Certification</TableCell>
                    <TableCell>Medical</TableCell>
                    <TableCell>National Board of Certification for Medical Interpreters</TableCell>
                    <TableCell>Jan 15, 2022</TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Valid</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Spanish-English Translation Certificate</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>American Translators Association</TableCell>
                    <TableCell>Mar 10, 2021</TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500">Expiring Soon</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ) : role === 'lsp' ? (
                <>
                  <TableRow>
                    <TableCell>Maria Rodriguez - Medical Interpreter Certification</TableCell>
                    <TableCell>Medical</TableCell>
                    <TableCell>National Board</TableCell>
                    <TableCell>Jan 15, 2022</TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Valid</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carlos Lopez - Legal Interpreter Certification</TableCell>
                    <TableCell>Legal</TableCell>
                    <TableCell>Federal Court</TableCell>
                    <TableCell>Jun 5, 2022</TableCell>
                    <TableCell>Jun 5, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500">Expired</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  <TableRow>
                    <TableCell>Medical Interpreter Certification</TableCell>
                    <TableCell>Professional</TableCell>
                    <TableCell>National Board</TableCell>
                    <TableCell>Various</TableCell>
                    <TableCell>Various</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Legal Interpreter Certification</TableCell>
                    <TableCell>Professional</TableCell>
                    <TableCell>Court Administration</TableCell>
                    <TableCell>Various</TableCell>
                    <TableCell>Various</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {role === 'admin' && (
          <CardFooter className="flex justify-end">
            <AddCertificationTypeDialog onCertificationAdded={handleCertificationAdded} />
          </CardFooter>
        )}
      </Card>

      {role === 'admin' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Certification Requirements</CardTitle>
            <CardDescription>
              Configure certification requirements for different interpreter types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Required Certification</TableHead>
                  <TableHead>Issuing Authority</TableHead>
                  <TableHead>Required For</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Medical</TableCell>
                  <TableCell>Medical Interpreter Certification</TableCell>
                  <TableCell>National Board of Certification for Medical Interpreters</TableCell>
                  <TableCell>All medical interpreters</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Legal</TableCell>
                  <TableCell>Legal Interpreter Certification</TableCell>
                  <TableCell>Federal Court Interpreter Certification</TableCell>
                  <TableCell>All legal interpreters</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <AddRequirementDialog onRequirementAdded={handleRequirementAdded} />
          </CardFooter>
        </Card>
      )}

      {role === 'freelancer' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
            <CardDescription>
              Certifications that will need to be renewed soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start p-4 border rounded-md">
                <div className="mr-4 mt-1">
                  <Calendar className="h-8 w-8 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Spanish-English Translation Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    Expires on Mar 10, 2024 (in 90 days)
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      Renewal process takes approximately 30 days. You can start the renewal process now.
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">Start Renewal</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(role === 'freelancer' || role === 'lsp') && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Certifications</CardTitle>
            <CardDescription>
              Certifications you can pursue to enhance your professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Legal Interpreter Certification</h3>
                </div>
                <p className="text-sm mb-4">
                  Become certified for legal interpretation in courtrooms and legal settings.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Estimated completion: 3-6 months</span>
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Healthcare Interpreter Certification</h3>
                </div>
                <p className="text-sm mb-4">
                  Specialized certification for medical and healthcare interpretation.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Estimated completion: 2-4 months</span>
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {role === 'admin' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Certification Requirements</CardTitle>
            <CardDescription>
              Configure certification requirements for different interpreter types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Required Certification</TableHead>
                  <TableHead>Issuing Authority</TableHead>
                  <TableHead>Required For</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Medical</TableCell>
                  <TableCell>Medical Interpreter Certification</TableCell>
                  <TableCell>National Board of Certification for Medical Interpreters</TableCell>
                  <TableCell>All medical interpreters</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Legal</TableCell>
                  <TableCell>Legal Interpreter Certification</TableCell>
                  <TableCell>Federal Court Interpreter Certification</TableCell>
                  <TableCell>All legal interpreters</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

