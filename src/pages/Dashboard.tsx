
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHome from '@/components/dashboard/DashboardHome';
import Jobs from '@/components/dashboard/Jobs';
import Revenue from '@/components/dashboard/Revenue';
import Complaints from '@/components/dashboard/Complaints';
import Vetting from '@/components/dashboard/Vetting';
import Membership from '@/components/dashboard/Membership';
import Account from '@/components/dashboard/Account';
import Certifications from '@/components/dashboard/Certifications';
import Support from '@/components/dashboard/Support';
import LSPInterpreterManagement from '@/components/dashboard/LSPInterpreterManagement';
import ClientManagement from '@/components/dashboard/ClientManagement';
import WorkingWithManagement from '@/components/dashboard/WorkingWithManagement';
import CourseManagement from '@/components/dashboard/CourseManagement';
import ConsultancyManagement from '@/components/dashboard/ConsultancyManagement';

const Dashboard = () => {
  return (
    <UserRoleProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/jobs/*" element={<Jobs />} />
          <Route path="/revenue/*" element={<Revenue />} />
          <Route path="/complaints/*" element={<Complaints />} />
          <Route path="/vetting/*" element={<Vetting />} />
          <Route path="/membership/*" element={<Membership />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/certifications/*" element={<Certifications />} />
          <Route path="/support/*" element={<Support />} />
          <Route path="/lsp-management/*" element={<DashboardHome />} /> {/* Placeholder */}
          <Route path="/verification/*" element={<DashboardHome />} /> {/* Placeholder */}
          <Route path="/interpreters/*" element={<LSPInterpreterManagement />} />
          <Route path="/clients/*" element={<ClientManagement />} />
          <Route path="/working-with/*" element={<WorkingWithManagement />} />
          <Route path="/courses/*" element={<CourseManagement />} />
          <Route path="/consultancy/*" element={<ConsultancyManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </UserRoleProvider>
  );
};

export default Dashboard;
