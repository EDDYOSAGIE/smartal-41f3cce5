
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Upload, TrendingUp, PieChart, BarChart3, Shield, Zap, Brain, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/80 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Insight Finance Buddy
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Financial Intelligence
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Upload your bank statement and get instant 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              AI-powered financial insights
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your financial data into actionable insights with our intelligent AI assistant. 
            Upload CSV or PDF bank statements and discover spending patterns, categorize transactions, and track your financial health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg h-auto border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Smart Upload & Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                AI-powered validation ensures you're uploading genuine bank statements. Supports CSV and PDF formats with intelligent data extraction.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">AI-Powered Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                Advanced machine learning automatically categorizes your transactions with 95%+ accuracy, understanding context and merchant details.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Interactive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                Beautiful visualizations and personalized AI advisor provide actionable insights to optimize your spending and improve financial health.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="flex flex-col items-center">
            <Shield className="h-12 w-12 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
            <p className="text-gray-600 text-sm">256-bit encryption protects your financial data</p>
          </div>
          <div className="flex flex-col items-center">
            <PieChart className="h-12 w-12 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">95%+ Accuracy</h3>
            <p className="text-gray-600 text-sm">AI categorization with human-level precision</p>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="h-12 w-12 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-gray-600 text-sm">Get insights in seconds, not hours</p>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your financial data?
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Join thousands of users who have already discovered the power of AI-driven financial insights. 
              Get started in minutes with your first bank statement analysis.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="mr-2 h-5 w-5" />
              Start Your Financial Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;
