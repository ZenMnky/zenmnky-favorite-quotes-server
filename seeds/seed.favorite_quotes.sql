TRUNCATE IF EXISTS favorite_quotes;

INSERT INTO favorite_quotes (content, attribution, source, tags)
    VALUES
    ('Stand up straight, with your shoulders back.', 'Dr. Jordan B Peterson', '12 Rules for Life', ARRAY['stoicism', 'friends', 'masculinity', 'lobsters']),
    ('Clean up your damn room', 'Dr. Jordan B Peterson', '12 Rules for Life', ARRAY['stoicism', 'friends', 'masculinity', 'lobsters']),
    ('Pursue what is meaningful, not what is expedient.', 'Dr. Jordan B Peterson', '12 Rules for Life', ARRAY['stoicism', 'friends', 'masculinity', 'lobsters']);