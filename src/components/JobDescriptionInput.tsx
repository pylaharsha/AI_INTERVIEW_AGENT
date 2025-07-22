import React, { useState } from 'react';
import { Briefcase, Target } from 'lucide-react';
import { JobDescription, JobRequirement } from '../types/interview';

interface JobDescriptionInputProps {
  onJobDescriptionSet: (jobDescription: JobDescription) => void;
  jobDescription?: JobDescription;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionSet,
  jobDescription
}) => {
  const [formData, setFormData] = useState({
    title: jobDescription?.title || '',
    company: jobDescription?.company || '',
    description: jobDescription?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract requirements from description (simplified)
    const requirements = extractRequirements(formData.description);
    
    const jobDesc: JobDescription = {
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements
    };
    
    onJobDescriptionSet(jobDesc);
  };

  const extractRequirements = (description: string): JobRequirement[] => {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
      'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Microservices'
    ];

    const requirements: JobRequirement[] = [];
    const lowerDesc = description.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
        let level: 'junior' | 'mid' | 'senior' = 'mid';
        
        // Determine level based on context
        if (lowerDesc.includes('senior') || lowerDesc.includes('lead') || lowerDesc.includes('architect')) {
          level = 'senior';
        } else if (lowerDesc.includes('junior') || lowerDesc.includes('entry')) {
          level = 'junior';
        }

        requirements.push({
          skill,
          level,
          required: lowerDesc.includes('required') || lowerDesc.includes('must have')
        });
      }
    });

    return requirements;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Briefcase className="mx-auto h-12 w-12 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Description</h2>
        <p className="text-gray-600">
          Enter the job details to personalize your interview questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="job-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Senior Software Engineer"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., TechCorp Inc."
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Paste the full job description here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <Target className="mr-2 h-5 w-5" />
          Generate Interview Questions
        </button>
      </form>

      {jobDescription && (
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Requirements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {jobDescription.requirements.map((req, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm ${
                  req.required 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                <div className="font-medium">{req.skill}</div>
                <div className="text-xs capitalize">{req.level} level</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};