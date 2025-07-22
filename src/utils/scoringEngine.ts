import { Answer, Question, Score, CandidateProfile } from '../types/interview';

export class ScoringEngine {
  static evaluateAnswer(
    question: Question,
    answer: Answer,
    candidateProfile: CandidateProfile
  ): Partial<Score> {
    const baseScore = this.calculateBaseScore(question, answer);
    const lengthScore = this.evaluateAnswerLength(answer.content, question.type);
    const keywordScore = this.evaluateKeywords(question, answer);
    
    const finalScore = Math.round((baseScore + lengthScore + keywordScore) / 3);

    return this.mapToScoreCategories(question.type, finalScore);
  }

  private static calculateBaseScore(question: Question, answer: Answer): number {
    // Simulate AI-based scoring
    const answerLength = answer.content.trim().length;
    const expectedLength = this.getExpectedAnswerLength(question.type);
    
    if (answerLength < expectedLength * 0.3) return 2; // Too short
    if (answerLength > expectedLength * 3) return 6; // Too verbose
    
    // Simulate content analysis based on question difficulty
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.2
    }[question.difficulty];

    return Math.min(10, Math.round(7 * difficultyMultiplier));
  }

  private static evaluateAnswerLength(content: string, questionType: string): number {
    const wordCount = content.trim().split(/\s+/).length;
    const expectedWords = {
      behavioral: { min: 50, max: 200, optimal: 100 },
      technical: { min: 30, max: 150, optimal: 75 },
      coding: { min: 20, max: 100, optimal: 50 }
    }[questionType] || { min: 30, max: 150, optimal: 75 };

    if (wordCount < expectedWords.min) return 4;
    if (wordCount > expectedWords.max) return 6;
    
    const deviation = Math.abs(wordCount - expectedWords.optimal) / expectedWords.optimal;
    return Math.max(1, Math.round(10 - (deviation * 5)));
  }

  private static evaluateKeywords(question: Question, answer: Answer): number {
    const keywordSets = {
      behavioral: ['experience', 'team', 'challenge', 'solution', 'result', 'learned'],
      technical: ['architecture', 'scalable', 'performance', 'implementation', 'design'],
      coding: ['algorithm', 'complexity', 'optimize', 'efficient', 'solution']
    };

    const relevantKeywords = keywordSets[question.type] || keywordSets.technical;
    const answerLower = answer.content.toLowerCase();
    
    const foundKeywords = relevantKeywords.filter(keyword => 
      answerLower.includes(keyword.toLowerCase())
    );

    const keywordRatio = foundKeywords.length / relevantKeywords.length;
    return Math.round(keywordRatio * 10);
  }

  private static getExpectedAnswerLength(questionType: string): number {
    return {
      behavioral: 400,
      technical: 300,
      coding: 200
    }[questionType] || 300;
  }

  private static mapToScoreCategories(questionType: string, score: number): Partial<Score> {
    const normalizedScore = score / 10; // Convert to 0-1 scale

    switch (questionType) {
      case 'behavioral':
        return {
          behavioral: normalizedScore,
          communication: normalizedScore * 0.8
        };
      case 'technical':
        return {
          technical: normalizedScore,
          problemSolving: normalizedScore * 0.9
        };
      case 'coding':
        return {
          technical: normalizedScore * 0.7,
          problemSolving: normalizedScore
        };
      default:
        return { overall: normalizedScore };
    }
  }

  static calculateOverallScore(scores: Partial<Score>[]): Score {
    const aggregated = {
      technical: 0,
      behavioral: 0,
      communication: 0,
      problemSolving: 0,
      overall: 0
    };

    let counts = {
      technical: 0,
      behavioral: 0,
      communication: 0,
      problemSolving: 0,
      overall: 0
    };

    scores.forEach(score => {
      Object.keys(score).forEach(key => {
        if (score[key as keyof Score] !== undefined) {
          aggregated[key as keyof Score] += score[key as keyof Score]!;
          counts[key as keyof Score]++;
        }
      });
    });

    // Calculate averages
    Object.keys(aggregated).forEach(key => {
      const count = counts[key as keyof Score];
      if (count > 0) {
        aggregated[key as keyof Score] = aggregated[key as keyof Score] / count;
      }
    });

    // Calculate overall score
    const validScores = [
      aggregated.technical,
      aggregated.behavioral,
      aggregated.communication,
      aggregated.problemSolving
    ].filter(score => score > 0);

    aggregated.overall = validScores.length > 0 
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;

    return aggregated;
  }
}