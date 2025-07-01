import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditableLessonSection } from "@/components/EditableLessonSection";
import { CreateReportDialog } from "@/components/CreateReportDialog";
import {
  useStudent,
  useLessonsByStudent,
  useCreateLesson,
  useUpdateLesson,
} from "@/hooks";
import { Lesson } from "@/types";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({
    date: "",
    time: "",
    topic: "",
    notes: "",
  });
  const [editLesson, setEditLesson] = useState({
    date: "",
    time: "",
    topic: "",
    status: "SCHEDULED" as Lesson["status"],
    notes: "",
  });

  // React Query 훅들
  const {
    data: student,
    isLoading: studentLoading,
    error: studentError,
  } = useStudent(id!);
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessonsByStudent(id!);
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  const handleAddLesson = () => {
    if (newLesson.date && newLesson.time && newLesson.topic && student) {
      createLessonMutation.mutate(
        {
          studentId: Number(id!),
          date: `${newLesson.date}T${newLesson.time}`,
          topic: newLesson.topic,
          status: "SCHEDULED",
        },
        {
          onSuccess: () => {
            setNewLesson({ date: "", time: "", topic: "", notes: "" });
            setIsAddLessonOpen(false);
          },
        }
      );
    }
  };

  const handleEditLesson = () => {
    if (
      selectedLesson &&
      editLesson.date &&
      editLesson.time &&
      editLesson.topic
    ) {
      updateLessonMutation.mutate(
        {
          id: selectedLesson.id.toString(),
          data: {
            date: `${editLesson.date}T${editLesson.time}`,
            topic: editLesson.topic,
            status: editLesson.status,
          },
        },
        {
          onSuccess: () => {
            setIsEditLessonOpen(false);
            setSelectedLesson(null);
            setEditLesson({
              date: "",
              time: "",
              topic: "",
              status: "SCHEDULED",
              notes: "",
            });
          },
        }
      );
    }
  };

  const openEditDialog = (lesson: any) => {
    setSelectedLesson(lesson);
    const lessonDate = new Date(lesson.date);
    const dateStr = lessonDate.toISOString().split("T")[0];
    const timeStr = lessonDate.toTimeString().slice(0, 5);

    setEditLesson({
      date: dateStr,
      time: timeStr,
      topic: lesson.topic,
      status: lesson.status,
      notes: lesson.notes || "",
    });
    setIsEditLessonOpen(true);
  };

  // const handleStatusChange = (
  //   lessonId: string,
  //   newStatus: Lesson["status"]
  // ) => {
  //   updateLessonMutation.mutate({
  //     id: lessonId,
  //     data: { status: newStatus },
  //   });
  // };

  const handleStatusChangeWithReport = (
    lesson: Lesson,
    newStatus: Lesson["status"]
  ) => {
    updateLessonMutation.mutate(
      {
        id: lesson.id.toString(),
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          // 상태가 완료로 변경되었고, 아직 리포트가 없다면 리포트 생성 팝업 표시
          if (newStatus === "COMPLETED" && !lesson.report) {
            setSelectedLesson(lesson);
            setIsCreateReportOpen(true);
          }
        },
      }
    );
  };

  // 로딩 상태
  if (studentLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (studentError || lessonsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mt-2">
            백엔드 서버가 실행 중인지 확인해주세요.
          </p>
          <Link
            to="/students"
            className="text-blue-600 hover:underline mt-4 block"
          >
            학생 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 학생이 없는 경우
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            학생을 찾을 수 없습니다
          </h2>
          <Link to="/students" className="text-blue-600 hover:underline">
            학생 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/students">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.data.name}
              </h1>
            </div>
            <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  수업 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 수업 등록</DialogTitle>
                  <DialogDescription>
                    {student.data.name} 학생의 새로운 수업을 등록합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-date">날짜</Label>
                      <Input
                        id="new-date"
                        type="date"
                        value={newLesson.date}
                        onChange={(e) =>
                          setNewLesson((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-time">시간</Label>
                      <Input
                        id="new-time"
                        type="time"
                        value={newLesson.time}
                        onChange={(e) =>
                          setNewLesson((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-topic">주제</Label>
                    <Input
                      id="new-topic"
                      placeholder="수업 주제를 입력하세요"
                      value={newLesson.topic}
                      onChange={(e) =>
                        setNewLesson((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-notes">메모</Label>
                    <Textarea
                      id="new-notes"
                      placeholder="수업 메모를 입력하세요 (선택사항)"
                      value={newLesson.notes}
                      onChange={(e) =>
                        setNewLesson((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddLessonOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleAddLesson}
                    disabled={createLessonMutation.isPending}
                  >
                    {createLessonMutation.isPending ? "등록 중..." : "등록"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              학생 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <p className="font-medium">{student.data.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <p className="font-medium">
                  {student.data.contact || "연락처 없음"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">과목</p>
                <p className="font-medium">{student.data.subject}</p>
              </div>
              {student.data.memo && (
                <div>
                  <p className="text-sm text-muted-foreground">메모</p>
                  <p className="font-medium">{student.data.memo}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <EditableLessonSection
          lessons={lessons.data?.lessons || []}
          students={[student.data]}
          onEditLesson={openEditDialog}
          onStatusChange={handleStatusChangeWithReport}
        />
      </main>

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>수업 정보 수정</DialogTitle>
            <DialogDescription>
              수업 정보와 상태를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">날짜</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editLesson.date}
                  onChange={(e) =>
                    setEditLesson((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-time">시간</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editLesson.time}
                  onChange={(e) =>
                    setEditLesson((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-topic">주제</Label>
              <Input
                id="edit-topic"
                placeholder="수업 주제를 입력하세요"
                value={editLesson.topic}
                onChange={(e) =>
                  setEditLesson((prev) => ({
                    ...prev,
                    topic: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-status">상태</Label>
              <Select
                value={editLesson.status}
                onValueChange={(value: Lesson["status"]) =>
                  setEditLesson((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">예정</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                  <SelectItem value="CANCELED">취소</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">메모</Label>
              <Textarea
                id="edit-notes"
                placeholder="수업 메모를 입력하세요 (선택사항)"
                value={editLesson.notes}
                onChange={(e) =>
                  setEditLesson((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditLessonOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleEditLesson}
              disabled={updateLessonMutation.isPending}
            >
              {updateLessonMutation.isPending ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Report Dialog */}
      <CreateReportDialog
        isOpen={isCreateReportOpen}
        onClose={() => setIsCreateReportOpen(false)}
        lesson={selectedLesson}
      />
    </div>
  );
}
