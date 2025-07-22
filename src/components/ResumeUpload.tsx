import React, { useCallback } from 'react';
import { Upload, FileText, User } from 'lucide-react';
import { ResumeParser } from '../utils/resumeParser';
import { CandidateProfile } from '../types/interview';

interface ResumeUploadProps {
  onProfileExtracted: (profile: Partial<CandidateProfile>) => void;
  candidateProfile?: Partial<CandidateProfile>;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ 
  onProfileExtracted, 
  candidateProfile 
}) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const profile = ResumeParser.parseResume(text);
      onProfileExtracted(profile);
    };
    reader.readAsText(file);
  }, [onProfileExtracted]);

  const handleTextPaste = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.trim().length > 50) {
      const profile = ResumeParser.parseResume(text);
      onProfileExtracted(profile);
    }
  }, [onProfileExtracted]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600">
          Upload your resume or paste the text below to get started with your personalized interview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              Click to upload resume
            </div>
            <div className="text-sm text-gray-500">
              Supports TXT, PDF, DOC, DOCX files
            </div>
          </label>
        </div>

        {/* Text Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Or paste your resume text:
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your resume content here..."
            onChange={handleTextPaste}
          />
        </div>
      </div>

      {/* Profile Preview */}
      {candidateProfile?.name && (
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Extracted Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{candidateProfile.name}</span>
              </div>
              {candidateProfile.email && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{candidateProfile.email}</span>
                </div>
              )}
              <div className="mb-3">
                <span className="font-medium text-gray-700">Experience:</span>
                <span className="ml-2 text-gray-900">{candidateProfile.experience} years</span>
              </div>
            </div>
            
            <div>
              {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700 block mb-2">Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};