import './dotenv.js'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { pool } from './database.js'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL

const options = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
};

const verifyFunction = async (accessToken, refreshToken, profile, done) => {
    try {
        const githubId = profile.id
        const username = profile.username
        const name = profile.displayName || profile.username
        const avatarUrl = profile.photos?.[0]?.value || null

        const existingUser = await pool.query(
            'SELECT id, github_id, username, name, major, graduation_year, avatar_url, created_at FROM users WHERE github_id = $1',
            [githubId]
        )

        if (existingUser.rows.length > 0) {
            return done(null, existingUser.rows[0])
        }

        const newUser = await pool.query(
            'INSERT INTO users (github_id, username, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, github_id, username, name, major, graduation_year, avatar_url, created_at',
            [githubId, username, name, avatarUrl]
        )

        return done(null, newUser.rows[0])
    } catch (error) {
        return done(error, null)
    }
}

passport.use(new GitHubStrategy(options, verifyFunction))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query(
            'SELECT id, github_id, username, name, major, graduation_year, avatar_url, created_at FROM users WHERE id = $1',
            [id]
        )
        if (user.rows.length > 0) {
            done(null, user.rows[0])
        } else {
            done(null, null)
        }
    } catch (error) {
        done(error, null)
    }
})

export default passport
