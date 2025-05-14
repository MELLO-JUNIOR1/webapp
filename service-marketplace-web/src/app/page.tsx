'use client'

import { Layout } from '@/components/layout/layout'
import { Button, Typography, Box, Grid, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'
import { TestConnection } from '@/components/test-connection'

export default function Home() {
  const router = useRouter()

  return (
    <Layout>
      <TestConnection />
      <Box className="text-center py-12">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Service Marketplace
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          Connect with skilled workers or find work opportunities
        </Typography>
        <Grid container spacing={4} justifyContent="center" className="mt-8">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push('/sign-up')}
            >
              Get Started
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => router.push('/about')}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={4} className="mt-16">
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" gutterBottom>
                For Customers
              </Typography>
              <Typography>
                Find skilled professionals for your service needs quickly and easily.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" gutterBottom>
                For Workers
              </Typography>
              <Typography>
                Connect with customers and grow your service business.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" gutterBottom>
                Secure & Easy
              </Typography>
              <Typography>
                Safe payments and verified professionals at your service.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
} 