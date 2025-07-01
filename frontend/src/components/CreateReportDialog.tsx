import { useState } from "react";
import { FileText, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReport } from "@/hooks";
import { Lesson } from "@/types";

interface CreateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

export function CreateReportDialog({
  isOpen,
  onClose,
  lesson,
}: CreateReportDialogProps) {
  const [content, setContent] = useState("");
  const createReport = useCreateReport();

  const handleSubmit = () => {
    if (content.trim() && lesson) {
      createReport.mutate(
        {
          content: content.trim(),
          lessonId: lesson.id,
        },
        {
          onSuccess: () => {
            setContent("");
            onClose();
          },
        }
      );
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            수업 리포트 작성
          </DialogTitle>
          <DialogDescription>
            {lesson.topic} 수업에 대한 리포트를 작성해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 수업 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>학생: {lesson.student?.name || "알 수 없는 학생"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(lesson.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-sm text-gray-600">주제: {lesson.topic}</div>
          </div>

          {/* 리포트 내용 */}
          <div className="space-y-2">
            <Label htmlFor="report-content">리포트 내용</Label>
            <Textarea
              id="report-content"
              placeholder="수업 내용, 학생의 이해도, 개선점, 다음 수업 계획 등을 작성해주세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-gray-500">{content.length}/2000자</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || createReport.isPending}
          >
            {createReport.isPending ? "저장 중..." : "리포트 저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
