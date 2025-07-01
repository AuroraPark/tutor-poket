import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";
import { LessonCalendar } from "./LessonCalendar";
import { LessonList } from "./LessonList";

interface Lesson {
  id: string;
  date: string;
  topic: string;
  status: string;
  studentId: string;
  memo?: string;
}

interface Student {
  id: string;
  name: string;
}

interface LessonSectionProps {
  lessons: Lesson[];
  students: Student[];
}

type ViewMode = "calendar" | "list";

export function LessonSection({ lessons, students }: LessonSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">다가오는 수업</h2>

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
        <LessonCalendar lessons={lessons} students={students} />
      ) : (
        <LessonList lessons={lessons} students={students} />
      )}
    </div>
  );
}
