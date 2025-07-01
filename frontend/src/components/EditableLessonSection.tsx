import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";
import { EditableLessonCalendar } from "./EditableLessonCalendar";
import { EditableLessonList } from "./EditableLessonList";
import { Lesson } from "@/types";

interface Student {
  id: string;
  name: string;
}

interface EditableLessonSectionProps {
  lessons: Lesson[];
  students: Student[];
  onEditLesson: (lesson: Lesson) => void;
  onStatusChange?: (lesson: Lesson, newStatus: Lesson["status"]) => void;
}

type ViewMode = "calendar" | "list";

export function EditableLessonSection({
  lessons,
  students,
  onEditLesson,
  onStatusChange,
}: EditableLessonSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">수업 목록</h2>

        {/* 모드 전환 버튼 */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>리스트</span>
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>달력</span>
          </Button>
        </div>
      </div>

      {/* 수업 표시 */}
      {viewMode === "calendar" ? (
        <EditableLessonCalendar
          lessons={lessons}
          students={students}
          onEditLesson={onEditLesson}
          onStatusChange={onStatusChange}
        />
      ) : (
        <EditableLessonList
          lessons={lessons}
          students={students}
          onEditLesson={onEditLesson}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
