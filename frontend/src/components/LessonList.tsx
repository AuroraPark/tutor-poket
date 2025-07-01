import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  date: string;
  topic: string;
  status: string;
  studentId: string;
  memo?: string;
}

interface Student {
  id: number;
  name: string;
}

interface LessonListProps {
  lessons: Lesson[];
  students: Student[];
}

export function LessonList({ lessons, students }: LessonListProps) {
  // 학생 이름 가져오기
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === Number(studentId));
    return student?.name || "알 수 없는 학생";
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default">완료</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary">예정</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">취소</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 날짜별로 수업 그룹화
  const groupLessonsByDate = () => {
    const grouped: { [key: string]: Lesson[] } = {};

    lessons.forEach((lesson) => {
      const dateKey = new Date(lesson.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(lesson);
    });

    // 날짜별로 정렬
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([dateKey, dayLessons]) => ({
        date: new Date(dateKey),
        lessons: dayLessons.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      }));
  };

  const groupedLessons = groupLessonsByDate();

  return (
    <div className="space-y-6">
      {groupedLessons.map(({ date, lessons: dayLessons }) => (
        <div key={date.toDateString()} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </h3>

          <div className="space-y-3">
            {dayLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg">
                          {getStudentName(lesson.studentId)}
                        </h4>
                        {getStatusBadge(lesson.status)}
                      </div>

                      <p className="text-muted-foreground mb-2">
                        {lesson.topic}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(lesson.date).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {lesson.memo && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">메모:</span>{" "}
                          {lesson.memo}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {groupedLessons.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            예정된 수업이 없습니다.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
