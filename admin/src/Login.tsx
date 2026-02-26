import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Security 
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface LoginResponse {
  success: boolean
  token?: string
  user?: any
  requiresTwoFactor?: boolean
  sessionId?: string
  method?: string
  error?: string
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    telegramCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data: LoginResponse = await response.json()

      if (data.requiresTwoFactor) {
        setShowTwoFactor(true)
        setSessionId(data.sessionId || '')
        setError('Введите код из Telegram')
      } else if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        setError(data.error || 'Ошибка входа')
      }
    } catch (error) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleTelegramCodeSubmit = async () => {
    if (!formData.telegramCode) {
      setError('Введите код из Telegram')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          telegramCode: formData.telegramCode
        })
      })

      const data: LoginResponse = await response.json()

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        setError(data.error || 'Неверный код')
      }
    } catch (error) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Админка
            </Typography>
            <Typography variant="body2" color="text.secondary">
              GrinderMaster Panel
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!showTwoFactor ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Пароль"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Войти'}
              </Button>
            </form>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Двухфакторная аутентификация
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Код отправлен в Telegram
              </Typography>

              <TextField
                fullWidth
                label="Код из Telegram"
                name="telegramCode"
                value={formData.telegramCode}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="123456"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleTelegramCodeSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Подтвердить'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowTwoFactor(false)}
              >
                Назад
              </Button>
            </Box>
          )}

          <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
            Вход только для администраторов
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
