
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Shield, 
  Building2, 
  UserCheck, 
  UserCircle 
} from 'lucide-react';

const RoleSelector = () => {
  const { role, setRole } = useUserRole();

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">View Dashboard As:</span>
      </div>
      <Select value={role} onValueChange={(value) => setRole(value as any)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> 
              <span>Admin</span>
            </div>
          </SelectItem>
          <SelectItem value="lsp">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> 
              <span>LSP</span>
            </div>
          </SelectItem>
          <SelectItem value="freelancer">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> 
              <span>Freelancer</span>
            </div>
          </SelectItem>
          <SelectItem value="client">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" /> 
              <span>Client</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
