import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pommuyglcsovkglmrvoc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbW11eWdsY3NvdmtnbG1ydm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA0MDI3MzQsImV4cCI6MTk5NTk3ODczNH0.A3y0whp8_rLctvvuueBoT95P0xhCCQh6l4lEIPPvWAY'
export const supabase = createClient(supabaseUrl, supabaseKey)