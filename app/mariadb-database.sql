CREATE TABLE motivational_speeches (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Automatically incrementing ID
    input VARCHAR(255),                     -- Text field for input
    mood VARCHAR(50),                       -- Text field for mood
    speech_proposal VARCHAR(255),           -- Text field for text proposal
    audio_file LONGBLOB                     -- Audio file in binary format
);
