'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';

export function ExportBuyersButton() {
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Build export URL with current filters
      const exportParams = new URLSearchParams();
      
      // Copy current search params to export
      searchParams.forEach((value, key) => {
        if (['search', 'city', 'propertyType', 'status', 'timeline', 'sortBy', 'sortOrder'].includes(key)) {
          exportParams.set(key, value);
        }
      });

      const response = await fetch(`/api/buyers/export?${exportParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the filename from response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'buyers-export.csv';

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export buyers');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
    </button>
  );
}
