import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateBuyerForm } from '@/components/buyers/create-buyer-form';

export default async function NewBuyerPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Lead</h1>
        <p className="text-gray-600">Add a new buyer lead to the system</p>
      </div>
      
      <CreateBuyerForm />
    </div>
  );
}
