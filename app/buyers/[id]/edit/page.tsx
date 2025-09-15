'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BuyerForm } from '@/components/forms/buyer-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EditBuyerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchBuyer();
    }
  }, [status, session, params.id]);

  const fetchBuyer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/buyers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        // Check permissions
        if (data.ownerId !== session?.user?.email && session?.user?.role !== 'admin') {
          router.push('/buyers');
          return;
        }
        setBuyer(data);
      } else if (response.status === 404) {
        router.push('/buyers');
      }
    } catch (error) {
      console.error('Error fetching buyer:', error);
      router.push('/buyers');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated' || !buyer) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Buyer Lead</h1>
        <p className="text-gray-600">Update buyer information and requirements</p>
      </div>
      
      <BuyerForm 
        initialData={buyer} 
        onSubmit={async (data) => {
          const response = await fetch(`/api/buyers/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            router.push(`/buyers/${params.id}`);
          }
        }}
        submitLabel="Update Lead"
      />
    </div>
  );
}
