-- Fix payment_transactions status constraint to allow 'paid' status
ALTER TABLE payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_status_check;
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'));

-- Fix bookings payment_method constraint to allow 'paystack'
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_method_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_method_check 
CHECK (payment_method IN ('pesapal', 'paystack', 'stripe', 'cash'));

-- Fix bookings payment_status constraint to allow 'paid'
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));