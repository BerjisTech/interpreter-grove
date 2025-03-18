import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  UserCheck, 
  UserMinus,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddClientDialog } from './client/AddClientDialog';

interface Client {
  id: string;
  name: string;
  organization: string;
  services: string[];
  status: 'active' | 'pending' | 'inactive';
  lastService: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    organization: 'Healthcare',
    services: ['Medical Interpretation', 'Document Translation'],
    status: 'active',
    lastService: '1 day ago'
  },
  {
    id: '2',
    name: 'Global Industries',
    organization: 'Manufacturing',
    services: ['Technical Documentation', 'Conference Interpretation'],
    status: 'active',
    lastService: '1 week ago'
  },
  {
    id: '3',
    name: 'Legal Solutions Inc',
    organization: 'Legal',
    services: ['Legal Interpretation', 'Certified Document Translation'],
    status: 'pending',
    lastService: 'Never'
  },
  {
    id: '4',
    name: 'Educational Services',
    organization: 'Education',
    services: ['Academic Translation', 'Educational Interpretation'],
    status: 'inactive',
    lastService: '2 months ago'
  }
];

const ClientManagement = () => {
  const { role } = useUserRole();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  const filteredClients = filter === 'all' 
    ? clients 
    : clients.filter(client => client.status === filter);

  const handleStatusChange = (id: string, newStatus: 'active' | 'pending' | 'inactive') => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, status: newStatus } : client
    ));
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
  };

  if (role !== 'lsp' && role !== 'admin' && role !== 'freelancer') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Clients</h1>
        <AddClientDialog onClientAdded={handleAddClient} />
      </div>

      <div className="flex gap-2 mb-4">
        <Button 
          variant={filter === 'all' ? "default" : "outline"} 
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'active' ? "default" : "outline"} 
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={filter === 'pending' ? "default" : "outline"} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'inactive' ? "default" : "outline"} 
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.organization}</TableCell>
                <TableCell>{client.services.join(', ')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : client.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{client.lastService}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {client.status !== 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleStatusChange(client.id, 'active')}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span className="sr-only">Activate</span>
                      </Button>
                    )}
                    {client.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleStatusChange(client.id, 'inactive')}
                      >
                        <UserMinus className="h-4 w-4" />
                        <span className="sr-only">Deactivate</span>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0" 
                      asChild
                    >
                      <Link to={`/dashboard/client/${client.id}`}>
                        <LinkIcon className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientManagement;
