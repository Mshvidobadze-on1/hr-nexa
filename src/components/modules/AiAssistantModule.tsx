'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { AiChatMessage, FlightRiskAnalysis } from '@/types/hr';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Flame,
  Activity,
} from 'lucide-react';

export function AiAssistantModule() {
  const { flightRisks, employees, currentUser } = useHR();

  const [activeTab, setActiveTab] = useState<'chat' | 'flightRisk'>('flightRisk');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'გამარჯობა! მე ვარ HR NEXA-ს ხელოვნური ინტელექტის ასისტენტი. შემიძლია გიპასუხოთ საქართველოს შრომის კოდექსზე, შვებულებების წესებზე, ხელფასების კალკულაციასა და კომპანიის შიდა პოლიტიკაზე. რით შემიძლია დაგეხმაროთ?',
      timestamp: '10:00',
      suggestedQuestions: [
        'რამდენი დღეა წლიური ანაზღაურებადი შვებულება?',
        'როგორ იანგარიშება 2%+2% საპენსიო და 20% საშემოსავლო?',
        'რა წესები მოქმედებს ზეგანაკვეთურ სამუშაოზე?',
        'როგორ მუშაობს Earned Wage Access (EWA)?',
      ],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = q.toLowerCase();

      if (lower.includes('შვებულებ') || lower.includes('დღე')) {
        botResponse =
          'საქართველოს შრომის კოდექსის (მუხლი 31) მიხედვით, თანამშრომელს ეკუთვნის წელიწადში არანაკლებ 24 სამუშაო დღე ანაზღაურებადი შვებულება. შვებულების მოთხოვნის უფლება წარმოიშობა მუშაობის დაწყებიდან 11 თვის შემდეგ, თუმცა მხარეთა შეთანხმებით შესაძლებელია უფრო ადრეც.';
      } else if (lower.includes('ხელფას') || lower.includes('საპენსიო') || lower.includes('საშემოსავლო')) {
        botResponse =
          'საქართველოში ხელფასი იანგარიშება შემდეგნაირად:\n1. დარიცხული ხელფასიდან (Gross) იკავება 2% თანამშრომლის საპენსიო ფონდში.\n2. საშემოსავლო 20% იანგარიშება დარჩენილი თანხიდან: (Gross - 2%) × 20%.\n3. ხელზე ასაღები (Net) შეადგენს Gross-ის ~78.4%-ს (საპენსიოთი) ან 80%-ს (საპენსიოს გარეშე).\nდამსაქმებელი დამატებით რიცხავს +2%-ს საპენსიო ფონდში.';
      } else if (lower.includes('ზეგანაკვეთ') || lower.includes('ღამ')) {
        botResponse =
          'სტანდარტული სამუშაო დრო კვირაში 40 საათია. 40 საათს ზემოთ ნამუშევარი საათები ითვლება ზეგანაკვეთურად და ანაზღაურდება გაზრდილი ტარიფით (მინიმუმ საათობრივი განაკვეთის 125%-ით). ღამის საათებია 22:00-დან 06:00 საათამდე.';
      } else if (lower.includes('ewa') || lower.includes('გამოტან')) {
        botResponse =
          'Earned Wage Access (EWA) გაძლევთ საშუალებას თვის ბოლომდე დაუცდელად გამოიტანოთ უკვე ნამუშევარი დღეების შესაბამისი ხელფასის 50%-მდე მყისიერად, 0% საპროცენტო განაკვეთით და ფიქსირებული 5 ₾ საკომისიოთი.';
      } else {
        botResponse = `თქვენს შეკითხვაზე პასუხი HR NEXA-ს შიდა პოლიტიკის მიხედვით: ყველა ოპერაცია (შვებულება, ცნობის გაცემა, ხელფასის უწყისი) სრულად ავტომატიზებულია. დამატებითი დეტალებისთვის შეგიძლიათ მიმართოთ HR დეპარტამენტს ან შეამოწმოთ თქვენი პირადი კაბინეტი.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>HR NEXA • AI & Predictive Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            AI ასისტენტი და პროგნოზული ანალიტიკა
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            ჭკვიანი LLM ასისტენტი შრომის კანონმდებლობასა და შიდა რეგულაციებზე + მანქანური სწავლების
            (ML) მოდელი თანამშრომელთა გადადგომის (Flight Risk) პროგნოზირებისთვის.
          </p>
        </div>

        <div className="flex items-center bg-white/10 p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI HR Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('flightRisk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'flightRisk'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Flight Risk Analytics</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI Chatbot */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">NEXA AI HR Assistant</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RAG Knowledge Base (საქართველოს შრომის კოდექსი 2026)
                </span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-lg p-4 rounded-3xl space-y-2 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[10px] block text-right ${
                      m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>

                  {/* Suggested Question Chips */}
                  {m.suggestedQuestions && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500">
                        ხშირად დასმული შეკითხვები:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-[11px] text-indigo-700 font-semibold cursor-pointer transition text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span>AI აგენერირებს პასუხს...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="დასვით შეკითხვა შრომის კანონმდებლობაზე, შვებულებებზე, ხელფასზე..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Predictive Flight Risk Analytics */}
      {activeTab === 'flightRisk' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                თანამშრომელთა გადადგომის რისკის პროგნოზირება (Flight Risk Model)
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              მოდელი აანალიზებს 4 ძირითად პარამეტრს: ზეგანაკვეთურ სამუშაო საათებს (Burnout),
              გამოუყენებელი შვებულების დღეების რაოდენობას, დასწრების სისტემატურობასა და ბოლო
              შეფასების ქულას.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flightRisks.map((risk) => (
              <div
                key={risk.employeeId}
                className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between space-y-4 ${
                  risk.riskLevel === 'HIGH'
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : risk.riskLevel === 'MEDIUM'
                    ? 'border-amber-300'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {risk.employeeName}
                      </h4>
                      <p className="text-xs text-indigo-700 font-bold mt-0.5">{risk.position}</p>
                      <p className="text-[11px] text-slate-500">{risk.department}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-2xl font-black ${
                          risk.riskLevel === 'HIGH'
                            ? 'text-rose-600'
                            : risk.riskLevel === 'MEDIUM'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {risk.riskScore}%
                      </span>
                      <div
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1 ${
                          risk.riskLevel === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : risk.riskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {risk.riskLevel} RISK
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-4">
                    <div
                      className={`h-full rounded-full ${
                        risk.riskLevel === 'HIGH'
                          ? 'bg-rose-500'
                          : risk.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${risk.riskScore}%` }}
                    />
                  </div>

                  {/* Key Factors */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700">რისკის ფაქტორები:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {risk.keyFactors.map((factor, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="text-[11px] font-extrabold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI რეკომენდაცია HR-სთვის:</span>
                  </div>
                  <p className="text-[11px] text-indigo-950 leading-relaxed">
                    {risk.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
