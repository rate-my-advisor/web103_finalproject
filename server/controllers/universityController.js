import { pool } from "../config/database.js";

// get/display all currently-added universities
const getUniversities = async (req, res) => {
    try {
        const results = await pool.query(`
            SELECT *
            FROM universities
            ORDER BY name ASC
        `);

        return res.status(200).json(results.rows);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to retrieve universities",
        });
    }
};

// get all advisors for a specific university
const getAdvisorsByUniversity = async (req, res) => {
    try {
        const universityId = Number(req.params.universityId);

        if (!Number.isInteger(universityId) || universityId <= 0) {
            return res.status(400).json({
                message: "Invalid university ID",
            });
        }

        // confirm university exists fr
        const universityResults = await pool.query(
            `
                SELECT *
                FROM universities
                WHERE university_id = $1
            `,
            [universityId],
        );

        if (universityResults.rows.length === 0) {
            return res.status(404).json({
                message: "University not found",
            });
        }

        // get all advisors belonging to that specific university
        const advisorResults = await pool.query(
            `
                SELECT *
                FROM advisors
                WHERE university_id = $1
                ORDER BY last_name ASC, first_name ASC
            `,
            [universityId],
        );

        return res.status(200).json({
            university: universityResults.rows[0],
            advisors: advisorResults.rows,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to retrieve university advisors",
        });
    }
};

export default {
  getUniversities,
  getAdvisorsByUniversity
};