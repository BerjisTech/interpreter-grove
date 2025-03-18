
import { useMockUser } from "@/hooks/useMockUser";
import { Button } from "@/components/ui/button";
import { UserIcon, Users, LogOut } from "lucide-react";

const MockUserPanel = () => {
  const { isMockUser, mockUserType, clearMockUser } = useMockUser();

  const loginAsMaria = () => {
    window.location.href = `${window.location.pathname}?mock_user=maria`;
  };

  const loginAsClient = () => {
    window.location.href = `${window.location.pathname}?mock_user=client`;
  };

  // If already logged in as mock user, show info and logout button
  if (isMockUser) {
    return (
      <div className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-border z-50 flex flex-col gap-2">
        <div className="text-sm font-medium text-center">
          {mockUserType === 'interpreter' ? 'Logged in as Maria' : 'Logged in as Client'}
        </div>
        <Button size="sm" variant="outline" onClick={clearMockUser}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-border z-50 flex flex-col gap-2">
      <div className="text-xs font-medium text-center mb-1">Mock Users (Testing)</div>
      <Button size="sm" variant="secondary" onClick={loginAsMaria}>
        <UserIcon className="h-3.5 w-3.5 mr-1.5" />
        Login as Maria
      </Button>
      <Button size="sm" variant="outline" onClick={loginAsClient}>
        <Users className="h-3.5 w-3.5 mr-1.5" />
        Login as Client
      </Button>
    </div>
  );
};

export default MockUserPanel;
