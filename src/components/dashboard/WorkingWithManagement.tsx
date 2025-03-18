
import React from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Building2, User, Headphones, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Provider {
  id: string;
  name: string;
  type: 'lsp' | 'interpreter';
  languages: string[];
  services: string[];
  rating: number;
  lastSession: string;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Global Translations Inc.',
    type: 'lsp',
    languages: ['English', 'Spanish', 'French'],
    services: ['Medical', 'Legal', 'Technical'],
    rating: 4.8,
    lastSession: '2 days ago'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    type: 'interpreter',
    languages: ['Spanish', 'English'],
    services: ['Medical', 'Conference'],
    rating: 4.9,
    lastSession: '5 days ago'
  },
  {
    id: '3',
    name: 'Language Connect LLC',
    type: 'lsp',
    languages: ['English', 'Arabic', 'French', 'German'],
    services: ['Legal', 'Technical', 'Business'],
    rating: 4.5,
    lastSession: '2 weeks ago'
  },
  {
    id: '4',
    name: 'David Chen',
    type: 'interpreter',
    languages: ['Mandarin', 'English'],
    services: ['Business', 'Technical'],
    rating: 4.7,
    lastSession: '1 month ago'
  }
];

const WorkingWithManagement = () => {
  const { role } = useUserRole();

  if (role !== 'client') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Interpreters & LSPs</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Last Session</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProviders.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {provider.type === 'lsp' ? (
                      <Building2 className="h-4 w-4 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 text-green-500" />
                    )}
                    <span className="capitalize">{provider.type}</span>
                  </div>
                </TableCell>
                <TableCell>{provider.languages.join(', ')}</TableCell>
                <TableCell>{provider.services.join(', ')}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{provider.rating}</span>
                    <span className="ml-1 text-yellow-500">★</span>
                  </div>
                </TableCell>
                <TableCell>{provider.lastSession}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                      <Link to={`/dashboard/book/${provider.type}/${provider.id}`}>
                        <Headphones className="h-4 w-4" />
                        <span className="sr-only">Book Session</span>
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                      <Link to={`/dashboard/${provider.type}/${provider.id}`}>
                        <LinkIcon className="h-4 w-4" />
                        <span className="sr-only">View Profile</span>
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

export default WorkingWithManagement;
