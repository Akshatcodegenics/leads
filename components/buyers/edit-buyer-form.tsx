'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BuyerForm } from '@/components/forms/buyer-form';
import { BuyerFormData } from '@/lib/validations/buyer';
import { Buyer } from '@/lib/db/schema';

interface EditBuyerFormProps {
  buyer: Buyer;
}

export function EditBuyerForm({ buyer }: EditBuyerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: BuyerFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/buyers/${buyer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          updatedAt: buyer.updatedAt, // For concurrency control
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          alert('This buyer has been modified by another user. Please refresh the page and try again.');
          window.location.reload();
          return;
        }
        throw new Error(error.error || 'Failed to update buyer');
      }

      router.push(`/buyers/${buyer.id}`);
    } catch (error) {
      console.error('Error updating buyer:', error);
      alert(error instanceof Error ? error.message : 'Failed to update buyer');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert buyer data to form format
  const initialData: Partial<BuyerFormData> = {
    fullName: buyer.fullName,
    email: buyer.email || '',
    phone: buyer.phone,
    city: buyer.city,
    propertyType: buyer.propertyType,
    bhk: buyer.bhk || undefined,
    purpose: buyer.purpose,
    budgetMin: buyer.budgetMin || undefined,
    budgetMax: buyer.budgetMax || undefined,
    timeline: buyer.timeline,
    source: buyer.source,
    status: buyer.status,
    notes: buyer.notes || '',
    tags: buyer.tags || [],
  };

  return (
    <div>
      <div className="mb-6">
        <Link href={`/buyers/${buyer.id}`} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to buyer details
        </Link>
      </div>
      
      <BuyerForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Update Lead"
      />
    </div>
  );
}
