-- Wiping and reseting the database

/*
SET SQL_SAFE_UPDATES = 0;
DELETE FROM friends_list;
DELETE FROM check_in;
DELETE FROM fave_spot;
DELETE FROM votes;
DELETE FROM study_spot;
DELETE FROM user;

SET FOREIGN_KEY_CHECKS = 0;

-- Truncate tables in correct order
TRUNCATE TABLE friends_list;
TRUNCATE TABLE check_in;
TRUNCATE TABLE fave_spot;
TRUNCATE TABLE votes;
TRUNCATE TABLE study_spot;
TRUNCATE TABLE user;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

*/

-- Insert users
INSERT INTO `users` (`username`, `email`, `password`) VALUES
('alice123', 'alice@example.com', 'hashed_pw_1'),
('bob456', 'bob@example.com','hashed_pw_2'),
('carol789', 'carol@example.com', 'hashed_pw_3'),
('dave321', 'dave@example.com', 'hashed_pw_4'),
('eve999', 'eve@example.com', 'hashed_pw_5'),
('frank007', 'frank@example.com', 'hashed_pw_6');

-- Insert study spots
INSERT INTO `study_spot` (`name`, `description`, `location_pin`) VALUES
('Leavey Library', 'Quiet environment with many study cubicles', ST_GeomFromText('POINT(-118.2851 34.0219)')),
('Fertitta Hall', 'Modern business building with open seating, natural light, and great WiFi', ST_GeomFromText('POINT(-118.2853 34.0198)')),
('Ronald Tutor Campus Center', 'Central student hub with lounges, food court, and study spaces', ST_GeomFromText('POINT(-118.2857 34.0205)')),
('Engineering Quad', 'Sunny open-air seating with power outlets', ST_GeomFromText('POINT(-118.2895 34.0212)')),
('Annenberg Cafe', 'Modern space with lots of plugs and good coffee', ST_GeomFromText('POINT(-118.2870 34.0210)')),
('Doheny Library', 'Historic library with silent floors', ST_GeomFromText('POINT(-118.2847 34.0215)'));

-- Insert votes
INSERT INTO `votes` (`user_id`, `location_id`, `vote_type`) VALUES
(1, 1, 'upvote'), (1, 3, 'upvote'), (2, 2, 'upvote'), (3, 1, 'upvote'),
(4, 4, 'upvote'), (4, 1, 'downvote'), (5, 5, 'upvote'), (5, 3, 'downvote'), (6, 6, 'upvote'), (6, 2, 'downvote');

-- Insert favorites
INSERT INTO `fave_spot` (`user_id`, `location_id`) VALUES
(1, 3), (2, 1), (3, 2),
(4, 5), (5, 1), (6, 4), (3, 5);

-- Insert check-ins
INSERT INTO `check_in` (`user_id`, `location_id`, `check_in_time`, `check_out_time`) VALUES
(1, 1, '2025-04-19 10:00:00', '2025-04-19 12:30:00'),
(2, 2, '2025-04-19 09:45:00', '2025-04-19 11:00:00'),
(3, 3, '2025-04-19 14:00:00', NULL),
(4, 4, '2025-04-19 11:00:00', '2025-04-19 12:15:00'),
(5, 5, '2025-04-19 13:00:00', NULL),
(6, 6, '2025-04-19 08:00:00', '2025-04-19 10:00:00'),
(2, 3, '2025-04-19 10:30:00', '2025-04-19 12:00:00');

-- Insert friends list
INSERT INTO `friends_list` (`user_id_1`, `user_id_2`, `status`) VALUES
(1, 2, 'accepted'),
(1, 3, 'pending'),
(2, 3, 'accepted'),
(4, 5, 'accepted'),
(4, 6, 'pending'),
(5, 6, 'accepted'),
(2, 4, 'accepted'),
(3, 5, 'declined');