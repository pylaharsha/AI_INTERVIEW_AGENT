import { useState, useCallback } from 'react';
import { InterviewSession, InterviewState, CandidateProfile, JobDescription, Answer } from '../types/interview';
import { QuestionGenerator } from '../utils/questionGenerator';
import { ScoringEngine } from '../utils/scoringEngine';

export const useInterview = () => {
  const [state, setState] = useState<InterviewState>({
    session: null,
    isLoading: false,
    error: null
  });

  const createSession = useCallback((
    candidateProfile: CandidateProfile,
    jobDescription: JobDescription
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Generate questions based on profile and job description
      const questions = QuestionGenerator.generateQuestionSet(
        candidateProfile,
        jobDescription,
        8
      );

      const session: InterviewSession = {
        id: `interview-${Date.now()}`,
        candidateProfile,
        jobDescription,
        questions,
        answers: [],
        currentQuestionIndex: 0,
        score: {
          technical: 0,
          behavioral: 0,
          communication: 0,
          problemSolving: 0,
          overall: 0
        },
        status: 'in-progress',
        startTime: new Date()
      };

      setState(prev => ({
        ...prev,
        session,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create interview session',
        isLoading: false
      }));
    }
  }, []);

  const submitAnswer = useCallback((answer: Answer) => {
    setState(prev => {
      if (!prev.session) return prev;

      const updatedSession = { ...prev.session };
      const currentQuestion = updatedSession.questions[updatedSession.currentQuestionIndex];
      
      // Add answer to session
      updatedSession.answers.push(answer);

      // Calculate score for this answer
      const answerScore = ScoringEngine.evaluateAnswer(
        currentQuestion,
        answer,
        updatedSession.candidateProfile
      );

      // Update overall score
      const allScores = updatedSession.answers.map(ans => {
        const q = updatedSession.questions.find(question => question.id === ans.questionId);
        return q ? ScoringEngine.evaluateAnswer(q, ans, updatedSession.candidateProfile) : {};
      });

      updatedSession.score = ScoringEngine.calculateOverallScore(allScores);

      // Move to next question or complete interview
      if (updatedSession.currentQuestionIndex < updatedSession.questions.length - 1) {
        updatedSession.currentQuestionIndex++;
      } else {
        updatedSession.status = 'completed';
        updatedSession.endTime = new Date();
      }

      return {
        ...prev,
        session: updatedSession
      };
    });
  }, []);

  const resetInterview = useCallback(() => {
    setState({
      session: null,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    state,
    createSession,
    submitAnswer,
    resetInterview
  };
};