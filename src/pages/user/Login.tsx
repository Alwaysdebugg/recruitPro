import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Custom styled components with Apple-like styling
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  position: 'relative',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '460px',
  padding: theme.spacing(4),
  borderRadius: '18px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f5f5f7',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0071e3',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#86868b',
  },
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px',
  fontSize: '17px',
  fontWeight: 400,
  textTransform: 'none',
  backgroundColor: '#0071e3',
  '&:hover': {
    backgroundColor: '#0077ed',
  },
}));

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement login logic
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your email and password');
      }

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Typography
        variant="h4"
        component="h3"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          fontWeight: 700,
          color: "#1d1d1f",
          letterSpacing: "-0.5px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        RecruitPro
      </Typography>
      {/* login form */}
      <StyledBox>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 4,
            color: "#1d1d1f",
          }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 3,
              borderRadius: "12px",
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ marginTop: 3, marginBottom: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </StyledButton>

          <Box sx={{ textAlign: "center" }}>
            <Link
              href="/register"
              sx={{
                color: "#0071e3",
                textDecoration: "none",
                fontSize: "14px",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </form>
      </StyledBox>
    </StyledContainer>
  );
} 