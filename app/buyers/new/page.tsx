'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BuyerForm } from '@/components/forms/buyer-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function NewBuyerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Lead</h1>
        <p className="text-gray-600">Add a new buyer lead to the system</p>
      </div>
      
      <BuyerForm 
        onSubmit={async (data) => {
          const response = await fetch('/api/buyers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            const buyer = await response.json();
            router.push(`/buyers/${buyer.id}`);
          }
        }}
        submitLabel="Create Lead"
      />
    </div>
  );
}
