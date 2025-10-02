// src/types/kuis.ts
import { type Database } from './database'

export type Kuis = Database['public']['Tables']['kuis']['Row']
export type KuisInsert = Database['public']['Tables']['kuis']['Insert']
export type KuisUpdate = Database['public']['Tables']['kuis']['Update']

export type KuisQuestion = Database['public']['Tables']['kuis_questions']['Row']
export type QuestionOption =
  Database['public']['Tables']['question_options']['Row']
export type KuisAttempt = Database['public']['Tables']['kuis_attempts']['Row']
export type KuisAnswer = Database['public']['Tables']['kuis_answers']['Row']

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'matching'
export type QuizType = 'practice' | 'midterm' | 'final' | 'assignment'
export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned' | 'graded'

export interface KuisWithQuestions extends Kuis {
  questions?: Array<
    KuisQuestion & {
      options?: QuestionOption[]
    }
  >
}

export interface QuizAttemptDetail extends KuisAttempt {
  quiz?: Kuis
  answers?: KuisAnswer[]
}
