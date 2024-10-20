import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Calendar, Loader2Icon, } from "lucide-react"
import { Link } from 'react-router-dom'
import { ENDPOINTS } from '@/Constant'
import { Checkbox } from '@/components/ui/checkbox'
import empty from '@/assets/imgs/empty.png';

const fetchReasons = async () => {
    try {
        const response = await fetch(ENDPOINTS.GET_REASON_DECLINE);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

// Mocked API calls - replace these with actual API calls
const fetchProperties = async () => {
    try {
        const response = await fetch(ENDPOINTS.GET_PROPERTIES_MANAGER);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

const acceptProperty = async (id) => {
    try {
        let f = new URLSearchParams({
            propertyId: id,
            status: 1,
        })
        const response = await fetch(`${ENDPOINTS.UPDATE_STATUS_PROPERTY}?${f}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

const rejectProperty = async (id, reasons, otherRs) => {
    try {
        let f = new URLSearchParams({
            propertyId: id,
            status: 0
        })
        const response = await fetch(`${ENDPOINTS.UPDATE_STATUS_PROPERTY}?${f}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            await fetch(`${ENDPOINTS.POST_REASON_DECLINE}?pid=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reasons: reasons,
                    otherReason: otherRs
                })
            });
        }
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
}

export default function PropertyManagement() {
    const [properties, setProperties] = useState([])
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectingProperty, setRejectingProperty] = useState(0)
    const [selectedReasons, setSelectedReasons] = useState([])
    const [otherReason, setOtherReason] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rejectionReasons, setRejectionReasons] = useState([
        "Không đủ thông tin",
        "Hình ảnh không phù hợp",
        "Giá không hợp lý",
        "Địa chỉ không chính xác",
        "Khác"
    ])

    const form = useForm()

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-semibold">Đang xử lý...</p>
            </div>
        </div>
    );

    useEffect(async () => {
        setIsLoading(true)
        await fetchProperties().then(setProperties)
        await fetchReasons().then(setRejectionReasons)
        setIsLoading(false)
    }, [])

    const handleShowDetail = (id) => {
        window.location.href = "/detail/" + id;
    }

    const handleAccept = async (id) => {
        setIsLoading(true)
        await acceptProperty(id)
        setProperties(properties.filter(p => p.propertyId !== id))
        setIsLoading(false)
    }

    const handleReject = (id) => {
        setRejectingProperty(id)
        setIsRejectDialogOpen(true)
    }

    const handleReasonChange = (reasonId) => {
        setSelectedReasons(prev => {
            if (prev.includes(reasonId)) {
                return prev.filter(id => id !== reasonId)
            } else {
                return [...prev, reasonId]
            }
        })
    }

    const submitRejection = async () => {
        setIsRejectDialogOpen(false)
        setIsLoading(true)
        await rejectProperty(rejectingProperty, selectedReasons, otherReason)
        setProperties(properties.filter(p => p.propertyId !== rejectingProperty))
        setIsLoading(false)
        setRejectingProperty(null)
        setSelectedReasons([])
        setOtherReason("")
    }

    return (
        <div className="container mx-auto p-4 px-60">
            {isLoading && <LoadingOverlay />}
            <h1 className="text-2xl font-bold mb-4">Property Management</h1>
            <div className="mb-4 flex justify-between items-center">
                <Button onClick={() => { form.reset(); window.location.href = "/post" }}>Add Property</Button>
            </div>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reject Property</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {rejectionReasons.map((reason) => (
                            <div key={reason.reasonId} className="flex items-center space-x-2">
                                <Checkbox className="p-0"
                                    id={reason.reasonId}
                                    checked={selectedReasons.includes(reason.reasonId)}
                                    onCheckedChange={() => handleReasonChange(reason.reasonId)}
                                />
                                <Label htmlFor={reason.reasonId}>{reason.reasonContent}</Label>
                            </div>
                        ))}
                        {selectedReasons.includes(rejectionReasons[rejectionReasons.length - 1].reasonId) && (
                            <Textarea
                                placeholder="Enter other reason"
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={submitRejection}>Submit Rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {properties.length > 0 ? (
                <div className={`grid gap-4 grid-cols-1`}>
                    {properties.map((property) => (
                        <Card key={property.id} className={`group overflow-hidden transition-all duration-300 hover:shadow-lg flex`}>
                            <div className={`relative w-1/4 p-4`}>
                                <div className={`aspect-w-3 aspect-h-2 w-full h-full`}>
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
                            <div className={`flex flex-col justify-between w-3/4 p-4`}>
                                <div>
                                    <CardHeader className="p-0 mb-2">
                                        <div className='flex items-center justify-between'>
                                            <CardTitle className="w-fit text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                <div>
                                                    {property.content}
                                                </div>

                                            </CardTitle>
                                            {property.postPrice && (
                                                <div className='w-fit'>
                                                    <Badge className="bg-green-600 text-primary-foreground">
                                                        {property.postPrice.type.typeName} - {property.postPrice.duration} ngày - {formatDate(property.postTime)}
                                                    </Badge>
                                                </div>
                                            )}
                                            {!property.postPrice && (
                                                <div className='w-fit'>
                                                    <Badge className="bg-blue-600 text-primary-foreground">
                                                        Free
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-2">
                                        <p className="text-lg font-semibold text-primary">
                                            {property.price?.toLocaleString()} VNĐ
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
                                                <Calendar className={`w-4 h-4 mr-1 ml-2`} />
                                                {formatDate(property.updatedAt)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </div>
                                <CardFooter className="p-0 mt-4">
                                    <Badge variant="outline" className="mr-2">
                                        {property.area} m²
                                    </Badge>
                                    <div className="ml-auto space-x-2">
                                        <Button variant="outline" onClick={() => handleShowDetail(property.propertyId)}>Chi tiết</Button>
                                        <Button variant="default" onClick={() => handleAccept(property.propertyId)}>Chấp nhận</Button>
                                        <Button variant="destructive" onClick={() => handleReject(property.propertyId)}>Từ chối</Button>
                                    </div>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <img
                        src={empty}
                        alt="No properties found"
                        className="mb-4 h-40"
                    />
                    <p className="text-xl font-semibold text-gray-600">Không có bài đăng đang chờ duyệt</p>
                </div>
            )}
        </div>
    )
}