
import { useUserRole } from '@/contexts/UserRoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star, 
  MessageSquare, 
  TrendingUp,
  BadgeCheck,
  Users,
  User,
  Award,
  Languages,
  Building2
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  const { role } = useUserRole();

  const getWelcomeMessage = () => {
    switch(role) {
      case 'admin': return 'Welcome to the Admin Dashboard';
      case 'lsp': return 'Welcome to your LSP Dashboard';
      case 'freelancer': return 'Welcome to your Interpreter Dashboard';
      case 'client': return 'Welcome to your Client Dashboard';
      default: return 'Welcome to your Dashboard';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{getWelcomeMessage()}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {role === 'admin' && (
          <>
            <StatCard 
              title="Total Users" 
              value="12,345" 
              description="+2.5% from last month" 
              icon={<Users className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Active Interpreters" 
              value="1,234" 
              description="+5.2% from last month" 
              icon={<Languages className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="LSPs" 
              value="56" 
              description="+1 new this month" 
              icon={<User className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Revenue" 
              value="$256,384" 
              description="+12.3% from last month" 
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
            />
          </>
        )}
        
        {(role === 'lsp' || role === 'freelancer') && (
          <>
            <StatCard 
              title="Active Jobs" 
              value={role === 'lsp' ? "48" : "5"} 
              description="Across all interpreters" 
              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Completed Jobs" 
              value={role === 'lsp' ? "254" : "42"} 
              description="Last 30 days" 
              icon={<Clock className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Total Earnings" 
              value={role === 'lsp' ? "$12,384" : "$4,280"} 
              description="Last 30 days" 
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Rating" 
              value={role === 'lsp' ? "4.8" : "4.9"} 
              description="Based on client reviews" 
              icon={<Star className="h-4 w-4 text-muted-foreground" />} 
            />
          </>
        )}
        
        {role === 'client' && (
          <>
            <StatCard 
              title="Active Jobs" 
              value="3" 
              description="Currently in progress" 
              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Completed Jobs" 
              value="12" 
              description="Last 30 days" 
              icon={<Clock className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Spent" 
              value="$1,250" 
              description="Last 30 days" 
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
            />
            <StatCard 
              title="Top Interpreters" 
              value="5" 
              description="In your favorites" 
              icon={<Star className="h-4 w-4 text-muted-foreground" />} 
            />
          </>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {role === 'admin' && (
                    <>
                      <div className="flex items-center">
                        <BadgeCheck className="mr-2 h-5 w-5 text-primary" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">New interpreter verification request</p>
                          <p className="text-sm text-muted-foreground">Sarah Johnson submitted credentials for review</p>
                        </div>
                        <div className="ml-auto font-medium">Just now</div>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-orange-500" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">New complaint submitted</p>
                          <p className="text-sm text-muted-foreground">Regarding job #8753 - interpreter was late</p>
                        </div>
                        <div className="ml-auto font-medium">2h ago</div>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-5 w-5 text-primary" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">New LSP registration</p>
                          <p className="text-sm text-muted-foreground">Global Interpreters Inc. created an account</p>
                        </div>
                        <div className="ml-auto font-medium">5h ago</div>
                      </div>
                    </>
                  )}
                  
                  {(role === 'lsp' || role === 'freelancer') && (
                    <>
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-primary" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">New job request</p>
                          <p className="text-sm text-muted-foreground">Spanish interpretation for medical appointment</p>
                        </div>
                        <div className="ml-auto font-medium">Just now</div>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">New 5-star review</p>
                          <p className="text-sm text-muted-foreground">Client was very satisfied with your service</p>
                        </div>
                        <div className="ml-auto font-medium">3h ago</div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Payment received</p>
                          <p className="text-sm text-muted-foreground">$120 for job #4532</p>
                        </div>
                        <div className="ml-auto font-medium">Yesterday</div>
                      </div>
                    </>
                  )}
                  
                  {role === 'client' && (
                    <>
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-primary" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Job confirmed</p>
                          <p className="text-sm text-muted-foreground">Maria Garcia will be your interpreter tomorrow</p>
                        </div>
                        <div className="ml-auto font-medium">1h ago</div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-amber-500" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Upcoming appointment</p>
                          <p className="text-sm text-muted-foreground">Legal consultation with interpreter tomorrow at 2PM</p>
                        </div>
                        <div className="ml-auto font-medium">4h ago</div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-red-500" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Payment processed</p>
                          <p className="text-sm text-muted-foreground">$85 for job #6721</p>
                        </div>
                        <div className="ml-auto font-medium">Yesterday</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                {role === 'admin' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Unresolved Complaints</p>
                        <p className="text-sm text-muted-foreground">14 complaints need attention</p>
                      </div>
                      <div className="font-medium text-red-500">14</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Pending Verifications</p>
                        <p className="text-sm text-muted-foreground">8 interpreters waiting for verification</p>
                      </div>
                      <div className="font-medium text-amber-500">8</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Active Interpreters</p>
                        <p className="text-sm text-muted-foreground">89% of interpreters active this week</p>
                      </div>
                      <div className="font-medium text-green-500">89%</div>
                    </div>
                  </div>
                )}
                
                {(role === 'lsp' || role === 'freelancer') && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Job Acceptance Rate</p>
                        <p className="text-sm text-muted-foreground">You've accepted 92% of offered jobs</p>
                      </div>
                      <div className="font-medium text-green-500">92%</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Average Rating</p>
                        <p className="text-sm text-muted-foreground">Based on your last 20 jobs</p>
                      </div>
                      <div className="font-medium text-green-500">4.9/5</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Certification Status</p>
                        <p className="text-sm text-muted-foreground">All certifications up to date</p>
                      </div>
                      <div className="font-medium text-green-500">✓</div>
                    </div>
                  </div>
                )}
                
                {role === 'client' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Completed Jobs</p>
                        <p className="text-sm text-muted-foreground">Total jobs completed this year</p>
                      </div>
                      <div className="font-medium">32</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Your Rating</p>
                        <p className="text-sm text-muted-foreground">How interpreters rate working with you</p>
                      </div>
                      <div className="font-medium text-green-500">4.8/5</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Membership Status</p>
                        <p className="text-sm text-muted-foreground">Premium membership active</p>
                      </div>
                      <div className="font-medium text-primary">Premium</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This tab would display more detailed analytics data based on user role.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This tab would display reports and allow report generation based on user role.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This tab would display and manage user notifications based on role.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardHome;
