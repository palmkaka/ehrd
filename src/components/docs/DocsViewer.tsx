'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import docsService, { Document } from '@/lib/services/docs-service';
import { ArrowLeft, MoreVertical, Share2 } from 'lucide-react';

interface DocsViewerProps {
  doc: Document | null;
  onBack: () => void;
}

export const DocsViewer: React.FC<DocsViewerProps> = ({ doc, onBack }) => {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(doc?.content || '');

  useEffect(() => {
    setContent(doc?.content || '');
  }, [doc]);

  if (!doc) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a document to view</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">{doc.name}</h2>
            <p className="text-sm text-gray-500">
              Created by {doc.uploadedBy} • {new Date(doc.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600">
            <Share2 size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Start typing..."
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{content || 'No content yet'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {isEditing ? 'Done Editing' : 'Edit Document'}
        </button>
      </div>
    </div>
  );
};
