import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { LessonSection } from "@/components/LessonSection";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useStudents, useLessons } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudents();
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessons();
  const { logout, user, stats } = useAuth();

  if (studentsLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (studentsError || lessonsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mt-2">
            백엔드 서버가 실행 중인지 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TutorPocket</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                안녕하세요, {user?.name}님!
              </div>
              <NotificationDropdown />
              <Link to="/assignments">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  과제
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 학생 수</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.data?.totalStudents || students.length}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.data?.newStudentsThisMonth || 0}명 이번 달
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                이번 주 수업
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.data?.totalLessonsThisWeek || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                완료: {stats?.data?.completedLessonsThisWeek || 0}개 / 예정:{" "}
                {stats?.data?.scheduledLessonsThisWeek || 0}개
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료율</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.data?.completionRateThisMonth || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.data?.completionRateChange > 0 ? "+" : ""}
                {stats?.data?.completionRateChange || 0}% 지난 달 대비
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">내 학생들</h2>
            <AddStudentDialog />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.data?.map((student: any) => (
              <Link key={student.id} to={`/students/${student.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {student.name}
                        </CardTitle>
                        <CardDescription>
                          {student.contact || "연락처 없음"}
                        </CardDescription>
                      </div>
                      <Badge variant="default">{student.subject}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">과목:</span>
                        <span>{student.subject}</span>
                      </div>
                      {student.memo && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">메모:</span>{" "}
                          {student.memo}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="mt-8">
          <LessonSection
            lessons={lessons.data || []}
            students={students.data || []}
          />
        </div>
      </main>
    </div>
  );
}
