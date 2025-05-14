'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { supabase } from '@/lib/supabase'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import type { Profile, ServiceRequest } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/sign-in')
          return
        }

        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setProfile(profileData)

        // Get relevant service requests
        const { data: requestsData } = await supabase
          .from('service_requests')
          .select('*')
          .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
          .order('created_at', { ascending: false })

        setRequests(requestsData || [])
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {profile?.full_name}!
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ mb: 4 }}>
          {profile?.role === 'customer' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/requests/new')}
            >
              Post New Service Request
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/requests/available')}
            >
              Find Work
            </Button>
          )}
        </Box>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Active Requests
              </Typography>
              <Typography variant="h4">
                {requests.filter(r => r.status === 'open').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">
                {requests.filter(r => r.status === 'assigned').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">
                {requests.filter(r => r.status === 'completed').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Requests */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Recent Requests
        </Typography>
        <Grid container spacing={3}>
          {requests.slice(0, 4).map((request) => (
            <Grid item xs={12} md={6} key={request.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {request.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Budget: ${request.budget}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => router.push(`/requests/${request.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {requests.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No requests found. 
              {profile?.role === 'customer' 
                ? ' Create your first service request!'
                : ' Start browsing available jobs!'}
            </Typography>
          </Paper>
        )}
      </Box>
    </Layout>
  )
} 