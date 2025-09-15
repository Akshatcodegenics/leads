'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface StatusQuickActionsProps {
  buyerId: string;
  currentStatus: string;
  canEdit: boolean;
}

const statusOptions = [
  { value: 'New', label: 'New', color: 'status-new' },
  { value: 'Qualified', label: 'Qualified', color: 'status-qualified' },
  { value: 'Contacted', label: 'Contacted', color: 'status-contacted' },
  { value: 'Visited', label: 'Visited', color: 'status-visited' },
  { value: 'Negotiation', label: 'Negotiation', color: 'status-negotiation' },
  { value: 'Converted', label: 'Converted', color: 'status-converted' },
  { value: 'Dropped', label: 'Dropped', color: 'status-dropped' },
];

export function StatusQuickActions({ buyerId, currentStatus, canEdit }: StatusQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus || !canEdit) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/buyers/${buyerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      router.refresh();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  if (!canEdit) {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentOption?.color}`}>
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentOption?.color} hover:opacity-80 disabled:opacity-50`}
      >
        {isUpdating ? 'Updating...' : currentStatus}
        <ChevronDown className="ml-1 h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  option.value === currentStatus ? 'bg-gray-100' : ''
                }`}
              >
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
