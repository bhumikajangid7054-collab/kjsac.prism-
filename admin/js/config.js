// ======================================
// PRISM ADMIN CONFIG
// ======================================

const SUPABASE_URL =
"https://tzabdsmfesbttzmmqtzn.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YWJkc21mZXNidHR6bW1xdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzA0MzcsImV4cCI6MjEwMDY0NjQzN30.3yyWogU5ScNEX39DcpfI_dgtSIUGJ87WVo2kp_Tzwq8";

const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.supabase = supabase;
