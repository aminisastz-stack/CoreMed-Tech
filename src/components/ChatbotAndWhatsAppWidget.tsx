import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Send,
  AlertOctagon,
  Bot,
  Phone,
  ExternalLink,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatbotAndWhatsAppWidgetProps {
  onOpenMaintenanceModal: () => void;
}

export const ChatbotAndWhatsAppWidget: React.FC<ChatbotAndWhatsAppWidgetProps> = ({
  onOpenMaintenanceModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Habari! Karibu CoreMed Tech (Biomedical Solutions). We provide 24/7 biomedical engineering, ISO 17025 calibration, and hospital spare parts across Tanzania.\n\nJe, nikusaidie nini leo? / How can I assist your clinical facility today?',
      timestamp: 'Just now',
      quickActions: [
        { label: '🚨 Ripoti Mashine Iliyoharibika (Emergency)', actionId: 'report_fault' },
        { label: '⚙️ Omba Calibration / Maintenance SLA', actionId: 'request_sla' },
        { label: '💬 Wasiliana Moja kwa Moja WhatsApp', actionId: 'whatsapp_direct' },
        { label: '📍 Ghala la Spare Parts & Vituo vya Arusha/Dar', actionId: 'spares_info' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [messages, isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'whatsapp_direct') {
      window.open(
        'https://wa.me/255742296631?text=Habari%20CoreMed%20Tech,%20nahitaji%20msaada%20wa%20biomedical%20engineering%20kwa%20ajili%20ya%20hospitali%20yetu.',
        '_blank'
      );
      return;
    }

    if (actionId === 'report_fault') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Nahitaji kuripoti mashine iliyoharibika kwa dharura (Emergency Repair)',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Tafadhali toa jina la hospitali, idara (mfano: ICU, Theatre, Radiology), na aina ya mashine iliyoharibika. Timu yetu ya Dar es Salaam na Arusha inapatikana kwa dharura masaa 24.\n\nAu bonyeza kitufe hapa chini kufungua fomu rasmi ya SLA Dispatch:',
          timestamp: 'Just now',
          quickActions: [
            { label: 'Fungua Fomu ya Dispatch ya Dharura', actionId: 'open_dispatch_form' },
            { label: 'Piga Simu ya Dharura: +255 742 296 631', actionId: 'call_hotline' }
          ]
        };
        setMessages((prev) => [...prev, botReply]);
      }, 700);
      return;
    }

    if (actionId === 'request_sla') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Ningependa taarifa za Calibration na Makubaliano ya Maintenance SLA',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'CoreMed Tech hutoa mikataba miwili ya SLA:\n1. Comprehensive SLA: Inajumuisha vipuri vyote (spares), ukaguzi wa kila mwezi, na dharura ya saa 4.\n2. Non-Comprehensive / Calibration SLA: Ukaguzi wa usalama wa umeme (IEC 62353) na vyeti vya ISO 17025 vya TMDA.\n\nUngependa quotation ya hospitali yako?',
          timestamp: 'Just now',
          quickActions: [
            { label: 'Fungua Fomu ya Maombi ya SLA', actionId: 'open_dispatch_form' },
            { label: 'Ongea na Mhandisi Mkuu WhatsApp', actionId: 'whatsapp_direct' }
          ]
        };
        setMessages((prev) => [...prev, botReply]);
      }, 700);
      return;
    }

    if (actionId === 'spares_info') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Je, mna ghala la spare parts wapi?',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Ghala letu kuu la vipuri (Regional Spare Parts Warehouse) lipo Dar es Salaam, Ali Hassan Mwinyi Rd, Kijitonyama. Tuna zaidi ya vipuri 12,000 vya ultrasound, X-ray, ventilators, na autoclaves.\n\nMakao Makuu yapo Arusha (AICC Kilimanjaro Hall Room 341).',
          timestamp: 'Just now'
        };
        setMessages((prev) => [...prev, botReply]);
      }, 700);
      return;
    }

    if (actionId === 'open_dispatch_form') {
      onOpenMaintenanceModal();
      return;
    }

    if (actionId === 'call_hotline') {
      window.location.href = 'tel:+255742296631';
      return;
    }

    if (actionId.startsWith('forward_whatsapp:')) {
      const rawQuery = decodeURIComponent(actionId.replace('forward_whatsapp:', ''));
      const textParam = encodeURIComponent(
        `Habari CoreMed Tech (+255 742 296 631), nina swali kuhusu: "${rawQuery}". Naomba ufafanuzi wa kiufundi kutoka kwa mhandisi wa biomedical.`
      );
      window.open(`https://wa.me/255742296631?text=${textParam}`, '_blank');
      return;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Smart simulated responses in Swahili and English
    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase().trim();
      let replyText = '';
      let isUnknown = false;
      let quickActions: { label: string; actionId: string; isPrimaryWhatsApp?: boolean }[] = [];

      // Check known biomedical domain topics
      if (
        lower.includes('bei') ||
        lower.includes('cost') ||
        lower.includes('quote') ||
        lower.includes('proforma') ||
        lower.includes('gharama') ||
        lower.includes('invoice') ||
        lower.includes('bei gani') ||
        lower.includes('how much') ||
        lower.includes('shilingi') ||
        lower.includes('tsh') ||
        lower.includes('usd')
      ) {
        replyText =
          'Gharama zetu hutegemea aina ya kifaa cha tiba na kiwango cha makubaliano ya SLA. Tunaweza kukutumia Pro-Forma Invoice rasmi iliyo tayari kwa NeST au ununuzi wa moja kwa moja ndani ya masaa 2.\n\nTafadhali bonyeza "Omba Pro-Forma Invoice" au wasiliana moja kwa moja na idara ya mauzo.';
        quickActions = [
          { label: 'Omba Pro-Forma Invoice / SLA', actionId: 'open_dispatch_form' },
          { label: 'Ongea na Mauzo WhatsApp (+255 742 296 631)', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('arusha') ||
        lower.includes('dar') ||
        lower.includes('mwanza') ||
        lower.includes('dodoma') ||
        lower.includes('mbeya') ||
        lower.includes('kilimanjaro') ||
        lower.includes('moshi') ||
        lower.includes('wapi') ||
        lower.includes('ofisi') ||
        lower.includes('location') ||
        lower.includes('depot') ||
        lower.includes('where') ||
        lower.includes('makao') ||
        lower.includes('kituo') ||
        lower.includes('address')
      ) {
        replyText =
          'Wahandisi wetu wapo Arusha (Makao Makuu: AICC Kilimanjaro Hall Room 341) na Dar es Salaam (Ghala Kuu la Vipuri: Kijitonyama, Ali Hassan Mwinyi Rd).\n\nTunasafiri haraka mikoa yote ya Tanzania (Mwanza, Dodoma, Kilimanjaro, Mbeya, Tanga, nk.). Muda wetu wa dharura ni chini ya masaa 4 kwa Dar es Salaam na Arusha.';
        quickActions = [
          { label: '📍 Ghala la Spare Parts & Vituo', actionId: 'spares_info' },
          { label: '💬 Wasiliana na Hub ya Karibu WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('tmda') ||
        lower.includes('nest') ||
        lower.includes('brela') ||
        lower.includes('cheti') ||
        lower.includes('certificate') ||
        lower.includes('usajili') ||
        lower.includes('iso') ||
        lower.includes('standards') ||
        lower.includes('legal') ||
        lower.includes('leseni') ||
        lower.includes('tra')
      ) {
        replyText =
          'CoreMed Tech imesajiliwa BRELA (Cert #482910), inatambulika rasmi na TMDA kwa uuzaji, usambazaji na matengenezo ya vifaa vya tiba, na tuna Vendor Code rasmi kwenye mfumo wa kitaifa wa NeST kwa zabuni za serikali na hospitali za umma.';
        quickActions = [
          { label: '📄 Angalia Nyaraka za NeST & TMDA Kwenye Portal', actionId: 'open_dispatch_form' },
          { label: '💬 Ongea na Afisa Uzingatiaji WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('oxygen') ||
        lower.includes('gesi') ||
        lower.includes('hewa') ||
        lower.includes('mgps') ||
        lower.includes('psa') ||
        lower.includes('manifold') ||
        lower.includes('cylinder') ||
        lower.includes('mitungi') ||
        lower.includes('oksijeni')
      ) {
        replyText =
          'Tunasanifu, kufunga na kukarabati mifumo kamili ya Medical Gas Pipeline Systems (MGPS) na mitambo ya PSA Oxygen Generating Plants (93% ± 3%) inayozalisha oksijeni hospitalini na kujaza mitungi ya dharura masaa 24.';
        quickActions = [
          { label: 'Omba Ukaguzi wa MGPS / Oksijeni', actionId: 'open_dispatch_form' },
          { label: 'Ongea na Mhandisi wa MGPS WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('ultrasound') ||
        lower.includes('radiology') ||
        lower.includes('x-ray') ||
        lower.includes('xray') ||
        lower.includes('mri') ||
        lower.includes('ct scan') ||
        lower.includes('sonar') ||
        lower.includes('imaging') ||
        lower.includes('doppler')
      ) {
        replyText =
          'Tunasambaza na kufanya matengenezo ya Mindray Resona Ultrasounds, Siemens Magnetom MRI, digital DR flat panels, na mashine za X-Ray. Kila mfumo unajumuisha mafunzo ya watumiaji na calibration ya usalama wa mionzi na umeme.';
        quickActions = [
          { label: 'Katalogi ya Diagnostic Imaging', actionId: 'open_dispatch_form' },
          { label: 'Ongea na Mtaalamu wa Imaging WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('theatre') ||
        lower.includes('anesthesia') ||
        lower.includes('upasuaji') ||
        lower.includes('surgical') ||
        lower.includes('ot') ||
        lower.includes('ventila') ||
        lower.includes('diathermy') ||
        lower.includes('usingizi')
      ) {
        replyText =
          'Tunaweka na kukarabati meza za kisasa za upasuaji (electro-hydraulic OT tables), taa za upasuaji za LED zisizo na vivuli, mashine za usingizi (anesthesia workstations), na mashine za kupumulia (ICU ventilators).';
        quickActions = [
          { label: 'Vifaa vya Operating Theatre', actionId: 'open_dispatch_form' },
          { label: 'Ongea na Mhandisi wa Upasuaji WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('autoclave') ||
        lower.includes('sterilization') ||
        lower.includes('cssd') ||
        lower.includes('steam') ||
        lower.includes('kuchemsha') ||
        lower.includes('sterilizer')
      ) {
        replyText =
          'Tuna vifaa na huduma za autoclaves za mvuke za presha (Pulse Vacuum Steam Autoclaves 100L - 1500L), pamoja na kubadilisha gaskets za milango, hita, na kutoa vipimo vya Bowie-Dick kwa viwango vya EN 285.';
        quickActions = [
          { label: 'Huduma za Autoclave & CSSD', actionId: 'open_dispatch_form' },
          { label: 'Ongea na Mhandisi wa CSSD WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('calibration') ||
        lower.includes('kupima') ||
        lower.includes('fluke') ||
        lower.includes('iec 62353') ||
        lower.includes('iec 60601') ||
        lower.includes('leakage') ||
        lower.includes('uhakiki') ||
        lower.includes('vipimo')
      ) {
        replyText =
          'Wahandisi wetu hutumia Fluke Biomedical Analyzers kupima usalama wa umeme (electrical leakage current), nguvu ya defibrillators, na mtiririko wa gesi, kisha kutoa vyeti vya ISO/IEC 17025 vinavyotambulika na TMDA.';
        quickActions = [
          { label: 'Omba Calibration ya Vifaa', actionId: 'open_dispatch_form' },
          { label: 'Timu ya Calibration WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else if (
        lower.includes('haribika') ||
        lower.includes('breakdown') ||
        lower.includes('emergency') ||
        lower.includes('dharura') ||
        lower.includes('repair') ||
        lower.includes('fault') ||
        lower.includes('tengeneza') ||
        lower.includes('tatizo') ||
        lower.includes('kuzimika')
      ) {
        replyText =
          'Tafadhali toa jina la hospitali, idara na aina ya mashine. Timu yetu ya dharura ipo tayari masaa 24 kufika hospitalini ndani ya masaa 4 kwa Dar es Salaam na Arusha.';
        quickActions = [
          { label: '🚨 Fungua Fomu ya Dispatch ya Dharura', actionId: 'open_dispatch_form' },
          { label: '📞 Piga Simu ya Dharura: +255 742 296 631', actionId: 'call_hotline' }
        ];
      } else if (
        lower.includes('habari') ||
        lower.includes('mambo') ||
        lower.includes('hello') ||
        lower.includes('hi') ||
        lower.includes('salama') ||
        lower.includes('asalaam') ||
        lower.includes('good morning') ||
        lower.includes('good afternoon')
      ) {
        replyText =
          'Habari! Karibu sana CoreMed Tech (Biomedical Solutions). Tunatoa huduma za ufungaji, ukarabati, vipuri na calibration ya vifaa vya hospitali Tanzania nzima. Je, una swali gani au unahitaji msaada gani leo?';
        quickActions = [
          { label: '🚨 Ripoti Mashine Iliyoharibika', actionId: 'report_fault' },
          { label: '⚙️ Omba Calibration / Maintenance SLA', actionId: 'request_sla' },
          { label: '💬 Wasiliana Moja kwa Moja WhatsApp', actionId: 'whatsapp_direct' }
        ];
      } else {
        // AI DOES NOT KNOW THE ANSWER TO THIS QUESTION!
        // DIRECT THAT QUESTION TO WHATSAPP NUMBER (+255 742 296 631) WITH PRE-FILLED QUESTION!
        isUnknown = true;
        replyText = `Samahani, sina jibu la moja kwa moja la kiufundi kwa swali hili kwa sasa.\n\nSwali lako: "${userText}" limeelekezwa moja kwa moja kwa Mhandisi Mkuu wa Biomedical wa zamu kupitia WhatsApp (+255 742 296 631) ili akupatie majibu rasmi na ushauri wa kitaalamu mara moja.\n\n(I don't have the exact technical answer for this question yet. Your question has been forwarded directly to our Senior Biomedical Engineer on WhatsApp at +255 742 296 631).`;
        quickActions = [
          {
            label: '💬 Tuma Swali Hili Moja kwa Moja WhatsApp (+255 742 296 631)',
            actionId: `forward_whatsapp:${encodeURIComponent(userText)}`,
            isPrimaryWhatsApp: true
          },
          {
            label: '📞 Piga Simu ya Mhandisi: +255 742 296 631',
            actionId: 'call_hotline'
          }
        ];
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: 'Just now',
        isForwardedToWhatsApp: isUnknown,
        forwardedQuery: isUnknown ? userText : undefined,
        quickActions
      };
      setMessages((prev) => [...prev, botReply]);
    }, 700);
  };

  return (
    <>
      {/* Fullscreen AI Assistant Modal */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden transition-all duration-300 animate-in fade-in ${
            isFullscreen
              ? 'w-full h-full h-[100dvh]'
              : 'sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[480px] sm:h-[680px] sm:max-h-[88vh] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="CoreMed AI Assistant Fullscreen"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F4C81] via-[#0D416F] to-[#0A3357] text-white px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-md shrink-0 border-b border-white/10">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              {/* Brand logo container with crisp high-contrast backdrop */}
              <div className="bg-white/95 rounded-xl px-2.5 py-1.5 shadow-xs shrink-0 flex items-center justify-center">
                <BrandLogo size="sm" theme="light" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-base font-bold font-display text-white tracking-tight truncate flex items-center gap-1.5">
                    <span>CoreMed AI Assistant</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                  </h2>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-200 truncate">
                  24/7 Biomedical Support · Tanzania National Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* WhatsApp Hotline quick link */}
              <a
                href="https://wa.me/255742296631?text=Habari%20CoreMed%20Tech,%20nahitaji%20msaada%20wa%20biomedical%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                title="Direct WhatsApp Hotline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+255 742 296 631</span>
              </a>

              {/* Desktop Fullscreen / Window Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:inline-flex p-2 rounded-lg hover:bg-white/15 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Switch to compact window' : 'Expand to full screen'}
                aria-label={isFullscreen ? 'Switch to compact window' : 'Expand to full screen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer flex items-center gap-1"
                aria-label="Close assistant"
                title="Close Assistant (Esc)"
              >
                <span className="text-xs font-semibold hidden sm:inline">Close</span>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto bg-slate-50/70 text-xs sm:text-sm">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Emergency Banner */}
              <div className="p-3 bg-red-50/90 border border-red-200/90 rounded-xl flex items-center justify-between text-xs text-red-950 shadow-2xs">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="leading-snug">
                    <strong>Hitilafu ya Dharura?</strong> Wahandisi wa CoreMed wapo tayari masaa 24 Dar & Arusha.
                  </span>
                </div>
                <button
                  onClick={onOpenMaintenanceModal}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] whitespace-nowrap ml-2 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  Dispatch SLA
                </button>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A3357] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-0.5">
                      CM
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-2xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0F4C81] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>

                    {/* Dedicated WhatsApp Direct Referral Card when AI doesn't know */}
                    {msg.isForwardedToWhatsApp && (
                      <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl space-y-2.5 my-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
                            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                              Swali Limeelekezwa WhatsApp
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            +255 742 296 631
                          </span>
                        </div>

                        <p className="text-xs text-emerald-900 leading-snug">
                          Swali lako limeandaliwa kutumwa moja kwa moja kwa <strong>Mhandisi Mkuu wa Biomedical</strong> kupitia WhatsApp ili upate jibu mara moja:
                        </p>

                        {msg.forwardedQuery && (
                          <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 font-medium italic">
                            "{msg.forwardedQuery}"
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleQuickAction(`forward_whatsapp:${encodeURIComponent(msg.forwardedQuery || '')}`)}
                          className="w-full py-2.5 px-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-white" />
                          <span>Fungua WhatsApp na Tuma Swali Hili Sasa</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="pt-1.5 flex flex-col gap-1.5">
                        {msg.quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(qa.actionId)}
                            className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between group ${
                              qa.isPrimaryWhatsApp
                                ? 'bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 active:scale-99 border border-slate-200 text-[#0F4C81] hover:text-[#0A3357]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {qa.isPrimaryWhatsApp && <Phone className="w-4 h-4 text-white shrink-0" />}
                              <span>{qa.label}</span>
                            </span>
                            <ExternalLink
                              className={`w-3.5 h-3.5 shrink-0 ${
                                qa.isPrimaryWhatsApp
                                  ? 'text-white'
                                  : 'opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <span
                      className={`block text-[10px] ${
                        msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center text-xs font-bold">
                    CM
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Bar Controls Container */}
          <div className="shrink-0 bg-white border-t border-slate-200 shadow-lg">
            <div className="max-w-3xl mx-auto w-full">
              {/* Quick Action Chips Strip */}
              <div className="px-3 sm:px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Quick Actions:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAction('report_fault')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  🚨 Ripoti Mashine
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('request_sla')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0F4C81] font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  ⚙️ Calibration / SLA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('whatsapp_direct')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  💬 WhatsApp Direct
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('spares_info')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  📍 Ghala la Vipuri
                </button>
              </div>

              {/* Direct WhatsApp Helper Strip */}
              <div className="px-3 sm:px-4 py-1.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-900 font-medium">Unahitaji kuongea na mhandisi kwa WhatsApp?</span>
                <a
                  href="https://wa.me/255742296631?text=Habari%20CoreMed%20Tech,%20nahitaji%20msaada%20wa%20biomedical%20equipment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>+255 742 296 631</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Input Form with Mobile Safe Area Support */}
              <form onSubmit={handleSend} className="p-2.5 sm:p-3.5 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Andika swali lako au tatizo la mashine (mfano: ultrasound, MRI, anesthesia)..."
                  className="flex-1 text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-100/90 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#0F4C81] hover:bg-[#0A3357] disabled:opacity-40 text-white font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                  aria-label="Send message"
                >
                  <span className="hidden sm:inline text-xs">Tuma</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons Lockup - Only visible when Assistant is CLOSED */}
      {!isOpen && (
        <aside aria-label="Support and Quick Contact" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5">
          {/* WhatsApp Quick Direct Button */}
          <a
            href="https://wa.me/255742296631?text=Hello%20CoreMed%20Tech,%20I%20am%20contacting%20you%20from%20the%20website%20regarding%20biomedical%20solutions."
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group"
            title="Direct WhatsApp: +255 742 296 631"
            aria-label="Chat directly on WhatsApp"
          >
            <Phone className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          </a>

          {/* AI Assistant Chat Bubble Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="h-12 px-4 rounded-full bg-[#0F4C81] hover:bg-[#0A3357] active:scale-95 text-white flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer"
            aria-label="Open CoreMed AI Assistant in Fullscreen"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F4C81]"></span>
            </div>
            <span className="text-xs font-bold tracking-tight pr-1 hidden sm:inline">
              Msaada wa Haraka / AI
            </span>
          </button>
        </aside>
      )}
    </>
  );
};
