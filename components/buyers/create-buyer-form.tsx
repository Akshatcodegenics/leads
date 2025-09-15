'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuyerForm } from '@/components/forms/buyer-form';
import { BuyerFormData } from '@/lib/validations/buyer';

export function CreateBuyerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: BuyerFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create buyer');
      }

      const buyer = await response.json();
      router.push(`/buyers/${buyer.id}`);
    } catch (error) {
      console.error('Error creating buyer:', error);
      alert(error instanceof Error ? error.message : 'Failed to create buyer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BuyerForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel="Create Lead"
    />
  );
}
