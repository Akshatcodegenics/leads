'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface ImportResult {
  success: boolean;
  imported?: number;
  errors?: number;
  validationErrors?: Array<{ row: number; errors: string }>;
  details?: {
    results: Array<{ row: number; buyer: any }>;
    errors: Array<{ row: number; error: string }>;
  };
}

export function ImportBuyersForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        validationErrors: [{ row: 0, errors: 'Failed to upload file' }]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Full Name,Email,Phone,City,Property Type,BHK,Purpose,Budget Min,Budget Max,Timeline,Source,Status,Notes,Tags
John Doe,john@example.com,9876543210,Chandigarh,Apartment,2,Buy,5000000,7000000,0-3m,Website,New,"Looking for 2BHK in Sector 22","urgent,first-time-buyer"
Jane Smith,jane@example.com,9876543211,Mohali,Villa,3,Rent,25000,35000,3-6m,Referral,Qualified,"Prefers gated community","family,pets"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyers-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link href="/buyers" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to buyers list
        </Link>
      </div>

      {/* Instructions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Instructions</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Upload a CSV file with buyer lead information</p>
          <p>• Maximum 200 rows per import</p>
          <p>• Required fields: Full Name, Phone, City, Property Type, Purpose, Timeline, Source</p>
          <p>• BHK is required for Apartment and Villa property types</p>
          <p>• Budget Max must be greater than or equal to Budget Min if both are provided</p>
          <p>• Tags should be comma-separated within the cell</p>
        </div>
        <div className="mt-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isUploading}
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || isUploading}
              className="btn btn-primary"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Buyers
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
          
          {result.success ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Import completed successfully!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Imported:</span>
                  <span className="ml-2 font-medium text-green-600">{result.imported} buyers</span>
                </div>
                {result.errors! > 0 && (
                  <div>
                    <span className="text-gray-500">Errors:</span>
                    <span className="ml-2 font-medium text-red-600">{result.errors} rows</span>
                  </div>
                )}
              </div>

              {result.details?.errors && result.details.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
                  <div className="space-y-1 text-sm">
                    {result.details.errors.map((error, index) => (
                      <div key={index} className="text-red-600">
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link href="/buyers" className="btn btn-primary">
                  View Imported Buyers
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Import failed</span>
              </div>

              {result.validationErrors && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Validation Errors:</h4>
                  <div className="space-y-1 text-sm max-h-60 overflow-y-auto">
                    {result.validationErrors.map((error, index) => (
                      <div key={index} className="text-red-600">
                        Row {error.row}: {error.errors}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Please fix the errors and try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
