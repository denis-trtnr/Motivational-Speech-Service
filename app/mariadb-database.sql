CREATE TABLE `motivanional_speeches` (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Automatisch inkrementierende ID
    input VARCHAR(255),                     -- Textfeld für Input
    mood VARCHAR(50),                       -- Textfeld für Mood (Stimmung)
    speech_proposal VARCHAR(255),           -- Textfeld für Textvorschlag
    audio_file LONGBLOB                     -- Audiodatei im binären Format
);