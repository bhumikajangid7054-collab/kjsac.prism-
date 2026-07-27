/*
=========================================
PRISM WEBSITE
Department of Political Science
K. J. Somaiya College of Arts & Commerce
=========================================
SUPABASE CONFIGURATION
=========================================
*/

const SUPABASE_URL = "https://tzabdsmfesbttzmmqtzn.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6YWJkc21mZXNidHR6bW1xdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzA0MzcsImV4cCI6MjEwMDY0NjQzN30.3yyWogU5ScNEX39DcpfI_dgtSIUGJ87WVo2kp_Tzwq8";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

/*
=========================================
ANNOUNCEMENTS
=========================================
*/

async function getAnnouncements() {

    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
FACULTY
=========================================
*/

async function getFaculty() {

    const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("id");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
DATALABS
=========================================
*/

async function getDataLabs() {

    const { data, error } = await supabase
        .from("datalabs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
NEWSLETTERS
=========================================
*/

async function getNewsletters() {

    const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .order("issue", { ascending: false });

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
EVENTS
=========================================
*/

async function getEvents() {

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
EVENT GALLERY
=========================================
*/

async function getEventGallery(eventId) {

    const { data, error } = await supabase
        .from("event_gallery")
        .select("*")
        .eq("event_id", eventId);

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

/*
=========================================
STORAGE UPLOAD
=========================================
*/

async function uploadFile(bucket, file) {

    const fileName = Date.now() + "_" + file.name;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) {

        console.error(error);

        return null;

    }

    const {

        data

    } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return data.publicUrl;

}
