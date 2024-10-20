'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, ChevronLeft, ChevronRight, X, MessageSquare, DollarSign, Clock, Maximize2, Ruler, CheckCircle, Star } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ENDPOINTS } from '@/Constant'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel'

export default function PropertyDetail() {
  const { id } = useParams()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)
  const [otherListings, setOtherListings] = useState([])
  const [similarListings, setSimilarListings] = useState([])
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const nextSlide = useCallback(() => {
    if (data && data.propertyImages) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.propertyImages.length)
    }
  }, [data])

  const prevSlide = useCallback(() => {
    if (data && data.propertyImages) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.propertyImages.length) % data.propertyImages.length)
    }
  }, [data])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Property ID is missing')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${ENDPOINTS.GET_PROPERTY_DETAIL + id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property details')
        }
        const result = await response.json()
        setData({ ...result, images: result.image ? [result.image] : [] })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    // Fetch other listings by the same user
    const fetchOtherListings = async () => {
      try {
        const response = await fetch(`${ENDPOINTS.GET_PROPERTIES_BY_OWNER}${data.posterId}?pid=${id}`)
        if (!response.ok) throw new Error('Failed to fetch other listings')
        const result = await response.json()
        setOtherListings(result) // Limit to 2 listings
      } catch (error) {
        console.error('Error fetching other listings:', error)
      }
    }

    // Fetch similar listings
    const fetchSimilarListings = async () => {
      try {
        const response = await fetch(`${ENDPOINTS.GET_PROPERTIES_BY_LOCATION}?lat=${data.lat}&lng=${data.lng}&pid=${id}`)
        if (!response.ok) throw new Error('Failed to fetch similar listings')
        const result = await response.json()
        setSimilarListings(result) // Limit to 5 listings
      } catch (error) {
        console.error('Error fetching similar listings:', error)
      }
    }

    if (data) {
      fetchOtherListings()
      fetchSimilarListings()
    }
  }, [data])

  useEffect(() => {
    let interval = null
    if (!isZoomed && data && data.propertyImages && data.propertyImages.length > 1) {
      interval = setInterval(nextSlide, 5000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isZoomed, nextSlide, data])

  const formatTimeSince = (timestamp) => {
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
  }

  const getTimeSinceUpdate = (updateTime) => {
    const now = new Date();
    const updateDate = new Date(updateTime);
    const diffTime = Math.abs(now - updateDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày trước`;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Implement contact form submission logic here
    console.log('Contact form submitted', { contactName, contactPhone, contactMessage })
  }

  const handleCare = (e) => {

  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-20 py-8">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="w-full aspect-video mb-5" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="sticky top-4 h-fit">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-20 py-8">
        <Card>
          <CardContent className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-60 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.content}</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Property Information */}
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <div className="mb-3">
            <Card className="w-full mx-auto">
              <div className="relative">
                <div className="aspect-w-3 aspect-h-2">
                  {data.propertyImages && data.propertyImages.length > 0 ? (
                    <img
                      src={data.propertyImages[currentIndex].image}
                      alt={`Property view ${currentIndex + 1}`}
                      className="w-full h-full object-cover rounded-t-lg cursor-pointer"
                      onClick={toggleZoom}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                {data.propertyImages && data.propertyImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full px-2"
                      onClick={prevSlide}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full px-2"
                      onClick={nextSlide}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {data.propertyImages.length}
                    </div>
                  </>
                )}
              </div>
              {data.propertyImages && data.propertyImages.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 p-2">
                  {data.propertyImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 ${index === currentIndex ? 'ring-2 ring-primary' : ''}`}
                    >
                      <img
                        src={image.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-16 w-24 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="mb-3">
            <CardContent className="pt-4">
              <h2 className="text-2xl font-bold mb-2">{data.content}</h2>
              <div className="flex items-center mb-2">
                <span className="text-xl font-semibold">{data.price.toLocaleString()} VNĐ/tháng</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="ml-2">Xem lịch sử giá</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Lịch sử giá</DialogTitle>
                    </DialogHeader>
                    {/* Implement price history chart or table here */}
                    <p>Chức năng đang được phát triển</p>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{data.address}, {data.ward}, {data.district}, {data.city}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>Cập nhật: {getTimeSinceUpdate(data.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Đặc điểm phòng trọ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span><strong>Giá:</strong> {data.price.toLocaleString()} VNĐ/tháng</span>
                </div>
                <div className="flex items-center">
                  <Maximize2 className="w-5 h-5 mr-2" />
                  <span><strong>Diện tích:</strong> {data.area} m²</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Tiện nghi</h3>
                <div className="grid grid-cols-4 gap-2">
                  {data.amentities.slice(0, showAllAmenities ? data.amentities.length : 8).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-gray-900" />
                      <span>{amenity.amentityName}</span>
                    </div>
                  ))}
                </div>
                {data.amentities.length > 8 && (
                  <Button
                    variant="link"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-2"
                  >
                    {showAllAmenities ? 'Ẩn bớt' : 'Xem thêm'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Vị trí</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px', width: '100%' }}>
                <MapContainer center={[data.lat, data.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[data.lat, data.lng]}>
                    <Popup>
                      {data.content}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mô tả chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-4 h-fit space-y-6">
          {/* Owner Information */}
          <Card>
            <CardContent className="pt-6 p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={data.owner} />
                  <AvatarFallback>{data.owner.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{data.owner}</h3>
                  <p className="text-xs text-muted-foreground">Hoạt động 1 giờ trước • Phản hồi 87%</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" variant="default">
                  <Phone className="w-4 h-4 mr-2" />
                  Bấm để hiện SĐT
                </Button>
                <Button onClick={handleCare} className="w-full hover:bg-primary hover:text-white" variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Quan tâm đến phòng trọ này
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Bạn cần tư vấn thêm?</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Họ và tên"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Số điện thoại"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Thêm lời nhắn (100 kí tự)"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  {!isFormValid && (
                    <p className='text-red-500 text-sm'>Số điện thoại không hợp lệ.</p>
                  )}
                  <Button type="submit" className="w-full">
                    Gửi thông tin
                  </Button>
                </div>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                Bằng việc gửi thông tin, bạn đồng ý với Chính sách bảo mật của HOLA HOUSING và cho phép chúng tôi thu thập, xử lý và chia sẻ thông tin này cho người thuê để liên hệ với bạn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Other listings by the same user */}
      {otherListings.length > 0 &&
        (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Tin rao khác của {data.owner}</h2>
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {otherListings.map((listing) => (
                  <CarouselItem key={listing.propertyId} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Link to={`${"/detail/" + listing.propertyId}`}>
                        <Card>
                          <CardContent className="flex flex-col p-3">
                            <div className="relative w-full mb-4 aspect-w-3 aspect-h-2 z-100">
                              <img src={listing.propertyImages[0]?.image} alt={listing.content} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute top-2 left-2 h-fit w-fit bg-primary text-white px-2 py-1 rounded-md text-sm">
                                {listing.propertyImages?.length || 0} ảnh
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{listing.content}</h3>
                            <p className="text-primary mb-2"><span className="font-bold">{listing.price.toLocaleString()} VND</span>/tháng</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{formatTimeSince(listing.updatedAt)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{listing.address}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="p-0" />
              <CarouselNext className="p-0" />
            </Carousel>
          </div>
        )}

      {/* Similar listings */}
      {similarListings.length > 0 &&
        (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Các nhà trọ trong khu vực</h2>
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {similarListings.map((listing) => (
                  <CarouselItem key={listing.propertyId} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Link to={`${"/detail/" + listing.propertyId}`}>
                        <Card>
                          <CardContent className="flex flex-col p-3">
                            <div className="relative w-full mb-4 aspect-w-3 aspect-h-2 z-100">
                              <img src={listing.propertyImages[0]?.image} alt={listing.content} className="w-full h-full object-cover rounded-md" />
                              <span className="absolute top-2 left-2 h-fit w-fit bg-primary text-white px-2 py-1 rounded-md text-sm">
                                {listing.propertyImages?.length || 0} ảnh
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{listing.content}</h3>
                            <p className="text-primary mb-2"><span className="font-bold">{listing.price.toLocaleString()} VND</span>/tháng</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{formatTimeSince(listing.updatedAt)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className='w-full whitespace-nowrap overflow-hidden text-ellipsis'>{listing.address}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="p-0" />
              <CarouselNext className="p-0" />
            </Carousel>
          </div>
        )}

      {/* Zoom Modal */}
      {isZoomed && data.propertyImages && data.propertyImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-20">
            <img
              src={data.propertyImages[currentIndex].image}
              alt={`Zoomed view ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white rounded-full px-2"
              onClick={toggleZoom}
            >
              <X className="h-6 w-6" />
            </Button>
            {data.propertyImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full px-2"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full px-2"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {data.propertyImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}