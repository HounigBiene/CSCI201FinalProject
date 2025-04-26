create SCHEMA IF NOT EXISTS studyspot_finder;
USE studyspot_finder;

DROP TABLE friends_list;
DROP TABLE check_in;
DROP TABLE fave_spot;
DROP TABLE votes;
DROP TABLE study_spot;
DROP TABLE user;

CREATE TABLE `user`(
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL, /* to store password hash */
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


-- some mock data
INSERT INTO `user` (`username`, `email`, `phone`, `password`)
VALUES ('johndoe', 'johndoe@example.com', '123-456-7890', 'johndoe12347363467nbvfdvgghg!'); 

INSERT INTO `user` (`username`, `email`, `phone`, `password`)
VALUES ('alice123', 'alice@example.com', '555-123-4567', '$2y$10$examplehashedpassword1234567890');

INSERT INTO `study_spot` (`name`, `description`, `location_pin`)
VALUES ('Leavey Library', 'Quiet library with group and solo study areas.', ST_GeomFromText('POINT(-118.2851 34.0206)'));
INSERT INTO `study_spot` (`name`, `description`, `location_pin`)
VALUES (
  'Engineering Quad',
  'Outdoor seating area surrounded by engineering buildings. Great for group work and fresh air.',
  ST_GeomFromText('POINT(-118.2895 34.0209)')
);
--
--INSERT INTO `votes` (`user_id`, `location_id`) VALUES (1, 1);
--
--INSERT INTO `fave_spot` (`user_id`, `location_id`) VALUES (1, 1);
--
--INSERT INTO `check_in` (`user_id`, `location_id`, `check_in_time`)
--VALUES (1, 1, NOW());
--
--INSERT INTO `friends_list` (`user_id_1`, `user_id_2`, `status`) VALUES (1, 2, 'accepted');
--
---- SOME USEFUL SCRIPTS
---- get all study spots
--SELECT location_id, name, description FROM study_spot;
--
---- get user and password
--SELECT username, password FROM user;
--
---- get a user's favorite spots
--SELECT ss.location_id, ss.name, ss.description
--FROM fave_spot fs
--JOIN study_spot ss ON fs.location_id = ss.location_id
--WHERE fs.user_id = 1;
--
---- get votes on spots
--SELECT ss.location_id, ss.name, COUNT(v.user_id) AS vote_count
--FROM study_spot ss
--LEFT JOIN votes v ON ss.location_id = v.location_id
--GROUP BY ss.location_id
--ORDER BY vote_count DESC;
--
---- get user's friends
--SELECT u.user_id, u.username, f.status
--FROM friends_list f
--JOIN user u ON f.user_id_2 = u.user_id
--WHERE f.user_id_1 = 1 AND f.status = 'accepted';
--
---- get who is checked in
--SELECT u.user_id, u.username, c.check_in_time
--FROM check_in c
--JOIN user u ON c.user_id = u.user_id
--WHERE c.location_id = 1 AND c.check_out_time IS NULL;
--
---- getting select alls
--SELECT * FROM user;
--SELECT * FROM study_spot;
--SELECT * FROM votes;
--SELECT * FROM fave_spot;
--SELECT * FROM check_in;
--SELECT * FROM friends_list;





