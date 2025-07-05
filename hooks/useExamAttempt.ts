"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import attemptService from '../services/attempt.service';
import answerService from '../services/answer.service';
import {
  Attempt,
  Answer,
  CreateAttemptDto,
  CreateAnswerDto,
  UpdateAnswerDto,
  AttemptStatus
} from '../types/exams';
import { AccessType } from '@/types';

interface UseExamAttemptProps {
  examId?: string;
  attemptId?: string;
}

/**
 * Hook for managing exam attempts and answers
 */
export const useExamAttempt = ({ examId, attemptId }: UseExamAttemptProps = {}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  /**
   * Start a new exam attempt
   */
  const startAttempt = useCallback(async (accessType?: AccessType, enrollmentId?: string) => {
    if (!examId) {
      setError('Exam ID is required to start an attempt');
      toast.error('Exam ID is required to start an attempt');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data: CreateAttemptDto = {
        examId,
        accessType: accessType || AccessType.INDIVIDUAL,
        enrollmentId,
        status: AttemptStatus.IN_PROGRESS,
        timeSpent: 0
      };

      const newAttempt = await attemptService.createAttempt(data);
      setAttempt(newAttempt);
      return newAttempt;
    } catch (err: any) {
      const message = err.message || 'Failed to start exam attempt';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [examId]);

  /**
   * Load an existing attempt by ID
   */
  const loadAttempt = useCallback(async (id: string = attemptId!) => {
    if (!id) {
      setError('Attempt ID is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedAttempt = await attemptService.getAttemptById(id);
      setAttempt(loadedAttempt);
      
      // Load answers for this attempt
      setLoadingAnswers(true);
      try {
        const attemptAnswers = await answerService.getAnswersByAttempt(id);
        setAnswers(attemptAnswers);
      } catch (answerErr: any) {
        console.error('Failed to load answers:', answerErr);
        // Don't fail the whole attempt load if answers fail
      } finally {
        setLoadingAnswers(false);
      }
      
      return loadedAttempt;
    } catch (err: any) {
      const message = err.message || 'Failed to load exam attempt';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  /**
   * Submit an answer for the current attempt
   */
  const submitAnswer = useCallback(async (data: CreateAnswerDto | UpdateAnswerDto, answerId?: string) => {
    if (!attempt?.id && !data.attemptId) {
      setError('No active attempt found');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let response: Answer;
      
      if (answerId) {
        // Update existing answer
        response = await answerService.updateAnswer(answerId, data as UpdateAnswerDto);
      } else {
        // Create new answer
        response = await answerService.createAnswer({
          ...data as CreateAnswerDto,
          attemptId: data.attemptId || attempt!.id
        });
      }

      // Update answers list
      setAnswers(prev => {
        const index = prev.findIndex(a => a.id === response.id);
        if (index >= 0) {
          return [...prev.slice(0, index), response, ...prev.slice(index + 1)];
        } else {
          return [...prev, response];
        }
      });

      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit answer';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attempt]);

  /**
   * Update the time spent on questions
   */
  const updateTimeSpent = useCallback(async (questionId: string, timeInSeconds: number) => {
    if (!attempt?.id) {
      setError('No active attempt found');
      return null;
    }

    let timeSpent: number = attempt.timeSpent || 0;
    timeSpent = timeSpent + timeInSeconds;

    try {
      const updatedAttempt = await attemptService.updateAttempt(attempt.id, {
        timeSpent
      });
      setAttempt(updatedAttempt);
      return updatedAttempt;
    } catch (err: any) {
      console.error('Failed to update time spent:', err);
      return null;
    }
  }, [attempt]);

  /**
   * Submit the entire attempt
   */
  const submitAttempt = useCallback(async () => {
    if (!attempt?.id) {
      setError('No active attempt found');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const updatedAttempt = await attemptService.updateAttempt(attempt.id, {
        status: AttemptStatus.SUBMITTED,
        submitTime: now,
        endTime: now
      });
      setAttempt(updatedAttempt);
      toast.success('Exam submitted successfully!');
      return updatedAttempt;
    } catch (err: any) {
      const message = err?.message || 'Failed to submit exam';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attempt]);

  /**
   * Evaluate the current attempt
   */
  const evaluateAttempt = useCallback(async () => {
    if (!attempt?.id) {
      setError('No active attempt found');
      return null;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      // First ensure the attempt is submitted
      let currentAttempt = attempt;
      if (currentAttempt.status === AttemptStatus.IN_PROGRESS) {
        const now = new Date();
        currentAttempt = await attemptService.updateAttempt(attempt.id, {
          status: AttemptStatus.SUBMITTED,
          submitTime: now,
          endTime: now
        });
        setAttempt(currentAttempt);
      }

      // Then evaluate it
      const evaluatedAttempt = await attemptService.evaluateAttempt(currentAttempt.id);
      setAttempt(evaluatedAttempt);
      
      // Reload answers to get updated marks
      const updatedAnswers = await answerService.getAnswersByAttempt(currentAttempt.id);
      setAnswers(updatedAnswers);
      
      toast.success('Exam evaluated successfully!');
      return evaluatedAttempt;
    } catch (err: any) {
      const message = err?.message || 'Failed to evaluate exam';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsEvaluating(false);
    }
  }, [attempt]);

  return {
    loading,
    loadingAnswers,
    isEvaluating,
    error,
    attempt,
    answers,
    startAttempt,
    loadAttempt,
    submitAnswer,
    updateTimeSpent,
    submitAttempt,
    evaluateAttempt
  };
};

export default useExamAttempt;
