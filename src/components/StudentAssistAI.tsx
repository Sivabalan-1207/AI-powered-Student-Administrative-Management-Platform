import React, { useState, useRef, useEffect } from 'react';
import { store } from '../services/store';
import { Bot, Send, User, Sparkles, X, ChevronRight, FileText, Bell, Utensils, ShoppingBag, ExternalLink, HelpCircle } from 'lucide-react';

interface StudentAssistAIProps {
  onNavigate?: (page: string) => void;
  isOpenFloating?: boolean;
  onCloseFloating?: () => void;
  isEmbedded?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: Array<{ label: string; page: string; icon?: string }>;
}

export const StudentAssistAI: React.FC<StudentAssistAIProps> = ({
  onNavigate,
  isOpenFloating,
  onCloseFloating,
  isEmbedded = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: "Hello! I'm **Student Assist AI**, your smart campus administrative guide. How can I help you today? You can ask about certificate applications, parent verification status, academic alerts, predicted completion dates, or campus food and stationery orders!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: 'Track My Certificate', page: 'my-requests' },
        { label: 'Apply for Bonafide', page: 'new-request' },
        { label: 'Check Academic Alerts', page: 'academic-alerts' },
        { label: 'Order Food Court', page: 'food-court' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateGroundedAIResponse(userText);
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 900);
  };

  const generateGroundedAIResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const state = store.getState();
    const student = state.currentUser;
    const activeApps = state.applications.filter((a) => a.studentId === student.id);
    const alerts = state.academicAlerts.filter((a) => a.studentId === student.id && a.status === 'active');
    const orders = state.orders.filter((o) => o.userId === student.id);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `msg-bot-${Date.now()}`;

    // 1. Certificate Tracking & Prediction Query
    if (q.includes('track') || q.includes('status') || q.includes('where is my') || q.includes('certificate')) {
      if (activeApps.length === 0) {
        return {
          id,
          sender: 'bot',
          text: "You currently have no active certificate requests. Would you like to apply for a Bonafide Certificate, Study Certificate, or Conduct Certificate?",
          timestamp,
          actions: [{ label: 'Apply for Certificate', page: 'new-request' }]
        };
      }

      const latest = activeApps[0];
      const estDate = new Date(latest.predictedCompletionDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });

      return {
        id,
        sender: 'bot',
        text: `Here is the live status for your latest request **${latest.requestNumber}** (${latest.serviceTitle}):\n\n` +
          `• **Current Stage:** ${latest.currentStage}\n` +
          `• **Status:** ${latest.status.replace(/_/g, ' ').toUpperCase()}\n` +
          `• **Predicted Completion:** ${estDate}\n` +
          `• **Parent Verification:** ${latest.parentVerificationStatus.toUpperCase()}\n` +
          `• **HOD Approval:** ${latest.hodApprovalStatus.toUpperCase()}\n\n` +
          (latest.isDelayed ? `⚠️ **Delay Note:** ${latest.delayReason || 'Slightly higher queue volume.'}` : '✅ On schedule for estimated completion date.'),
        timestamp,
        actions: [
          { label: 'View Live Request Tracker', page: 'my-requests' },
          { label: 'View Uploaded Documents', page: 'student-documents' }
        ]
      };
    }

    // 2. Parent Verification Query
    if (q.includes('parent') || q.includes('mother') || q.includes('father') || q.includes('verification')) {
      const parentPending = activeApps.find((a) => a.parentVerificationStatus === 'pending');
      if (parentPending) {
        const parentRec = state.parentVerifications.find((p) => p.applicationId === parentPending.id);
        return {
          id,
          sender: 'bot',
          text: `Your request **${parentPending.requestNumber}** (${parentPending.serviceTitle}) is currently waiting for Parent Verification.\n\n` +
            `• Sent to: **${parentRec?.parentContact || student.parentEmail}**\n` +
            `• Token: \`${parentRec?.token || 'token-parent-99218'}\`\n\n` +
            `Your parent can approve via the link sent to their contact, or you can demonstrate the Parent Verification screen directly!`,
          timestamp,
          actions: [{ label: 'Open Live Tracker', page: 'my-requests' }]
        };
      }
      return {
        id,
        sender: 'bot',
        text: "Parent verification is a mandatory security step for Bonafide, Conduct, and Loan certificates. Once initiated, a secure link is sent to your registered parent email/phone. HOD approval is unlocked automatically after parent approval!",
        timestamp
      };
    }

    // 3. Academic Alerts / Attendance / Marks Query
    if (q.includes('attendance') || q.includes('alert') || q.includes('marks') || q.includes('75%')) {
      if (alerts.length > 0) {
        const attAlert = alerts.find((a) => a.type === 'attendance');
        const mrkAlert = alerts.find((a) => a.type === 'internal_marks');

        let text = "⚠️ **Active Academic Alerts Detected:**\n\n";
        if (attAlert) {
          text += `• **Attendance Alert:** ${attAlert.courseCode} (${attAlert.courseName}) is currently **${attAlert.currentValue}%** (below required ${attAlert.thresholdValue}% threshold).\n`;
        }
        if (mrkAlert) {
          text += `• **Internal Mark Alert:** ${mrkAlert.courseCode} (${mrkAlert.courseName}) internal score is **${mrkAlert.currentValue}%** (below minimum target ${mrkAlert.thresholdValue}%).\n`;
        }
        text += "\nRecommended Action: Please consult your course instructor or department HOD for attendance condonation or remedial coaching classes.";

        return {
          id,
          sender: 'bot',
          text,
          timestamp,
          actions: [{ label: 'Open Academic Alerts Page', page: 'academic-alerts' }]
        };
      }
      return {
        id,
        sender: 'bot',
        text: "Your academic records are currently in good standing! Attendance is monitored against a 75% minimum threshold, and internal test marks are checked automatically upon update.",
        timestamp,
        actions: [{ label: 'View Academic Records', page: 'academic-alerts' }]
      };
    }

    // 4. Food Court / Stationery Orders Query
    if (q.includes('food') || q.includes('dosa') || q.includes('stationery') || q.includes('order') || q.includes('qr')) {
      if (orders.length > 0) {
        const latestOrder = orders[0];
        return {
          id,
          sender: 'bot',
          text: `You have an active order **${latestOrder.orderNumber}** (${latestOrder.storeType.toUpperCase()})!\n\n` +
            `• **Total Amount:** ₹${latestOrder.total}\n` +
            `• **Status:** ${latestOrder.orderStatus.replace(/_/g, ' ').toUpperCase()}\n` +
            `• **Payment:** ${latestOrder.paymentStatus.toUpperCase()} (${latestOrder.paymentMethod.toUpperCase()})\n\n` +
            `Show your digital QR code at the counter for counter collection.`,
          timestamp,
          actions: [
            { label: 'View My Orders & QR Receipts', page: 'my-orders' },
            { label: 'Order More Food', page: 'food-court' }
          ]
        };
      }
      return {
        id,
        sender: 'bot',
        text: "You can purchase fresh meals, snacks, beverages from the Digital Food Court or lab notebooks and stationery from the Stationery Store! Complete instant digital checkout to generate a single-use QR collection receipt.",
        timestamp,
        actions: [
          { label: 'Open Food Court', page: 'food-court' },
          { label: 'Open Stationery Store', page: 'stationery-store' }
        ]
      };
    }

    // 5. Default General Administrative Guidance
    return {
      id,
      sender: 'bot',
      text: `I can assist you with administrative workflows on CampusConnect!\n\n` +
        `• **Certificate Applications:** Apply online for Bonafide, Study, Conduct, or Loan certificates.\n` +
        `• **AI Document Pre-checks:** Documents are pre-scanned for file validity, signature presence, and legibility.\n` +
        `• **AI Completion Estimates:** Calculates predicted turnaround times based on historical department velocity.\n` +
        `• **Campus Shopping:** Digital Food Court and Stationery Hub with QR verification.`,
      timestamp,
      actions: [
        { label: 'Apply for Certificate', page: 'new-request' },
        { label: 'Track Requests', page: 'my-requests' },
        { label: 'Campus Dining', page: 'food-court' }
      ]
    };
  };

  const containerContent = (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-purple-100 shadow-xl overflow-hidden">
      
      {/* AI Assistant Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-inner">
            <Bot className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>Student Assist AI</span>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-purple-400/30 text-purple-100 rounded-md border border-purple-300/30">
                Grounded LLM
              </span>
            </div>
            <div className="text-[11px] text-purple-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Connected to Campus Administrative Engine
            </div>
          </div>
        </div>

        {isOpenFloating && onCloseFloating && (
          <button
            onClick={onCloseFloating}
            className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Quick Action Buttons inside Bot Message */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate && onNavigate(act.page)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[11px] hover:bg-purple-100 hover:text-purple-800 transition-colors border border-purple-200/60 flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-medium text-slate-500 ml-1">Analyzing database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI about certificates, parent status, attendance, food..."
            className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );

  if (isEmbedded) {
    return <div className="h-[600px]">{containerContent}</div>;
  }

  if (isOpenFloating) {
    return (
      <div className="fixed bottom-6 right-6 w-96 h-[550px] z-50 animate-in fade-in slide-in-from-bottom-5">
        {containerContent}
      </div>
    );
  }

  return null;
};
