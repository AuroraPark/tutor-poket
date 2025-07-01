import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/types";
import { Student } from "@/types";

interface LessonCalendarProps {
  lessons: Lesson[];
  students: Student[];
}

export function LessonCalendar({ lessons, students }: LessonCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 달력 시작일 (이전 달의 일부 포함)
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // 달력 종료일 (다음 달의 일부 포함)
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  // 달력에 표시할 날짜들 생성
  const calendarDays = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 특정 날짜의 수업들 가져오기
  const getLessonsForDate = (date: Date) => {
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.date);
      return lessonDate.toDateString() === date.toDateString();
    });
  };

  // 학생 이름 가져오기
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === Number(studentId));
    return student?.name || "알 수 없는 학생";
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="text-xs">
            완료
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="secondary" className="text-xs">
            예정
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="text-xs">
            취소
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h3>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          오늘
        </Button>
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀들 */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const dayLessons = getLessonsForDate(date);

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${isToday ? "ring-2 ring-blue-500" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                } ${isToday ? "text-blue-600" : ""}`}
              >
                {date.getDate()}
              </div>

              <div className="space-y-1">
                {dayLessons.slice(0, 2).map((lesson) => (
                  <div
                    key={lesson.id}
                    className="text-xs p-1 bg-blue-50 rounded"
                  >
                    <div className="font-medium truncate">
                      {getStudentName(lesson.studentId.toString())}
                    </div>
                    <div className="text-gray-600 truncate">{lesson.topic}</div>
                    {getStatusBadge(lesson.status)}
                  </div>
                ))}
                {dayLessons.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayLessons.length - 2}개 더
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
