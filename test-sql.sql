\c nc_games_test

INSERT INTO comments (author, body, review_id)
VALUES ("bainesface", "I was the werewolf...", 3)
RETURNING *;