// src/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string
          nim_nip: string | null
          phone: string | null
          avatar_url: string | null
          birth_date: string | null
          address: string | null
          is_active: boolean
          email_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name: string
          nim_nip?: string | null
          phone?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          address?: string | null
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string
          nim_nip?: string | null
          phone?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          address?: string | null
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          role_name: string
          role_code: 'ADMIN' | 'DOSEN' | 'MAHASISWA' | 'LABORAN'
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          role_name: string
          role_code: 'ADMIN' | 'DOSEN' | 'MAHASISWA' | 'LABORAN'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          role_name?: string
          role_code?: 'ADMIN' | 'DOSEN' | 'MAHASISWA' | 'LABORAN'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          permission_name: string
          permission_code: string
          module: string
          action: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          permission_name: string
          permission_code: string
          module: string
          action: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          permission_name?: string
          permission_code?: string
          module?: string
          action?: string
          description?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          assigned_at: string
          assigned_by: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
        }
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          granted_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          granted_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          granted_at?: string
        }
      }
      laboratories: {
        Row: {
          id: string
          lab_code: string
          lab_name: string
          lab_type: 'praktikum' | 'depo_alat'
          description: string | null
          capacity: number
          location: string | null
          facilities: string[] | null
          operating_hours: Json | null
          contact_person: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lab_code: string
          lab_name: string
          lab_type: 'praktikum' | 'depo_alat'
          description?: string | null
          capacity?: number
          location?: string | null
          facilities?: string[] | null
          operating_hours?: Json | null
          contact_person?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lab_code?: string
          lab_name?: string
          lab_type?: 'praktikum' | 'depo_alat'
          description?: string | null
          capacity?: number
          location?: string | null
          facilities?: string[] | null
          operating_hours?: Json | null
          contact_person?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      equipments: {
        Row: {
          id: string
          equipment_code: string
          equipment_name: string
          category: string
          subcategory: string | null
          laboratory_id: string | null
          current_location_id: string | null
          brand: string | null
          model: string | null
          serial_number: string | null
          purchase_date: string | null
          purchase_price: number | null
          warranty_end_date: string | null
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
          status: 'available' | 'in_use' | 'maintenance' | 'broken' | 'retired'
          description: string | null
          specifications: Json | null
          maintenance_notes: string | null
          last_maintenance: string | null
          next_maintenance: string | null
          qr_code: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_code: string
          equipment_name: string
          category: string
          subcategory?: string | null
          laboratory_id?: string | null
          current_location_id?: string | null
          brand?: string | null
          model?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          warranty_end_date?: string | null
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
          status?: 'available' | 'in_use' | 'maintenance' | 'broken' | 'retired'
          description?: string | null
          specifications?: Json | null
          maintenance_notes?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          qr_code?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_code?: string
          equipment_name?: string
          category?: string
          subcategory?: string | null
          laboratory_id?: string | null
          current_location_id?: string | null
          brand?: string | null
          model?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          warranty_end_date?: string | null
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
          status?: 'available' | 'in_use' | 'maintenance' | 'broken' | 'retired'
          description?: string | null
          specifications?: Json | null
          maintenance_notes?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          qr_code?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      mata_kuliah: {
        Row: {
          id: string
          course_code: string
          course_name: string
          description: string | null
          credit_hours: number
          theory_hours: number
          practice_hours: number
          semester: number | null
          prerequisite_course_id: string | null
          suggested_laboratory_id: string | null
          created_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_code: string
          course_name: string
          description?: string | null
          credit_hours?: number
          theory_hours?: number
          practice_hours?: number
          semester?: number | null
          prerequisite_course_id?: string | null
          suggested_laboratory_id?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_code?: string
          course_name?: string
          description?: string | null
          credit_hours?: number
          theory_hours?: number
          practice_hours?: number
          semester?: number | null
          prerequisite_course_id?: string | null
          suggested_laboratory_id?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      peminjaman: {
        Row: {
          id: string
          requested_by: string
          mata_kuliah_id: string | null
          laboratory_id: string | null
          request_title: string
          purpose: string
          requested_date: string
          start_time: string
          end_time: string
          participant_count: number | null
          equipment_needed: string[] | null
          special_requirements: string | null
          status:
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'cancelled'
            | 'completed'
          approved_by: string | null
          approved_at: string | null
          approval_notes: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requested_by: string
          mata_kuliah_id?: string | null
          laboratory_id?: string | null
          request_title: string
          purpose: string
          requested_date: string
          start_time: string
          end_time: string
          participant_count?: number | null
          equipment_needed?: string[] | null
          special_requirements?: string | null
          status?:
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'cancelled'
            | 'completed'
          approved_by?: string | null
          approved_at?: string | null
          approval_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requested_by?: string
          mata_kuliah_id?: string | null
          laboratory_id?: string | null
          request_title?: string
          purpose?: string
          requested_date?: string
          start_time?: string
          end_time?: string
          participant_count?: number | null
          equipment_needed?: string[] | null
          special_requirements?: string | null
          status?:
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'cancelled'
            | 'completed'
          approved_by?: string | null
          approved_at?: string | null
          approval_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      booking: {
        Row: {
          id: string
          peminjaman_id: string
          laboratory_id: string | null
          booked_by: string
          booking_date: string
          start_time: string
          end_time: string
          actual_start_time: string | null
          actual_end_time: string | null
          participant_count: number | null
          status: 'confirmed' | 'in_use' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          peminjaman_id: string
          laboratory_id?: string | null
          booked_by: string
          booking_date: string
          start_time: string
          end_time: string
          actual_start_time?: string | null
          actual_end_time?: string | null
          participant_count?: number | null
          status?: 'confirmed' | 'in_use' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          peminjaman_id?: string
          laboratory_id?: string | null
          booked_by?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          actual_start_time?: string | null
          actual_end_time?: string | null
          participant_count?: number | null
          status?: 'confirmed' | 'in_use' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
      }
      jadwal: {
        Row: {
          id: string
          mata_kuliah_id: string
          laboratory_id: string | null
          dosen_id: string | null
          title: string
          description: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          max_participants: number | null
          current_participants: number
          session_type: 'lecture' | 'practice' | 'exam' | 'consultation'
          recurring_type: 'none' | 'weekly' | 'monthly' | null
          recurring_until: string | null
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mata_kuliah_id: string
          laboratory_id?: string | null
          dosen_id?: string | null
          title: string
          description?: string | null
          scheduled_date: string
          start_time: string
          end_time: string
          max_participants?: number | null
          current_participants?: number
          session_type?: 'lecture' | 'practice' | 'exam' | 'consultation'
          recurring_type?: 'none' | 'weekly' | 'monthly' | null
          recurring_until?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mata_kuliah_id?: string
          laboratory_id?: string | null
          dosen_id?: string | null
          title?: string
          description?: string | null
          scheduled_date?: string
          start_time?: string
          end_time?: string
          max_participants?: number | null
          current_participants?: number
          session_type?: 'lecture' | 'practice' | 'exam' | 'consultation'
          recurring_type?: 'none' | 'weekly' | 'monthly' | null
          recurring_until?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          mata_kuliah_id: string
          enrollment_date: string
          status: 'active' | 'completed' | 'dropped' | 'failed'
          final_grade: string | null
          grade_points: number | null
          attendance_percentage: number | null
        }
        Insert: {
          id?: string
          student_id: string
          mata_kuliah_id: string
          enrollment_date?: string
          status?: 'active' | 'completed' | 'dropped' | 'failed'
          final_grade?: string | null
          grade_points?: number | null
          attendance_percentage?: number | null
        }
        Update: {
          id?: string
          student_id?: string
          mata_kuliah_id?: string
          enrollment_date?: string
          status?: 'active' | 'completed' | 'dropped' | 'failed'
          final_grade?: string | null
          grade_points?: number | null
          attendance_percentage?: number | null
        }
      }
      materi: {
        Row: {
          id: string
          mata_kuliah_id: string
          title: string
          description: string | null
          content_type: 'pdf' | 'video' | 'document' | 'link'
          file_url: string | null
          file_size: number | null
          upload_by: string | null
          is_downloadable: boolean
          is_required: boolean
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mata_kuliah_id: string
          title: string
          description?: string | null
          content_type?: 'pdf' | 'video' | 'document' | 'link'
          file_url?: string | null
          file_size?: number | null
          upload_by?: string | null
          is_downloadable?: boolean
          is_required?: boolean
          order_number?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mata_kuliah_id?: string
          title?: string
          description?: string | null
          content_type?: 'pdf' | 'video' | 'document' | 'link'
          file_url?: string | null
          file_size?: number | null
          upload_by?: string | null
          is_downloadable?: boolean
          is_required?: boolean
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      kuis: {
        Row: {
          id: string
          mata_kuliah_id: string
          title: string
          description: string | null
          instructions: string | null
          quiz_type: 'practice' | 'midterm' | 'final' | 'assignment'
          total_questions: number
          time_limit: number | null
          max_attempts: number
          passing_score: number
          randomize_questions: boolean
          randomize_options: boolean
          show_results_immediately: boolean
          allow_review: boolean
          start_date: string | null
          end_date: string | null
          created_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mata_kuliah_id: string
          title: string
          description?: string | null
          instructions?: string | null
          quiz_type?: 'practice' | 'midterm' | 'final' | 'assignment'
          total_questions?: number
          time_limit?: number | null
          max_attempts?: number
          passing_score?: number
          randomize_questions?: boolean
          randomize_options?: boolean
          show_results_immediately?: boolean
          allow_review?: boolean
          start_date?: string | null
          end_date?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mata_kuliah_id?: string
          title?: string
          description?: string | null
          instructions?: string | null
          quiz_type?: 'practice' | 'midterm' | 'final' | 'assignment'
          total_questions?: number
          time_limit?: number | null
          max_attempts?: number
          passing_score?: number
          randomize_questions?: boolean
          randomize_options?: boolean
          show_results_immediately?: boolean
          allow_review?: boolean
          start_date?: string | null
          end_date?: string | null
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      kuis_questions: {
        Row: {
          id: string
          kuis_id: string
          question_text: string
          question_type:
            | 'multiple_choice'
            | 'true_false'
            | 'short_answer'
            | 'essay'
            | 'matching'
          question_image_url: string | null
          points: number
          explanation: string | null
          order_number: number
          created_at: string
        }
        Insert: {
          id?: string
          kuis_id: string
          question_text: string
          question_type:
            | 'multiple_choice'
            | 'true_false'
            | 'short_answer'
            | 'essay'
            | 'matching'
          question_image_url?: string | null
          points?: number
          explanation?: string | null
          order_number?: number
          created_at?: string
        }
        Update: {
          id?: string
          kuis_id?: string
          question_text?: string
          question_type?:
            | 'multiple_choice'
            | 'true_false'
            | 'short_answer'
            | 'essay'
            | 'matching'
          question_image_url?: string | null
          points?: number
          explanation?: string | null
          order_number?: number
          created_at?: string
        }
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          option_image_url: string | null
          is_correct: boolean
          order_number: number
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          option_image_url?: string | null
          is_correct?: boolean
          order_number?: number
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          option_image_url?: string | null
          is_correct?: boolean
          order_number?: number
        }
      }
      kuis_attempts: {
        Row: {
          id: string
          kuis_id: string
          student_id: string
          attempt_number: number
          start_time: string
          end_time: string | null
          time_spent: number | null
          total_score: number | null
          percentage_score: number | null
          status: 'in_progress' | 'completed' | 'abandoned' | 'graded'
          graded_by: string | null
          graded_at: string | null
          feedback: string | null
        }
        Insert: {
          id?: string
          kuis_id: string
          student_id: string
          attempt_number?: number
          start_time?: string
          end_time?: string | null
          time_spent?: number | null
          total_score?: number | null
          percentage_score?: number | null
          status?: 'in_progress' | 'completed' | 'abandoned' | 'graded'
          graded_by?: string | null
          graded_at?: string | null
          feedback?: string | null
        }
        Update: {
          id?: string
          kuis_id?: string
          student_id?: string
          attempt_number?: number
          start_time?: string
          end_time?: string | null
          time_spent?: number | null
          total_score?: number | null
          percentage_score?: number | null
          status?: 'in_progress' | 'completed' | 'abandoned' | 'graded'
          graded_by?: string | null
          graded_at?: string | null
          feedback?: string | null
        }
      }
      kuis_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_option_id: string | null
          text_answer: string | null
          is_correct: boolean | null
          points_earned: number
          answered_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_option_id?: string | null
          text_answer?: string | null
          is_correct?: boolean | null
          points_earned?: number
          answered_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_option_id?: string | null
          text_answer?: string | null
          is_correct?: boolean | null
          points_earned?: number
          answered_at?: string
        }
      }
      nilai: {
        Row: {
          id: string
          student_id: string
          mata_kuliah_id: string
          assessment_type:
            | 'quiz'
            | 'midterm'
            | 'final'
            | 'assignment'
            | 'practice'
          assessment_title: string | null
          kuis_attempt_id: string | null
          raw_score: number | null
          max_score: number | null
          percentage: number | null
          letter_grade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | null
          grade_points: number | null
          weight: number
          graded_by: string | null
          graded_at: string
          feedback: string | null
          is_final: boolean
        }
        Insert: {
          id?: string
          student_id: string
          mata_kuliah_id: string
          assessment_type:
            | 'quiz'
            | 'midterm'
            | 'final'
            | 'assignment'
            | 'practice'
          assessment_title?: string | null
          kuis_attempt_id?: string | null
          raw_score?: number | null
          max_score?: number | null
          percentage?: number | null
          letter_grade?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | null
          grade_points?: number | null
          weight?: number
          graded_by?: string | null
          graded_at?: string
          feedback?: string | null
          is_final?: boolean
        }
        Update: {
          id?: string
          student_id?: string
          mata_kuliah_id?: string
          assessment_type?:
            | 'quiz'
            | 'midterm'
            | 'final'
            | 'assignment'
            | 'practice'
          assessment_title?: string | null
          kuis_attempt_id?: string | null
          raw_score?: number | null
          max_score?: number | null
          percentage?: number | null
          letter_grade?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | null
          grade_points?: number | null
          weight?: number
          graded_by?: string | null
          graded_at?: string
          feedback?: string | null
          is_final?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'booking'
            | 'quiz'
            | 'maintenance'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          related_table: string | null
          related_id: string | null
          is_read: boolean
          is_push_sent: boolean
          is_email_sent: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'booking'
            | 'quiz'
            | 'maintenance'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          related_table?: string | null
          related_id?: string | null
          is_read?: boolean
          is_push_sent?: boolean
          is_email_sent?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?:
            | 'info'
            | 'success'
            | 'warning'
            | 'error'
            | 'booking'
            | 'quiz'
            | 'maintenance'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          related_table?: string | null
          related_id?: string | null
          is_read?: boolean
          is_push_sent?: boolean
          is_email_sent?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      pengumuman: {
        Row: {
          id: string
          title: string
          content: string
          announcement_type: 'general' | 'urgent' | 'maintenance' | 'academic'
          target_roles: string[] | null
          target_courses: string[] | null
          is_active: boolean
          publish_date: string
          expire_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          announcement_type?: 'general' | 'urgent' | 'maintenance' | 'academic'
          target_roles?: string[] | null
          target_courses?: string[] | null
          is_active?: boolean
          publish_date?: string
          expire_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          announcement_type?: 'general' | 'urgent' | 'maintenance' | 'academic'
          target_roles?: string[] | null
          target_courses?: string[] | null
          is_active?: boolean
          publish_date?: string
          expire_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventaris: {
        Row: {
          id: string
          equipment_id: string
          stock_quantity: number
          available_quantity: number
          reserved_quantity: number
          minimum_stock: number
          reorder_point: number
          last_stock_check: string | null
          stock_check_by: string | null
          location_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          stock_quantity?: number
          available_quantity?: number
          reserved_quantity?: number
          minimum_stock?: number
          reorder_point?: number
          last_stock_check?: string | null
          stock_check_by?: string | null
          location_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          stock_quantity?: number
          available_quantity?: number
          reserved_quantity?: number
          minimum_stock?: number
          reorder_point?: number
          last_stock_check?: string | null
          stock_check_by?: string | null
          location_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          equipment_id: string
          movement_type:
            | 'in'
            | 'out'
            | 'transfer'
            | 'adjustment'
            | 'maintenance'
          quantity: number
          from_location_id: string | null
          to_location_id: string | null
          reference_id: string | null
          reference_type: string | null
          notes: string | null
          moved_by: string | null
          movement_date: string
        }
        Insert: {
          id?: string
          equipment_id: string
          movement_type:
            | 'in'
            | 'out'
            | 'transfer'
            | 'adjustment'
            | 'maintenance'
          quantity: number
          from_location_id?: string | null
          to_location_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          moved_by?: string | null
          movement_date?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          movement_type?:
            | 'in'
            | 'out'
            | 'transfer'
            | 'adjustment'
            | 'maintenance'
          quantity?: number
          from_location_id?: string | null
          to_location_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          moved_by?: string | null
          movement_date?: string
        }
      }
      equipment_maintenance: {
        Row: {
          id: string
          equipment_id: string
          maintenance_type:
            | 'preventive'
            | 'corrective'
            | 'calibration'
            | 'inspection'
          scheduled_date: string
          completed_date: string | null
          maintenance_description: string | null
          cost: number | null
          vendor: string | null
          technician: string | null
          maintenance_notes: string | null
          next_maintenance_date: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_by: string | null
          completed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          maintenance_type:
            | 'preventive'
            | 'corrective'
            | 'calibration'
            | 'inspection'
          scheduled_date: string
          completed_date?: string | null
          maintenance_description?: string | null
          cost?: number | null
          vendor?: string | null
          technician?: string | null
          maintenance_notes?: string | null
          next_maintenance_date?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_by?: string | null
          completed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          maintenance_type?:
            | 'preventive'
            | 'corrective'
            | 'calibration'
            | 'inspection'
          scheduled_date?: string
          completed_date?: string | null
          maintenance_description?: string | null
          cost?: number | null
          vendor?: string | null
          technician?: string | null
          maintenance_notes?: string | null
          next_maintenance_date?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_by?: string | null
          completed_by?: string | null
          created_at?: string
        }
      }
      equipment_bookings: {
        Row: {
          id: string
          booking_id: string
          equipment_id: string
          quantity_requested: number
          quantity_allocated: number
          pickup_time: string | null
          return_time: string | null
          condition_before: string | null
          condition_after: string | null
          damage_notes: string | null
          responsible_person: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          equipment_id: string
          quantity_requested?: number
          quantity_allocated?: number
          pickup_time?: string | null
          return_time?: string | null
          condition_before?: string | null
          condition_after?: string | null
          damage_notes?: string | null
          responsible_person?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          equipment_id?: string
          quantity_requested?: number
          quantity_allocated?: number
          pickup_time?: string | null
          return_time?: string | null
          condition_before?: string | null
          condition_after?: string | null
          damage_notes?: string | null
          responsible_person?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          setting_type: 'string' | 'number' | 'boolean' | 'json'
          description: string | null
          is_public: boolean
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          setting_type?: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          is_public?: boolean
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string | null
          setting_type?: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          is_public?: boolean
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>  
    Functions: Record<string, never>  
    Enums: Record<string, never>
  }
}
