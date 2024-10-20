import React, { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, HelpCircle, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function PropertyPayment() {
  const navigate = useNavigate()
  const { id } = useParams() // Use this to retrieve property ID from route parameters
  const { toast } = useToast()

  // Example property data. In a real app, fetch it using the ID or from state.
  const propertyData = {
    title: "Sample Property",
    description: "A great property for rent.",
    price: 1000000,
  }

  const [selectedPackage, setSelectedPackage] = useState('pushListing')
  const [duration, setDuration] = useState(3)
  const [startDate, setStartDate] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)

  const packages = {
    pushListing: { 
      name: 'Đẩy tin', 
      price: 5000,
      description: 'Đẩy tin của bạn lên top danh sách',
      details: 'Gói Đẩy tin giúp tin đăng của bạn xuất hiện ở vị trí cao trong danh sách.'
    },
    multipleImages: { 
      name: 'Tin nhiều hình ảnh', 
      price: 15000,
      description: 'Hiển thị nhiều hình ảnh hơn cho tin đăng của bạn',
      details: 'Gói Tin nhiều hình ảnh cho phép bạn đăng tải và hiển thị nhiều hình ảnh hơn.'
    },
    priorityListing: { 
      name: 'Tin ưu tiên', 
      price: 90000,
      description: 'Hiển thị tin đăng ở vị trí ưu tiên trên trang tìm kiếm',
      details: 'Gói Tin ưu tiên đảm bảo tin đăng của bạn sẽ được hiển thị ở vị trí ưu tiên.'
    },
    comboPackage: {
      name: 'Tin nhiều ảnh + Đẩy tin',
      price: 17000,
      description: 'Kết hợp ưu điểm của Tin nhiều hình ảnh và Đẩy tin',
      details: 'Gói Tin nhiều ảnh + Đẩy tin là sự kết hợp hoàn hảo giữa hai tính năng.'
    }
  }

  const durations = [
    { days: 3, discount: 0.05 },
    { days: 7, discount: 0.10 },
    { days: 30, discount: 0.20 }
  ]

  const calculateTotal = useMemo(() => {
    const basePrice = packages[selectedPackage].price * duration
    const discount = durations.find(d => d.days === duration)?.discount || 0
    return Math.round(basePrice * (1 - discount))
  }, [selectedPackage, duration])

  const handleSubmit = async () => {
    if (!startDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày bắt đầu",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://api.vietqr.io/v2/generate', {
        method: 'POST',
        headers: {
          'x-client-id': 'c7d8a3cd-0aed-4994-8df0-b8b99146e151',
          'x-api-key': '68375ae5-097c-47f6-af3f-46f0f737fa26',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNo: '194517637',
          accountName: 'NGUYEN QUOC TRUNG',
          acqId: '970432',
          addInfo: '',
          amount: calculateTotal.toString(),
          template: 'compact',
        }),
      })
      const data = await response.json()
      setQrCodeUrl(data.data.qrDataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompletePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyData,
          paymentData: {
            package: selectedPackage,
            duration,
            startDate,
            totalAmount: calculateTotal,
          },
        }),
      })
      
      if (response.ok) {
        setIsPaymentComplete(true)
        toast({
          title: "Thành công",
          description: "Thanh toán đã được hoàn tất.",
          variant: "default",
        })
      } else {
        throw new Error('Payment completion failed')
      }
    } catch (error) {
      console.error('Error completing payment:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi hoàn tất thanh toán. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Cấu hình bài đăng</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin bất động sản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Tiêu đề:</strong> {propertyData.title}</div>
            <div><strong>Mô tả:</strong> {propertyData.description}</div>
            <div><strong>Giá:</strong> {propertyData.price.toLocaleString()} đ</div>
            {/* Add other property details here */}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gói đăng</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={selectedPackage}
            onValueChange={(value) => setSelectedPackage(value)}
            className="flex flex-col space-y-4"
            disabled={!!qrCodeUrl}
          >
            {Object.entries(packages).map(([key, value]) => (
              <div key={key} className={`flex items-center space-x-2 p-4 rounded-lg transition-colors ${value.isCombo ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-accent'}`}>
                <RadioGroupItem value={key} id={key} className="p-0" />
                <Label htmlFor={key} className="flex flex-col flex-grow cursor-pointer">
                  <span className="flex items-center">
                    <b>{value.name}</b>
                    {value.isCombo && (
                      <Badge variant="secondary" className="ml-2">
                        Combo
                      </Badge>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto ml-1 bg-transparent">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{value.name}</DialogTitle>
                          <DialogDescription className="mt-2">
                            <p>{value.description}</p>
                            <p className="mt-2">{value.details}</p>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </span>
                  <span className="text-sm text-muted-foreground">{value.price.toLocaleString()} đ/ngày</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thời gian đăng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {durations.map((option) => (
              <Button
                key={option.days}
                variant={duration === option.days ? "default" : "outline"}
                onClick={() => setDuration(option.days)}
                className="flex flex-col items-center justify-center h-24"
                disabled={!!qrCodeUrl}
              >
                <span className="font-bold">{option.days} ngày</span>
                <span className="text-sm">Giảm {(option.discount * 100).toFixed(0)}%</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ngày bắt đầu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Input 
              type="date" 
              className="block w-full" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              disabled={!!qrCodeUrl}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Gói đăng</span>
              <span>{packages[selectedPackage].name}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian đăng</span>
              <span>{duration} ngày</span>
            </div>
            <div className="flex justify-between">
              <span>Đơn giá / ngày</span>
              <span>{packages[selectedPackage].price.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>{(durations.find(d => d.days === duration)?.discount * 100 || 0).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng tiền</span>
              <span>{calculateTotal.toLocaleString()} đ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!qrCodeUrl && !isPaymentComplete && (
        <Button className="w-full mb-6" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Thanh toán và đăng tin'}
        </Button>
      )}

      {qrCodeUrl && !isPaymentComplete && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mã QR Thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <img src={qrCodeUrl} alt="QR Code" className="mb-4" />
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Lưu ý khi chuyển khoản</AlertTitle>
              <AlertDescription>
                Vui lòng sử dụng nội dung chuyển khoản: "{packages[selectedPackage].name} - {duration} ngay - {startDate}" để chúng tôi có thể xác nhận giao dịch của bạn.
              </AlertDescription>
            </Alert>
            <Button className="w-full"   onClick={handleCompletePayment} disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
            </Button>
          </CardContent>
        </Card>
      )}

      {isPaymentComplete && (
        <Alert>
          <AlertTitle>Thanh toán hoàn tất</AlertTitle>
          <AlertDescription>
            Cảm ơn bạn đã thanh toán. Bài đăng của bạn sẽ được xử lý và đăng tải trong thời gian sớm nhất.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
