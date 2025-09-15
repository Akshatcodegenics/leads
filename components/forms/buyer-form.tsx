'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buyerSchema, BuyerFormData } from '@/lib/validations/buyer';
import { TagInput } from '@/components/ui/tag-input';

interface BuyerFormProps {
  initialData?: Partial<BuyerFormData>;
  onSubmit: (data: BuyerFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function BuyerForm({ initialData, onSubmit, isLoading, submitLabel = 'Create Lead' }: BuyerFormProps) {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      ...initialData,
      tags,
    },
  });

  const propertyType = watch('propertyType');
  const isResidential = propertyType === 'Apartment' || propertyType === 'Villa';

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onFormSubmit = async (data: BuyerFormData) => {
    await onSubmit({ ...data, tags });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              {...register('fullName')}
              type="text"
              className="form-input"
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="form-input"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="form-input"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select {...register('city')} className="form-select">
              <option value="">Select city</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Mohali">Mohali</option>
              <option value="Zirakpur">Zirakpur</option>
              <option value="Panchkula">Panchkula</option>
              <option value="Other">Other</option>
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Property Requirements */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select {...register('propertyType')} className="form-select">
              <option value="">Select property type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
            </select>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>

          {isResidential && (
            <div>
              <label htmlFor="bhk" className="block text-sm font-medium text-gray-700 mb-1">
                BHK *
              </label>
              <select {...register('bhk')} className="form-select">
                <option value="">Select BHK</option>
                <option value="Studio">Studio</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
              {errors.bhk && (
                <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose *
            </label>
            <select {...register('purpose')} className="form-select">
              <option value="">Select purpose</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
              Timeline *
            </label>
            <select {...register('timeline')} className="form-select">
              <option value="">Select timeline</option>
              <option value="0-3m">0-3 months</option>
              <option value="3-6m">3-6 months</option>
              <option value=">6m">More than 6 months</option>
              <option value="Exploring">Just exploring</option>
            </select>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register('budgetMin', { valueAsNumber: true })}
                type="number"
                className="form-input"
                placeholder="Minimum budget"
              />
              {errors.budgetMin && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('budgetMax', { valueAsNumber: true })}
                type="number"
                className="form-input"
                placeholder="Maximum budget"
              />
              {errors.budgetMax && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            📋 Additional Information
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                📍 Source
              </label>
              <select {...register('source')} className="form-select">
                <option value="">Select source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Call">Call</option>
                <option value="Other">Other</option>
              </select>
              {errors.source && (
                <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                📊 Status
              </label>
              <select {...register('status')} className="form-select">
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Visited">Visited</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
                <option value="Dropped">Dropped</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Tags</label>
            <TagInput
              tags={tags}
              onTagsChange={handleTagsChange}
              placeholder="Type and press Enter to add tags"
              suggestions={['urgent', 'first-time-buyer', 'investor', 'family', 'pets', 'luxury', 'budget-conscious', 'ready-to-move']}
            />
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              📝 Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="form-textarea"
              placeholder="Additional notes about the buyer..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
