'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import docsService, { Document } from '@/lib/services/docs-service';
import {
  Upload,
  Plus,
  FileText,
  Folder,
  BookOpen,
  Download,
  Share2,
  Trash2,
  Search,
} from 'lucide-react';

export const DocsList: React.FC = () => {
  const { user } = useAppStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'document' | 'folder' | 'wiki'>('all');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = docsService.subscribeToFiles(user.companyId, (files) => {
      setDocuments(files);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: Document['type']) => {
    switch (type) {
      case 'folder':
        return <Folder size={20} className="text-blue-600" />;
      case 'wiki':
        return <BookOpen size={20} className="text-purple-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Docs & Drive</h1>

        {/* Controls */}
        <div className="space-y-4">
          {/* Search and Create */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus size={20} />
              New Document
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              <Upload size={20} />
              Upload
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'document', 'folder', 'wiki'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No documents found</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    {getIcon(doc.type)}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 truncate">{doc.name}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </p>

                {/* Shared With */}
                {doc.sharedWith && doc.sharedWith.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
                    <Share2 size={14} />
                    Shared with {doc.sharedWith.length}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">
                    Open
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <Download size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
