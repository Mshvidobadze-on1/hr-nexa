'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { Course, CourseLesson } from '@/types/hr';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Award,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  FileText,
  HelpCircle,
  X,
  Share2,
  Printer,
  ChevronRight,
  Check,
  Video,
} from 'lucide-react';

export function LmsModule() {
  const { courses, completeCourseQuiz, currentUser, employees } = useHR();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) || employees[3] || employees[0];

  const filteredCourses = courses.filter((c) =>
    categoryFilter === 'ALL' ? true : c.category === categoryFilter
  );

  const startCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveLesson(course.lessons[0] || null);
    setShowQuiz(false);
    setQuizCompleted(false);
    setShowCertificate(false);
    setQuizAnswers({});
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const submitQuiz = () => {
    if (!selectedCourse) return;
    let correct = 0;
    selectedCourse.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const percentage = Math.round((correct / selectedCourse.quiz.length) * 100);
    setQuizScore(percentage);
    setQuizCompleted(true);

    if (percentage >= 70) {
      completeCourseQuiz(selectedCourse.id, selectedCourse.pointsReward);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>HR NEXA • LMS (Learning Management System)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            სწავლება და პროფესიული განვითარება
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            ვიდეო გაკვეთილები, პრეზენტაციები, ტესტები და სერტიფიკატები. კურსის წარმატებით გავლისას
            ავტომატურად გერიცხებათ NEXA Rewards ქულები!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-300 font-semibold">ჩემი NEXA ქულები</div>
            <div className="text-xl font-black text-amber-400">{currentEmp.nexaPoints} pts</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedCourse ? (
        /* Course Catalog */
        <div className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs">
            {['ALL', 'FinTech & Law', 'IT & Security', 'HR & Management'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'ყველა კურსი' : cat}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className={`p-6 ${course.thumbnail} text-white relative overflow-hidden`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                      {course.category}
                    </span>
                    <h3 className="text-base font-extrabold mt-3 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.totalDuration}</span>
                      <span>•</span>
                      <span>{course.lessons.length} გაკვეთილი</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="text-[11px] text-slate-500">
                      ლექტორი: <strong className="text-slate-900">{course.instructor}</strong>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{course.pointsReward} NEXA ქულა</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {course.enrolledCount} თანამშრომელი
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => startCourse(course)}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>კურსის დაწყება</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Course Player & Lessons View */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Player Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
            >
              <span>← კურსების კატალოგში დაბრუნება</span>
            </button>
            <div className="font-extrabold text-sm text-slate-900 truncate max-w-md">
              {selectedCourse.title}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
              <Sparkles className="w-4 h-4" />
              <span>+{selectedCourse.pointsReward} ქულა</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Video Player & Lesson Summary or Quiz */}
            <div className="lg:col-span-8 space-y-4">
              {!showQuiz ? (
                <>
                  {/* Video Player Box */}
                  <div className="bg-slate-950 rounded-3xl overflow-hidden aspect-video shadow-2xl relative flex items-center justify-center border border-slate-800">
                    {activeLesson?.videoUrl ? (
                      <video
                        controls
                        className="w-full h-full object-contain"
                        src={activeLesson.videoUrl}
                      />
                    ) : (
                      <div className="text-center p-8 text-white space-y-3">
                        <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                        <h4 className="font-bold text-base">{activeLesson?.title}</h4>
                        <p className="text-xs text-slate-400 max-w-md">
                          პრეზენტაციის სლაიდები და სალექციო მასალები მოცემულია ქვემოთ.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Notes */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900">
                        {activeLesson?.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-semibold">
                        ხანგრძლივობა: {activeLesson?.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeLesson?.summary}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>შემაჯამებელ ტესტზე გადასვლა (Quiz)</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Interactive Quiz Card */
                <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase">
                        კურსის შემაჯამებელი ტესტი
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">
                        შემოწმება და სერტიფიცირება
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      ← გაკვეთილებზე დაბრუნება
                    </button>
                  </div>

                  {!quizCompleted ? (
                    <div className="space-y-6">
                      {selectedCourse.quiz.map((q, idx) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="font-bold text-xs text-slate-900">
                            {idx + 1}. {q.question}
                          </div>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                                  quizAnswers[q.id] === oIdx
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={quizAnswers[q.id] === oIdx}
                                  onChange={() => handleAnswerSelect(q.id, oIdx)}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length < selectedCourse.quiz.length}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 cursor-pointer transition transform active:scale-95"
                        >
                          ტესტის გაგზავნა და შეფასება
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Quiz Results Card */
                    <div className="text-center py-6 space-y-4">
                      <div
                        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center font-black text-2xl ${
                          quizScore >= 70
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        {quizScore >= 70 ? '✓' : '!'}
                      </div>

                      <div>
                        <h4 className="text-xl font-black text-slate-900">
                          {quizScore >= 70
                            ? 'გილოცავთ! ტესტი წარმატებით ჩაბარებულია!'
                            : 'ტესტი ვერ ჩაბარდა, სცადეთ თავიდან'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          თქვენი შედეგი: <strong>{quizScore}%</strong> (მინიმალური გამსვლელი: 70%)
                        </p>
                      </div>

                      {quizScore >= 70 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-sm mx-auto text-amber-800 text-xs font-bold flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>თქვენ დაგერიცხათ +{selectedCourse.pointsReward} NEXA ქულა!</span>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-3 pt-3">
                        {quizScore >= 70 && (
                          <button
                            onClick={() => setShowCertificate(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>სერტიფიკატის ნახვა</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setQuizCompleted(false);
                            setQuizAnswers({});
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                          თავიდან გავლა
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 4 Cols: Lesson Navigation List */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">სასწავლო პროგრამა</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCourse.lessons.length} გაკვეთილი • 1 ტესტი
                </p>
              </div>

              <div className="space-y-2">
                {selectedCourse.lessons.map((ls, idx) => (
                  <button
                    key={ls.id}
                    onClick={() => {
                      setActiveLesson(ls);
                      setShowQuiz(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      activeLesson?.id === ls.id && !showQuiz
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-xs truncate">{ls.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium font-mono">
                      {ls.duration}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => setShowQuiz(true)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    showQuiz
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100/60 text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold">შემაჯამებელი ქვიზი</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                    ტესტი
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      {showCertificate && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">HR NEXA Official Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  ბეჭდვა / PDF
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Canvas */}
            <div className="p-8 text-center space-y-6 border-8 border-indigo-50 m-4 rounded-2xl bg-gradient-to-b from-white via-indigo-50/20 to-white">
              <div className="text-indigo-900 font-extrabold text-2xl tracking-widest uppercase">
                HR NEXA ACADEMY
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                სერტიფიკატი გაიცემა წარმატებით დასრულებისთვის
              </div>

              <div className="text-3xl font-black text-slate-900 pt-2 border-b-2 border-indigo-600 inline-block px-8 pb-1">
                {currentEmp.firstName} {currentEmp.lastName}
              </div>

              <div className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                წარმატებით გაიარა და შეაფასა პროფესიული კურსი: <br />
                <strong className="text-indigo-950 text-sm">{selectedCourse.title}</strong>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left text-[11px] text-slate-500">
                <div>
                  <div>გაცემის თარიღი:</div>
                  <strong className="text-slate-900">05 ნოემბერი, 2026</strong>
                </div>
                <div className="text-center">
                  <div>სერტიფიკატის ID:</div>
                  <strong className="text-slate-900 font-mono">NX-2026-88192</strong>
                </div>
                <div className="text-right">
                  <div>ავტორიზებული:</div>
                  <strong className="text-slate-900">HR NEXA Cloud</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
