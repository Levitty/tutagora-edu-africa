
-- Update tutaeducators@gmail.com to have super_admin role
UPDATE profiles 
SET role = 'super_admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tutaeducators@gmail.com'
);

-- Verify the update worked
SELECT p.id, p.first_name, p.last_name, p.role, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tutaeducators@gmail.com';
