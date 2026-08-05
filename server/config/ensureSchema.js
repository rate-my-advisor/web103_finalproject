import { pool } from "./database.js";

export const ensureDatabaseSchema = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS review_likes (
            review_id INTEGER NOT NULL
                REFERENCES reviews(review_id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL
                REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (review_id, user_id)
        )
    `);
};
