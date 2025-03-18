
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  User, 
  Award, 
  Headphones,
  Building2,
  BadgeCheck,
  LucideIcon,
  List,
  Link as LinkIcon
} from 'lucide-react';
import RoleSelector from './RoleSelector';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
  roles: Array<'admin' | 'lsp' | 'freelancer' | 'client'>;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role } = useUserRole();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard', 
      roles: ['admin', 'lsp', 'freelancer', 'client'] 
    },
    { 
      title: 'Jobs', 
      icon: Briefcase, 
      href: '/dashboard/jobs', 
      roles: ['admin', 'lsp', 'freelancer', 'client'] 
    },
    { 
      title: 'Revenue', 
      icon: DollarSign, 
      href: '/dashboard/revenue', 
      roles: ['admin', 'lsp', 'freelancer'] 
    },
    { 
      title: 'Complaints', 
      icon: MessageSquare, 
      href: '/dashboard/complaints', 
      roles: ['admin', 'lsp', 'client'] 
    },
    { 
      title: 'Vetting', 
      icon: ShieldCheck, 
      href: '/dashboard/vetting', 
      roles: ['admin', 'lsp'] 
    },
    { 
      title: 'Membership', 
      icon: Users, 
      href: '/dashboard/membership', 
      roles: ['admin', 'lsp', 'freelancer', 'client'] 
    },
    { 
      title: 'Account', 
      icon: User, 
      href: '/dashboard/account', 
      roles: ['admin', 'lsp', 'freelancer', 'client'] 
    },
    { 
      title: 'Certifications', 
      icon: Award, 
      href: '/dashboard/certifications', 
      roles: ['admin', 'lsp', 'freelancer'] 
    },
    { 
      title: 'Support', 
      icon: Headphones, 
      href: '/dashboard/support', 
      roles: ['admin', 'lsp', 'freelancer', 'client'] 
    },
    // New management items
    { 
      title: 'Manage Interpreters', 
      icon: Users, 
      href: '/dashboard/interpreters', 
      roles: ['admin', 'lsp'] 
    },
    { 
      title: 'Manage Clients', 
      icon: List, 
      href: '/dashboard/clients', 
      roles: ['admin', 'lsp', 'freelancer'] 
    },
    { 
      title: 'My Providers', 
      icon: LinkIcon, 
      href: '/dashboard/working-with', 
      roles: ['client'] 
    },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    // For the Dashboard home path specifically
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    // For other paths, check if the current path starts with the nav item path
    // This handles nested routes like /dashboard/jobs/123
    return path !== '/dashboard' && location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold">Interpreter Hub</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        className={isActive(item.href) ? "bg-primary/10 text-primary font-medium" : ""}
                        isActive={isActive(item.href)}
                      >
                        <Link to={item.href}>
                          <item.icon className={isActive(item.href) ? "text-primary" : ""} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {role === 'admin' && (
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        tooltip="LSP Management"
                        className={isActive('/dashboard/lsp-management') ? "bg-primary/10 text-primary font-medium" : ""}
                        isActive={isActive('/dashboard/lsp-management')}
                      >
                        <Link to="/dashboard/lsp-management">
                          <Building2 className={isActive('/dashboard/lsp-management') ? "text-primary" : ""} />
                          <span>LSP Management</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        tooltip="Verification"
                        className={isActive('/dashboard/verification') ? "bg-primary/10 text-primary font-medium" : ""}
                        isActive={isActive('/dashboard/verification')}
                      >
                        <Link to="/dashboard/verification">
                          <BadgeCheck className={isActive('/dashboard/verification') ? "text-primary" : ""} />
                          <span>Verification</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          <SidebarFooter>
            <RoleSelector />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
