import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useCreateStudent } from "@/hooks/useStudents";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";

interface AddStudentDialogProps {
  onSuccess?: () => void;
}

export function AddStudentDialog({ onSuccess }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    contact: "",
    memo: "",
  });

  const createStudentMutation = useCreateStudent();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      console.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      await createStudentMutation.mutateAsync({
        ...formData,
        tutorId: user.id,
      });

      // 폼 초기화
      setFormData({
        name: "",
        subject: "",
        contact: "",
        memo: "",
      });

      // 다이얼로그 닫기
      setOpen(false);

      // 성공 콜백 호출
      onSuccess?.();
    } catch (error) {
      console.error("학생 추가 실패:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          학생 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 학생 추가</DialogTitle>
          <DialogDescription>
            새로운 학생의 정보를 입력해주세요. 이름과 과목은 필수입니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="학생 이름"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                과목
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="수학, 영어, 과학 등"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                연락처
              </Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="010-1234-5678"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memo" className="text-right">
                메모
              </Label>
              <Textarea
                id="memo"
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="학생에 대한 추가 정보나 메모"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={createStudentMutation.isPending}>
              {createStudentMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
