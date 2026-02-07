import { useForm } from 'react-hook-form'
import styles from './login.module.css'

type LoginFormData = {
  username: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange'
  })

  const validate_password=(password: string)=>{
    if(!(password.length>=8 && /[A-Za-z]/.test(password) && /\d/.test(password) && /[@$!%*#?&]/.test(password))){return "Password must be atleast 8 char long,contain a letter ,and a number"}
  else{
    return true;
  }
  }

const onSubmit = (data: LoginFormData) => {
  localStorage.setItem('username', data.username)
  console.log(localStorage.getItem('username'))
  window.location.reload();
}

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

          <div>
            <label className={styles.label}>Username</label>
            <input
              {...register('username', {
                required: 'This field is required',
                minLength: { value: 8, message: 'Minimum 8 characters' }
              })}
              className={styles.input}
              placeholder="Enter your username"
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
                validate : validate_password
              })}
              className={styles.input}
              placeholder="Enter your password"
            />
            {errors.password?.message && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={!isValid || isSubmitting}
          >
            Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login
