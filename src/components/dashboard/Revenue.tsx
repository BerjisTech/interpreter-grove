
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const Revenue = () => {
  const { role } = useUserRole();
  
  // Only admin, lsp, and freelancer should see this page
  if (role === 'client') {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground">
          Clients don't have access to the revenue management page.
        </p>
      </div>
    );
  }

  const pageTitle = role === 'admin' 
    ? 'Platform Revenue' 
    : role === 'lsp' 
      ? 'LSP Revenue' 
      : 'Earnings Management';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Wallet className="mr-2 h-4 w-4" />
            {role === 'admin' ? 'Adjust Fees' : 'Withdraw Funds'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total {role === 'admin' ? 'Revenue' : 'Earnings'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '$256,384.54' : role === 'lsp' ? '$42,567.89' : '$8,245.60'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +12.5%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending {role === 'admin' ? 'Payouts' : 'Earnings'}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '$32,450.00' : role === 'lsp' ? '$5,230.45' : '$1,245.30'}
            </div>
            <p className="text-xs text-muted-foreground">
              To be released in 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Platform Fees' : 'Fees Paid'}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '$38,457.68' : role === 'lsp' ? '$4,256.79' : '$824.56'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={role === 'admin' ? 'text-green-500 flex items-center' : 'text-red-500 flex items-center'}>
                {role === 'admin' ? (
                  <><ArrowUpRight className="mr-1 h-3 w-3" />+8.2%</>
                ) : (
                  <><ArrowDownRight className="mr-1 h-3 w-3" />-2.5%</>
                )}
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'admin' ? 'Active Subscriptions' : 'Monthly Growth'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'admin' ? '1,245' : role === 'lsp' ? '+18.3%' : '+7.5%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === 'admin' ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />+32 new
                </span>
              ) : (
                'Compared to previous month'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          {role === 'admin' && <TabsTrigger value="reports">Reports</TabsTrigger>}
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                {role === 'admin' 
                  ? 'Recent platform transactions' 
                  : 'Your most recent transactions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#TX-9872</TableCell>
                    <TableCell>May 26, 2023</TableCell>
                    <TableCell>
                      {role === 'admin' 
                        ? 'Platform fee from job #9872' 
                        : 'Payment for interpretation job #9872'}
                    </TableCell>
                    <TableCell className="text-green-600">
                      +${role === 'admin' ? '15.00' : role === 'lsp' ? '85.00' : '70.00'}
                    </TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#TX-9865</TableCell>
                    <TableCell>May 24, 2023</TableCell>
                    <TableCell>
                      {role === 'admin' 
                        ? 'Platform fee from job #9865' 
                        : 'Payment for interpretation job #9865'}
                    </TableCell>
                    <TableCell className="text-green-600">
                      +${role === 'admin' ? '12.50' : role === 'lsp' ? '75.00' : '62.50'}
                    </TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                  {role !== 'admin' && (
                    <TableRow>
                      <TableCell>#TX-OUT-452</TableCell>
                      <TableCell>May 20, 2023</TableCell>
                      <TableCell>Withdrawal to bank account</TableCell>
                      <TableCell className="text-red-600">
                        -${role === 'lsp' ? '500.00' : '250.00'}
                      </TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                {role === 'admin' 
                  ? 'Platform invoices' 
                  : 'Your invoices for completed jobs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#INV-2023-123</TableCell>
                    <TableCell>May 31, 2023</TableCell>
                    <TableCell>
                      {role === 'admin' 
                        ? 'Monthly service invoice to Global Interpreters' 
                        : 'May 2023 Services'}
                    </TableCell>
                    <TableCell>
                      ${role === 'admin' ? '1,245.00' : role === 'lsp' ? '875.00' : '450.00'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payouts</CardTitle>
              <CardDescription>
                {role === 'admin' 
                  ? 'Recent payouts to interpreters and LSPs' 
                  : 'Your payout history'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#PO-4582</TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell>
                      ${role === 'admin' ? '18,540.00' : role === 'lsp' ? '500.00' : '250.00'}
                    </TableCell>
                    <TableCell>Bank Transfer</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {role === 'admin' && (
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                  Platform financial reports and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This section would contain detailed financial reports and analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Revenue;
