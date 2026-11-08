'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHR } from '@/context/HRContext';
import { AiChatMessage } from '@/types/hr';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Sparkles,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

export function FloatingAiChat() {
  const { isAiChatOpen, setIsAiChatOpen, toggleAiChat, currentUser } = useHR();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `გამარჯობა, ${currentUser?.fullName?.split(' ')[0] || ''}! 👋 მე ვარ HR NEXA-ს ხელოვნური ინტელექტის ასისტენტი. შემიძლია გიპასუხოთ საქართველოს შრომის კოდექსზე, შვებულების წესებზე, ხელფასის კალკულაციასა და EWA-ზე. რით შემიძლია დაგეხმაროთ?`,
      timestamp: '10:00',
      suggestedQuestions: [
        'რამდენი დღეა წლიური შვებულება?',
        'როგორ იანგარიშება 2%+2% საპენსიო?',
        'როგორ გამოვიტანო ხელფასი EWA-ით?',
        'როგორ ანაზღაურდება ზეგანაკვეთური?',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = q.toLowerCase();

      if (lower.includes('შვებულებ') || lower.includes('დღე')) {
        botResponse =
          'საქართველოს შრომის კოდექსის (მუხლი 31) მიხედვით:\n• თანამშრომელს ეკუთვნის წელიწადში არანაკლებ 24 სამუშაო დღე ანაზღაურებადი შვებულება.\n• ასევე შესაძლებელია წელიწადში 15 კალენდარული დღე უხელფასო შვებულების აღება.\n• მოთხოვნის გაგზავნა შეგიძლიათ პირდაპირ „შვებულებების“ მოდულიდან.';
      } else if (lower.includes('ხელფას') || lower.includes('საპენსიო') || lower.includes('საშემოსავლო')) {
        botResponse =
          'საქართველოში ხელფასის დაბეგვრა და დაქვითვები:\n1. დარიცხული ხელფასიდან (Gross) 2% ირიცხება დასაქმებულის საპენსიო ანგარიშზე.\n2. საშემოსავლო გადასახადი (20%) იანგარიშება: (Gross - 2%) × 20%.\n3. ხელზე ასაღები თანხა (Net) შეადგენს Gross-ის დაახლოებით 78.4%-ს.\n4. დამსაქმებელი თავის მხრივ დამატებით რიცხავს +2%-ს საპენსიო სააგენტოში.';
      } else if (lower.includes('ewa') || lower.includes('წინსწრებ') || lower.includes('გამოტან')) {
        botResponse =
          'Earned Wage Access (EWA) მოდულით თქვენ შეგიძლიათ:\n• გამოიტანოთ უკვე ნამუშევარი დღეების გამომუშავებული ხელფასის 50%-მდე მყისიერად.\n• თანხა ირიცხება საქართველოს ნებისმიერ ბანკში (TBC / BOG) 5 ₾ ფიქსირებული საკომისიოთი.\n• სესხის პროცენტი არის 0%, რადგან ეს თქვენივე გამომუშავებული ხელფასია!';
      } else if (lower.includes('ზეგანაკვეთ') || lower.includes('ღამ')) {
        botResponse =
          'შრომის კოდექსის რეგულაციები სამუშაო დროზე:\n• სტანდარტული სამუშაო დრო კვირაში 40 საათია.\n• 40 საათს ზემოთ მუშაობა ითვლება ზეგანაკვეთურად და ანაზღაურდება გაზრდილი ტარიფით (მინიმუმ საათობრივი განაკვეთის 125%).\n• ღამის საათებია 22:00-დან 06:00-მდე.';
      } else if (lower.includes('ცნობ') || lower.includes('ბანკ')) {
        botResponse =
          'სამსახურებრივი ცნობის მიღება შეგიძლიათ „თანამშრომლის კაბინეტიდან“ (ESS). ცნობა ხელფასისა და დაკავებული თანამდებობის შესახებ გენერირდება მყისიერად როგორც ქართულ, ისე ინგლისურ ენაზე (PDF / ბეჭდვა).';
      } else {
        botResponse = `თქვენს შეკითხვაზე პასუხი HR NEXA-ს პოლიტიკით: ყველა პროცედურა სრულად ციფრულია. შეგიძლიათ ისარგებლოთ პირადი კაბინეტით, ან დამატებითი შეკითხვით მიმართოთ HR მენეჯერს.`;
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
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'assistant',
        text: 'ჩატი განახლდა. რით შემიძლია დაგეხმაროთ?',
        timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          'რამდენი დღეა წლიური შვებულება?',
          'როგორ იანგარიშება 2%+2% საპენსიო?',
          'როგორ გამოვიტანო ხელფასი EWA-ით?',
          'როგორ ანაზღაურდება ზეგანაკვეთური?',
        ],
      },
    ]);
  };

  return (
    <div className="select-none">
      {/* Floating Trigger Launcher Button (When closed) */}
      {!isAiChatOpen && (
        <button
          onClick={toggleAiChat}
          type="button"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        >
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-indigo-700 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <div className="flex items-center gap-1.5 text-xs font-black">
              <span>AI ასისტენტი</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            </div>
            <div className="text-[10px] text-indigo-200">შრომის კოდექსი & HR</div>
          </div>
        </button>
      )}

      {/* Floating Chat Window (When Open) */}
      {isAiChatOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] w-auto h-[530px] sm:h-[580px] max-h-[82vh] z-50 rounded-2xl sm:rounded-3xl shadow-2xl border border-indigo-500/30 bg-slate-900/95 backdrop-blur-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <Bot className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">HR NEXA AI</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 truncate max-w-[200px]">
                  შრომის კოდექსი & HR მრჩეველი
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="ჩატის გასუფთავება"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleAiChat}
                title="ჩაკეცვა"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAiChatOpen(false)}
                title="დახურვა"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 space-y-1.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[10px] ${
                      msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {/* Suggested Question Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                      <div className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>სწრაფი შეკითხვები:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500/40 text-[10px] text-slate-300 hover:text-white transition text-left cursor-pointer"
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
              <div className="flex gap-2.5 justify-start items-center text-slate-400 text-xs pl-9">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="italic text-[11px]">AI წერს პასუხს...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chip Shortcuts above Input */}
          <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] sm:text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend('რამდენი დღეა წლიური შვებულება?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              🏖️ შვებულება
            </button>
            <button
              onClick={() => handleSend('როგორ იანგარიშება 2%+2% საპენსიო?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              💰 საპენსიო
            </button>
            <button
              onClick={() => handleSend('როგორ გამოვიტანო ხელფასი EWA-ით?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              ⚡ EWA
            </button>
          </div>

          {/* Chat Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="დასვით შეკითხვა შრომის კოდექსზე..."
              className="flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
