import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import bg_authen from '@/assets/imgs/bg_authen.jpg';
import { CONSTANTS } from '@/Constant'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error , setError] = useState('')
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const success = await login(email, password)
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${localStorage.getItem(CONSTANTS.USERNAME)||""}!`,
      })
      const redirectPath = localStorage.getItem('redirectPath') || '/'
      localStorage.removeItem('redirectPath')
      navigate(redirectPath)
    } else {
      setError('Login failed. Please check your credentials and try again.')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 hidden lg:block" style={{ flex: '3' }}>
        <img
          src={bg_authen}
          alt="Sign In"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-6" style={{ flex: '2' }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password to sign in</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign In</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}