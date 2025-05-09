-- Create schema and use it
CREATE SCHEMA IF NOT EXISTS studyspot_finder;
USE studyspot_finder;

-- Drop tables if they already exist
DROP TABLE IF EXISTS friends_list;
DROP TABLE IF EXISTS check_in;
DROP TABLE IF EXISTS fave_spot;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS study_spot;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE IF NOT EXISTS `users`(
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Study spots table
CREATE TABLE IF NOT EXISTS `study_spot`(
    `location_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `location_pin` POINT NOT NULL,
    `current_check_in_count` INT DEFAULT 0
);

-- Votes table
CREATE TABLE IF NOT EXISTS `votes` (
    `user_id` INT NOT NULL,
    `location_id` INT NOT NULL,
    `vote_type` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

-- Favorite spots table
CREATE TABLE IF NOT EXISTS `fave_spot` (
    `user_id` INT,
    `location_id` INT,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

-- Check-in table
CREATE TABLE IF NOT EXISTS `check_in` (
    `user_id` INT,
    `location_id` INT,
    `check_in_time` DATETIME NOT NULL,
    `check_out_time` DATETIME,
    PRIMARY KEY (`user_id`, `check_in_time`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

-- Friends list table
CREATE TABLE IF NOT EXISTS `friends_list` (
    `user_id_1` INT,
    `user_id_2` INT,
    status ENUM('pending', 'accepted', 'declined') NOT NULL,
    PRIMARY KEY (`user_id_1`, `user_id_2`),
    FOREIGN KEY (`user_id_1`) REFERENCES users(`user_id`),
    FOREIGN KEY (`user_id_2`) REFERENCES users(`user_id`)
);

-- Grant permissions
GRANT ALL PRIVILEGES ON studyspot_finder.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Insert dummy study spots
INSERT INTO `study_spot` (`name`, `description`, `location_pin`, `current_check_in_count`) VALUES
('Leavey Library', 'Quiet environment with many study cubicles', ST_GeomFromText('POINT(-118.2851 34.0219)'), 5),
('Fertitta Hall', 'Modern business building with open seating, natural light, and great WiFi', ST_GeomFromText('POINT(-118.2853 34.0198)'), 2),
('Ronald Tutor Campus Center', 'Central student hub with lounges, food court, and study spaces', ST_GeomFromText('POINT(-118.2857 34.0205)'), 3),
('Engineering Quad', 'Sunny open-air seating with power outlets', ST_GeomFromText('POINT(-118.2895 34.0212)'), 1),
('Annenberg Cafe', 'Modern space with lots of plugs and good coffee', ST_GeomFromText('POINT(-118.2870 34.0210)'), 4),
('Doheny Library', 'Historic library with silent floors', ST_GeomFromText('POINT(-118.2847 34.0215)'), 2);

INSERT INTO users (username, email, password) VALUES
('TommyTrojan', 'tommy@usc.edu', '$2a$10$DPRckKwbolvXKcB.JT9hueNxWFziTkGjkbvMY14lRjMpkscpXnKCm'),  -- user_id = 1
('Hecuba', 'hecuba@usc.edu', '$2a$10$DPRckKwbolvXKcB.JT9hueNxWFziTkGjkbvMY14lRjMpkscpXnKCm'),      -- user_id = 2
('BruinBear', 'bruin@ucla.edu', '$2a$10$DPRckKwbolvXKcB.JT9hueNxWFziTkGjkbvMY14lRjMpkscpXnKCm'),   -- user_id = 3
('TravelerHorse', 'traveler@usc.edu', '$2a$10$DPRckKwbolvXKcB.JT9hueNxWFziTkGjkbvMY14lRjMpkscpXnKCm'), -- user_id = 4
('GeorgeT', 'georget@usc.edu', '$2a$10$DPRckKwbolvXKcB.JT9hueNxWFziTkGjkbvMY14lRjMpkscpXnKCm');    -- user_id = 5

-- Hecuba → TommyTrojan
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (2, 1, 'pending');

-- BruinBear → TommyTrojan
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (3, 1, 'pending');

-- TravelerHorse → TommyTrojan
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (4, 1, 'pending');

-- GeorgeT → TommyTrojan
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (5, 1, 'pending');



