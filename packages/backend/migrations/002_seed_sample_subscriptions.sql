-- ==============================================================================
-- Looply Seed Data: Sample Subscriptions
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. In your Clerk Dashboard (https://dashboard.clerk.com), go to "Users" and copy your User ID (e.g., user_2xxxxxxxx...).
-- 2. Replace 'YOUR_CLERK_USER_ID' below with your actual Clerk User ID so the rows appear in your mobile app.
-- 3. Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql).
-- ==============================================================================

DO $$
DECLARE
    target_user_id text := 'YOUR_CLERK_USER_ID'; -- <-- Replace with your Clerk user ID (e.g. 'user_2xxx')
BEGIN
    INSERT INTO public.subscriptions (
        user_id,
        name,
        plan,
        plan_details,
        category,
        price,
        currency,
        billing,
        status,
        payment_method,
        start_date,
        renewal_date,
        color,
        icon_key
    ) VALUES
    (
        target_user_id,
        'Adobe Creative Cloud',
        'Teams Plan',
        'All Apps Team License',
        'Design',
        77.49,
        'USD',
        'Monthly',
        'active',
        'Visa ending in 8530',
        now() - interval '30 days',
        now() + interval '5 days',
        '#f5c542',
        'adobe'
    ),
    (
        target_user_id,
        'GitHub Pro',
        'Developer',
        'Developer Suite + Copilot',
        'Developer Tools',
        9.99,
        'USD',
        'Monthly',
        'active',
        'Mastercard ending in 2408',
        now() - interval '60 days',
        now() + interval '12 days',
        '#e8def8',
        'github'
    ),
    (
        target_user_id,
        'Claude Pro',
        'Pro Plan',
        'Claude 3.5 Sonnet Priority Access',
        'AI Tools',
        20.00,
        'USD',
        'Monthly',
        'paused',
        'Amex ending in 1010',
        now() - interval '45 days',
        now() + interval '18 days',
        '#b8d4e3',
        'claude'
    ),
    (
        target_user_id,
        'Spotify',
        'Premium Individual',
        'Ad-free music + offline downloads',
        'Entertainment',
        10.99,
        'USD',
        'Monthly',
        'active',
        'Apple Pay',
        now() - interval '90 days',
        now() + interval '2 days',
        '#bce3c5',
        'spotify'
    ),
    (
        target_user_id,
        'Netflix',
        'Standard HD',
        '2 screens streaming',
        'Entertainment',
        15.49,
        'USD',
        'Monthly',
        'active',
        'Visa ending in 3141',
        now() - interval '15 days',
        now() + interval '15 days',
        '#f5b7b1',
        'netflix'
    ),
    (
        target_user_id,
        'ChatGPT Plus',
        'Plus Plan',
        'GPT-4o & Canvas access',
        'AI Tools',
        20.00,
        'USD',
        'Monthly',
        'active',
        'Mastercard ending in 9812',
        now() - interval '10 days',
        now() + interval '20 days',
        '#d4efdf',
        'chatgpt'
    ),
    (
        target_user_id,
        'Figma Professional',
        'Professional',
        'Unlimited version history & dev mode',
        'Design',
        15.00,
        'USD',
        'Monthly',
        'active',
        'Visa ending in 5521',
        now() - interval '25 days',
        now() + interval '6 days',
        '#d7bde2',
        'figma'
    ),
    (
        target_user_id,
        'Notion Plus',
        'Personal Plus',
        'Unlimited blocks & file uploads',
        'Productivity',
        10.00,
        'USD',
        'Monthly',
        'active',
        'Visa ending in 4114',
        now() - interval '5 days',
        now() + interval '25 days',
        '#d5e8d4',
        'notion'
    );
END $$;
