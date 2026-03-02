-- Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id text PRIMARY KEY,
    name text NOT NULL,
    "groupId" text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Trainers Table
CREATE TABLE IF NOT EXISTS public.trainers (
    id text PRIMARY KEY,
    name text NOT NULL,
    "courtId" text NOT NULL,
    passcode text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id text PRIMARY KEY,
    date text NOT NULL, -- Storing as text (YYYY-MM-DD) since frontend uses it that way
    "submittedAt" text NOT NULL, -- Storing as ISO string timestamp
    "courtId" text NOT NULL,
    "groupId" text NOT NULL,
    "trainerId" text NOT NULL,
    "trainerName" text NOT NULL,
    "eventName" text, -- nullable
    "presentStudentIds" text[] NOT NULL DEFAULT '{}', -- array of text
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - allow all for now since it's a closed admin/trainer ecosystem using passcodes
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow all operations (Anon usage)
CREATE POLICY "Allow All operations on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All operations on trainers" ON public.trainers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All operations on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
