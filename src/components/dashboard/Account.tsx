
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Add Badge import
import { 
  User, 
  Mail, 
  Phone, 
  Languages, 
  Shield, 
  CreditCard,
  Image,
  Save,
  Globe,
  Building2,
  BookOpen,
  Briefcase,
  DollarSign,
  MapPin
} from 'lucide-react';
import { useState } from 'react';

const Account = () => {
  const { role } = useUserRole();
  const [profileImage, setProfileImage] = useState('/placeholder.svg');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          {(role === 'freelancer' || role === 'lsp') && (
            <TabsTrigger value="services" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Services
            </TabsTrigger>
          )}
          {role === 'admin' && (
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admin Controls
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and public details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border">
                    <img
                      src={profileImage}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-background/80 p-1 hover:bg-background/90"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                      <Input id="firstName" placeholder="John" defaultValue={role === 'client' ? 'John' : 'Maria'} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                      <Input id="lastName" placeholder="Doe" defaultValue={role === 'client' ? 'Smith' : 'Rodriguez'} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="john.doe@example.com" 
                        defaultValue={role === 'client' ? 'john.smith@example.com' : 'maria.rodriguez@example.com'} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  
                  {role === 'freelancer' && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="languages" className="text-sm font-medium">Languages</label>
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-muted-foreground" />
                          <Input id="languages" placeholder="English, Spanish, etc." defaultValue="English, Spanish" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="specializations" className="text-sm font-medium">Specializations</label>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <Input id="specializations" placeholder="Medical, Legal, etc." defaultValue="Medical, General" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="rate" className="text-sm font-medium">Hourly Rate ($)</label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input id="rate" type="number" placeholder="50" defaultValue="45" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {role === 'lsp' && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <Input id="companyName" placeholder="Company Name" defaultValue="Global Interpreters Inc." />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="website" className="text-sm font-medium">Website</label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Input id="website" placeholder="https://example.com" defaultValue="https://globalinterpreters.com" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Business Address</label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input id="address" placeholder="123 Main St, City, State, Zip" defaultValue="456 Business Ave, New York, NY 10001" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          {(role === 'freelancer' || role === 'lsp') && (
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  This information will be displayed publicly on your profile page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full p-2 border rounded-md resize-y"
                      placeholder="Write a brief description about yourself or your company..."
                      defaultValue={role === 'freelancer' 
                        ? "Professional interpreter with 5+ years of experience in medical and general interpretation. Fluent in English and Spanish."
                        : "Leading language service provider specializing in medical, legal, and technical interpretation services."}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Update your billing information and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {(role === 'freelancer' || role === 'lsp') && (
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services & Rates</CardTitle>
                <CardDescription>
                  Manage your services, availability, and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Service Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="videoRemote" className="rounded" defaultChecked />
                      <label htmlFor="videoRemote">Video Remote Interpretation</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="onSite" className="rounded" defaultChecked />
                      <label htmlFor="onSite">On-site Interpretation</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="telephonic" className="rounded" defaultChecked />
                      <label htmlFor="telephonic">Telephonic Interpretation</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="document" className="rounded" />
                      <label htmlFor="document">Document Translation</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="medical" className="rounded" defaultChecked />
                      <label htmlFor="medical">Medical</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="legal" className="rounded" />
                      <label htmlFor="legal">Legal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="business" className="rounded" defaultChecked />
                      <label htmlFor="business">Business</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="technical" className="rounded" />
                      <label htmlFor="technical">Technical</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="community" className="rounded" defaultChecked />
                      <label htmlFor="community">Community</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="conference" className="rounded" />
                      <label htmlFor="conference">Conference</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="videoRate" className="text-sm">Video Remote (hourly rate)</label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input id="videoRate" type="number" defaultValue="45" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="onsiteRate" className="text-sm">On-site (hourly rate)</label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input id="onsiteRate" type="number" defaultValue="60" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phoneRate" className="text-sm">Telephonic (per minute rate)</label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input id="phoneRate" type="number" defaultValue="0.75" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="documentRate" className="text-sm">Document Translation (per word rate)</label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input id="documentRate" type="number" defaultValue="0.12" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Update Services</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        
        {role === 'admin' && (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
                <CardDescription>
                  Platform administration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">User Management</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Button variant="outline" className="w-full justify-start">
                          Manage Users
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">System Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Button variant="outline" className="w-full justify-start">
                          Configure System
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Fee Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Button variant="outline" className="w-full justify-start">
                          Configure Fees
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">API Management</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Button variant="outline" className="w-full justify-start">
                          Manage API Keys
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Account;
