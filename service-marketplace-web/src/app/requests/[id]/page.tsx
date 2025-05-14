'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { ServiceRequest, Message } from '@/models/types'
import { getRequest, updateRequest } from '@/services/requests'
import { getMessages, sendMessage, subscribeToMessages } from '@/services/messages'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function RequestDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const data = await getRequest(id as string)
        setRequest(data)
        const messageData = await getMessages(id as string)
        setMessages(messageData)
      } catch (error) {
        console.error('Error loading request:', error)
        setError('Error loading request details')
      } finally {
        setLoading(false)
      }
    }

    loadRequest()

    // Subscribe to real-time messages
    const unsubscribe = subscribeToMessages(id as string, (messages) => {
      setMessages(messages)
    })

    return () => unsubscribe()
  }, [id])

  const handleSendMessage = async () => {
    if (!user || !request || !newMessage.trim()) return

    try {
      await sendMessage({
        senderId: user.id,
        receiverId: request.workerId || request.customerId,
        requestId: request.id,
        content: newMessage.trim(),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleUpdateStatus = async (newStatus: ServiceRequest['status']) => {
    if (!request) return

    try {
      await updateRequest(request.id, { status: newStatus })
      setRequest({ ...request, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
    }
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

  if (error || !request) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error || 'Request not found'}</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{request.title}</h1>
          <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
            {request.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Category</dt>
                <dd>{request.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Location</dt>
                <dd>{request.location}</dd>
              </div>
              {request.budget && (
                <div>
                  <dt className="text-sm text-muted-foreground">Budget</dt>
                  <dd>{formatCurrency(request.budget)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted-foreground">Created</dt>
                <dd>{formatDate(new Date(request.createdAt))}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{request.description}</p>
          </div>
        </div>

        {user && (
          <div className="mt-6">
            {user.id === request.customerId && request.status === 'completed' && (
              <Button
                onClick={() => handleUpdateStatus('completed')}
                className="w-full"
              >
                Mark as Completed
              </Button>
            )}
            {user.id === request.workerId && request.status === 'accepted' && (
              <Button
                onClick={() => handleUpdateStatus('in_progress')}
                className="w-full"
              >
                Start Work
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="border rounded-lg p-4 bg-card">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {formatDate(new Date(message.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-md border bg-background"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 