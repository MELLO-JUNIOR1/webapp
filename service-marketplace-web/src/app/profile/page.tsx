'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Rating } from '@/models/types'
import { getUserRatings } from '@/services/ratings'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRatings = async () => {
      if (!user) return
      try {
        const data = await getUserRatings(user.id)
        setRatings(data)
      } catch (error) {
        console.error('Error loading ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRatings()
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to view your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd>{user.displayName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Role</dt>
                  <dd className="capitalize">{user.role}</dd>
                </div>
                {user.role === 'worker' && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Profession</dt>
                    <dd>{user.profession}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-muted-foreground">Member Since</dt>
                  <dd>{formatDate(new Date(user.createdAt))}</dd>
                </div>
              </dl>
            </div>

            {user.role === 'worker' && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Rating</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">
                    {user.rating?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({user.totalRatings || 0} reviews)
                  </div>
                </div>
              </div>
            )}
          </div>

          {user.role === 'worker' && ratings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="border rounded-lg p-4 bg-card"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold mr-2">
                          {rating.rating.toFixed(1)}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < rating.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(rating.createdAt))}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-muted-foreground">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 