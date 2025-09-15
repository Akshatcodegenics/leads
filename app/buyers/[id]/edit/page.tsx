import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { EditBuyerForm } from '@/components/buyers/edit-buyer-form';

interface EditBuyerPageProps {
  params: { id: string };
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const buyer = await BuyerService.getBuyerById(params.id);
  
  if (!buyer) {
    notFound();
  }

  // Check permissions
  if (buyer.ownerId !== session.user.id && session.user.role !== 'admin') {
    redirect('/buyers');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Buyer Lead</h1>
        <p className="text-gray-600">Update buyer information and requirements</p>
      </div>
      
      <EditBuyerForm buyer={buyer} />
    </div>
  );
}
