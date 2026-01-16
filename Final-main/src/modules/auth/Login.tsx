import PasswordInput from '@/components/form/PasswordInput'
import { usePasswordToggle } from '@/hooks/useCommon'
import { useLoginForm } from '@/hooks/useLoginForm'

export default function Login() {
	const passwordToggle = usePasswordToggle()
	const {
		username,
		setUsername,
		password,
		setPassword,
		errors,
		isLoading,
		handleLogin,
	} = useLoginForm()

	return (
		<div className="login-container">
			<div className="login-card">
				<div className="logo">
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g>
							<line x1="32" y1="12" x2="32" y2="6" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
							<line x1="40" y1="14" x2="44" y2="10" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
							<line x1="24" y1="14" x2="20" y2="10" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
							<line x1="46" y1="20" x2="50" y2="18" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
							<line x1="18" y1="20" x2="14" y2="18" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
							<path d="M32 28C32 28 22 20 22 15C22 12 24 10 27 10C29 10 31 11 32 13C33 11 35 10 37 10C40 10 42 12 42 15C42 20 32 28 32 28Z" fill="#E91E63" stroke="#E91E63" strokeWidth="2" />
						</g>
						<path d="M12 38 Q17 35, 22 38 T32 38 T42 38 T52 38" stroke="#1A237E" strokeWidth="3" fill="none" strokeLinecap="round" />
						<path d="M12 44 Q17 41, 22 44 T32 44 T42 44 T52 44" stroke="#1A237E" strokeWidth="3" fill="none" strokeLinecap="round" />
					</svg>
				</div>
				<h2 className="title">CMS Login</h2>
				<form onSubmit={handleLogin}>
					<div className="form-group">
						<label htmlFor="username">Username or email</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username or email"
							className={errors.username ? 'error' : ''}
						/>
						<span className="error-message">{errors.username || ''}</span>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<PasswordInput
							value={password}
							onChange={setPassword}
							showPassword={passwordToggle.showPassword}
							onToggle={passwordToggle.togglePassword}
							hasError={!!errors.password}
						/>
						<span className="error-message">{errors.password || ''}</span>
					</div>
					<button type="submit" className="login-button" disabled={isLoading}>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	)
}

