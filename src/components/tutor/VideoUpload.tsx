
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Video, Trash2, Eye, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tutor's courses
  const { data: courses } = useQuery({
    queryKey: ['tutor-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, subject')
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch course videos
  const { data: courseVideos } = useQuery({
    queryKey: ['course-videos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('course_videos')
        .select(`
          *,
          courses(title, subject)
        `)
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Upload video mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (videoData: {
      title: string;
      description: string;
      courseId: string;
      file: File;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Upload video file to storage
      const fileExt = videoData.file.name.split('.').pop();
      const fileName = `${user.id}/${videoData.courseId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(fileName, videoData.file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(fileName);
      
      // Create video record
      const { data, error } = await supabase
        .from('course_videos')
        .insert({
          course_id: videoData.courseId,
          tutor_id: user.id,
          title: videoData.title,
          description: videoData.description,
          video_url: urlData.publicUrl,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-videos'] });
      toast({ title: "Video uploaded successfully!" });
      // Reset form
      setSelectedFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setSelectedCourse('');
      setIsUploading(false);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({ 
        title: "Upload failed", 
        description: "Please try again or contact support.",
        variant: "destructive" 
      });
      setIsUploading(false);
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from('course_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-videos'] });
      toast({ title: "Video deleted successfully" });
    },
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ videoId, isPublished }: { videoId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('course_videos')
        .update({ is_published: !isPublished })
        .eq('id', videoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-videos'] });
      toast({ title: "Video status updated" });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 500MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle || !selectedCourse) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a video file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadVideoMutation.mutate({
      title: videoTitle,
      description: videoDescription,
      courseId: selectedCourse,
      file: selectedFile,
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Course Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-select">Select Course *</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course for this video" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} ({course.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title *</Label>
            <Input
              id="video-title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Video Description</Label>
            <Textarea
              id="video-description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Describe what students will learn from this video"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Video File *</Label>
            <Input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !videoTitle || !selectedCourse || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Your Course Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseVideos?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No videos uploaded yet.</p>
              <p className="text-sm">Upload your first course video above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseVideos?.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        Course: {video.courses?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={video.is_published ? 'default' : 'secondary'}>
                          {video.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(video.video_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={video.is_published ? 'secondary' : 'default'}
                      onClick={() => togglePublishMutation.mutate({
                        videoId: video.id,
                        isPublished: video.is_published
                      })}
                    >
                      {video.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVideoMutation.mutate(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;
