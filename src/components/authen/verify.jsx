import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp"
import { toast } from "@/hooks/use-toast"

export default function OTPVerification() {
  const [otp, setOTP] = useState("")

  const handleVerify = () => {
    if (otp.length === 6) {
      // This is where you'd typically make an API call to verify the OTP
      // For this example, we'll just simulate a successful verification
      toast({
        title: "OTP Verified",
        description: `Your OTP (${otp}) has been successfully verified.`,
      })
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Verify Your OTP
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the 6-digit code sent to your device
          </p>
        </div>

        <div className="mt-8 space-y-6 flex flex-col items-center">
          <InputOTP
            className="flex justify-center gap-2"
            maxLength={6}
            value={otp}
            onChange={setOTP}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button 
            className="w-full" 
            onClick={handleVerify}
            disabled={otp.length !== 6}
          >
            Verify OTP
          </Button>
        </div>
      </div>
    </div>
  )
}