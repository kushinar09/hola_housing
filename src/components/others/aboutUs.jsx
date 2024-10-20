import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Users, Search, MessageCircle } from 'lucide-react'
import Logo from "../../assets/logo/logo_bg_horizontal.png"
import { Link } from 'react-router-dom'

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Về Hola Housing</h1>

      <div className="mb-12">
        <img
          src={Logo}
          alt="Hola Housing Team"
          layout="responsive"
          className="rounded-lg w-full"
        />
      </div>

      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Chào mừng bạn đến với Hola Housing</h2>
            <p className="mb-4">
              Hola Housing là nền tảng môi giới nhà trọ hàng đầu tại khu vực Hòa Lạc. Chúng tôi là một nhóm nhỏ, đầy nhiệt huyết, triển khai dự án này trong khuôn khổ chương trình học tại Đại học FPT. Mục tiêu của chúng tôi là mang lại giải pháp tìm kiếm và thuê nhà trọ thuận tiện cho sinh viên, người lao động và những ai đang tìm chỗ ở tại khu vực Hòa Lạc.
            </p>
            <p>
              Với sự phát triển mạnh mẽ của Hòa Lạc, đặc biệt là sự gia tăng các trường đại học, khu công nghệ cao và các dự án lớn, Hola Housing giúp bạn dễ dàng tiếp cận với những lựa chọn nhà trọ phù hợp. Chúng tôi kết nối bạn với các chủ nhà trọ, cung cấp thông tin chi tiết, hỗ trợ giao tiếp và đặt chỗ trực tuyến, giúp tiết kiệm thời gian và chi phí.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Dự án sinh viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dù là một dự án sinh viên, nhưng Hola Housing cam kết mang lại trải nghiệm chuyên nghiệp và chất lượng cao. Chúng tôi luôn nỗ lực không ngừng để cải thiện dịch vụ, nhằm đáp ứng tốt nhất nhu cầu của bạn.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-6 h-6 mr-2" />
                Đối tác đáng tin cậy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Hãy để Hola Housing trở thành đối tác đáng tin cậy của bạn trên hành trình tìm kiếm ngôi nhà lý tưởng tại Hòa Lạc!
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ của chúng tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Search className="w-6 h-6 mr-2 flex-shrink-0 text-primary" />
                <span>Tìm kiếm nhà trọ dễ dàng với các bộ lọc chi tiết</span>
              </li>
              <li className="flex items-start">
                <MessageCircle className="w-6 h-6 mr-2 flex-shrink-0 text-primary" />
                <span>Kết nối trực tiếp với chủ nhà trọ</span>
              </li>
              <li className="flex items-start">
                <Home className="w-6 h-6 mr-2 flex-shrink-0 text-primary" />
                <span>Thông tin chi tiết và hình ảnh về các nhà trọ</span>
              </li>
              <li className="flex items-start">
                <Users className="w-6 h-6 mr-2 flex-shrink-0 text-primary" />
                <span>Hỗ trợ khách hàng tận tình</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Bắt đầu tìm nhà trọ ngay hôm nay</h3>
          <Link to={"/properties"}>
            <Button size="lg">
              Tìm nhà trọ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}