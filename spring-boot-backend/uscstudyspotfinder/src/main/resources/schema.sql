create SCHEMA IF NOT EXISTS studyspot_finder;
USE studyspot_finder;

DROP TABLE IF EXISTS friends_list;
DROP TABLE IF EXISTS check_in;
DROP TABLE IF EXISTS fave_spot;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS study_spot;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS `users`(
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL, /* to store password hash */
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `study_spot`(
    `location_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `location_pin` POINT NOT NULL
);

CREATE TABLE IF NOT EXISTS `votes` (
    `user_id` INT NOT NULL,
    `location_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE IF NOT EXISTS `fave_spot` (
    `user_id` INT,
    `location_id` INT,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE IF NOT EXISTS `check_in` (
    `user_id` INT,
    `location_id` INT,
    `check_in_time` DATETIME NOT NULL,
    `check_out_time` DATETIME,
    PRIMARY KEY (`user_id`, `check_in_time`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE IF NOT EXISTS `friends_list` (
    `user_id_1` INT,
    `user_id_2` INT,
    status ENUM('pending', 'accepted', 'declined') NOT NULL,
    PRIMARY KEY (`user_id_1`, `user_id_2`),
    FOREIGN KEY (`user_id_1`) REFERENCES users(`user_id`),
    FOREIGN KEY (`user_id_2`) REFERENCES users(`user_id`)
);

GRANT ALL PRIVILEGES ON studyspot_finder.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

INSERT INTO `study_spot` (`name`, `description`, `location_pin`) VALUES
('Leavey Library', 'Quiet environment with many study cubicles', ST_GeomFromText('POINT(-118.2851 34.0219)')),
('Fertitta Hall', 'Modern business building with open seating, natural light, and great WiFi', ST_GeomFromText('POINT(-118.2853 34.0198)')),
('Ronald Tutor Campus Center', 'Central student hub with lounges, food court, and study spaces', ST_GeomFromText('POINT(-118.2857 34.0205)')),
('Engineering Quad', 'Sunny open-air seating with power outlets', ST_GeomFromText('POINT(-118.2895 34.0212)')),
('Annenberg Cafe', 'Modern space with lots of plugs and good coffee', ST_GeomFromText('POINT(-118.2870 34.0210)')),
('Doheny Library', 'Historic library with silent floors', ST_GeomFromText('POINT(-118.2847 34.0215)'));

-- Users
INSERT INTO users (username, email, password) VALUES ('charlotte', 'charlotte@usc.edu', 'pw');
INSERT INTO users (username, email, password) VALUES ('bob', 'bob@usc.edu', 'pw');
INSERT INTO users (username, email, password) VALUES ('alice', 'alice@usc.edu', 'pw');

SELECT * FROM users;


-- Friends (charlotte -> bob accepted, charlotte -> alice accepted)
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (1, 2, 'accepted');
INSERT INTO friends_list (user_id_1, user_id_2, status) VALUES (1, 3, 'accepted');

SELECT * FROM friends_list;

-- Checkins
INSERT INTO check_in (user_id, location_id, check_in_time) VALUES (2, 1, NOW());