'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Edit, Phone, Mail } from 'lucide-react';
import { Buyer } from '@/lib/db/schema';
import { StatusQuickActions } from './status-quick-actions';
import { useSession } from 'next-auth/react';

interface BuyersListProps {
  buyers: (Buyer & { owner: { id: string; name: string | null; email: string } })[];
}

export function BuyersList({ buyers }: BuyersListProps) {
  const { data: session } = useSession();

  if (buyers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No buyers found matching your criteria.</p>
      </div>
    );
  }

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return '-';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    if (max) return `Up to ₹${max.toLocaleString()}`;
    return '-';
  };

  const getStatusClass = (status: string) => {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'New': return `${baseClass} status-new`;
      case 'Qualified': return `${baseClass} status-qualified`;
      case 'Contacted': return `${baseClass} status-contacted`;
      case 'Visited': return `${baseClass} status-visited`;
      case 'Negotiation': return `${baseClass} status-negotiation`;
      case 'Converted': return `${baseClass} status-converted`;
      case 'Dropped': return `${baseClass} status-dropped`;
      default: return `${baseClass} status-new`;
    }
  };

  return (
    <div className="table-container">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              👤 Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              📞 Contact
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              🏠 Property
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              💰 Budget
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              📊 Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              ⚡ Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {buyers.map((buyer) => (
            <tr key={buyer.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {buyer.fullName}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {buyer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {buyer.phone}
                        </div>
                      )}
                      {buyer.email && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {buyer.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {buyer.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {buyer.propertyType}
                  {buyer.bhk && ` - ${buyer.bhk} BHK`}
                </div>
                <div className="text-sm text-gray-500">
                  {buyer.purpose}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatBudget(buyer.budgetMin, buyer.budgetMax)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {buyer.timeline}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusQuickActions
                  buyerId={buyer.id}
                  currentStatus={buyer.status}
                  canEdit={buyer.ownerId === session?.user?.id || session?.user?.role === 'admin'}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(buyer.updatedAt), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/buyers/${buyer.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/buyers/${buyer.id}/edit`}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit buyer"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
