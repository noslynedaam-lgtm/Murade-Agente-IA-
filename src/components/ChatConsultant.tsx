import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  FileText,
  AlertCircle,
  HelpCircle,
  Building2,
  Users,
  Calculator,
  ArrowRight,
  Filter,
  CheckCircle2,
  Compass,
  BookmarkCheck,
  ExternalLink,
  Globe,
  ShieldAlert,
  Mic,
  MicOff,
  Radio,
  Square,
  Phone,
  PhoneOff,
  Headphones,
  Loader2,
  Activity,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { KNOWLEDGE_BASE_DOCS, KnowledgeDoc, OFFICIAL_SOURCES } from '../data/knowledgeDocs.ts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'fiscal' | 'dp' | 'contabil' | 'all';
  referencedDocs?: { id: string; title: string; filePath: string }[];
}

interface ChatConsultantProps {
  onOpenDoc: (docId: string) => void;
  onOpenSimulators: () => void;
  initialQuery?: string;
}

interface PromptItem {
  categoryKey: 'fiscal' | 'dp' | 'contabil' | 'all';
  categoryLabel: string;
  icon: any;
  title: string;
  query: string;
  lawRef: string;
}

const ALL_PROMPTS: PromptItem[] = [
  // Fiscal
  {
    categoryKey: 'fiscal',
    categoryLabel: 'Fiscal',
    icon: Calculator,
    title: 'Fator R no Simples Nacional',
    query: 'Como calcular o Fator R para saber se minha empresa de serviços enquadra no Anexo III ou Anexo V da LC 123/2006?',
    lawRef: 'LC 123/2006 Art. 18',
  },
  {
    categoryKey: 'fiscal',
    categoryLabel: 'Fiscal',
    icon: Building2,
    title: 'DIFAL no ICMS para E-commerce',
    query: 'Qual é a regra do DIFAL para vendas de e-commerce a consumidor final não contribuinte após a LC 190/2022?',
    lawRef: 'LC 190/2022 e EC 87/2015',
  },
  {
    categoryKey: 'fiscal',
    categoryLabel: 'Fiscal',
    icon: Sparkles,
    title: 'Reforma Tributária e Transição',
    query: 'Explique a transição do IBS e da CBS a partir de 2026 e o funcionamento do mecanismo de Split Payment.',
    lawRef: 'EC 132/2023',
  },
  {
    categoryKey: 'fiscal',
    categoryLabel: 'Fiscal',
    icon: Calculator,
    title: 'Lucro Presumido: Adicional e PIS/COFINS',
    query: 'Como calcular o adicional de 10% do IRPJ e as retenções de PIS, COFINS e CSLL (CSRF 4,65%) no Lucro Presumido?',
    lawRef: 'Lei 9.718/98 e RIR/2018',
  },

  // DP & Trabalhista
  {
    categoryKey: 'dp',
    categoryLabel: 'DP & Trabalhista',
    icon: Users,
    title: 'Prazos Críticos do eSocial',
    query: 'Quais são os prazos oficiais do eSocial para envio da admissão (S-2200), demissão (S-2299) e fechamento da folha (S-1299)?',
    lawRef: 'MOS e Portaria Conjunta MTE',
  },
  {
    categoryKey: 'dp',
    categoryLabel: 'DP & Trabalhista',
    icon: AlertCircle,
    title: 'FGTS Digital e Recolhimento Pix',
    query: 'Como funciona o recolhimento do FGTS Digital via Pix, qual o novo vencimento no dia 20 e a multa de 40%?',
    lawRef: 'Lei 14.438/2022',
  },
  {
    categoryKey: 'dp',
    categoryLabel: 'DP & Trabalhista',
    icon: Calculator,
    title: 'Aviso Prévio Proporcional (Lei 12.506/11)',
    query: 'Como funciona a contagem de 30 dias mais 3 dias por ano completo de serviço na rescisão sem justa causa?',
    lawRef: 'Lei nº 12.506/2011',
  },
  {
    categoryKey: 'dp',
    categoryLabel: 'DP & Trabalhista',
    icon: Users,
    title: 'Convenções Coletivas e Art. 611-A',
    query: 'O que prevalece no negociado sobre o legislado conforme o Art. 611-A da CLT e quais direitos são indisponíveis (Art. 611-B)?',
    lawRef: 'Art. 611-A e 611-B CLT',
  },

  // Contábil
  {
    categoryKey: 'contabil',
    categoryLabel: 'Contábil',
    icon: FileText,
    title: 'Plano de Contas e Partidas Dobradas',
    query: 'Como organizar a estrutura padrão dos 5 grupos do Plano de Contas e fazer o de-para para o Plano Referencial da RFB?',
    lawRef: 'NBC TG 1000 / Lei 6.404/76',
  },
  {
    categoryKey: 'contabil',
    categoryLabel: 'Contábil',
    icon: FileText,
    title: 'Obrigatoriedade e Prazos ECD / ECF',
    query: 'Quais empresas estão obrigadas à entrega da ECD (SPED Contábil) e da ECF e quais os prazos limites anuais?',
    lawRef: 'IN RFB nº 2.003 e 2.004',
  },
  {
    categoryKey: 'contabil',
    categoryLabel: 'Contábil',
    icon: BookmarkCheck,
    title: 'Formalidades do Livro Diário e Razão',
    query: 'Quais são as formalidades extrínsecas obrigatórias do Livro Diário e os prazos prescricionais de guarda de documentos?',
    lawRef: 'Código Civil Art. 1.179',
  },
  {
    categoryKey: 'contabil',
    categoryLabel: 'Contábil',
    icon: Calculator,
    title: 'Princípio da Competência e Provisões',
    query: 'Como efetuar os lançamentos contábeis de provisão de folha, férias e 13º salário pelo regime de competência?',
    lawRef: 'CPC 00 (R2) Estrutura Conceitual',
  },
];

const SPECIALTY_CONFIG = {
  all: {
    title: 'Geral / Todos os Módulos',
    badge: 'Visão Integrada',
    desc: 'Atuação multidisciplinar abrangendo Fiscal, Departamento Pessoal Trabalhista e Contabilidade societária brasileira.',
    relatedDocIds: ['simples-nacional', 'clt-principios', 'plano-de-contas', 'reforma-tributaria'],
    placeholder: 'Digite sua consulta técnica sobre Simples Nacional, CLT, Contabilidade, eSocial ou Tributos...',
  },
  fiscal: {
    title: 'Especialidade Fiscal & Tributária',
    badge: 'Regimes & Impostos',
    desc: 'Foco exclusivo em Simples Nacional, Anexos I a V, Fator R, Lucro Presumido, ICMS (DIFAL e ST) e Reforma Tributária (IBS/CBS).',
    relatedDocIds: ['simples-nacional', 'lucro-presumido', 'icms-regras', 'reforma-tributaria'],
    placeholder: 'Consulte sobre Simples Nacional, alíquotas efetivas, Fator R, ICMS DIFAL, IRPJ Presumido...',
  },
  dp: {
    title: 'Especialidade Departamento Pessoal & Trabalhista',
    badge: 'Rotinas CLT & eSocial',
    desc: 'Foco exclusivo em CLT, rescisões, horas extras, eSocial (S-1200, S-2200, S-2299), FGTS Digital via Pix e Convenções Coletivas.',
    relatedDocIds: ['clt-principios', 'eSocial-prazos', 'fgts-inss', 'cct-normas'],
    placeholder: 'Consulte sobre rescisão CLT, prazos eSocial, cálculo FGTS Digital, desconto INSS progressivo...',
  },
  contabil: {
    title: 'Especialidade Contábil & SPED',
    badge: 'Escrituração & Normas',
    desc: 'Foco exclusivo em Plano de Contas, partidas dobradas, regime de competência, demonstrações (BP, DRE) e SPED (ECD/ECF).',
    relatedDocIds: ['plano-de-contas', 'livros-obrigacoes', 'ecd-ecf'],
    placeholder: 'Consulte sobre Plano de Contas referencial, conciliação contábil, Livro Diário, prazos ECD/ECF...',
  },
};

export const ChatConsultant: React.FC<ChatConsultantProps> = ({
  onOpenDoc,
  onOpenSimulators,
  initialQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fiscal' | 'dp' | 'contabil'>('all');
  const [filterChatHistory, setFilterChatHistory] = useState(false);
  const [showOfficialSources, setShowOfficialSources] = useState(false);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Voice Interaction States (STT, TTS & Dual-Engine Audio Capture)
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [autoSpeakReply, setAutoSpeakReply] = useState(true);

  // Screen Expansion / Full Reading Area State & Font Controls
  const [isScreenExpanded, setIsScreenExpanded] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>('');
  const hasVoiceInputRef = useRef<boolean>(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      category: 'all',
      content: `Olá! Sou o **Murade Agente IA**, seu consultor técnico especializado em legislação Fiscal, Departamento Pessoal Trabalhista e Contabilidade no Brasil.

📌 **Regra Principal de Rigor — Nunca Inventar Informação:**
Respondo **somente** com as informações registradas nos arquivos da Base de Conhecimento. Se eu não encontrar a resposta nos arquivos, direi com clareza: *"Não tenho essa informação na base de conhecimento. Consulte a fonte oficial abaixo."* Nunca invento, adivinho ou utilizo dados fora dos arquivos homologados.

📌 **Citação Obrigatória de Fontes e Links Oficiais:**
Todas as minhas respostas indicam a fonte do arquivo correspondente (\`📌 Fonte: [arquivo.md]\`) e o link oficial governamental para conferência (\`🔗 Confira também: [link oficial]\`).

Você pode utilizar os botões de **Filtro de Especialidade** acima para focar em uma das áreas:
- **Fiscal:** Simples Nacional, Anexos I a V, Fator R, Lucro Presumido, ICMS DIFAL e Reforma Tributária.
- **DP & Trabalhista:** CLT, eSocial (prazos e eventos), FGTS Digital via Pix e Convenções Coletivas.
- **Contábil:** Plano de Contas, Livro Diário, Balanço Patrimonial, DRE e SPED (ECD/ECF).

🎙️ **Como perguntar:** Você tem a opção de **digitar** sua dúvida no campo abaixo ou clicar no botão **Falar (Microfone)** como em uma ligação. Você pode falar à vontade: quando parar de falar, eu respondo automaticamente para você em voz alta!

Como posso orientar sua demanda hoje?

⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConfig = SPECIALTY_CONFIG[selectedCategory];

  // Filter prompts dynamically based on selected category
  const visiblePrompts = useMemo(() => {
    if (selectedCategory === 'all') {
      return ALL_PROMPTS;
    }
    return ALL_PROMPTS.filter((p) => p.categoryKey === selectedCategory);
  }, [selectedCategory]);

  // Filter linked documents based on selected category
  const linkedDocs = useMemo(() => {
    return KNOWLEDGE_BASE_DOCS.filter((d) => activeConfig.relatedDocIds.includes(d.id));
  }, [activeConfig]);

  // Messages filtered by category if option enabled
  const displayedMessages = useMemo(() => {
    if (!filterChatHistory || selectedCategory === 'all') {
      return messages;
    }
    return messages.filter((m) => m.id === 'welcome' || m.category === selectedCategory);
  }, [messages, filterChatHistory, selectedCategory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  // Helper to cleanly stop any playing audio (both HTML5 Audio and SpeechSynthesis)
  const stopAudioPlayback = () => {
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      audioElementRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  // Keyboard shortcut: Escape restores normal size if expanded
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isScreenExpanded) {
        setIsScreenExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScreenExpanded]);

  // Stop speech synthesis, audio recording, and recognition on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Pure Studio Human Voice Player (Gemini Studio AI Human Voice — 100% human voice for everything)
  const handleSpeak = async (id: string, text: string) => {
    if (speakingId === id) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setSpeakingId(id);

    const naturalText = cleanTextForHumanSpeech(text);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: naturalText.slice(0, 1000),
          voice: 'Kore', // Exclusively the genuine human voice!
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audioObj = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          audioElementRef.current = audioObj;
          audioObj.onended = () => {
            setSpeakingId(null);
            audioElementRef.current = null;
          };
          audioObj.onerror = () => {
            setSpeakingId(null);
            audioElementRef.current = null;
          };
          await audioObj.play();
          return;
        }
      }
    } catch (err) {
      console.error('TTS error:', err);
      setSpeakingId(null);
    }
  };

  // Test Human Voice button
  const handleTestVoice = () => {
    const testMsg = 'Olá! Esta é a voz humana oficial do Murade Agente IA para todas as respostas e pareceres.';
    handleSpeak('test-voice', testMsg);
  };

  const handleSend = async (textToSend?: string, shouldSpeak = false) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    // Stop speaking previous response when asking a new question
    stopAudioPlayback();

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      category: selectedCategory,
      content: queryText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: historyPayload,
          category: selectedCategory,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsgId = 'assistant-' + Date.now();
        const assistantMsg: Message = {
          id: assistantMsgId,
          role: 'assistant',
          category: selectedCategory,
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          referencedDocs: data.referencedDocs,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Auto speak if requested by voice conversation or if autoSpeak is active
        if (shouldSpeak || autoSpeakReply) {
          setTimeout(() => {
            handleSpeak(assistantMsgId, data.reply);
          }, 200);
        }
      } else {
        throw new Error(data.error || 'Erro ao processar consulta');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: 'assistant-error-' + Date.now(),
        role: 'assistant',
        category: selectedCategory,
        content: `Ocorreu uma instabilidade na consulta ao motor do agente. Por favor, tente novamente ou consulte diretamente os manuais na aba **Base de Conhecimento** ou os portais oficiais.

⚠️ "Esta informação é uma orientação com base na legislação vigente. Sempre confirme com um contador ou advogado habilitado. Esta ferramenta não substitui orientação profissional."`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop and release audio hardware
  const stopAudioHardware = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setAudioLevel(0);
  };

  // Stop listening and immediately send what was transcribed or recorded
  const stopListeningAndSend = async () => {
    const currentTyped = (latestTranscriptRef.current || input).trim();
    const recorder = mediaRecorderRef.current;
    const hadVoice = hasVoiceInputRef.current;

    stopAudioHardware();

    // 1. If text was already recognized by client Web Speech API:
    if (currentTyped.length > 2) {
      setVoiceNotice('Enviando sua pergunta gravada...');
      setTimeout(() => setVoiceNotice(null), 2500);
      handleSend(currentTyped, true);
      return;
    }

    // 2. Otherwise, use server-side Gemini transcription from recorded audio:
    if (recorder && recorder.state !== 'inactive') {
      setIsTranscribing(true);
      setVoiceNotice('Transcrevendo sua fala com IA...');

      const mimeType = recorder.mimeType || 'audio/webm';

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        try {
          recorder.stop();
        } catch (e) {
          resolve();
        }
      });

      const chunks = audioChunksRef.current;
      if (chunks.length > 0) {
        try {
          const blob = new Blob(chunks, { type: mimeType });
          const base64Audio = await blobToBase64(blob);

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio, mimeType }),
          });

          const data = await res.json();
          setIsTranscribing(false);

          if (data.success && data.transcript && data.transcript.trim().length > 1) {
            const transcribedQuery = data.transcript.trim();
            setInput(transcribedQuery);
            setVoiceNotice('Pergunta reconhecida com sucesso!');
            setTimeout(() => setVoiceNotice(null), 2000);
            handleSend(transcribedQuery, true);
            return;
          }
        } catch (transcribeErr) {
          console.error('Transcription error:', transcribeErr);
        }
      }
      setIsTranscribing(false);
    }

    if (hadVoice) {
      setVoiceNotice('Áudio recebido, mas não foi possível distinguir o texto. Tente falar um pouco mais alto ou selecione uma das perguntas sugeridas.');
    } else {
      setVoiceNotice('Nenhuma fala detectada. Fale no microfone ou clique em uma das perguntas sugeridas.');
    }
    setTimeout(() => setVoiceNotice(null), 4000);
  };

  // Cancel listening without sending
  const cancelListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    stopAudioHardware();
    latestTranscriptRef.current = '';
    audioChunksRef.current = [];
    setInput('');
    setVoiceNotice('Gravação cancelada.');
    setTimeout(() => setVoiceNotice(null), 2000);
  };

  // Start speech recognition & microphone capture
  const startListening = async () => {
    // Stop any ongoing speech playback
    stopAudioPlayback();

    // Auto-expand middle screen so the voice consultation and answer have full room to read
    setIsScreenExpanded(true);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    stopAudioHardware();

    latestTranscriptRef.current = '';
    audioChunksRef.current = [];
    hasVoiceInputRef.current = false;
    setVoiceNotice(null);

    // 1. Request microphone via getUserMedia
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;
      }
    } catch (mediaErr: any) {
      console.warn('getUserMedia error:', mediaErr);
      if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
        setVoiceNotice('Permissão do microfone negada. Clique no ícone de cadeado na barra de endereços para permitir o acesso ao microfone.');
        setTimeout(() => setVoiceNotice(null), 6000);
        return;
      }
    }

    setIsListening(true);
    setVoiceNotice('🎙️ Ouvindo... Pode falar. Ao parar de falar, o agente responderá automaticamente.');

    // 2. Setup Audio Visualizer (Live VU Meter)
    if (stream) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateMeter = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const level = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(level);

            if (level > 8) {
              hasVoiceInputRef.current = true;
            }

            animFrameRef.current = requestAnimationFrame(updateMeter);
          };
          updateMeter();
        }
      } catch (audioCtxErr) {
        console.warn('AudioContext setup error:', audioCtxErr);
      }

      // 3. Setup MediaRecorder for universal recording
      try {
        let mimeType = 'audio/webm;codecs=opus';
        if (typeof MediaRecorder !== 'undefined') {
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            if (MediaRecorder.isTypeSupported('audio/webm')) {
              mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
              mimeType = 'audio/mp4';
            } else {
              mimeType = '';
            }
          }
          const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
          audioChunksRef.current = [];
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start(250);
          mediaRecorderRef.current = recorder;
        }
      } catch (recErr) {
        console.warn('MediaRecorder setup error:', recErr);
      }
    }

    // 4. Concurrently, try Web Speech API for immediate live speech recognition
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; ++i) {
            fullText += event.results[i][0].transcript + ' ';
          }
          const cleanText = fullText.trim();
          if (cleanText) {
            hasVoiceInputRef.current = true;
            latestTranscriptRef.current = cleanText;
            setInput(cleanText);

            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
            silenceTimerRef.current = setTimeout(() => {
              stopListeningAndSend();
            }, 1800);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition notice (MediaRecorder active):', event.error);
        };

        recognition.onend = () => {
          // If ended naturally
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition start failed, relying on MediaRecorder + Gemini:', e);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={`flex flex-col transition-all duration-200 ${
        isScreenExpanded
          ? 'fixed inset-0 z-50 bg-[#eef2f6] p-2 sm:p-4 w-full h-full shadow-2xl overflow-hidden'
          : 'h-[calc(100vh-8.5rem)] max-w-6xl mx-auto w-full px-4 sm:px-6 py-3'
      }`}
    >
      {/* 1. TOP SPECIALTY FILTER BAR */}
      <div className="pb-3 border-b border-slate-200 shrink-0 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="font-bold flex items-center gap-1.5 text-slate-900">
              <Filter className="w-3.5 h-3.5 text-blue-700" />
              Filtro de Especialidade:
            </span>
            <div className="flex items-center gap-1 bg-slate-200/90 p-1 rounded-lg border border-slate-300 shadow-2xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0f2444] text-white shadow-xs ring-1 ring-blue-500 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {selectedCategory === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                Geral / Todos
              </button>
              <button
                onClick={() => setSelectedCategory('fiscal')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'fiscal'
                    ? 'bg-[#0f2444] text-white shadow-xs ring-1 ring-blue-500 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {selectedCategory === 'fiscal' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                Fiscal
              </button>
              <button
                onClick={() => setSelectedCategory('dp')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'dp'
                    ? 'bg-[#0f2444] text-white shadow-xs ring-1 ring-blue-500 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {selectedCategory === 'dp' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                DP & Trabalhista
              </button>
              <button
                onClick={() => setSelectedCategory('contabil')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'contabil'
                    ? 'bg-[#0f2444] text-white shadow-xs ring-1 ring-blue-500 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {selectedCategory === 'contabil' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                Contábil
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Screen Expansion Toggle in Top Bar */}
            <button
              onClick={() => setIsScreenExpanded(!isScreenExpanded)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer border ${
                isScreenExpanded
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
                  : 'bg-[#0f2444] hover:bg-blue-900 text-white border-blue-900'
              }`}
              title={isScreenExpanded ? "Restaurar tamanho normal" : "Clique aqui para a tela do meio crescer e abrir em tamanho grande"}
            >
              {isScreenExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Restaurar / Reduzir (Esc)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>⤢ Fazer a Tela Crescer</span>
                </>
              )}
            </button>

            {!isScreenExpanded && (
              <>
                <button
                  onClick={() => setShowOfficialSources(!showOfficialSources)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    showOfficialSources
                      ? 'bg-[#102a4e] text-white border-[#102a4e] shadow-xs'
                      : 'text-slate-800 bg-white hover:bg-slate-100 border-slate-300 shadow-2xs'
                  }`}
                  title="Consultar links e portais oficiais da legislação"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fontes Oficiais ({OFFICIAL_SOURCES.length})</span>
                </button>

                <button
                  onClick={onOpenSimulators}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Simuladores</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2. ACTIVE SPECIALTY BANNER */}
        {!isScreenExpanded ? (
          <div className="p-2.5 bg-[#f8fafc] border border-blue-200/80 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-bold text-xs text-blue-950 uppercase tracking-tight">
                  {activeConfig.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                  {activeConfig.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {activeConfig.desc}
              </p>
            </div>

            {/* Linked Document Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-600" />
                Manuais:
              </span>
              {linkedDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onOpenDoc(doc.id)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-950 border border-slate-200 transition-colors cursor-pointer"
                  title={`Abrir manual completo: ${doc.title}`}
                >
                  {doc.filePath.split('/').pop()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-3 py-1 bg-blue-50/80 border border-blue-200/90 rounded-lg flex items-center justify-between text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="font-bold">{activeConfig.title}</span>
              <span className="text-[11px] text-blue-800 hidden sm:inline">— Tela Ampliada para Leitura Completa dos Pareceres</span>
            </div>
            <button
              onClick={() => setIsScreenExpanded(false)}
              className="text-[11px] text-slate-600 hover:text-blue-900 font-semibold cursor-pointer underline"
            >
              Voltar ao tamanho normal
            </button>
          </div>
        )}

        {/* 2.1 OFFICIAL SOURCES EXPANDABLE REFERENCE PANEL */}
        {showOfficialSources && (
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
              <div className="flex items-center gap-2 text-blue-950 font-bold">
                <Globe className="w-4 h-4 text-blue-700" />
                <span>📌 Fontes Oficiais Homologadas para Consulta:</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Governo Federal & Órgãos de Classe</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {OFFICIAL_SOURCES.map((source, sIdx) => (
                <a
                  key={sIdx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white hover:bg-blue-100/50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-900 text-xs truncate">
                      {source.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {source.desc}
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 truncate mt-1.5 pt-1 border-t border-slate-100">
                    {source.url.replace(/^https?:\/\//, '')}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. MIDDLE SCREEN EXPANSION BANNER & TOGGLE */}
      <div
        onClick={() => setIsScreenExpanded(!isScreenExpanded)}
        className={`py-2 px-3.5 rounded-xl my-1.5 flex items-center justify-between text-xs cursor-pointer transition-all shadow-sm group ${
          isScreenExpanded
            ? 'bg-gradient-to-r from-[#0f2444] via-blue-950 to-slate-900 text-white border border-blue-400/40'
            : 'bg-gradient-to-r from-blue-50 via-white to-blue-50/80 hover:bg-blue-100/70 border-2 border-blue-300 text-blue-950 hover:border-blue-500 ring-2 ring-blue-100'
        }`}
        title={isScreenExpanded ? "Clique para reduzir ou restaurar o tamanho normal" : "Clique aqui para esta tela do meio crescer e abrir em tamanho grande"}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isScreenExpanded ? 'bg-emerald-400 animate-pulse' : 'bg-blue-600 animate-ping'}`}></span>
          <span className="font-extrabold text-xs sm:text-sm tracking-tight">
            {isScreenExpanded
              ? '⛶ Tela do Meio Expandida (Modo Leitura Completa dos Pareceres)'
              : '📜 Tela do Meio — Clique para a tela crescer e ver o resultado completo ⤢'}
          </span>
          <span className={`text-[11px] hidden sm:inline ${isScreenExpanded ? 'text-blue-200' : 'text-slate-600'}`}>
            {isScreenExpanded
              ? '· Área ampla com espaço total para rolar e ler tudo com conforto'
              : '· (Dica: Clique nesta faixa ou em qualquer lugar da tela para ela crescer e abrir)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isScreenExpanded && (
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg text-xs" onClick={(e) => e.stopPropagation()}>
              <span className="text-slate-300 font-medium text-[11px]">Tamanho do Texto:</span>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal')}
                className="font-bold text-white hover:text-blue-300 px-1 cursor-pointer"
                title="Alternar tamanho da letra para leitura"
              >
                {fontSize === 'normal' ? 'A (Padrão)' : fontSize === 'large' ? 'A+ (Grande)' : 'A++ (Máxima)'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsScreenExpanded(!isScreenExpanded);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
              isScreenExpanded
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                : 'bg-[#0f2444] hover:bg-blue-900 text-white group-hover:scale-102 ring-1 ring-blue-400'
            }`}
          >
            {isScreenExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Restaurar Tamanho (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-300" />
                <span>⤢ Clique para a Tela Crescer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3.1 MESSAGES SCROLL AREA (THE MIDDLE SCREEN) */}
      <div
        onClick={(e) => {
          // If clicked and not yet expanded, grow the screen unless clicking an action button or link
          const target = e.target as HTMLElement;
          if (!isScreenExpanded && !target.closest('button') && !target.closest('a') && !target.closest('input')) {
            setIsScreenExpanded(true);
          }
        }}
        className={`flex-1 min-h-0 overflow-y-auto py-3 space-y-4 pr-1 transition-all ${
          !isScreenExpanded
            ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/80 rounded-xl bg-white/40 p-2'
            : 'bg-white/70 rounded-2xl p-3 sm:p-5 border border-blue-200/80 shadow-inner'
        }`}
        title={!isScreenExpanded ? "Clique em qualquer ponto desta tela do meio para ela crescer e abrir em tamanho grande" : ""}
      >
        {displayedMessages.map((msg) => {
          const bodyTextSize =
            fontSize === 'xlarge'
              ? 'text-base sm:text-lg leading-relaxed'
              : fontSize === 'large'
              ? 'text-sm sm:text-base leading-relaxed'
              : 'text-xs sm:text-sm leading-normal';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#0f2444] text-white flex items-center justify-center shrink-0 shadow-xs border border-blue-400/30">
                  <Bot className="w-4 h-4 text-blue-300" />
                </div>
              )}

              <div
                className={`w-full max-w-[90%] sm:max-w-3xl rounded-xl p-4 transition-all ${
                  msg.role === 'user'
                    ? 'bg-[#102a4e] text-white shadow-xs'
                    : 'bg-[#f8fafc] border border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-tight">
                      {msg.role === 'user' ? 'Sua Consulta' : 'Murade Agente IA'}
                    </span>
                    {msg.category && msg.category !== 'all' && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                        msg.role === 'user'
                          ? 'bg-blue-800/80 text-blue-100'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {msg.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] opacity-70 tabular-nums">{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copiar parecer"
                          className="p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          title={speakingId === msg.id ? 'Parar leitura' : 'Ouvir parecer com voz humana'}
                          className="p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Message Body with Markdown formatting & dynamic font size */}
                <div className={`prose max-w-none prose-slate space-y-2 ${bodyTextSize}`}>
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={pIdx} className="font-bold text-slate-900 mt-2 mb-1">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={pIdx} className="font-bold text-slate-900 mt-3 mb-1">
                          {paragraph.replace('## ', '')}
                        </h3>
                      );
                    }

                    if (
                      paragraph.includes('Esta informação é uma orientação') ||
                      paragraph.includes('Esta informação é orientação') ||
                      paragraph.includes('Esta ferramenta não substitui orientação profissional')
                    ) {
                      return (
                        <div
                          key={pIdx}
                          className="mt-3 p-3 bg-amber-50/90 border border-amber-300 rounded-lg text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 shadow-2xs"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span className="font-medium leading-relaxed">
                            {paragraph.replace(/[⚖️⚠️*"]/g, '').trim()}
                          </span>
                        </div>
                      );
                    }

                    if (paragraph.includes('📌 Fonte:') || paragraph.includes('🔗 Confira também:')) {
                      return (
                        <div
                          key={pIdx}
                          className="mt-2.5 p-2.5 bg-blue-50/80 border border-blue-200/90 rounded-lg text-xs sm:text-sm font-medium text-slate-800 space-y-1 shadow-2xs"
                          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(paragraph) }}
                        />
                      );
                    }

                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1">
                          {items.map((it, iIdx) => (
                            <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it.replace(/^[-*]\s*/, '')) }} />
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <p
                        key={pIdx}
                        className="whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(paragraph) }}
                      />
                    );
                  })}
                </div>

                {/* Direct references with official links */}
                {msg.referencedDocs && msg.referencedDocs.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-blue-600" /> Fontes e Portais Oficiais:
                    </span>
                    {msg.referencedDocs.map((doc: any) => (
                      <div key={doc.id} className="inline-flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => onOpenDoc(doc.id)}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-blue-50 text-blue-900 rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                          title={`Ver arquivo na base: ${doc.filePath}`}
                        >
                          <span>📄 {doc.filePath}</span>
                        </button>
                        {doc.officialLink && (
                          <a
                            href={doc.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-white text-blue-800 rounded border border-blue-200 hover:bg-blue-50 transition-colors shadow-2xs"
                            title={`Abrir portal oficial (${doc.officialLink})`}
                          >
                            <ExternalLink className="w-3 h-3 text-blue-600" />
                            <span>🔗 {doc.officialLinkLabel || 'Portal Oficial'}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 text-sm justify-start animate-in fade-in duration-150">
            <div className="w-8 h-8 rounded-full bg-[#0f2444] text-white flex items-center justify-center shrink-0 shadow-xs border border-blue-400/30">
              <Bot className="w-4 h-4 text-blue-300" />
            </div>
            <div className="bg-[#f8fafc] border border-blue-200 rounded-xl p-4 shadow-xs flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  ⚡ Murade Agente IA respondendo com máxima agilidade...
                </span>
                <span className="text-[11px] text-slate-500">
                  Consultando legislação para o modo <strong>{activeConfig.title}</strong> e formulando parecer direto.
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. DYNAMIC SPECIALIZED QUICK PROMPTS (Full grid in normal mode, compact strip in expanded mode) */}
      {!isScreenExpanded ? (
        <div className="py-2 shrink-0 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Consultas Rápidas para: <strong className="text-blue-900">{activeConfig.title}</strong></span>
            </p>
            <span className="text-[11px] text-slate-500 font-mono">
              {visiblePrompts.length} sugestões ativas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {visiblePrompts.slice(0, 4).map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.query)}
                  className="text-left p-2.5 bg-[#f8fafc] border border-slate-200 hover:border-blue-400 rounded-lg shadow-xs hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-blue-900 mb-1">
                      <span className="flex items-center gap-1.5 truncate">
                        <Icon className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-800 shrink-0" />
                        <span className="truncate">{prompt.title}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {prompt.query}
                    </p>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{prompt.lawRef}</span>
                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-1 shrink-0 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-600" /> Sugestões Rápidas:
          </span>
          {visiblePrompts.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt.query)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-lg text-slate-800 hover:text-blue-950 font-medium truncate max-w-[240px] cursor-pointer shadow-2xs shrink-0"
              title={prompt.query}
            >
              {prompt.title}
            </button>
          ))}
        </div>
      )}

      {/* 5. INPUT FORM AREA & VOICE RECOGNITION */}
      <div className="mt-2 pt-2 border-t border-slate-200 shrink-0 space-y-2">
        {/* Voice Notice Feedback if any */}
        {voiceNotice && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Radio className="w-3.5 h-3.5 text-blue-700 animate-spin" />
              {voiceNotice}
            </span>
            <button
              onClick={() => setVoiceNotice(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Active Voice Recording Banner (Phone Call / Microfone Aberto) */}
        {/* Active Transcribing Banner */}
        {isTranscribing && (
          <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl flex items-center justify-between gap-2.5 text-xs text-blue-950 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
              <div>
                <span className="font-bold text-blue-900">🎙️ Transcrevendo sua fala com IA...</span>
                <span className="text-slate-600 ml-1.5 hidden sm:inline">
                  Processando áudio capturado e consultando a base de conhecimento oficial.
                </span>
              </div>
            </div>
            <span className="text-[10px] text-blue-700 font-mono bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
              Gemini Áudio
            </span>
          </div>
        )}

        {/* Live Active Voice Recording Banner (Phone Call / Microfone Aberto) */}
        {isListening && (
          <div className="p-3.5 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-2 border-rose-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-950 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="relative flex h-4 w-4 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 items-center justify-center text-white">
                  <Mic className="w-2.5 h-2.5" />
                </span>
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-rose-900 text-sm">🎙️ Ligação por Voz Ativa</span>
                  <span className="bg-rose-200/80 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Ouvindo
                  </span>
                  {/* VU Meter */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-100 rounded-md border border-rose-200">
                    <Activity className="w-3 h-3 text-rose-600 animate-pulse" />
                    <div className="w-16 bg-rose-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full transition-all duration-75"
                        style={{ width: `${Math.max(10, audioLevel)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-rose-900 font-bold tabular-nums">
                      {audioLevel}%
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 text-xs mt-0.5">
                  Fale sua pergunta à vontade. <strong>Ao parar de falar</strong>, o agente responde automaticamente por voz. Ou clique em <strong>Encerrar & Enviar</strong> para adiantar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={stopListeningAndSend}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                title="Encerrar ligação e enviar pergunta agora"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Encerrar & Enviar</span>
              </button>
              <button
                type="button"
                onClick={cancelListening}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs border border-slate-300 cursor-pointer transition-all"
                title="Cancelar gravação de voz"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Agent Speaking Active Status Banner */}
        {speakingId && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-950 shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-700 animate-pulse shrink-0" />
              <div>
                <span className="font-semibold text-blue-900">
                  Murade Agente IA está respondendo em voz alta para você...
                </span>
                <span className="text-blue-700/80 ml-1.5 text-[11px] hidden sm:inline">
                  (Áudio em português brasileiro)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={stopAudioPlayback}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-semibold text-[11px] cursor-pointer shadow-2xs transition-colors shrink-0"
              title="Parar áudio da resposta"
            >
              <Square className="w-3 h-3 fill-current text-rose-600" />
              <span>Parar Áudio</span>
            </button>
          </div>
        )}

        {/* Form with Text Input, Microphone Button, and Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? '🎙️ Ouvindo sua voz... fale agora...' : activeConfig.placeholder}
              disabled={isLoading || isTranscribing}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
              }`}
            />
          </div>

          {/* Microphone Button (Click to speak, click to stop/send, or just stop speaking) */}
          <button
            type="button"
            onClick={isListening ? stopListeningAndSend : startListening}
            disabled={isLoading || isTranscribing}
            className={`px-4 py-3 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs font-semibold text-xs gap-2 ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400 animate-pulse'
                : 'bg-[#eef2f6] hover:bg-blue-100 text-blue-900 border border-blue-200/90'
            }`}
            title={
              isListening
                ? 'Clique para encerrar a fala e enviar agora (ou apenas pare de falar)'
                : 'Falar com o Agente por microfone (voz como em uma ligação)'
            }
          >
            {isListening ? (
              <>
                <PhoneOff className="w-4 h-4 text-white" />
                <span className="font-bold">Encerrar & Enviar</span>
              </>
            ) : isTranscribing ? (
              <>
                <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
                <span className="font-bold">Transcrevendo...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-blue-700" />
                <span className="font-bold">Falar no Microfone</span>
              </>
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isListening || isTranscribing}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs font-semibold text-xs gap-1.5"
          >
            <span>Consultar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Voice Questions Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Mic className="w-3 h-3 text-blue-600" />
            Sugestões com resposta falada:
          </span>
          {[
            { label: 'Fator R Simples', q: 'Como calcular o Fator R no Simples Nacional para enquadrar no Anexo III ou V?' },
            { label: 'Prazos eSocial', q: 'Quais os prazos do eSocial para admissão S-2200 e demissão S-2299?' },
            { label: 'DIFAL ICMS', q: 'Qual a regra do DIFAL no ICMS para e-commerce após a LC 190/2022?' },
            { label: 'FGTS Digital Pix', q: 'Como funciona o recolhimento do FGTS Digital via Pix e o vencimento no dia 20?' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(item.q);
                handleSend(item.q, true);
              }}
              disabled={isLoading || isListening || isTranscribing}
              className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 border border-slate-200 rounded-md font-medium transition-colors cursor-pointer text-[11px]"
              title={`Perguntar e ouvir: "${item.q}"`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom Options Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1 text-[11px] text-slate-500 px-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Canal ativo: <strong className="text-slate-700">{activeConfig.title}</strong>
            </span>

            {/* Toggle Audio Auto-Play for Assistant Responses */}
            <button
              type="button"
              onClick={() => setAutoSpeakReply(!autoSpeakReply)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-900 cursor-pointer transition-colors"
              title="Ativar ou desativar resposta falada automática do agente"
            >
              {autoSpeakReply ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Áudio da resposta: <strong>Ativado</strong></span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Áudio da resposta: <strong>Mudo</strong></span>
                </>
              )}
            </button>

            {/* Pure Human Voice Indicator & Test (Robotic voice removed completely as requested) */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg text-[11px] font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Headphones className="w-3.5 h-3.5 text-blue-700" />
                  Voz: <strong className="text-emerald-900 font-bold">Voz Humana Natural Oficial</strong> (Única para tudo)
                </span>
              </div>

              <button
                type="button"
                onClick={handleTestVoice}
                className="px-2.5 py-1 bg-[#0f2444] hover:bg-blue-900 text-white font-bold rounded-lg text-[11px] cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                title="Ouvir uma demonstração da voz humana oficial agora"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Ouvir Voz Humana</span>
              </button>
            </div>
          </div>

          <span className="font-mono tabular-nums text-slate-400">
            Validação profissional mandatória
          </span>
        </div>
      </div>
    </div>
  );
};

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200/80 px-1 py-0.5 rounded text-[12px] font-mono text-slate-800">$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline font-semibold hover:text-blue-900 inline-flex items-center gap-0.5">$1</a>')
    .replace(/(^|[^"'>])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline font-semibold hover:text-blue-900 break-all inline-flex items-center gap-0.5">$2</a>');
}

function cleanTextForHumanSpeech(text: string): string {
  return text
    // Replace markdown headers and bullets
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    // Replace bold/italic/code
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Clean URLs - replace with pleasant natural phrasing instead of spelling out raw http
    .replace(/https?:\/\/[^\s)]+/g, 'link oficial governamental')
    // Remove icons/emojis that synthetic readers stumble on
    .replace(/[📌🔗⚠️⚖️🎙️🔍🏛️✅]/g, '')
    // Make source citation sound natural and conversational
    .replace(/Fonte:\s*([^\n]+)/gi, 'Fonte consultada: $1.')
    .replace(/Confira também:\s*([^\n]+)/gi, 'Consulte também o site oficial.')
    .replace(/"/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

