import React from 'react';
import { Trophy, Download, RefreshCw, Star } from 'lucide-react';
import { InterviewSession } from '../types/interview';
import { ScoreDisplay } from './ScoreDisplay';

interface InterviewResultsProps {
  session: InterviewSession;
  onRestart: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({
  session,
  onRestart
}) => {
  const totalDuration = session.answers.reduce((sum, answer) => sum + answer.duration, 0);
  const averageAnswerTime = Math.round(totalDuration / session.answers.length);

  const generateReport = () => {
    const report = {
      candidate: session.candidateProfile.name,
      position: session.jobDescription.title,
      date: new Date().toISOString().split('T')[0],
      duration: `${Math.round(totalDuration / 60)} minutes`,
      questionsAnswered: session.answers.length,
      scores: session.score,
      answers: session.answers.map(answer => {
        const question = session.questions.find(q => q.id === answer.questionId);
        return {
          question: question?.content,
          answer: answer.content,
          duration: `${Math.round(answer.duration / 60)} minutes`
        };
      })
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `interview-report-${session.candidateProfile.name?.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 0.7) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 0.6) return { level: 'Average', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(session.score.overall);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 ${performance.bg} rounded-full mb-4`}>
          <Trophy className={`h-10 w-10 ${performance.color}`} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
        <p className="text-gray-600">
          Great job, {session.candidateProfile.name}! Here's your performance summary.
        </p>
      </div>

      {/* Performance Level */}
      <div className={`${performance.bg} rounded-lg p-6 text-center`}>
        <div className={`text-2xl font-bold ${performance.color} mb-2`}>
          {performance.level} Performance
        </div>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-700">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Overall Score: {Math.round(session.score.overall * 100)}%
          </div>
          <div>•</div>
          <div>Duration: {Math.round(totalDuration / 60)} minutes</div>
          <div>•</div>
          <div>{session.answers.length} questions answered</div>
        </div>
      </div>

      {/* Score Display */}
      <ScoreDisplay score={session.score} showDetailed={true} />

      {/* Interview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {session.questions.length}
          </div>
          <div className="text-gray-600">Total Questions</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {Math.round(totalDuration / 60)}m
          </div>
          <div className="text-gray-600">Total Duration</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {Math.round(averageAnswerTime / 60)}m
          </div>
          <div className="text-gray-600">Avg. Answer Time</div>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
        <div className="space-y-3">
          {session.questions.map((question, index) => {
            const answer = session.answers.find(a => a.questionId === question.id);
            const answered = !!answer;
            
            return (
              <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      Q{index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      question.type === 'behavioral' ? 'bg-green-100 text-green-800' :
                      question.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {question.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      question.difficulty === 'easy' ? 'bg-gray-100 text-gray-800' :
                      question.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{question.content.substring(0, 100)}...</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  {answered ? `${Math.round(answer.duration / 60)}m` : 'Not answered'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={generateReport}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Report
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Start New Interview
        </button>
      </div>
    </div>
  );
};