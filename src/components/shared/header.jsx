import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"
import Logo from "../../assets/logo/logo_nobg.png"
import { ENDPOINTS } from '@/Constant'
import { Bell } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from '@/contexts/AuthContext'
import * as signalR from '@microsoft/signalr'

function LogoSite(props) {
  return (
    <img src={Logo} alt="Logo" {...props} />
  )
}

export default function Header() {
  const [isLoading, setIsLoading] = useState(true)
  const { isLoggedIn, username, logout } = useAuth()
  const [connection, setConnection] = useState()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const timeDifference = useCallback((timestamp) => {
    const now = new Date()
    const givenTime = new Date(timestamp)
    const diffMs = now - givenTime

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffMinutes < 60) return `${diffMinutes} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 30) return `${diffDays} ngày trước`
    if (diffMonths < 12) return `${diffMonths} tháng trước`
    return `${diffYears} năm trước`
  }, [])

  const handleLoginClick = () => navigate('/login')
  const handleSignupClick = () => navigate('/signup')

  const handleLogout = async () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleViewAllNotifications = () => navigate('/all-notifications')

  const initializeSignalRConnection = useCallback(async () => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(ENDPOINTS.NOTIFICATION_HUB)
      .withAutomaticReconnect()
      .build()

    try {
      await newConnection.start()
      console.log("SignalR Connected")
      setConnection(newConnection)

      newConnection.on("ReceiveNotification", (notification, userId) => {
        setNotifications(prevNotifications => [
          {
            id: notification.id,
            title: notification.title,
            time: timeDifference(notification.createdDate),
            url: notification.url,
            isRead: false,
          },
          ...prevNotifications
        ])
        setUnreadCount(prevCount => prevCount + 1)
        toast({
          title: "New Notification",
          description: notification.description,
        })
      })
    } catch (err) {
      console.error("SignalR Connection Error:", err)
    }
  }, [timeDifference, toast])

  const fetchInitialNotifications = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINTS.GET_NOTIFICATIONS + "?userId=1")
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.map(notification => ({
        ...notification,
        time: timeDifference(notification.createdDate)
      })))
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive"
      })
    }
  }, [timeDifference, toast])

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${ENDPOINTS.MARK_NOTIFICATION_READ}/${notificationId}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to mark notification as read')
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      )
      setUnreadCount(prevCount => prevCount - 1)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    fetchInitialNotifications();
    initializeSignalRConnection();
    return () => clearTimeout(timer)
  }, [])



  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000)
  //   if (isLoggedIn) {
  //     initializeSignalRConnection()
  //   }
  //   return () => {
  //     clearTimeout(timer)
  //     if (connection) {
  //       connection.stop()
  //     }
  //   }
  // }, [isLoggedIn, initializeSignalRConnection, fetchInitialNotifications, connection])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
          <Skeleton className="h-12 w-48 mr-6 hidden lg:flex" />
          <div className="ml-auto flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link to="/" className="mr-6 hidden lg:flex">
          <LogoSite className="h-48 w-48" />
          <span className="sr-only">Hola Housing</span>
        </Link>
        <div className="ml-auto flex gap-2 items-center">
          <Link to="/post" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors transition-all duration-100 hover:scale-105 hover:bg-primary/90 focus:bg-primary/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50">Đăng bài</Link>
          <Link to="/aboutUs" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50">Về chúng tôi</Link>
          <Link to="/properties" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50">Danh sách nhà trọ</Link>
          {/* <Link to="/news" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50">Tin tức</Link>
          <Link to="/postNews" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50">Đăng tin tức</Link> */}

          {isLoggedIn ? (
            <>
              <Popover>
                <PopoverTrigger className='p-0' asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Notifications</h4>
                      <p className="text-sm text-muted-foreground">You have {unreadCount} notifications unread</p>
                    </div>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <Link 
                          to={notification.url} 
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div
                            className={`flex items-start gap-4 rounded-md p-2 hover:bg-accent ${notification.isRead ? 'bg-background' : 'bg-accent'}`}
                          >
                            <Bell className="mt-1 h-5 w-5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.time}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Button onClick={handleViewAllNotifications} variant="outline" className="w-full">
                      View All Notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Link to="/profile" className="mx-2 text-sm font-medium text-primary hover:text-primary/80">
                Hello, {username}
              </Link>
              <Button className="justify-self-end" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="justify-self-end" onClick={handleLoginClick}>
                Sign in
              </Button>
              <Button className="justify-self-end" onClick={handleSignupClick}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>
    </div>
  )
}