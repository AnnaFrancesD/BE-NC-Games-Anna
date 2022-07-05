\c nc_games_test

SELECT a.*, COUNT (b.review_id) AS comment_count FROM reviews a
LEFT JOIN comments b
ON a.review_id = b.review_id
GROUP BY a.review_id
ORDER BY created_at DESC;