'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BuyerDetails } from '@/components/buyers/buyer-details';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function BuyerPage() {
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
    <div className="max-w-6xl mx-auto">
      <BuyerDetails buyer={buyer} currentUser={{ email: session?.user?.email!, role: session?.user?.role }} />
    </div>
  );
}
