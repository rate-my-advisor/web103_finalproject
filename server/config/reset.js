import "./dotenv.js";
import { pool } from "./database.js";

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
        // reminder: reviews depend on advisors/students,
        //           advisors depend on universities
        await client.query(`
            DROP TABLE IF EXISTS reviews;
            DROP TABLE IF EXISTS advisors;
            DROP TABLE IF EXISTS students;
            DROP TABLE IF EXISTS universities;
        `);

        // create parent tables first
        await client.query(`
            CREATE TABLE universities (
                university_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );
        `);

        await client.query(`
            CREATE TABLE students (
                student_id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                major VARCHAR(255) NOT NULL,
                graduation_year INTEGER NOT NULL
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

                FOREIGN KEY (university_id)
                    REFERENCES universities(university_id)
            );
        `);

        // reviews connected to exisitng advisor/student
        // should we include CHECK's? like CHECK (overall_rating BETWEEN 1 AND 5)
        await client.query(`
            CREATE TABLE reviews (
                review_id SERIAL PRIMARY KEY,
                advisor_id INTEGER NOT NULL,
                student_id INTEGER NOT NULL,
                overall_rating INTEGER NOT NULL,
                communication_rating INTEGER NOT NULL,
                availability_rating INTEGER NOT NULL,
                comment TEXT,
                would_recommend BOOLEAN NOT NULL,
                review_date DATE NOT NULL DEFAULT CURRENT_DATE,

                FOREIGN KEY (advisor_id)
                    REFERENCES advisors(advisor_id),

                FOREIGN KEY (student_id)
                    REFERENCES students(student_id)
            );
        `);

        // COMMIT means every query succeeded, so save all changes
        await client.query("COMMIT");

        console.log("✅ Database tables reset successfully");
        console.log("✅ universities table created");
        console.log("✅ students table created");
        console.log("✅ advisors table created");
        console.log("✅ reviews table created");
        console.log("ℹ️ Tables are empty and ready for user input");
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