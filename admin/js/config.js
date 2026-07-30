// ==========================================
// PRISM ADMIN PANEL
// config.js
// ==========================================

// Replace these with your actual Supabase credentials

const SUPABASE_URL = "https://tzabdsmfesbttzmmqtzn.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YWJkc21mZXNidHR6bW1xdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzA0MzcsImV4cCI6MjEwMDY0NjQzN30.3yyWogU5ScNEX39DcpfI_dgtSIUGJ87WVo2kp_Tzwq8";

// Create client

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make it globally available

window.supabaseClient = supabaseClient;

// Storage Buckets

window.BUCKETS = {
    faculty: "faculty",
    events: "events",
    gallery: "gallery",
    newsletters: "newsletters",
    documents: "documents"
};

// Database Tables

window.TABLES = {
    faculty: "faculty",
    datalabs: "datalabs",
    events: "events",
    gallery: "event_gallery",
    newsletters: "newsletters"
};
