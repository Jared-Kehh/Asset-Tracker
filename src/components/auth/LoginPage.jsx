import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [mode,     setMode]     = useState('login')   // 'login' | 'forgot'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [resetSent,setResetSent]= useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(
        error.message.includes('Invalid login')
          ? 'Incorrect email or password. Please try again.'
          : error.message
      )
    }
    // On success, supabase auth state changes → App.jsx re-renders automatically
  }

  const handleForgot = async e => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Enter your email address above first.'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setResetSent(true)
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.leftInner}>
          <div className={styles.logoMark}>AT</div>
          <h1 className={styles.leftTitle}>Track every device.<br />Across every office.</h1>
          <p className={styles.leftSub}>
            AssetTrack gives your whole team a single real-time view of all your
            technology — no spreadsheets, no guesswork.
          </p>
          <div className={styles.features}>
            {[
              { icon: '🗂', text: 'Centralized asset inventory' },
              { icon: '📍', text: 'Multi-location support' },
              { icon: '📷', text: 'Barcode scanning' },
              { icon: '📊', text: 'Live dashboard & reports' },
            ].map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          {/* Logo for mobile */}
          <div className={styles.mobileLogo}>
            <div className={styles.logoMarkSm}>AT</div>
            <span>AssetTrack</span>
          </div>

          {mode === 'login' && (
            <>
              <h2 className={styles.cardTitle}>Welcome back</h2>
              <p className={styles.cardSub}>Sign in to your organization's account.</p>

              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.field}>
                  <label className={styles.label}>Email address</label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="you@yourorg.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Password</label>
                    <button
                      type="button"
                      className={styles.forgotLink}
                      onClick={() => { setMode('forgot'); setError('') }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className={styles.errorBox}>
                    <span>⚠️</span> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`${styles.btnSubmit} ${loading ? styles.btnLoading : ''}`}
                  disabled={loading}
                >
                  {loading
                    ? <><span className={styles.spinner} /> Signing in…</>
                    : 'Sign In →'
                  }
                </button>
              </form>

              <p className={styles.helpNote}>
                Need access? Contact your organization's administrator.
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <button className={styles.backBtn} onClick={() => { setMode('login'); setError(''); setResetSent(false) }}>
                ← Back to sign in
              </button>
              <h2 className={styles.cardTitle}>Reset your password</h2>
              <p className={styles.cardSub}>
                Enter your email and we'll send you a reset link.
              </p>

              {resetSent ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>✅</div>
                  <p><strong>Check your inbox.</strong></p>
                  <p>A password reset link has been sent to <strong>{email}</strong>.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleForgot}>
                  <div className={styles.field}>
                    <label className={styles.label}>Email address</label>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="you@yourorg.org"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div className={styles.errorBox}>
                      <span>⚠️</span> {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`${styles.btnSubmit} ${loading ? styles.btnLoading : ''}`}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className={styles.spinner} /> Sending…</>
                      : 'Send Reset Link →'
                    }
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
