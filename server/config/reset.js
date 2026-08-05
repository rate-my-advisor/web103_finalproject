import fs from "fs";
import "./dotenv.js";
import { pool } from "./database.js";

const usUniversities = JSON.parse(
    fs.readFileSync(new URL("./us_universities.json", import.meta.url), "utf8")
);

/*
    pool.query --> pool is like a group of reusable db connections
    client.query --> client is a single db connection
*/

const resetDatabase = async () => {
    // ask pool for available db connection, store in client variable
    let client

    try {
        client = await pool.connect()

        // BEGIN line treats all following queries as one operation
        await client.query("BEGIN");

        // drop child tables before parent tables
        // reminder: reviews depend on advisors/users
        //           advisors depend on universities
        await client.query(`
            DROP TABLE IF EXISTS review_likes CASCADE;
            DROP TABLE IF EXISTS reviews CASCADE;
            DROP TABLE IF EXISTS advisors CASCADE;
            DROP TABLE IF EXISTS students CASCADE;
            DROP TABLE IF EXISTS universities CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS "session" CASCADE;
        `);

        // create unified users table (student account profile)
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                github_id VARCHAR(255) UNIQUE,
                username VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255),
                name VARCHAR(255),
                major VARCHAR(255),
                graduation_year INTEGER,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // create parent tables first
        await client.query(`
            CREATE TABLE universities (
                university_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );
        `);

        // advisors connected to existing university
        await client.query(`
            CREATE TABLE advisors (
                advisor_id SERIAL PRIMARY KEY,
                university_id INTEGER NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                department VARCHAR(255) NOT NULL,
                office VARCHAR(255),
                rating DECIMAL(3, 2),

                FOREIGN KEY (university_id)
                    REFERENCES universities(university_id)
            );
        `);

        // reviews connected to existing advisor & user
        await client.query(`
            CREATE TABLE reviews (
                review_id SERIAL PRIMARY KEY,
                advisor_id INTEGER NOT NULL,
                user_id INTEGER,
                overall_rating INTEGER NOT NULL
                    CHECK (overall_rating BETWEEN 1 AND 5),
                communication_rating INTEGER NOT NULL
                    CHECK (communication_rating BETWEEN 1 AND 5),
                availability_rating INTEGER NOT NULL
                    CHECK (availability_rating BETWEEN 1 AND 5),
                comment TEXT,
                would_recommend BOOLEAN NOT NULL,
                review_date DATE NOT NULL DEFAULT CURRENT_DATE,
                likes INTEGER NOT NULL DEFAULT 0
                    CHECK (likes >= 0),
                reported BOOLEAN NOT NULL DEFAULT FALSE,

                FOREIGN KEY (advisor_id)
                    REFERENCES advisors(advisor_id) ON DELETE CASCADE,

                FOREIGN KEY (user_id)
                    REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE UNIQUE INDEX IF NOT EXISTS unique_user_advisor_review
            ON reviews (advisor_id, user_id)
            WHERE user_id IS NOT NULL;
        `);

        await client.query(`
            CREATE TABLE review_likes (
                review_id INTEGER NOT NULL
                    REFERENCES reviews(review_id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (review_id, user_id)
            );
        `);

        // Create trigger to recalculate advisor rating on update
        await client.query(`
            CREATE OR REPLACE FUNCTION update_advisor_rating()
            RETURNS TRIGGER AS $$
            DECLARE
                target_advisor_id INT;
            BEGIN
                -- Identify which advisor was affected based on the operation type
                IF (TG_OP = 'DELETE') THEN
                    target_advisor_id := OLD.advisor_id;
                ELSE
                    target_advisor_id := NEW.advisor_id;
                END IF;

                -- Recalculate average rating for that advisor
                UPDATE advisors
                SET rating = (
                    SELECT ROUND(AVG(overall_rating)::numeric, 2)
                    FROM reviews
                    WHERE advisor_id = target_advisor_id
                )
                WHERE advisor_id = target_advisor_id;

                RETURN NULL; -- AFTER triggers return NULL
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Attach the trigger to the reviews table
        await client.query(`
            DROP TRIGGER IF EXISTS trigger_update_advisor_rating ON reviews;

            CREATE TRIGGER trigger_update_advisor_rating
            AFTER INSERT OR UPDATE OR DELETE ON reviews
            FOR EACH ROW
            EXECUTE FUNCTION update_advisor_rating();
        `);

        // Bulk insert all US universities
        const placeholders = usUniversities.map((_, i) => `($${i + 1})`).join(", ");
        await client.query(
            `INSERT INTO universities (name) VALUES ${placeholders} ON CONFLICT (name) DO NOTHING;`,
            usUniversities
        );

        // Insert seed advisors mapped to their respective university
        await client.query(`
            INSERT INTO advisors (university_id, first_name, last_name, email, department, office) VALUES
            ((SELECT university_id FROM universities WHERE name = 'Harvard University'), 'Sarah', 'Conner', 'sconner@harvard.edu', 'Computer Science', 'Maxwell Dworkin 214'),
            ((SELECT university_id FROM universities WHERE name = 'Harvard University'), 'David', 'Malan', 'dmalan@harvard.edu', 'Computer Science', 'Science Center 102'),
            ((SELECT university_id FROM universities WHERE name = 'Stanford University'), 'Andrew', 'Ng', 'ang@stanford.edu', 'Artificial Intelligence', 'Gates Building 154'),
            ((SELECT university_id FROM universities WHERE name = 'Stanford University'), 'Jennifer', 'Widom', 'jwidom@stanford.edu', 'Computer Science', 'Packard Building 202'),
            ((SELECT university_id FROM universities WHERE name = 'Massachusetts Institute of Technology'), 'Gilbert', 'Strang', 'gstrang@mit.edu', 'Mathematics', 'Building 2-265'),
            ((SELECT university_id FROM universities WHERE name = 'University of California, Berkeley'), 'Michael', 'Jordan', 'jordan@berkeley.edu', 'Data Science', 'Soda Hall 387'),
            ((SELECT university_id FROM universities WHERE name = 'Columbia University'), 'Jeannette', 'Wing', 'jwing@columbia.edu', 'Computer Science', 'Mudd Hall 450');
        `);

        // COMMIT means every query succeeded, so save all changes
        await client.query("COMMIT");

        console.log("✅ Database tables reset successfully");
        console.log(`✅ universities table created and prefilled with ${usUniversities.length} US universities`);
        console.log("✅ users table created");
        console.log("✅ advisors table created");
        console.log("✅ reviews table created");
    } catch (error) {
        if (client) {
            // ROLLBACK means failed, undo everything since BEGIN line
            await client.query("ROLLBACK")
        }

        console.error("⚠️ Error resetting database:", error)
    } finally {
        if (client) {
            // return the specific db connection back to pool
            client.release();
        }

        // shut down the entire connection pool (for resource cleanup and efficiency)
        await pool.end();
    }
};

resetDatabase()
