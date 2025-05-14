'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { ServiceRequest } from '@/models/types'
import { getCustomerRequests } from '@/services/requests'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return
      try {
        const data = await getCustomerRequests(user.id)
        setRequests(data)
      } catch (error) {
        console.error('Error loading requests:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to view your requests.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Service Requests</h1>
        <Link href="/requests/new">
          <Button>Create New Request</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You haven't created any service requests yet.
          </p>
          <Link href="/requests/new">
            <Button>Create Your First Request</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 bg-card"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{request.title}</h2>
                <span className="px-2 py-1 rounded text-sm bg-primary/10 text-primary">
                  {request.status}
                </span>
              </div>
              <p className="text-muted-foreground mb-2">
                {request.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {formatDate(new Date(request.createdAt))}
                </span>
                <Link href={`/requests/${request.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 