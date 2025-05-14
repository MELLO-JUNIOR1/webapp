'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { ServiceRequest } from '@/models/types'
import { getWorkerJobs, getWorkerAcceptedJobs, updateRequest } from '@/services/requests'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function JobsPage() {
  const { user } = useAuth()
  const [availableJobs, setAvailableJobs] = useState<ServiceRequest[]>([])
  const [acceptedJobs, setAcceptedJobs] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJobs = async () => {
      if (!user || !user.profession) return
      try {
        const [available, accepted] = await Promise.all([
          getWorkerJobs(user.profession),
          getWorkerAcceptedJobs(user.id)
        ])
        setAvailableJobs(available)
        setAcceptedJobs(accepted)
      } catch (error) {
        console.error('Error loading jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [user])

  const handleAcceptJob = async (jobId: string) => {
    if (!user) return
    try {
      await updateRequest(jobId, {
        workerId: user.id,
        status: 'accepted'
      })
      // Refresh jobs
      const [available, accepted] = await Promise.all([
        getWorkerJobs(user.profession!),
        getWorkerAcceptedJobs(user.id)
      ])
      setAvailableJobs(available)
      setAcceptedJobs(accepted)
    } catch (error) {
      console.error('Error accepting job:', error)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to view available jobs.</p>
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
      {/* Accepted Jobs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Accepted Jobs</h2>
        {acceptedJobs.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't accepted any jobs yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {acceptedJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="px-2 py-1 rounded text-sm bg-primary/10 text-primary">
                    {job.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">
                  {job.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-muted-foreground mr-4">
                      {formatDate(new Date(job.createdAt))}
                    </span>
                    {job.budget && (
                      <span className="font-medium">
                        {formatCurrency(job.budget)}
                      </span>
                    )}
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available Jobs Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>
        {availableJobs.length === 0 ? (
          <p className="text-muted-foreground">
            No available jobs in your profession at the moment.
          </p>
        ) : (
          <div className="grid gap-4">
            {availableJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="px-2 py-1 rounded text-sm bg-primary/10 text-primary">
                    {job.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">
                  {job.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-muted-foreground mr-4">
                      {formatDate(new Date(job.createdAt))}
                    </span>
                    {job.budget && (
                      <span className="font-medium">
                        {formatCurrency(job.budget)}
                      </span>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptJob(job.id)}
                    >
                      Accept Job
                    </Button>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
} 