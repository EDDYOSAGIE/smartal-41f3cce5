
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface TransactionSummaryProps {
  data: {
    totalInflow: number;
    totalOutflow: number;
    netFlow: number;
    categories: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
  };
}

const TransactionSummary = ({ data }: TransactionSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inflow</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.totalInflow)}
          </div>
          <p className="text-xs text-muted-foreground">
            Money coming in
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outflow</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(data.totalOutflow)}
          </div>
          <p className="text-xs text-muted-foreground">
            Money going out
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
          <DollarSign className={`h-4 w-4 ${data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.netFlow)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.netFlow >= 0 ? 'Positive balance' : 'Negative balance'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummary;
