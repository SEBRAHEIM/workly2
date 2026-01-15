-- Create saved_cards table
CREATE TABLE IF NOT EXISTS saved_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand TEXT NOT NULL, -- 'visa', 'mastercard', etc.
    last4 TEXT NOT NULL,
    bin TEXT, -- first 6 digits
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Creators can manage their own saved cards"
    ON saved_cards FOR ALL
    USING (auth.uid() = creator_id);

-- If a card is set as default, unset others for the same creator
CREATE OR REPLACE FUNCTION handle_new_default_card()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default THEN
        UPDATE saved_cards
        SET is_default = false
        WHERE creator_id = NEW.creator_id AND id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_handle_default_card
BEFORE INSERT OR UPDATE ON saved_cards
FOR EACH ROW
EXECUTE FUNCTION handle_new_default_card();
