-- Allow admins to see all withdrawals
CREATE POLICY "Admins can view all withdrawals"
ON withdrawals FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Allow admins to update withdrawals (for approval/rejection)
CREATE POLICY "Admins can update withdrawals"
ON withdrawals FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
