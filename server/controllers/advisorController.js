import { pool } from '../config/database.js'

const getAdvisors = async (req, res) => {
    try {
        const results = await pool.query(`
            SELECT
                a.*,
                u.name AS university_name
            FROM advisors AS a
            JOIN universities AS u
                ON a.university_id = u.university_id
            ORDER BY a.advisor_id ASC
        `)

        res.status(200).json(results.rows)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const getAdvisorById = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId) || advisorId <= 0) {
            return res.status(400).json({ message: 'Invalid advisor ID' })
        }

        const results = await pool.query(
            `
                SELECT
                    a.*,
                    u.name AS university_name
                FROM advisors AS a
                JOIN universities AS u
                    ON a.university_id = u.university_id
                WHERE a.advisor_id = $1
            `,
            [advisorId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const createAdvisor = async (req, res) => {
    let client
    let transactionStarted = false

    try {
        // add university_name to associate id with name
        const {
            university_id,
            university_name,
            first_name,
            last_name,
            email,
            department,
            office
        } = req.body

        // check university_id and university_name before proceeding
        const hasUniversityId = 
            university_id !== undefined &&
            university_id !== null &&
            university_id !== ""

        const hasUniversityName = 
            typeof university_name === "string" &&
            university_name.trim() !== ""

        // allow only either university_id or university_name, not both given
        if (hasUniversityId && hasUniversityName) {
            return res.status(400).json({
                message: "Give either university_id or university_name, NOT BOTH!"
            })
        }

        // require either one to be provided
        if (!hasUniversityId && !hasUniversityName) {
            return res.status(400).json({
                message:
                    "Either university_id or university_name is required"
            })
        }

        // require other information to be given
        if (
            typeof first_name !== "string" ||
            !first_name.trim() ||
            typeof last_name !== "string" ||
            !last_name.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof department !== "string" ||
            !department.trim()
        ) {
            return res.status(400).json({
                message:
                    "first_name, last_name, email, and department are required"
            })
        }

        let universityId

        if (hasUniversityId) {
            universityId = Number(university_id)

            if (
                !Number.isInteger(universityId) ||
                universityId <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid university ID"
                })
            }
        }

        // pull one specific connection from pool
        client = await pool.connect()

        await client.query("BEGIN")
        transactionStarted = true

        // in the existing dropdown selection, make sure university_id exists
        if (hasUniversityId) {
            const universityResults = await client.query(
                `
                    SELECT university_id
                    FROM universities
                    WHERE university_id = $1
                `,
                [universityId]
            )

            // that specific university doesn't exist
            if (universityResults.rows.length === 0) {
                // undo all changes made since BEGIN
                await client.query("ROLLBACK")
                transactionStarted = false

                return res.status(404).json({
                    message: "University not found!"
                })
            }
        }

        // university not in dropdown --> user types manually
        if (hasUniversityName) {
            // add new university in universities table
            const universityResults = await client.query(
                `
                    INSERT INTO universities (name)
                    VALUES ($1)
                    ON CONFLICT (name)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING university_id
                `,
                [university_name.trim()]
            )

            // put university_id into universityId
            universityId = universityResults.rows[0].university_id
        }

        // validate office
        if (
            office !== undefined &&
            office !== null &&
            typeof office !== "string"
        ) {
            return res.status(400).json({
                message: "office must be a string"
            })
        }

        const advisorResults = await client.query(
            `
                INSERT INTO advisors (
                    university_id,
                    first_name,
                    last_name,
                    email, 
                    department,
                    office
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
            [
                universityId,
                first_name.trim(),
                last_name.trim(),
                email.trim().toLowerCase(),
                department.trim(),
                office?.trim() || null
            ]
        )

        // commit all valid changes and end transaction
        await client.query("COMMIT")
        transactionStarted = false

        res.status(201).json(advisorResults.rows[0])
    } catch (err) {
        if (client && transactionStarted) {
            await client.query("ROLLBACK")
        }

        // 23505 is unique violation, which means the email already exists in the advisors table
        if (err.code === "23505") {
            return res.status(409).json({
                message: "An advisor with that email already exists",
            });
        }

        console.error(err);

        // 500 is internal server error, which means something went wrong on the server side
        return res.status(500).json({
            message: "Unable to create advisor",
        });
    } finally {
        if (client) {
            client.release()
        }
    }
}

const updateAdvisor = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId) || advisorId <= 0) {
            return res.status(400).json({
                message: "Invalid advisor ID",
            });
        }

        const {
            university_id,
            first_name,
            last_name,
            email,
            department,
            office
        } = req.body

        // make sure at least one field was provided for update
        const noFieldsProvided =
            university_id === undefined &&
            first_name === undefined &&
            last_name === undefined &&
            email === undefined &&
            department === undefined &&
            office === undefined

        if (noFieldsProvided) {
            return res.status(400).json({
                message: "At least one field must be provided"
            })
        }

        // check university_id
        const universityId =
            university_id === undefined
                ? null
                : Number(university_id);

        if (
            university_id !== undefined &&
            (!Number.isInteger(universityId) || univeristyId <= 0)
        ) {
            return res.status(400).json({
                message: "Invalid university ID",
            });
        }

        // check if all inputs are answered and types match
        if (
            first_name !== undefined &&
            (typeof first_name !== "string" || !first_name.trim())
        ) {
            return res.status(400).json({
                message: "first_name must be a non-empty string"
            })
        }

        if (
            last_name !== undefined &&
            (typeof last_name !== "string" || !last_name.trim())
        ) {
            return res.status(400).json({
                message: "last_name must be a non-empty string"
            })
        }

        if (
            email !== undefined &&
            (typeof email !== "string" || !email.trim())
        ) {
            return res.status(400).json({
                message: "email must be a non-empty string"
            })
        }

        if (
            department !== undefined &&
            (typeof department !== "string" || !department.trim())
        ) {
            return res.status(400).json({
                message: "department must be a non-empty string"
            })
        }

        if (
            office !== undefined &&
            office !== null &&
            typeof office !== "string"
        ) {
            return res.status(400).json({
                message: "office must be a string"
            })
        }


        const results = await pool.query(
            `
                UPDATE advisors
                SET university_id = COALESCE($1, university_id),
                    first_name = COALESCE($2, first_name),
                    last_name = COALESCE($3, last_name),
                    email = COALESCE($4, email),
                    department = COALESCE ($5, department),
                    office = COALESCE($6, office)
                WHERE advisor_id = $7
                RETURNING *
            `,
            [
                universityId,
                first_name === undefined
                    ? null
                    : first_name.trim(),
                last_name === undefined
                    ? null
                    : last_name.trim(),
                email === undefined
                    ? null
                    : email.trim().toLowerCase(),
                department === undefined
                    ? null
                    : department.trim(),
                office === undefined
                    ? null
                    : office?.trim() || null,
                advisorId
            ],
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({
                message: "University does not exist",
            });
        }

        if (err.code === "23505") {
            return res.status(409).json({
                message: "An advisor with that email already exists",
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Unable to update advisor",
        });
    }
}

const deleteAdvisor = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId) || advisorId <= 0) {
            return res.status(400).json({
                message: "Invalid advisor ID",
            });
        }

        const results = await pool.query(
            `
                DELETE FROM advisors
                WHERE advisor_id = $1
                RETURNING *
            `,
            [advisorId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor cannot be deleted' })
        }

        res.status(200).json({
            message: 'Advisor deleted successfully',
            deletedAdvisor: results.rows[0]
        })
    } catch (err) {
        // occurs when reviews still reference advisor
        if (err.code === "23503") {
            return res.status(409).json({
                message:
                "Advisor cannot be deleted because reviews are associated with them",
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Unable to delete advisor",
        });
    }
}

export default {
  getAdvisors,
  getAdvisorById,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
}