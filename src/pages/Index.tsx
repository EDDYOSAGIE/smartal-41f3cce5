
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Upload, TrendingUp, PieChart, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Insight Finance Buddy</h1>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upload your bank statement and get instant 
            <span className="text-blue-600"> AI-powered financial insights</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your financial data into actionable insights with our intelligent AI assistant. 
            Upload CSV or PDF bank statements and discover spending patterns, categorize transactions, and track your financial health.
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simply upload your bank statements in CSV or PDF format and let our AI do the rest.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PieChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered transaction categorization helps you understand where your money goes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Visual Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beautiful charts and graphs make it easy to understand your financial patterns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to transform your financial data?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who have already discovered the power of AI-driven financial insights.
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Upload Your First Statement
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
