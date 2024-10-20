import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Tag, Plus, X, Trash } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ToastAction } from '@radix-ui/react-toast'

const formSchema = z.object({
  title: z.string().min(10, { message: "Tiêu đề phải có ít nhất 10 ký tự" }),
  summary: z.string().min(50, { message: "Tóm tắt phải có ít nhất 50 ký tự" }),
  author: z.string().min(2, { message: "Tên tác giả phải có ít nhất 2 ký tự" }),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "Ngày phải có định dạng DD/MM/YYYY" }),
  tags: z.array(z.string()).min(1, { message: "Phải có ít nhất 1 tag" }),
  content: z.array(z.object({
    type: z.enum(["paragraph", "subheading", "image"]),
    content: z.string(),
    src: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })).min(1, { message: "Phải có ít nhất 1 phần nội dung" }),
})

export default function CreateNewsArticle() {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Phân tích chi tiết thị trường nhà ở Việt Nam năm 2023",
      summary: "Bài viết này cung cấp cái nhìn tổng quan về thị trường nhà ở Việt Nam trong năm 2023, phân tích các xu hướng chính, thách thức và cơ hội trong lĩnh vực bất động sản.",
      author: "Nguyễn Văn A",
      date: new Date().toLocaleDateString('en-GB'),
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
    },
  })

  const onSubmit = (values) => {
    console.log(values)
    toast({
      className: (
        'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
      ),
      title: "Bài viết đã được tạo",
      description: "Bài viết của bạn đã được gửi để xét duyệt.",
      duration: 4000,
      position: "top",
      action: <ToastAction
        onClick={() => console.log('Clicked!')}
        altText="Close">Close</ToastAction>
    })
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      form.setValue('tags', [...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tag) => {
    const updatedTags = tags.filter(t => t !== tag)
    setTags(updatedTags)
    form.setValue('tags', updatedTags)
  }

  const addContentSection = (type) => {
    const currentContent = form.getValues().content
    form.setValue('content', [...currentContent, { type, content: "" }])
  }

  const removeContentSection = (index) => {
    const currentContent = form.getValues().content;
    const updatedContent = currentContent.filter((_, i) => i !== index);
    form.setValue('content', updatedContent);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Tạo bài viết mới</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tóm tắt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập tóm tắt bài viết"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tác giả</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên tác giả" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-auto p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Thêm tag mới"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />
                      <Button type="button" onClick={addTag}>
                        Thêm
                      </Button>
                    </div>
                    <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
                  </FormItem>

                  <Separator />

                  <div>
                    <FormLabel>Nội dung</FormLabel>
                    {form.watch('content').map((section, index) => (
                      <div key={index} className="mt-4">
                        <Select
                          onValueChange={(value) => {
                            const newContent = [...form.getValues().content]
                            newContent[index].type = value
                            form.setValue('content', newContent)
                          }}
                          defaultValue={section.type}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại nội dung" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paragraph">Đoạn văn</SelectItem>
                            <SelectItem value="subheading">Tiêu đề phụ</SelectItem>
                            <SelectItem value="image">Hình ảnh</SelectItem>
                          </SelectContent>
                        </Select>
                        <Controller
                          name={`content.${index}.content`}
                          control={form.control}
                          render={({ field }) => (
                            section.type === "image" ? (
                              <Input
                                className="mt-2"
                                placeholder="Nhập đường dẫn hình ảnh"
                                {...field}
                              />
                            ) : (
                              section.type === "subheading" ? (
                                <Input
                                  className="mt-2"
                                  placeholder="Nhập tiêu đề phụ"
                                  {...field}
                                />
                              ) : (
                                <ReactQuill
                                  theme="snow"
                                  value={field.value}
                                  onChange={field.onChange}
                                  className="mt-2"
                                  modules={{
                                    toolbar: [
                                      ['bold', 'italic', 'underline', 'strike'],
                                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                      ['link'],
                                      ['clean']
                                    ],
                                  }}
                                />
                              )
                            )
                          )}
                        />
                        {section.type === "image" && (
                          <>
                            <Input
                              className="mt-2"
                              placeholder="Alt text"
                              {...form.register(`content.${index}.alt`)}
                            />
                            <Input
                              className="mt-2"
                              placeholder="Caption"
                              {...form.register(`content.${index}.caption`)}
                            />
                          </>
                        )}
                        {/* Remove Button */}
                        {form.watch('content').length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => removeContentSection(index)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Xóa nội dung
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => addContentSection("paragraph")}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Thêm nội dung
                    </Button>
                  </div>

                  <Button type="submit">Đăng bài</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/2 sticky top-4 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Xem trước bài viết</CardTitle>
            </CardHeader>
            <CardContent>
              <article>
                <h1 className="text-3xl font-bold mb-4">{form.watch('title')}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {form.watch('author')}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {form.watch('date')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {form.watch('tags').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xl font-semibold mb-6">{form.watch('summary')}</p>
                <Separator className="my-6" />
                {form.watch('content').map((section, index) => {
                  switch (section.type) {
                    case 'paragraph':
                      return <div key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: section.content }} />
                    case 'subheading':
                      return <h2 key={index} className="text-2xl font-semibold mt-6 mb-4">{section.content}</h2>
                    case 'image':
                      return (
                        <figure key={index} className="my-6">
                          <img
                            src={section.content}
                            alt={section.alt || ''}
                            className="rounded-lg w-full h-auto"
                          />
                          <figcaption className="text-center text-sm text-gray-500 mt-2">{section.caption}</figcaption>
                        </figure>
                      )
                    default:
                      return null
                  }
                })}
              </article>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}