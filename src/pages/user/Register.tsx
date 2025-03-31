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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { register } from '../../api/user/auth';

// Define form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Custom styled components with Apple-like styling
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
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

export function Register() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    register(data.firstName, data.lastName, data.email, data.password)
    .then((res) => {
      if (res) {
        console.log("register success", res);
        navigate("/login");
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    })
    .catch((err) => {
      setError(err.message);
      setIsLoading(false);
    });
  };

  return (
    <StyledContainer>
      <StyledBox>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 4,
            color: '#1d1d1f'
          }}
        >
          Create Your Account
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 3,
              borderRadius: '12px'
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Box>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
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
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                label="Confirm Password"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </StyledButton>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="/login"
              sx={{
                color: '#0071e3',
                textDecoration: 'none',
                fontSize: '14px',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Already have an account? Sign in
            </Link>
          </Box>
        </form>
      </StyledBox>
    </StyledContainer>
  );
}
