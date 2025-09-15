'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, DollarSign, Clock, Tag, FileText } from 'lucide-react';
import { Buyer, BuyerHistory, User } from '@/lib/db/schema';

interface BuyerWithHistory extends Buyer {
  owner: { id: string; name: string | null; email: string };
  history: (BuyerHistory & { changedBy: { id: string; name: string | null; email: string } })[];
}

interface BuyerDetailsProps {
  buyer: BuyerWithHistory;
  currentUser: { id: string; role?: string };
}

export function BuyerDetails({ buyer, currentUser }: BuyerDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = buyer.ownerId === currentUser.id || currentUser.role === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this buyer? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/buyers/${buyer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete buyer');
      }

      window.location.href = '/buyers';
    } catch (error) {
      alert('Failed to delete buyer');
      setIsDeleting(false);
    }
  };

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    if (max) return `Up to ₹${max.toLocaleString()}`;
    return 'Not specified';
  };

  const getStatusClass = (status: string) => {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/buyers" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{buyer.fullName}</h1>
            <p className="text-gray-600">
              Created {formatDistanceToNow(new Date(buyer.createdAt), { addSuffix: true })} by {buyer.owner.name || buyer.owner.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={getStatusClass(buyer.status)}>
            {buyer.status}
          </span>
          {canEdit && (
            <>
              <Link href={`/buyers/${buyer.id}/edit`} className="btn btn-secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{buyer.phone}</p>
                </div>
              </div>
              {buyer.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{buyer.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{buyer.city}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium">{buyer.source}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Requirements */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium">{buyer.propertyType}</p>
              </div>
              {buyer.bhk && (
                <div>
                  <p className="text-sm text-gray-500">BHK</p>
                  <p className="font-medium">{buyer.bhk} BHK</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="font-medium">{buyer.purpose}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="font-medium">{buyer.timeline}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">{formatBudget(buyer.budgetMin, buyer.budgetMax)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {buyer.notes && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{buyer.notes}</p>
            </div>
          )}

          {/* Tags */}
          {buyer.tags && buyer.tags.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {buyer.tags.map((tag) => (
                  <span key={tag} className="tag">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{format(new Date(buyer.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{format(new Date(buyer.updatedAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{buyer.owner.name || buyer.owner.email}</p>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h3>
            {buyer.history.length === 0 ? (
              <p className="text-gray-500 text-sm">No changes recorded</p>
            ) : (
              <div className="space-y-3">
                {buyer.history.map((change) => (
                  <div key={change.id} className="border-l-2 border-blue-200 pl-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {change.changedBy.name || change.changedBy.email}
                      </p>
                      <p className="text-gray-500">
                        {formatDistanceToNow(new Date(change.changedAt), { addSuffix: true })}
                      </p>
                      <div className="mt-1 text-xs text-gray-600">
                        {Object.entries(change.diff).map(([field, { from, to }]) => (
                          <div key={field}>
                            <span className="font-medium">{field}:</span> {String(from)} → {String(to)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
