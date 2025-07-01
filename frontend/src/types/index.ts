export interface Student {
  id: number;
  name: string;
  subject: string;
  contact?: string;
  memo?: string;
  tutorId: number;
}

export interface Lesson {
  id: number;
  date: string;
  topic: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  studentId: number;
  notes?: string;
  report?: Report;
  student?: {
    id: number;
    name: string;
    subject: string;
  };
}

export interface Report {
  id: number;
  content: string;
  lessonId: number;
  assignments?: Assignment[];
}

export interface Assignment {
  id: number;
  title: string;
  content?: string;
  status: "PENDING" | "SUBMITTED" | "REVIEWED";
  dueDate?: string;
  attachment?: string;
  reportId: number;
}

export interface Tutor {
  id: number;
  name: string;
  email: string;
}

export interface Notification {
  id: number;
  type: "LESSON_REMINDER" | "REPORT_READY" | "ASSIGNMENT_DUE" | "GENERAL";
  title: string;
  message: string;
  isRead: boolean;
  lessonId?: number;
  reportId?: number;
  tutorId: number;
  createdAt: string;
  lesson?: {
    id: number;
    date: string;
    topic: string;
    status: string;
    studentId: number;
    student: {
      id: number;
      name: string;
      subject: string;
    };
  };
  report?: {
    id: number;
    content: string;
    lessonId: number;
    lesson: {
      id: number;
      date: string;
      topic: string;
      status: string;
      studentId: number;
      student: {
        id: number;
        name: string;
        subject: string;
      };
    };
  };
}
