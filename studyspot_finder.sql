create SCHEMA IF NOT EXISTS studyspot_finder;
USE studyspot_finder;

CREATE TABLE `user`(
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL, /* to store pashward hash */
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `study_spot`(
    `location_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `location_pin` POINT NOT NULL
);

CREATE TABLE `votes` (
    `user_id` INT NOT NULL,
    `location_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE `fave_spot` (
    `user_id` INT,
    `location_id` INT,
    PRIMARY KEY (`user_id`, `location_id`),
    FOREIGN KEY (`user_id`) REFERENCES user(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE `check_in` (
    `user_id` INT,
    `location_id` INT,
    `check_in_time` DATETIME NOT NULL,
    `check_out_time` DATETIME,
    PRIMARY KEY (`user_id`, `check_in_time`),
    FOREIGN KEY (`user_id`) REFERENCES user(`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES study_spot(`location_id`)
);

CREATE TABLE `friends_list` (
    `user_id_1` INT,
    `user_id_2` INT,
    status ENUM('pending', 'accepted', 'declined') NOT NULL,
    PRIMARY KEY (`user_id_1`, `user_id_2`),
    FOREIGN KEY (`user_id_1`) REFERENCES user(`user_id`),
    FOREIGN KEY (`user_id_2`) REFERENCES user(`user_id`)
);

-- SELECT * FROM fav_spot;
-- DROP TABLE friends_list;
-- DROP TABLE check_in;
-- DROP TABLE fave_spot;
-- DROP TABLE votes;
-- DROP TABLE study_spot;
-- DROP TABLE user;





