
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://chnqqpytvpggvfvggosp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobnFxcHl0dnBnZ3Zmdmdnb3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODg0ODMsImV4cCI6MjA1ODQ2NDQ4M30.z3EH0sw2GyyDVsGqLQyNwdZ8WAHQb3H2Vruy556y2n8";

// Define database interface with all tables
export type CustomDatabase = Database & {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
      };
      user_packages: {
        Row: {
          id: string;
          user_id: string;
          destination_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          destination_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          destination_id?: string;
          created_at?: string;
        };
      };
      vr_bookings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          time: string;
          address: string;
          status: string;
          additional_notes: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          date: string;
          time: string;
          address: string;
          status: string;
          additional_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          time?: string;
          address?: string;
          status?: string;
          additional_notes?: string | null;
          created_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          user_id: string;
          package_ids: string[];
          status: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          package_ids: string[];
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          package_ids?: string[];
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'vr-travel-auth-token',
  },
});
