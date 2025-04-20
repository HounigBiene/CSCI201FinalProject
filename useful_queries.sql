-- SOME USEFUL SCRIPTS
-- get all study spots
SELECT location_id, name, description FROM study_spot;

-- get user and password
SELECT username, password FROM user;

-- get a user's favorite spots
SELECT ss.location_id, ss.name, ss.description
FROM fave_spot fs
JOIN study_spot ss ON fs.location_id = ss.location_id
WHERE fs.user_id = 1;

-- get votes on spots
SELECT ss.location_id, ss.name, COUNT(v.user_id) AS vote_count
FROM study_spot ss
LEFT JOIN votes v ON ss.location_id = v.location_id
GROUP BY ss.location_id
ORDER BY vote_count DESC;

-- get user's friends
SELECT u.user_id, u.username, f.status
FROM friends_list f
JOIN user u ON f.user_id_2 = u.user_id
WHERE f.user_id_1 = 1 AND f.status = 'accepted';

-- get who is checked in
SELECT u.user_id, u.username, c.check_in_time
FROM check_in c
JOIN user u ON c.user_id = u.user_id
WHERE c.location_id = 1 AND c.check_out_time IS NULL;

-- getting select alls
SELECT * FROM user;
SELECT * FROM study_spot;
SELECT * FROM votes;
SELECT * FROM fave_spot;
SELECT * FROM check_in;
SELECT * FROM friends_list;

-- clearing tables
DELETE FROM check_in;
DELETE FROM friends_list;
DELETE FROM fave_spot;
DELETE FROM votes;
DELETE FROM study_spot;
DELETE FROM user;