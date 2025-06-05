
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Upload, ArrowLeft, LogOut, User } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import FinancialCharts from "@/components/FinancialCharts";
import TransactionSummary from "@/components/TransactionSummary";
import FinancialChatbot from "@/components/FinancialChatbot";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [financialData, setFinancialData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Get user info
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleFileUpload = async (file: File, analysisResults: any) => {
    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasUploadedFile(true);
      setFinancialData(analysisResults);
    }, 2000);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!"
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Home</span>
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Financial Dashboard
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {hasUploadedFile && (
                  <Button 
                    onClick={() => setHasUploadedFile(false)} 
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New File
                  </Button>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{userEmail}</span>
                </div>
                
                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!hasUploadedFile ? (
            <div className="flex items-center justify-center min-h-96">
              <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-semibold">Upload Your Bank Statement</CardTitle>
                  <CardDescription className="text-base">
                    Get started by uploading a CSV or PDF bank statement for AI-powered analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
                </CardContent>
              </Card>
            </div>
          ) : financialData ? (
            <div className="space-y-8">
              {/* Summary Cards */}
              <TransactionSummary data={financialData} />
              
              {/* Charts Section */}
              <FinancialCharts data={financialData} />
              
              {/* AI Insights */}
              {financialData.insights && (
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>AI Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                        <ul className="space-y-2">
                          {financialData.insights.map((insight: string, index: number) => (
                            <li key={index} className="text-gray-700 flex items-start">
                              <span className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {financialData.recommendations && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {financialData.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-gray-700 flex items-start">
                                <span className="h-2 w-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Processing your financial data...</p>
            </div>
          )}
        </main>
        
        {/* AI Chatbot - Always available at bottom right */}
        <FinancialChatbot />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
