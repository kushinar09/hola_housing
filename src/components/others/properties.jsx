'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDown, Search, Grid, List, MapPin, User, Calendar } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Link } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import { ENDPOINTS } from '@/Constant'
import { useToast } from "@/hooks/use-toast"
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import empty from '@/assets/imgs/empty.png';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

function MapSearch({ onLocationSelect, initialLocation }) {
  const [marker, setMarker] = useState(initialLocation)
  const [center, setCenter] = useState(initialLocation || [21.0278, 105.8342]) // Hanoi coordinates if no initial location
  const [searchQuery, setSearchQuery] = useState('')

  const HandleMapClick = ({ position, setPosition }) => {
    const map = useMap()

    useEffect(() => {
      if (position) {
        map.flyTo(position, map.getZoom())
      }
    }, [position, map])

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setCenter(e.latlng)
        setMarker({ lat, lng })
        map.flyTo([lat, lng], map.getZoom())
      },
    })

    return position === null ? null : (
      <Marker position={position} />
    )
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        console.log(lat, lon)
        setCenter([parseFloat(lat), parseFloat(lon)])
        setMarker({ lat: parseFloat(lat), lng: parseFloat(lon) })
      } else {
        alert('Không tìm thấy địa chỉ. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error searching for address:', error)
      alert('Có lỗi xảy ra khi tìm kiếm địa chỉ. Vui lòng thử lại.')
    }
  }

  return (
    <div className="h-[400px] w-full relative">
      <div className="absolute top-2 right-2 z-[1000] flex gap-2">
        <Input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HandleMapClick position={center} setPosition={setCenter} />
      </MapContainer>
      <Button
        className="absolute bottom-4 right-2 z-[1000]"
        onClick={() => marker && onLocationSelect(marker)}
      >
        Xác nhận vị trí
      </Button>
    </div>
  )
}

export default function Properties() {
  const [searchString, setSearchString] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [sortBy, setSortBy] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [error, setError] = useState(null)
  const [pageSize, setPageSize] = useState(8)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const { toast } = useToast()

  const fetchProperties = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        sortBy: sortBy.toString(),
        searchString,
        propertyType,
        address,
        city,
        district,
        ward,
        priceFrom: priceRange[0].toString(),
        priceTo: priceRange[1].toString(),
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
        ...(selectedLocation && {
          lat: selectedLocation.lat.toString(),
          lng: selectedLocation.lng.toString(),
        }),
      })

      const response = await fetch(`${ENDPOINTS.GET_PROPERTIES}?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data.data)
      setTotalPages(Math.ceil(data.total / pageSize))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [sortBy, pageSize, pageNumber])

  const handleSearch = () => {
    setPageNumber(1)
    fetchProperties()
  }

  const handleClear = () => {
    setSearchString('')
    setPriceRange([0, 10000000])
    setSortBy(0)
    setPropertyType('')
    setAddress('')
    setCity('')
    setDistrict('')
    setWard('')
    setSelectedLocation(null)
    setPageNumber(1)
    fetchProperties()
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setIsMapDialogOpen(false)
    setIsFilterSheetOpen(true)
    toast({
      title: "Vị trí đã chọn",
      description: `Vĩ độ: ${location.lat.toFixed(6)}, Kinh độ: ${location.lng.toFixed(6)}`,
      duration: 5000,
    })
  }

  const SkeletonCard = () => (
    <Card className={`${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={viewMode === 'list' ? 'w-1/5' : ''}>
        <Skeleton className="h-48 w-full" />
      </div>
      <div className={viewMode === 'list' ? 'w-4/5 p-4' : ''}>
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    </Card>
  )

  const ListingCard = ({ property }) => {
    const formatDate = (dateString) => {
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };

      const datePart = new Date(dateString).toLocaleDateString('vi-VN', dateOptions);
      const timePart = new Date(dateString).toLocaleTimeString('vi-VN', timeOptions);

      return `${timePart} ${datePart}`;
    };

    return (
      <Link to={`/detail/${property.propertyId}`} className="block w-full">
        <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${viewMode === 'list' ? 'flex' : 'h-full'}`}>
          <div className={`relative ${viewMode === 'list' ? 'w-1/4 p-4' : 'w-full'}`}>
            <div className={`${viewMode === 'list' ? 'aspect-w-3 aspect-h-2' : 'aspect-w-16 aspect-h-10'} w-full h-full`}>
              {property.propertyImages && property.propertyImages[0] ? (
                <img
                  src={property.propertyImages[0].image}
                  alt={property.content}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground">
              {property.propertyType}
            </Badge>
          </div>
          <div className={`flex flex-col justify-between ${viewMode === 'list' ? 'w-3/4 p-4' : 'p-4'}`}>
            <div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {property.content}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <p className="text-lg font-semibold text-primary">
                  {property.price.toLocaleString()} VNĐ
                  <span className="text-sm font-normal text-muted-foreground">/tháng</span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.address}, {property.ward}, {property.district}, {property.city}</span>
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {property.owner}
                  </span>
                  <span className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-1 ${viewMode === 'list' ? 'ml-2' : ''}`} />
                    {formatDate(property.postTime)}
                  </span>
                </div>
              </CardContent>
            </div>
            <CardFooter className="p-0 mt-4">
              <Badge variant="outline" className="mr-2">
                {property.area} m²
              </Badge>
              <Button variant="outline" className="ml-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Xem chi tiết
              </Button>
            </CardFooter>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <div className="container mx-auto p-4 px-60">
      <h1 className="text-2xl font-bold mb-4">Danh sách nhà trọ</h1>

      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="flex-grow mr-2"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Tìm kiếm
        </Button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                Bộ lọc <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                <div>
                  <label className="text-sm font-medium">Loại nhà</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nhà" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Tất cả</SelectItem>
                      <SelectItem value="House">Nhà</SelectItem>
                      <SelectItem value="Apartment">Căn hộ</SelectItem>
                      <SelectItem value="Room">Phòng trọ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Địa chỉ</label>

                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tỉnh, Thành phố</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ví dụ: Hà Nội"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Quận, Huyện</label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ví dụ: Tây Hồ"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Xã, Phường</label>
                  <Input
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="Ví dụ: Quảng An"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Khoảng giá</label>
                  <div className="mt-2">
                    <Slider
                      min={0}
                      max={10000000}
                      step={100000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{priceRange[0].toLocaleString()} VNĐ</span>
                      <span>{priceRange[1].toLocaleString()} VNĐ</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Chọn vị trí trên bản đồ</label>
                  <Button
                    className="w-full mt-2"
                    onClick={() => {
                      setIsFilterSheetOpen(false)
                      setIsMapDialogOpen(true)
                    }}
                  >
                    Mở map
                  </Button>
                  {selectedLocation && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Đã chọn: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleClear}>Xóa</Button>
                  <Button onClick={() => {
                    handleSearch()
                    setIsFilterSheetOpen(false)
                  }}>Tìm kiếm</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Select value={sortBy.toString()} onValueChange={(value) => setSortBy(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Mới nhất</SelectItem>
            <SelectItem value="1">Giá tăng dần</SelectItem>
            <SelectItem value="2">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chọn vị trí trên bản đồ</DialogTitle>
          </DialogHeader>
          <MapSearch onLocationSelect={handleLocationSelect} initialLocation={selectedLocation} />
        </DialogContent>
      </Dialog>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className={`
          ${viewMode === 'grid' ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}
        `}>
          {Array(pageSize).fill(0).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : properties.length > 0 ? (
        <div className={`
          ${viewMode === 'grid' ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}
        `}>
          {properties.map((property) => (
            <ListingCard key={property.propertyId} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <img
            src={empty}
            alt="No properties found"
            className="mb-4"
          />
          <p className="text-xl font-semibold text-gray-600">Không tìm thấy kết quả phù hợp</p>
          <p className="text-gray-500">Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
        </div>
      )}

      {!isLoading && properties.length > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPageNumber(i + 1)}
                    isActive={pageNumber === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}