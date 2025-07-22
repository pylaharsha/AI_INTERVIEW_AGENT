import React from 'react';
import { Target, TrendingUp, MessageCircle, Zap, Award } from 'lucide-react';
import { Score } from '../types/interview';

interface ScoreDisplayProps {
  score: Score;
  showDetailed?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  showDetailed = false 
}) => {
  const scoreItems = [
    { key: 'technical', label: 'Technical Skills', icon: Target, color: 'blue' },
    { key: 'behavioral', label: 'Behavioral', icon: MessageCircle, color: 'green' },
    { key: 'communication', label: 'Communication', icon: TrendingUp, color: 'purple' },
    { key: 'problemSolving', label: 'Problem Solving', icon: Zap, color: 'amber' },
  ] as const;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const formatScore = (score: number) => Math.round(score * 100);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(score.overall)}`}>
          <Award className={`h-8 w-8 ${getScoreColor(score.overall)}`} />
        </div>
        <div className="mt-4">
          <div className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
            {formatScore(score.overall)}%
          </div>
          <div className="text-gray-600 text-sm">Overall Score</div>
        </div>
      </div>

      {/* Detailed Scores */}
      {showDetailed && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreItems.map(({ key, label, icon: Icon, color }) => {
              const scoreValue = score[key];
              const percentage = formatScore(scoreValue);

              return (
                <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 text-${color}-500 mr-2`} />
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(scoreValue)}`}>
                      {percentage}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        scoreValue >= 0.8 ? 'bg-green-500' :
                        scoreValue >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Score Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Performance Insights</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          {score.technical >= 0.8 && <li>• Strong technical knowledge demonstrated</li>}
          {score.behavioral >= 0.8 && <li>• Excellent behavioral responses with clear examples</li>}
          {score.communication >= 0.8 && <li>• Clear and articulate communication style</li>}
          {score.problemSolving >= 0.8 && <li>• Strong analytical and problem-solving skills</li>}
          
          {score.technical < 0.6 && <li>• Consider reviewing technical concepts</li>}
          {score.behavioral < 0.6 && <li>• Focus on providing specific examples with clear outcomes</li>}
          {score.communication < 0.6 && <li>• Work on structuring responses more clearly</li>}
          {score.problemSolving < 0.6 && <li>• Practice breaking down complex problems step-by-step</li>}
        </ul>
      </div>
    </div>
  );
};