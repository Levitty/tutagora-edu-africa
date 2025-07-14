import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CourseCreator from "@/components/tutor/CourseCreator";

const CourseCreation = () => {
  return (
    <ProtectedRoute requiredRole="tutor">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
            <p className="text-muted-foreground">Share your expertise and create engaging courses</p>
          </div>
          <CourseCreator />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CourseCreation;