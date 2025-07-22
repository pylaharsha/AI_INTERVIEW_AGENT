import React, { useState } from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import { ResumeUpload } from './components/ResumeUpload';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { InterviewChat } from './components/InterviewChat';
import { InterviewResults } from './components/InterviewResults';
import { useInterview } from './hooks/useInterview';
import { CandidateProfile, JobDescription } from './types/interview';

type Step = 'welcome' | 'resume' | 'job' | 'interview' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [candidateProfile, setCandidateProfile] = useState<Partial<CandidateProfile>>({});
  const [jobDescription, setJobDescription] = useState<JobDescription | undefined>();
  
  const { state, createSession, submitAnswer, resetInterview } = useInterview();

  const handleProfileExtracted = (profile: Partial<CandidateProfile>) => {
    setCandidateProfile(profile);
  };

  const handleJobDescriptionSet = (jd: JobDescription) => {
    setJobDescription(jd);
  };

  const startInterview = () => {
    if (candidateProfile.name && jobDescription) {
      const completeProfile: CandidateProfile = {
        name: candidateProfile.name || 'Unknown',
        email: candidateProfile.email || '',
        skills: candidateProfile.skills || [],
        experience: candidateProfile.experience || 0,
        education: candidateProfile.education || '',
        previousRoles: candidateProfile.previousRoles || [],
        resumeText: candidateProfile.resumeText || ''
      };

      createSession(completeProfile, jobDescription);
      setCurrentStep('interview');
    }
  };

  const handleAnswerSubmit = (answer: any) => {
    submitAnswer(answer);
    
    // Check if interview is completed
    setTimeout(() => {
      if (state.session?.status === 'completed') {
        setCurrentStep('results');
      }
    }, 100);
  };

  const handleRestart = () => {
    resetInterview();
    setCandidateProfile({});
    setJobDescription(undefined);
    setCurrentStep('welcome');
  };

  const renderWelcome = () => (
    <div className="text-center space-y-8">
      <div>
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6">
            <Brain className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Interview Agent
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Experience a personalized AI-powered interview tailored to your profile and target position. 
          Get real-time feedback, adaptive questioning, and comprehensive performance analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-blue-600 text-3xl font-bold mb-2">1</div>
          <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
          <p className="text-gray-600 text-sm">
            Our AI analyzes your background, skills, and experience level
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-purple-600 text-3xl font-bold mb-2">2</div>
          <h3 className="font-semibold text-gray-900 mb-2">Job Details</h3>
          <p className="text-gray-600 text-sm">
            Provide the job description for personalized question generation
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-green-600 text-3xl font-bold mb-2">3</div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Interview</h3>
          <p className="text-gray-600 text-sm">
            Engage in adaptive questioning with real-time evaluation
          </p>
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('resume')}
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcome();
      
      case 'resume':
        return (
          <div className="space-y-6">
            <ResumeUpload 
              onProfileExtracted={handleProfileExtracted}
              candidateProfile={candidateProfile}
            />
            {candidateProfile.name && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('job')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Job Description
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        );

      case 'job':
        return (
          <div className="space-y-6">
            <JobDescriptionInput
              onJobDescriptionSet={handleJobDescriptionSet}
              jobDescription={jobDescription}
            />
            {jobDescription && (
              <div className="text-center">
                <button
                  onClick={startInterview}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Start Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        );

      case 'interview':
        return state.session ? (
          <InterviewChat
            session={state.session}
            onAnswerSubmit={handleAnswerSubmit}
            isLoading={state.isLoading}
          />
        ) : null;

      case 'results':
        return state.session ? (
          <InterviewResults
            session={state.session}
            onRestart={handleRestart}
          />
        ) : null;

      default:
        return renderWelcome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className={`${currentStep === 'interview' ? 'h-screen' : 'min-h-screen'}`}>
        {currentStep === 'interview' ? (
          <div className="h-full flex flex-col">
            {renderStepContent()}
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {renderStepContent()}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;