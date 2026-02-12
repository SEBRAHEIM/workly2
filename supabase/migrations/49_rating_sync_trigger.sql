-- Trigger to update creator rating summary when a review is added
CREATE OR REPLACE FUNCTION update_creator_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        rating_avg = (
            SELECT ROUND(AVG(rating), 2)
            FROM reviews
            WHERE creator_id = NEW.creator_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE creator_id = NEW.creator_id
        )
    WHERE id = NEW.creator_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_review_added ON reviews;
CREATE TRIGGER on_review_added
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_creator_rating();

-- Add a unique constraint to prevent multiple reviews for the same project
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_project_id_key;
ALTER TABLE reviews ADD CONSTRAINT reviews_project_id_key UNIQUE (project_id);
