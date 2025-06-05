
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onFileUpload: (file: File, analysisResults: any) => void;
  isAnalyzing: boolean;
}

const FileUpload = ({ onFileUpload, isAnalyzing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationStep, setValidationStep] = useState<'upload' | 'validating' | 'valid' | 'invalid'>('upload');
  const [validationMessage, setValidationMessage] = useState("");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const validateFile = async (file: File) => {
    setValidationStep('validating');
    
    try {
      const fileContent = await readFileContent(file);
      
      const { data, error } = await supabase.functions.invoke('validate-bank-statement', {
        body: {
          fileName: file.name,
          fileContent: fileContent.substring(0, 2000), // Send first 2000 chars
          fileType: file.type
        }
      });

      if (error) throw error;

      if (data.isValid) {
        setValidationStep('valid');
        setValidationMessage(data.explanation);
        toast({
          title: "Valid bank statement detected!",
          description: "File validated successfully. Ready for analysis.",
        });
      } else {
        setValidationStep('invalid');
        setValidationMessage(data.explanation);
        toast({
          title: "Invalid file type",
          description: "This doesn't appear to be a bank statement. Please upload a valid bank statement.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStep('invalid');
      setValidationMessage("Error validating file. Please try again.");
      toast({
        title: "Validation error",
        description: "Could not validate file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelection = (file: File) => {
    const allowedTypes = ['text/csv', 'application/pdf', '.csv'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (!allowedTypes.includes(file.type) && fileExtension !== 'csv') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or PDF file.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    validateFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || validationStep !== 'valid') return;

    try {
      const fileContent = await readFileContent(selectedFile);
      
      const { data, error } = await supabase.functions.invoke('analyze-transactions', {
        body: {
          transactionData: fileContent,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size
        }
      });

      if (error) throw error;

      onFileUpload(selectedFile, data);
      
      toast({
        title: "Analysis complete!",
        description: "Your financial data has been analyzed successfully."
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze your financial data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setValidationStep('upload');
    setValidationMessage("");
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-3">Analyzing your financial data...</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our AI is processing your transactions, categorizing expenses, and generating personalized insights. This usually takes 30-60 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={`border-2 border-dashed transition-all cursor-pointer ${
          dragActive 
            ? "border-blue-500 bg-blue-50" 
            : validationStep === 'valid'
            ? "border-green-500 bg-green-50"
            : validationStep === 'invalid'
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <CardContent className="py-12 px-8 text-center">
          {validationStep === 'validating' ? (
            <div>
              <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium text-blue-600">Validating bank statement...</p>
              <p className="text-sm text-gray-500 mt-2">
                AI is checking if this is a valid financial document
              </p>
            </div>
          ) : validationStep === 'valid' ? (
            <div>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-green-600">Valid bank statement detected!</p>
              <p className="text-sm text-gray-600 mt-2">{validationMessage}</p>
            </div>
          ) : validationStep === 'invalid' ? (
            <div>
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-red-600">Invalid file type</p>
              <p className="text-sm text-gray-600 mt-2">{validationMessage}</p>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Drop your bank statement here"}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400">
                  Supports CSV and PDF bank statements • AI validation included
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.pdf,text/csv,application/pdf"
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {selectedFile && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <FileText className={`h-8 w-8 ${
              validationStep === 'valid' ? 'text-green-600' :
              validationStep === 'invalid' ? 'text-red-600' : 'text-blue-600'
            }`} />
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {validationStep === 'valid' && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            {validationStep === 'invalid' && (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            )}
          </div>
          
          <div className="flex space-x-3">
            {validationStep === 'valid' ? (
              <Button 
                onClick={handleUpload}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Upload className="mr-2 h-4 w-4" />
                Analyze with AI
              </Button>
            ) : (
              <Button 
                onClick={resetUpload}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Choose Different File
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
