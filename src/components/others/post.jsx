import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastAction } from "@/components/ui/toast"
import { Loader2, Search, Upload, X, HelpCircle, Info, Edit, AlertCircle, CheckCircle, CheckCircle2, Loader2Icon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ENDPOINTS } from '@/Constant'

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

    const handleMapClick = (e) => {
        setPosition(e.latlng)
    }

    useMapEvents({
        click: handleMapClick,
    })

    return position === null ? null : (
        <Marker position={position} />
    )
}

const packages = {
    free: {
        id: 1,
        name: 'Miễn phí',
        price: 0,
        description: '',
        details: 'Tin của bạn sẽ đưa vào danh sách theo thứ tự và giới hạn số ảnh hiển thị'
    },
    pushListing: {
        id: 2,
        name: 'Đẩy tin',
        price: 5000,
        description: 'Đẩy tin của bạn lên top danh sách',
        details: 'Gói Đẩy tin giúp tin đăng của bạn xuất hiện ở vị trí cao trong danh sách.'
    },
    multipleImages: {
        id: 3,
        name: 'Tin nhiều hình ảnh',
        price: 15000,
        description: 'Hiển thị nhiều hình ảnh hơn cho tin đăng của bạn',
        details: 'Gói Tin nhiều hình ảnh cho phép bạn đăng tải và hiển thị nhiều hình ảnh hơn.'
    },
    priorityListing: {
        id: 4,
        name: 'Tin ưu tiên',
        price: 90000,
        description: 'Hiển thị tin đăng ở vị trí ưu tiên trên trang tìm kiếm',
        details: 'Gói Tin ưu tiên đảm bảo tin đăng của bạn sẽ được hiển thị ở vị trí ưu tiên.'
    },
    comboPackage: {
        id: 5,
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

export default function CombinedPropertyForm() {
    const [propertyId, setPropertyId] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('postProperty')
    const [isTitleFocused, setIsTitleFocused] = useState(false)
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false)
    const [availableAmenities, setAvailableAmenities] = useState([])
    const [formData, setFormData] = useState({
        content: "Nhà trọ 1",
        description: "Phòng trọ very good, cách trường đại học FPT 10 phút đi bộ",
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
        amentities: [],
        images: [],
        postTime: null,
        poster_ID: 0,
        post_Price_ID: 0,
        postPrice: null
    })
    const [position, setPosition] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchAddress, setSearchAddress] = useState('')
    const fileInputRef = useRef(null)
    const { toast } = useToast()

    // Payment state
    const [selectedPackage, setSelectedPackage] = useState('free')
    const [duration, setDuration] = useState(3)
    const [startDate, setStartDate] = useState('')
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [isPaymentComplete, setIsPaymentComplete] = useState(false)

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-semibold">Đang xử lý...</p>
            </div>
        </div>
    );

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await fetch(ENDPOINTS.GET_AMENITIES)
                if (!response.ok) {
                    throw new Error('Failed to fetch amentities')
                }
                const data = await response.json()
                setAvailableAmenities(data)
            } catch (error) {
                console.error('Error fetching amentities:', error)
                toast({
                    title: "Error",
                    description: "Failed to load amentities. Please try again later.",
                    variant: "destructive",
                })
            }
        }

        fetchAmenities()
    }, [])

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

    const handleAmenityChange = useCallback((amentityId, amentityName) => {
        setFormData(prevData => {
            const amentityIndex = prevData.amentities.findIndex(a => a.amentityId === amentityId)
            if (amentityIndex > -1) {
                // Remove the amentity if it's already selected
                return {
                    ...prevData,
                    amentities: prevData.amentities.filter((_, index) => index !== amentityIndex)
                }
            } else {
                // Add the amentity if it's not already selected
                return {
                    ...prevData,
                    amentities: [...prevData.amentities, { amentityId: amentityId, amentityName: amentityName }]
                }
            }
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

    const handleSubmitProperty = async (e) => {
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
            toast({
                title: "Lưu bài thành công",
                description: "Bài đăng của bạn đã được lưu. Vui lòng hoàn tất thanh toán cho bài đăng.",
                duration: 3000,
            })
            setStep('propertyPayment')
        } catch (error) {
            console.error('Error submitting form:', error)
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const calculateTotal = useMemo(() => {
        if (selectedPackage === 'free') return 0
        const basePrice = packages[selectedPackage].price * duration
        const discount = durations.find(d => d.days === duration)?.discount || 0
        return Math.round(basePrice * (1 - discount))
    }, [selectedPackage, duration])

    const handleSubmitPayment = async () => {
        setIsLoading(true);
        if (selectedPackage !== 'free' && !startDate) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn ngày bắt đầu",
                variant: "destructive",
            })
            setIsLoading(false);
            return
        }
        setIsSubmitting(true)
        try {
            if (selectedPackage === 'free') {
                await fetch(ENDPOINTS.POST_PROPERTY, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                    .then(response => {
                        return response.text();
                    })
                    .then(async text => {
                        const numericResponse = Number(text);
                        console.log(numericResponse)
                        if (!isNaN(numericResponse)) {
                            // Handle free submission
                            setPropertyId(numericResponse)
                            try {
                                let f = new FormData()
                                formData.images.forEach((image, index) => {
                                    f.append('images', image.file);
                                });
                                await fetch(ENDPOINTS.POST_PROPERTY_IMAGES + "/" + numericResponse, {
                                    method: 'POST',
                                    body: f
                                }).then(response => {
                                    if (response.ok) {
                                        toast({
                                            title: "Thành công",
                                            description: "Bài đăng của bạn đã được xác nhận",
                                            variant: "default",
                                        });
                                        setIsPaymentComplete(true)
                                        setIsLoading(false);
                                        // window.location.href = "/properties";
                                    }
                                })
                            } catch (error) {
                                console.error("Error uploading images:", error);
                                toast({
                                    title: "Lỗi",
                                    description: "Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại.",
                                    variant: "destructive",
                                });
                                setIsLoading(false);
                            }
                        } else {
                            throw new Error("Invalid response format");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        toast({
                            title: "Lỗi",
                            description: "Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.",
                            variant: "destructive",
                        });
                        setIsLoading(false);
                    });
                    setIsLoading(false);
            } else {
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
                        addInfo: `${formData.owner} - ${packages[selectedPackage].name} -  ${duration} ngay - ${startDate} - ${formData.phoneNum}`,
                        amount: calculateTotal.toString(),
                        template: 'compact',
                    }),
                })
                setIsLoading(false);
                const data = await response.json()
                setQrCodeUrl(data.data.qrDataURL)
            }
        } catch (error) {
            console.error('Error generating QR code:', error)
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setIsLoading(false);
        }
    }

    const handleCompletePayment = async () => {
        setIsSubmitting(true)
        setIsLoading(true)
        try {
            formData.postTime = startDate;
            formData.postPrice = {
                duration: duration,
                price: packages[selectedPackage].price,
                typeId: packages[selectedPackage].id,
            };
            fetch(ENDPOINTS.POST_PROPERTY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            }).then(response => {
                return response.text();
            }).then(text => {
                const numericResponse = Number(text);
                console.log(numericResponse)
                if (!isNaN(numericResponse)) {
                    // Handle free submission
                    setPropertyId(numericResponse)
                    try {
                        let f = new FormData()
                        formData.images.forEach((image, index) => {
                            f.append('images', image.file);
                        });
                        fetch(ENDPOINTS.POST_PROPERTY_IMAGES + "/" + numericResponse, {
                            method: 'POST',
                            body: f
                        }).then(response => {
                            if (response.ok) {
                                toast({
                                    title: "Thành công",
                                    description: "Bài đăng của bạn đã được xác nhận",
                                    variant: "default",
                                });
                                setIsPaymentComplete(true)
                                // window.location.href = "/properties";
                            }
                        }).finally(() => {
                            setIsLoading(false);
                        });
                    } catch (error) {
                        console.error("Error uploading images:", error);
                        toast({
                            title: "Lỗi",
                            description: "Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại.",
                            variant: "destructive",
                        });
                        setIsLoading(false);
                    }
                } else {
                    throw new Error("Invalid response format");
                }
            }).catch(error => {
                console.error("Error:", error);
                toast({
                    title: "Lỗi",
                    description: "Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.",
                    variant: "destructive",
                });
                setIsLoading(false);
            });
        } catch (error) {
            console.error('Error completing payment:', error)
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi hoàn tất thanh toán. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditProperty = () => {
        setStep('postProperty')
    }

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
        <div className="relative">
            {isLoading && <LoadingOverlay />}
            {step === "postProperty" ? (
                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Đăng Bài Cho Thuê Nhà Trọ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitProperty} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="content">Tiêu đề ngắn</Label>
                                <Input
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    onFocus={() => setIsTitleFocused(true)}
                                    onBlur={() => setIsTitleFocused(false)}
                                    required
                                    maxLength={100}
                                    placeholder="Nhập tiêu đề ngắn cho bài đăng"
                                />
                            </div>

                            {isTitleFocused && (
                                <div className="space-y-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                                    <div className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold mb-1">Gợi ý tiêu đề:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Loại phòng + Diện tích + Giá + Vị trí + Thông tin hấp dẫn</li>
                                                <li>VD: Phòng trọ 2 giường ngủ, 20m², chỉ 5 triệu/tháng, gần đại học FPT Hà Nội</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả chi tiết</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    onFocus={() => setIsDescriptionFocused(true)}
                                    onBlur={() => setIsDescriptionFocused(false)}
                                    required
                                    placeholder="Mô tả chi tiết về nhà trọ của bạn"

                                    rows={5}
                                />
                            </div>
                            {isDescriptionFocused && (
                                <div className="space-y-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold mb-1">Không cho phép:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Sử dụng ngôn ngữ tục tĩu, phân biệt đối xử, hoặc ngôn từ gây khó chịu.</li>
                                                <li>Chứa các từ khóa spam</li>
                                                <li>Chứa thông tin cá nhân (ví dụ: số điện thoại, địa chỉ email, link website), các từ "nhất", "duy nhất", "tốt nhất", "số một", ...</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}


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
                                {formData.images && formData.images.length > 0 && (
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
                                    {availableAmenities.map((amentity) => (
                                        <div key={amentity.amentityId} className="flex items-center space-x-2">
                                            <Checkbox className="p-0"
                                                id={amentity.amentityId}
                                                checked={formData.amentities.some(a => a.amentityId === amentity.amentityId)}
                                                onCheckedChange={() => handleAmenityChange(amentity.amentityId, amentity.amentityName)}
                                            />
                                            <Label
                                                htmlFor={amentity.amentityId}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {amentity.amentityName}
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
                                    <MapContainer center={position || [21.0285, 105.8542]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
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

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
            ) : step === "propertyPayment" ? (
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <h1 className="text-2xl font-bold mb-6">Cấu hình bài đăng</h1>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Thông tin bất động sản</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div><strong>Tiêu đề:</strong> {formData.content}</div>
                                <div><strong>Giá:</strong> {parseInt(formData.price).toLocaleString()} đ</div>
                                <div><strong>Số lượng ảnh:</strong> {formData.images.length}</div>
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

                    {selectedPackage !== 'free' && (
                        <>
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
                        </>
                    )}

                    {!qrCodeUrl && !isPaymentComplete && (
                        <div className="flex space-x-4 mb-6">
                            <Button className="flex-1" onClick={handleEditProperty}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa bài đăng
                            </Button>
                            <Button className="flex-1" onClick={handleSubmitPayment} disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lý...' : (selectedPackage === 'free' ? 'Xác nhận' : 'Thanh toán và đăng tin')}
                            </Button>
                        </div>
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
                                        Vui lòng sử dụng nội dung chuyển khoản: "<b>{formData.owner} - {packages[selectedPackage].name} - {duration} ngày - {startDate} - Số điện thoại</b>" để chúng tôi có thể xác nhận giao dịch của bạn một cách nhanh chóng.
                                    </AlertDescription>
                                </Alert>
                                <Button className="w-full" onClick={handleCompletePayment} disabled={isSubmitting}>
                                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {isPaymentComplete && (
                        <Alert>
                            <AlertTitle>Xác nhận hoàn tất</AlertTitle>
                            <AlertDescription>
                                Cảm ơn bạn đã {selectedPackage === 'free' ? 'đăng tin' : 'thanh toán'}. Bài đăng của bạn sẽ được xử lý và đăng tải trong thời gian sớm nhất.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            ) : null}
        </div>
    );
}