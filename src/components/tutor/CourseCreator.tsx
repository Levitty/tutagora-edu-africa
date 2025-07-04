
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Plus } from 'lucide-react'
import { useCreateCourse } from '@/hooks/useCourses'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useToast } from '@/hooks/use-toast'

const CourseCreator = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    price: '',
    duration_weeks: '',
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
  const createCourseMutation = useCreateCourse()
  const { uploadFile, uploading } = useFileUpload()
  const { toast } = useToast()

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Economics', 'Literature'
  ]

  const levels = [
    { value: 'primary', label: 'Primary School' },
    { value: 'secondary', label: 'Secondary School' },
    { value: 'university', label: 'University' },
    { value: 'professional', label: 'Professional' },
  ]

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }))
  }

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let thumbnailUrl = ''
      
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'course-materials', `thumbnails/${Date.now()}_${thumbnailFile.name}`)
      }
      
      await createCourseMutation.mutateAsync({
        ...courseData,
        price: courseData.price ? parseFloat(courseData.price) : null,
        duration_weeks: courseData.duration_weeks ? parseInt(courseData.duration_weeks) : null,
        thumbnail_url: thumbnailUrl,
      })
      
      toast({
        title: "Course Created",
        description: "Your course has been created successfully!",
      })
      
      // Reset form
      setCourseData({
        title: '',
        description: '',
        subject: '',
        level: '',
        price: '',
        duration_weeks: '',
      })
      setThumbnailFile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Create New Course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Advanced Mathematics"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={courseData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your course..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh)</Label>
              <Input
                id="price"
                type="number"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                value={courseData.duration_weeks}
                onChange={(e) => handleInputChange('duration_weeks', e.target.value)}
                placeholder="8"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Course Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
            />
            {thumbnailFile && (
              <p className="text-sm text-gray-600">
                Selected: {thumbnailFile.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={createCourseMutation.isPending || uploading}
            className="w-full"
          >
            {createCourseMutation.isPending || uploading ? (
              "Creating Course..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CourseCreator
