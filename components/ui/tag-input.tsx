'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Tag } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInput({ tags, onTagsChange, placeholder = "Add tags...", suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(suggestion)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(e.target.value.length > 0 && filteredSuggestions.length > 0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(input.length > 0 && filteredSuggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="form-input"
        placeholder={placeholder}
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Tag className="h-3 w-3 mr-2 inline" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
