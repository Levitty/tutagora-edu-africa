
-- First, let's make tutaeducators@gmail.com a super admin
UPDATE profiles 
SET role = 'super_admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tutaeducators@gmail.com'
);

-- Add academic qualification document type to KYC documents
-- Update KYC documents table to include academic qualifications
ALTER TABLE kyc_documents 
ADD COLUMN IF NOT EXISTS academic_qualification_type TEXT;

-- Add video content table for courses
CREATE TABLE IF NOT EXISTS course_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on course_videos
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_videos
CREATE POLICY "Tutors can manage their own course videos"
ON course_videos FOR ALL
USING (auth.uid() = tutor_id);

CREATE POLICY "Anyone can view published course videos"
ON course_videos FOR SELECT
USING (is_published = true);

-- Update KYC documents to better handle different document types
UPDATE kyc_documents 
SET document_type = 'academic_qualification'
WHERE document_type LIKE '%certificate%' OR document_type LIKE '%degree%';

-- Create admin verification actions table
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action_type TEXT NOT NULL, -- 'kyc_approve', 'kyc_reject', 'course_approve', etc.
    target_id UUID NOT NULL, -- ID of the item being acted upon
    target_type TEXT NOT NULL, -- 'kyc_document', 'course', 'profile', etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage admin actions
CREATE POLICY "Super admins can manage admin actions"
ON admin_actions FOR ALL
USING (is_super_admin(auth.uid()));
