
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvmouflnotwjinnlvlsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bW91Zmxub3R3amlubmx2bHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzU5NDgsImV4cCI6MjA2NTUxMTk0OH0.P0XUR_RWaxm8_oRL1RIcYlly8RKu91rutBX1VQ0yqoU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
