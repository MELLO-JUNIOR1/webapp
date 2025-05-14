'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Typography, Box, List, ListItem } from '@mui/material'

export function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [tables, setTables] = useState<{name: string, exists: boolean}[]>([])

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check each table
        const tablesToCheck = ['profiles', 'service_requests', 'reviews']
        const tableStatus = await Promise.all(
          tablesToCheck.map(async (table) => {
            const { data, error } = await supabase.from(table).select('count')
            return {
              name: table,
              exists: !error
            }
          })
        )
        
        setTables(tableStatus)
        setStatus('connected')
      } catch (error) {
        console.error('Error:', error)
        setStatus('error')
      }
    }

    checkConnection()
  }, [])

  return (
    <Box className="p-4">
      <Typography variant="h6" gutterBottom>
        Supabase Connection Status:
      </Typography>
      <Typography color={status === 'connected' ? 'success.main' : status === 'error' ? 'error.main' : 'info.main'}>
        {status === 'loading' ? 'Checking connection...' :
         status === 'connected' ? 'Connected to Supabase!' :
         'Error connecting to Supabase'}
      </Typography>

      {status === 'connected' && (
        <Box className="mt-4">
          <Typography variant="subtitle1" gutterBottom>
            Table Status:
          </Typography>
          <List>
            {tables.map((table) => (
              <ListItem key={table.name}>
                <Typography color={table.exists ? 'success.main' : 'error.main'}>
                  {table.name}: {table.exists ? '✓' : '✗'}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {status === 'error' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry Connection
        </Button>
      )}
    </Box>
  )
} 