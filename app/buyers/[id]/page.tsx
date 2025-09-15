import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { BuyerDetails } from '@/components/buyers/buyer-details';

interface BuyerPageProps {
  params: { id: string };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const buyer = await BuyerService.getBuyerById(params.id);
  
  if (!buyer) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <BuyerDetails buyer={buyer} currentUser={session.user} />
    </div>
  );
}
