import express from 'express'
import bcrypt from 'bcryptjs'
import passport from '../config/passport.js'
import { pool } from '../config/database.js'

const router = express.Router()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// Register a new local user
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, name } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username.trim().toLowerCase()]
        )

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username is already taken.' })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`

        const newUserResult = await pool.query(
            `INSERT INTO users (username, password_hash, name, avatar_url)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, name, avatar_url, created_at`,
            [username.trim().toLowerCase(), passwordHash, name?.trim() || username.trim(), avatarUrl]
        )

        const user = newUserResult.rows[0]

        // Establish passport session
        req.login(user, (err) => {
            if (err) return next(err)
            return res.status(201).json({ message: 'Registration successful', user })
        })
    } catch (err) {
        console.error('Registration error:', err)
        res.status(500).json({ message: 'Server error during registration.' })
    }
})

// Login local user
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' })
        }

        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username.trim().toLowerCase()]
        )

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }

        const user = userResult.rows[0]

        if (!user.password_hash) {
            return res.status(400).json({ message: 'Account was registered via GitHub. Please login with GitHub.' })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }

        const safeUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar_url: user.avatar_url,
            created_at: user.created_at
        }

        req.login(safeUser, (err) => {
            if (err) return next(err)
            return res.status(200).json({ message: 'Login successful', user: safeUser })
        })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Server error during login.' })
    }
})

// Start GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

// GitHub Callback
router.get(
    '/github/callback',
    passport.authenticate('github', {
        successRedirect: CLIENT_URL,
        failureRedirect: `${CLIENT_URL}/login?error=auth_failed`
    })
)

// Get logged-in user details
router.get('/user', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.status(200).json({ user: req.user })
    } else {
        res.status(200).json({ user: null })
    }
})

// Logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.status(200).json({ message: 'Logged out successfully' })
        })
    })
})

export default router
