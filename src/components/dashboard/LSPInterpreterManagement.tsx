
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
import { AddInterpreterDialog } from './interpreter/AddInterpreterDialog';

interface Interpreter {
  id: string;
  name: string;
  languages: string[];
  specialties: string[];
  status: 'active' | 'pending' | 'inactive';
  lastActivity: string;
}

const mockInterpreters: Interpreter[] = [
  {
    id: '1',
    name: 'John Smith',
    languages: ['English', 'Spanish'],
    specialties: ['Medical', 'Legal'],
    status: 'active',
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    languages: ['Spanish', 'Portuguese'],
    specialties: ['Technical', 'Financial'],
    status: 'active',
    lastActivity: '1 day ago'
  },
  {
    id: '3',
    name: 'Alex Chen',
    languages: ['English', 'Mandarin', 'Cantonese'],
    specialties: ['Medical', 'Conference'],
    status: 'pending',
    lastActivity: 'Never'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    languages: ['English', 'French'],
    specialties: ['Legal', 'Immigration'],
    status: 'inactive',
    lastActivity: '3 months ago'
  }
];

const LSPInterpreterManagement = () => {
  const { role } = useUserRole();
  const [interpreters, setInterpreters] = useState<Interpreter[]>(mockInterpreters);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  const filteredInterpreters = filter === 'all' 
    ? interpreters 
    : interpreters.filter(interpreter => interpreter.status === filter);

  const handleStatusChange = (id: string, newStatus: 'active' | 'pending' | 'inactive') => {
    setInterpreters(interpreters.map(interpreter => 
      interpreter.id === id ? { ...interpreter, status: newStatus } : interpreter
    ));
  };

  const handleAddInterpreter = (newInterpreter: Interpreter) => {
    setInterpreters(prevInterpreters => [...prevInterpreters, newInterpreter]);
  };

  if (role !== 'lsp' && role !== 'admin') {
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
        <h1 className="text-2xl font-bold">Manage Interpreters</h1>
        <AddInterpreterDialog onInterpreterAdded={handleAddInterpreter} />
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
              <TableHead>Languages</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterpreters.map((interpreter) => (
              <TableRow key={interpreter.id}>
                <TableCell className="font-medium">{interpreter.name}</TableCell>
                <TableCell>{interpreter.languages.join(', ')}</TableCell>
                <TableCell>{interpreter.specialties.join(', ')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    interpreter.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : interpreter.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {interpreter.status.charAt(0).toUpperCase() + interpreter.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{interpreter.lastActivity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {interpreter.status !== 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleStatusChange(interpreter.id, 'active')}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span className="sr-only">Activate</span>
                      </Button>
                    )}
                    {interpreter.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleStatusChange(interpreter.id, 'inactive')}
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
                      <Link to={`/dashboard/interpreter/${interpreter.id}`}>
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

export default LSPInterpreterManagement;
