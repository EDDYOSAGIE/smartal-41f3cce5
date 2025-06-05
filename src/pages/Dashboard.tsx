
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Upload, ArrowLeft } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import FinancialCharts from "@/components/FinancialCharts";
import TransactionSummary from "@/components/TransactionSummary";

// Mock data for demonstration
const mockFinancialData = {
  totalInflow: 5420.50,
  totalOutflow: 3245.75,
  netFlow: 2174.75,
  categories: [
    { name: "Food & Dining", amount: 845.30, percentage: 26 },
    { name: "Transportation", amount: 420.15, percentage: 13 },
    { name: "Shopping", amount: 680.45, percentage: 21 },
    { name: "Bills & Utilities", amount: 920.85, percentage: 28 },
    { name: "Entertainment", amount: 379.00, percentage: 12 }
  ],
  monthlyTrends: [
    { month: "Jan", inflow: 4800, outflow: 3200 },
    { month: "Feb", inflow: 5200, outflow: 2950 },
    { month: "Mar", inflow: 5420, outflow: 3245 },
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    // Simulate file processing and AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasUploadedFile(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <Button onClick={() => setHasUploadedFile(false)} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasUploadedFile ? (
          <div className="flex items-center justify-center min-h-96">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Upload Your Bank Statement</CardTitle>
                <CardDescription>
                  Get started by uploading a CSV or PDF file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <TransactionSummary data={mockFinancialData} />
            
            {/* Charts Section */}
            <FinancialCharts data={mockFinancialData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
