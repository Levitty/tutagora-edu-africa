-- Update the tutor Levitty Mutua to approved status so they appear in tutor browsing
UPDATE profiles 
SET kyc_status = 'approved' 
WHERE first_name = 'Levitty' 
AND last_name = 'Mutua' 
AND role = 'tutor';