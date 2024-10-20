import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Tag } from 'lucide-react'

export default function Article() {
  // Giả lập dữ liệu bài báo
  const article = {
    title: "Phân tích chi tiết thị trường nhà ở Việt Nam năm 2023",
    summary: "Bài viết này cung cấp cái nhìn tổng quan về thị trường nhà ở Việt Nam trong năm 2023, phân tích các xu hướng chính, thách thức và cơ hội trong lĩnh vực bất động sản.",
    author: "Nguyễn Văn A",
    date: "15 tháng 3, 2023",
    tags: ["Bất động sản", "Thị trường nhà ở", "Phân tích"],
    content: [
      {
        type: "paragraph",
        content: "Thị trường nhà ở Việt Nam trong năm 2023 đã chứng kiến nhiều biến động đáng kể. Với sự phục hồi của nền kinh tế sau đại dịch COVID-19, nhu cầu nhà ở tại các thành phố lớn tiếp tục tăng cao, trong khi nguồn cung vẫn còn hạn chế ở nhiều phân khúc."
      },
      {
        type: "subheading",
        content: "Xu hướng giá nhà ở các thành phố lớn"
      },
      {
        type: "paragraph",
        content: "Tại Hà Nội và TP.HCM, giá nhà tiếp tục tăng, đặc biệt là ở phân khúc trung và cao cấp. Theo số liệu từ Bộ Xây dựng, giá trung bình của căn hộ chung cư tại Hà Nội tăng khoảng 5-7% so với năm trước, trong khi tại TP.HCM, mức tăng dao động từ 8-10%."
      },
      {
        type: "image",
        src: "https://cafefcdn.com/203337114487263232/2024/6/25/bieu-do-chi-so-nha-o-tphcm-sppi-q1-2024-savills-vietnam-1719276698342176516347.png",
        alt: "Biểu đồ giá nhà tại Hà Nội và TP.HCM",
        caption: "Biểu đồ so sánh giá nhà trung bình tại Hà Nội và TP.HCM từ 2019-2023"
      },
      {
        type: "subheading",
        content: "Thách thức và cơ hội"
      },
      {
        type: "paragraph",
        content: "Mặc dù thị trường nhà ở đang phát triển mạnh mẽ, vẫn còn nhiều thách thức đáng kể. Một trong những vấn đề lớn nhất là khả năng tiếp cận nhà ở của người có thu nhập trung bình và thấp. Giá nhà tăng nhanh hơn so với tốc độ tăng thu nhập đã tạo ra khoảng cách lớn giữa nhu cầu và khả năng chi trả."
      },
      {
        type: "paragraph",
        content: "Tuy nhiên, thị trường cũng mang lại nhiều cơ hội. Sự phát triển của các khu đô thị vệ tinh và cải thiện hệ thống giao thông công cộng đang mở ra những lựa chọn mới cho người mua nhà. Đồng thời, xu hướng phát triển bền vững và ứng dụng công nghệ trong xây dựng đang tạo ra những sản phẩm nhà ở chất lượng cao hơn."
      },
      {
        type: "subheading",
        content: "Dự báo cho năm 2024"
      },
      {
        type: "paragraph",
        content: "Các chuyên gia dự báo thị trường nhà ở sẽ tiếp tục tăng trưởng trong năm 2024, nhưng với tốc độ chậm hơn. Chính sách của Chính phủ về quản lý đất đai và phát triển nhà ở xã hội sẽ đóng vai trò quan trọng trong việc định hình thị trường. Đồng thời, sự phát triển của công nghệ fintech và proptech có thể tạo ra những thay đổi đáng kể trong cách thức giao dịch và quản lý bất động sản."
      }
    ],
    relatedArticles: [
      { title: "10 xu hướng thiết kế nhà ở năm 2023", link: "#" },
      { title: "Tác động của lãi suất đến thị trường bất động sản", link: "#" },
      { title: "Phân tích thị trường nhà ở các tỉnh thành mới nổi", link: "#" }
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {article.author}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {article.date}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-xl font-semibold mb-6">{article.summary}</p>
        <Separator className="my-6" />
        {article.content.map((section, index) => {
          switch (section.type) {
            case 'paragraph':
              return <p key={index} className="mb-4">{section.content}</p>
            case 'subheading':
              return <h2 key={index} className="text-2xl font-semibold mt-6 mb-4">{section.content}</h2>
            case 'image':
              return (
                <figure key={index} className="my-6">
                  <img
                    src={section.src}
                    alt={section.alt}
                    width={600}
                    height={400}
                    layout="responsive"
                    className="rounded-lg"
                  />
                  <figcaption className="text-center text-sm text-gray-500 mt-2">{section.caption}</figcaption>
                </figure>
              )
            default:
              return null
          }
        })}
      </article>
      <Separator className="my-8" />
      <section>
        <h3 className="text-2xl font-semibold mb-4">Bài viết liên quan</h3>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {article.relatedArticles.map((relatedArticle, index) => (
                <li key={index}>
                  <a href={relatedArticle.link} className="text-blue-600 hover:underline">
                    {relatedArticle.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}