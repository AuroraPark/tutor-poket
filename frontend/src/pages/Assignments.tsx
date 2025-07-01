import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignments,
  useCreateAssignment,
  useUpdateAssignmentStatus,
  useDeleteAssignment,
} from "@/hooks";
import { Assignment } from "@/types";

export default function Assignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    content: "",
    dueDate: "",
    reportId: "",
  });

  const { data: assignmentsData, isLoading, error } = useAssignments();
  const createAssignment = useCreateAssignment();
  const updateStatus = useUpdateAssignmentStatus();
  const deleteAssignment = useDeleteAssignment();

  const assignments = (assignmentsData?.data as Assignment[]) || [];

  // 검색 및 필터링
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.reportId) {
      createAssignment.mutate(
        {
          title: newAssignment.title,
          content: newAssignment.content,
          dueDate: newAssignment.dueDate || undefined,
          reportId: Number(newAssignment.reportId),
          status: "PENDING",
        },
        {
          onSuccess: () => {
            setNewAssignment({
              title: "",
              content: "",
              dueDate: "",
              reportId: "",
            });
            setIsAddDialogOpen(false);
          },
        }
      );
    }
  };

  const handleStatusChange = (assignmentId: string, newStatus: string) => {
    updateStatus.mutate({ id: assignmentId, status: newStatus });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm("정말로 이 과제를 삭제하시겠습니까?")) {
      deleteAssignment.mutate(assignmentId);
    }
  };

  const getStatusBadge = (status: Assignment["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            대기
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            제출
          </Badge>
        );
      case "REVIEWED":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            검토
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "기한 없음";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">과제 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            과제 목록을 불러올 수 없습니다
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
            <h1 className="text-2xl font-bold text-gray-900">과제 관리</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  과제 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 과제 추가</DialogTitle>
                  <DialogDescription>
                    새로운 과제를 생성합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">과제 제목</Label>
                    <Input
                      id="title"
                      placeholder="과제 제목을 입력하세요"
                      value={newAssignment.title}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">과제 내용</Label>
                    <Textarea
                      id="content"
                      placeholder="과제 내용을 입력하세요"
                      value={newAssignment.content}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">제출 기한</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportId">리포트 ID</Label>
                    <Input
                      id="reportId"
                      type="number"
                      placeholder="리포트 ID를 입력하세요"
                      value={newAssignment.reportId}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          reportId: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleCreateAssignment}
                    disabled={createAssignment.isPending}
                  >
                    {createAssignment.isPending ? "생성 중..." : "생성"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="과제 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="PENDING">대기</SelectItem>
                  <SelectItem value="SUBMITTED">제출</SelectItem>
                  <SelectItem value="REVIEWED">검토</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getStatusBadge(assignment.status)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={assignment.status}
                      onValueChange={(value) =>
                        handleStatusChange(assignment.id.toString(), value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">대기</SelectItem>
                        <SelectItem value="SUBMITTED">제출</SelectItem>
                        <SelectItem value="REVIEWED">검토</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteAssignment(assignment.id.toString())
                      }
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignment.content && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {assignment.content}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span
                      className={
                        isOverdue(assignment.dueDate)
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {formatDate(assignment.dueDate)}
                    </span>
                    {isOverdue(assignment.dueDate) && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  {assignment.attachment && (
                    <div className="text-sm text-blue-600">
                      📎 첨부파일 있음
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {searchTerm || (statusFilter && statusFilter !== "all")
                ? "검색 결과가 없습니다."
                : "등록된 과제가 없습니다."}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
