import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ImportBuyersForm } from '@/components/buyers/import-buyers-form';

export default async function ImportBuyersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Import Buyer Leads</h1>
        <p className="text-gray-600">Upload a CSV file to import multiple buyer leads at once</p>
      </div>
      
      <ImportBuyersForm />
    </div>
  );
}
