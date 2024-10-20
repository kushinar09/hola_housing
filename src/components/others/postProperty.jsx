'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastAction, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Loader2, Search, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { toast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

function LocationMarker({ position, setPosition }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom())
    }
  }, [position, map])

  const handleMapClick = useCallback((e) => {
    setPosition(e.latlng)
  }, [setPosition])

  useMapEvents({
    click: handleMapClick,
  })

  return position === null ? null : (
    <Marker position={position} />
  )
}

const amenities = [
  { id: 'wifi', label: 'Wifi' },
  { id: 'ac', label: 'Điều hòa' },
  { id: 'parking', label: 'Chỗ đậu xe' },
  { id: 'security', label: 'An ninh 24/7' },
  { id: 'laundry', label: 'Máy giặt' },
  { id: 'kitchen', label: 'Nhà bếp' },
  { id: 'tv', label: 'TV' },
  { id: 'fridge', label: 'Tủ lạnh' },
]

export default function PostProperty() {
  const [formData, setFormData] = useState({
    content: "Nhà trọ 1",
    description: "toots tootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstootstoots",
    price: "2000000",
    address: "Quốc lộ 21, Thạch Hòa, Huyện Thạch Thất, Hà Nội, Việt Nam",
    city: "Hà Nội",
    district: "Huyện Thạch Thất",
    ward: "Thạch Hòa",
    propertyType: "room",
    area: "20",
    lat: "21.013557",
    lng: "105.525275",
    phoneNum: "0332698091",
    owner: "Phong Duy",
    status: "2",
    amenities: [
      "wifi",
      "laundry",
      "ac",
      "kitchen",
      "parking",
      "tv",
      "security",
      "fridge"
    ],
    images: [],
    videoLink: ""
  })

  const [position, setPosition] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [searchAddress, setSearchAddress] = useState('')
  const fileInputRef = useRef(null)

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleAmenityChange = useCallback((amenityId) => {
    setFormData(prevData => {
      const updatedAmenities = prevData.amenities.includes(amenityId)
        ? prevData.amenities.filter(id => id !== amenityId)
        : [...prevData.amenities, amenityId]
      return { ...prevData, amenities: updatedAmenities }
    })
  }, [])

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    setFormData(prevData => {
      const newImages = [...prevData.images, ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))]
      // Limit to 12 images
      return {
        ...prevData,
        images: newImages.slice(0, 12)
      }
    })
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    setFormData(prevData => {
      const newImages = [...prevData.images, ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))]
      // Limit to 12 images
      return {
        ...prevData,
        images: newImages.slice(0, 12)
      }
    })
  }, [])

  const handleRemoveImage = useCallback((index) => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index)
    }))
  }, [])

  const validatePhoneNumber = (phoneNumber) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
    return regexPhoneNumber.test(phoneNumber)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.images.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên ít nhất 3 ảnh.",
        variant: "destructive",
      })
      return
    }
    if (!validatePhoneNumber(formData.phoneNum)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Form submitted:', formData)
      const queryString = new URLSearchParams(formData).toString()
      Navigate(`/payment?${queryString}`)
      toast({
        className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: "Đăng bài thành công",
        description: "Bài đăng của bạn đã được gửi và đang chờ xét duyệt.",
        duration: 4000,
        position: "top",
        action: <ToastAction onClick={() => console.log('Clicked!')} altText="Try again">Try again</ToastAction>
      })
      setShowToast(true)
      // Reset form
      setFormData({
        content: '',
        description: '',
        price: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        propertyType: '',
        area: '',
        lat: '',
        lng: '',
        phoneNum: '',
        owner: '',
        status: '1',
        amenities: [],
        images: [],
        videoLink: ''
      })
      setPosition(null)
      setSearchAddress('')
      setTimeout(() => {
        window.location.href = "/payment"
      }, 1000)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.",
        variant: "destructive",
        action: <ToastAction onClick={() => console.log('Clicked!')} altText="Try again">Try again</ToastAction>
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSearch = useCallback(async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newPosition = [parseFloat(lat), parseFloat(lon)]
        setPosition(newPosition)
        setFormData(prevData => ({
          ...prevData,
          lat: lat,
          lng: lon
        }))
      } else {
        alert('Không tìm thấy địa chỉ. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error searching for address:', error)
      alert('Có lỗi xảy ra khi tìm kiếm địa chỉ. Vui lòng thử lại.')
    }
  }, [searchAddress])

  useEffect(() => {
    if (position) {
      const lat = typeof position.lat === 'number' ? position.lat : position[0]
      const lng = typeof position.lng === 'number' ? position.lng : position[1]
      setFormData(prevData => ({
        ...prevData,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6)
      }))
    }
  }, [position])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Đăng Bài Cho Thuê Nhà Trọ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Tiêu đề ngắn</Label>
            <Input
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              maxLength={100}
              placeholder="Nhập tiêu đề ngắn cho bài đăng"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Mô tả chi tiết về nhà trọ của bạn"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh (Tối thiểu 3 ảnh, tối đa 12 ảnh)</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Bấm để chọn ảnh cần tải lên</p>
              <p className="text-xs text-gray-500">hoặc kéo thả ảnh vào đây</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Đã chọn {formData.images.length} ảnh</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-transparent hover:bg-gray-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="videoLink">Thêm video từ tiktok hoặc youtube</Label>
            <Input
              id="videoLink"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder="Nhập link video từ TikTok hoặc YouTube"
            />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá thuê (VNĐ/tháng)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: 3000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Diện tích (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: 30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ đầy đủ</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              maxLength={100}
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                maxLength={50}
                placeholder="Ví dụ: Hà Nội"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Quận/Huyện</Label>
              <Input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                maxLength={50}
                placeholder="Ví dụ: Cầu Giấy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">Phường/Xã</Label>
              <Input
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                required
                maxLength={50}
                placeholder="Ví dụ: Dịch Vọng"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Loại nhà trọ</Label>
            <Select onValueChange={(value) => handleSelectChange('propertyType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại nhà trọ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Căn hộ</SelectItem>
                <SelectItem value="house">Nhà nguyên căn</SelectItem>
                <SelectItem value="room">Phòng trọ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tiện ích</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox className="p-0"
                    id={amenity.id}
                    checked={formData.amenities.includes(amenity.id)}
                    onCheckedChange={() => handleAmenityChange(amenity.id)}
                  />
                  <Label
                    htmlFor={amenity.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchAddress">Tìm kiếm địa chỉ</Label>
            <div className="flex space-x-2">
              <Input
                id="searchAddress"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Nhập địa chỉ để tìm kiếm"
              />
              <Button type="button" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                <span className="sr-only">Tìm địa chỉ</span>
                Tìm
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vị trí trên bản đồ</Label>
            <div className="h-[300px] w-full">
              <MapContainer center={[21.0285, 105.8542]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Vĩ độ</Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={handleInputChange}
                placeholder="Tự động điền khi chọn trên bản đồ"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lng">Kinh độ</Label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={handleInputChange}
                placeholder="Tự động điền khi chọn trên bản đồ"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNum">Số điện thoại liên hệ</Label>
            <Input
              id="phoneNum"
              name="phoneNum"
              type="tel"
              value={formData.phoneNum}
              onChange={handleInputChange}
              required
              maxLength={11}
              placeholder="Ví dụ: 0912345678"
            />
            {formData.phoneNum && !validatePhoneNumber(formData.phoneNum) && (
              <p className="text-sm text-red-500">Số điện thoại không hợp lệ</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Tên chủ trọ</Label>
            <Input
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              required
              maxLength={50}
              placeholder="Nhập tên chủ trọ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Còn trống</SelectItem>
                <SelectItem value="2">Đã cho thuê</SelectItem>
                <SelectItem value="3">Đang bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || formData.images.length < 3 || !validatePhoneNumber(formData.phoneNum)}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}