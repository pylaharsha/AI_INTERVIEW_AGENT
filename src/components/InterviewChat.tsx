import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, User, Bot, Mic, MicOff } from 'lucide-react';
import { InterviewSession, Answer } from '../types/interview';

interface InterviewChatProps {
  session: InterviewSession;
  onAnswerSubmit: (answer: Answer) => void;
  isLoading?: boolean;
}

export const InterviewChat: React.FC<InterviewChatProps> = ({
  session,
  onAnswerSubmit,
  isLoading = false
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerStartTime, setAnswerStartTime] = useState<Date | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.currentQuestionIndex, session.answers.length]);

  useEffect(() => {
    if (currentQuestion && !answerStartTime) {
      setAnswerStartTime(new Date());
    }
  }, [currentQuestion, answerStartTime]);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !answerStartTime) return;

    const answer: Answer = {
      questionId: currentQuestion.id,
      content: currentAnswer.trim(),
      timestamp: new Date(),
      duration: Math.round((new Date().getTime() - answerStartTime.getTime()) / 1000)
    };

    onAnswerSubmit(answer);
    setCurrentAnswer('');
    setAnswerStartTime(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Interview with {session.candidateProfile.name}
          </h2>
          <div className="text-sm text-gray-500">
            Question {session.currentQuestionIndex + 1} of {session.questions.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Previous Q&A pairs */}
        {session.answers.map((answer, index) => {
          const question = session.questions.find(q => q.id === answer.questionId);
          if (!question) return null;

          return (
            <div key={answer.questionId} className="space-y-3">
              {/* Question */}
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-blue-50 rounded-lg p-4 max-w-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 uppercase">
                      {question.type} • {question.difficulty}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      ~{question.expectedDuration} min
                    </div>
                  </div>
                  <p className="text-gray-900">{question.content}</p>
                </div>
              </div>

              {/* Answer */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-gray-100 rounded-lg p-4 max-w-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      Answered in {formatDuration(answer.duration)}
                    </span>
                  </div>
                  <p className="text-gray-900">{answer.content}</p>
                </div>
                <div className="bg-gray-600 rounded-full p-2">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Current Question */}
        {currentQuestion && (
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 rounded-full p-2">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 max-w-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 uppercase">
                  {currentQuestion.type} • {currentQuestion.difficulty}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  ~{currentQuestion.expectedDuration} min
                </div>
              </div>
              <p className="text-gray-900">{currentQuestion.content}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Answer Input */}
      {currentQuestion && (
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmitAnswer} className="space-y-3">
            <div className="flex items-start space-x-3">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
              
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-3 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                
                <button
                  type="submit"
                  disabled={!currentAnswer.trim() || isLoading}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>

            {answerStartTime && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Take your time to provide a thoughtful response.</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatDuration(Math.round((new Date().getTime() - answerStartTime.getTime()) / 1000))}
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};