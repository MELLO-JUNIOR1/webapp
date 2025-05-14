import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress } from '@mui/material'
import { useAuthStore } from '@/lib/store'

interface LayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function Layout({ children, requireAuth = false }: LayoutProps) {
  const router = useRouter()
  const { user, userRole, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push('/sign-in')
    }
  }, [loading, requireAuth, user, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Service Marketplace
          </Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => router.push('/profile')}>
                Profile
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => router.push('/sign-in')}>
                Sign In
              </Button>
              <Button color="inherit" onClick={() => router.push('/sign-up')}>
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" className="flex-grow py-8">
        {children}
      </Container>

      <footer className="bg-gray-100 py-6">
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Service Marketplace. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </div>
  )
} 