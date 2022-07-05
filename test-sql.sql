\c nc_games_test

SELECT a.*, COUNT (b.review_id) AS commment_count FROM reviews a
LEFT JOIN comments b
ON a.review_id = b.review_id
WHERE a.review_id = 2
GROUP BY a.review_id;