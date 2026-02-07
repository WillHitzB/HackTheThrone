import { useForm } from 'react-hook-form'
import { useState } from 'react'
import styles from './login.module.css'
import { url } from '../../data/constant'
import { useNavigate } from 'react-router-dom'

type LoginFormData = {
  username: string
  password: string
  is_sign_in: boolean
}

const Login = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      is_sign_in: false // Default to login mode
    }
  })

  // Watch the checkbox value to change button text
  const isSignup = watch('is_sign_in')

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasLetter = /[A-Za-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*#?&]/.test(password)

    if (!(hasMinLength && hasLetter && hasNumber && hasSpecialChar)) {
      return 'Password must be at least 8 characters long, contain a letter, a number, and a special character'
    }
    return true
  }

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form Data:', data)
    setLoginError('')

    if (!data.is_sign_in) {
      // LOGIN LOGIC
      try {
        const body = new URLSearchParams()
        body.append('username', data.username)
        body.append('password', data.password)

        console.log('Login Data:', data)

        const response = await fetch(`${url}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          setLoginError(errorData.message || 'Invalid username or password')
          console.error('Login failed', response.status)
          return
        }

        const result = await response.json()
        console.log('Login Response:', result)

        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('username', data.username)

        console.log('Logged in')
        window.location.href = '/'
      } catch (err) {
        console.error('Login error', err)
        setLoginError('An error occurred. Please try again.')
      }
    } else {
      // SIGNUP LOGIC
      try {
        console.log('Signup Data:', data)

        const response = await fetch(`${url}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          setLoginError(errorData.message || 'Signup failed')
          console.error('Signup failed', response.status)
          return
        }

        const result = await response.json()
        console.log('Signup Response:', result)

        // Auto-login after signup
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('username', data.username)

        console.log('Signed up successfully')
        setTimeout(() => {
          window.location.href = '/'
        }, 20000);
      } catch (err) {
        console.error('Signup error', err)
        setLoginError('An error occurred during signup. Please try again.')
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {loginError && (
            <p className={styles.error} style={{ marginBottom: '1rem' }}>
              {loginError}
            </p>
          )}

          <div>
            <label className={styles.label}>Username</label>
            <input
              {...register('username', {
                required: 'This field is required',
                minLength: { value: 8, message: 'Minimum 8 characters' }
              })}
              className={styles.input}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            {errors.username?.message && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'This field is required',
                validate: validatePassword
              })}
              className={styles.input}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password?.message && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {/* Checkbox to toggle signup */}
          <div style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>
              <input
                type="checkbox"
                {...register('is_sign_in')}
                style={{ marginRight: '0.5rem' }}
              />
              Create a new account (Sign up)
            </label>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting 
              ? (isSignup ? 'Signing up...' : 'Logging in...') 
              : (isSignup ? 'Sign Up' : 'Login')
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login