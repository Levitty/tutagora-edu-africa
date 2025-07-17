
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, CheckCircle, Clock, XCircle, GraduationCap } from 'lucide-react'
import { useKYCDocuments, useUploadKYCDocument } from '@/hooks/useKYC'
import { useToast } from '@/hooks/use-toast'

const KYCUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')
  const [academicQualificationType, setAcademicQualificationType] = useState('')
  const { data: kycDocuments = [], isLoading } = useKYCDocuments()
  const uploadMutation = useUploadKYCDocument()
  const { toast } = useToast()

  const documentTypes = [
    { value: 'id_card', label: 'National ID Card', category: 'identification' },
    { value: 'passport', label: 'Passport', category: 'identification' },
    { value: 'driving_license', label: 'Driving License', category: 'identification' },
    { value: 'academic_qualification', label: 'Academic Qualification', category: 'academic' },
    { value: 'certificate', label: 'Teaching Certificate', category: 'professional' },
  ]

  const academicQualificationTypes = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)',
    'Professional Certificate',
    'Teaching License',
    'Other'
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and file to upload.",
        variant: "destructive",
      })
      return
    }

    if (documentType === 'academic_qualification' && !academicQualificationType) {
      toast({
        title: "Missing Information",
        description: "Please specify the type of academic qualification.",
        variant: "destructive",
      })
      return
    }

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        documentType,
        academicQualificationType: documentType === 'academic_qualification' ? academicQualificationType : undefined
      })
      
      toast({
        title: "Document Uploaded",
        description: "Your KYC document has been submitted for review.",
      })
      
      setSelectedFile(null)
      setDocumentType('')
      setAcademicQualificationType('')
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getDocumentIcon = (type: string) => {
    if (type === 'academic_qualification' || type === 'certificate') {
      return <GraduationCap className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  const getDocumentLabel = (type: string) => {
    const doc = documentTypes.find(d => d.value === type)
    return doc?.label || type.replace('_', ' ').toUpperCase()
  }

  const getCategoryColor = (type: string) => {
    const doc = documentTypes.find(d => d.value === type)
    switch (doc?.category) {
      case 'identification':
        return 'bg-blue-50 border-blue-200'
      case 'academic':
        return 'bg-green-50 border-green-200'
      case 'professional':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (isLoading) {
    return <div>Loading KYC documents...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            KYC Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(type.value)}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {documentType === 'academic_qualification' && (
            <div className="space-y-2">
              <Label htmlFor="academic-qualification-type">Academic Qualification Type</Label>
              <Select value={academicQualificationType} onValueChange={setAcademicQualificationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification type" />
                </SelectTrigger>
                <SelectContent>
                  {academicQualificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Document</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            <p className="text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !documentType || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kycDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No documents uploaded yet.</p>
              <p className="text-sm">Upload your identification and academic documents above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {kycDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${getCategoryColor(doc.document_type)}`}
                >
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.document_type)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {getDocumentLabel(doc.document_type)}
                      </div>
                      {doc.academic_qualification_type && (
                        <div className="text-sm text-green-700 font-medium">
                          {doc.academic_qualification_type}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                      </div>
                      {doc.notes && doc.status === 'rejected' && (
                        <div className="text-sm text-red-600 mt-1">
                          <strong>Admin Notes:</strong> {doc.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <Badge variant={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default KYCUpload
