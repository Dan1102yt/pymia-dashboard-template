import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clientConfig } from '../../config/client.config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// True only when the env var is present at build/runtime time
const IS_CONFIGURED = !!import.meta.env.VITE_WORKER_URL;

function buildSystemPrompt(): string {
  const cfg = clientConfig;
  const activeModules = Object.entries(cfg.modules).filter(([, v]) => v).map(([k]) => k);

  const finData = cfg.mockData.financiero.historico;
  const lastMes = finData[finData.length - 1];
  const totalIngresos = finData.reduce((s, m) => s + m.ingresos, 0);
  const totalEgresos = finData.reduce((s, m) => s + m.egresos, 0);

  const clientesSummary = cfg.mockData.clientes
    .map(c => `- ${c.nombre}${c.empresa ? ` (${c.empresa})` : ''}: $${c.totalCompras.toLocaleString('es-CO')} en compras totales, ${c.ciudad}`)
    .join('\n');

  const ventasSummary = cfg.mockData.ventas
    .map(v => {
      const cl = cfg.mockData.clientes.find(c => c.id === v.clienteId);
      return `- ${v.numero}: ${cl?.nombre ?? 'N/A'} · $${v.total.toLocaleString('es-CO')} · Estado: ${v.estado}`;
    })
    .join('\n');

  const industriaSummary = cfg.industria.entities
    .map(e => {
      const st = cfg.industria.statuses.find(s => s.key === e.statusKey);
      return `- ${e.name}: ${st?.label ?? e.statusKey}${e.responsable ? ` · Responsable: ${e.responsable}` : ''}`;
    })
    .join('\n');

  return `Eres el asistente de inteligencia artificial de "${cfg.clientName}", una empresa colombiana.
Respondes en español colombiano, de forma clara, concisa y profesional.
Tienes acceso a los datos del negocio y puedes analizarlos para dar recomendaciones útiles.
Usa Markdown para formatear tus respuestas cuando sea útil (tablas, listas, negritas).

DATOS ACTUALES DEL NEGOCIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Módulos activos: ${activeModules.join(', ')}

FINANCIERO (últimos 6 meses):
- Total ingresos: $${totalIngresos.toLocaleString('es-CO')}
- Total egresos: $${totalEgresos.toLocaleString('es-CO')}
- Utilidad: $${(totalIngresos - totalEgresos).toLocaleString('es-CO')}
- Margen: ${((totalIngresos - totalEgresos) / totalIngresos * 100).toFixed(1)}%
- Último mes (${lastMes.mes}): Ingresos $${lastMes.ingresos.toLocaleString('es-CO')}, Egresos $${lastMes.egresos.toLocaleString('es-CO')}

CLIENTES:
${clientesSummary}

VENTAS/COTIZACIONES:
${ventasSummary}

${cfg.industria.entityNamePlural.toUpperCase()}:
${industriaSummary}
━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde solo en base a estos datos. Si te preguntan algo fuera del contexto del negocio, puedes responder brevemente pero recuerda que tu rol principal es apoyar la gestión de "${cfg.clientName}".`;
}

// ─── Not-configured banner (rendered as a chat bubble) ───────────────────────

function UnconfiguredNotice() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: 'var(--color-secondary)' }}
      >
        <Bot size={15} />
      </div>
      <div className="max-w-[85%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <Settings size={15} className="text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Asistente en configuración</p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          El asistente de IA está listo, pero aún no hay un proxy configurado para conectarse con Claude.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-600 space-y-1">
          <p className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Pasos para activar</p>
          <p>1. Crea un archivo <span className="font-semibold">.env</span> en la raíz del proyecto</p>
          <p>2. Agrega: <span className="font-semibold text-slate-800">VITE_WORKER_URL=https://tu-proxy/</span></p>
          <p>3. Reinicia el servidor de desarrollo</p>
        </div>
        <p className="text-xs text-slate-400">
          El proxy debe reenviar las solicitudes a la API de Anthropic con tu clave secreta.
          Ver <span className="font-mono">.env.example</span> para más detalles.
        </p>
      </div>
    </div>
  );
}

// ─── Module ───────────────────────────────────────────────────────────────────

export function AsistenteModule() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: IS_CONFIGURED
        ? `¡Hola! Soy el asistente de IA de **${clientConfig.clientName}**. Tengo acceso a los datos de tu negocio y puedo ayudarte a:\n\n- Analizar tus **finanzas** y tendencias\n- Revisar el estado de tus **clientes** y ventas\n- Hacer seguimiento de tus **${clientConfig.industria.entityNamePlural.toLowerCase()}**\n- Dar recomendaciones basadas en los datos\n\n¿En qué te puedo ayudar hoy?`
        : `¡Hola! Soy el asistente de IA de **${clientConfig.clientName}**.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !IS_CONFIGURED) return;

    const workerUrl = import.meta.env.VITE_WORKER_URL;
    setInput('');
    setError(null);

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 2048,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);

      const data = await response.json();
      const replyText = data.content?.[0]?.text ?? data.choices?.[0]?.message?.content ?? 'No se pudo obtener respuesta.';

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)]">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-900">Asistente IA</h1>
        <p className="text-sm text-slate-500">
          {IS_CONFIGURED
            ? 'Con contexto de todos los módulos activos · claude-sonnet-4-5'
            : 'Pendiente de configuración · ver instrucciones abajo'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* First message (greeting) */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'text-white' : 'bg-slate-200'}`}
              style={msg.role === 'assistant' ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              {msg.role === 'assistant' ? <Bot size={15} /> : <User size={15} className="text-slate-600" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}
              style={msg.role === 'user' ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              {msg.role === 'assistant' ? (
                <div className="prose-chat"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Not-configured notice shown after the greeting bubble */}
        {!IS_CONFIGURED && <UnconfiguredNotice />}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Bot size={15} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Analizando...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex-shrink-0">
        {IS_CONFIGURED ? (
          <>
            <div className="flex gap-2 items-end bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Pregunta sobre tus datos... (Enter para enviar)"
                rows={1}
                className="flex-1 resize-none text-sm outline-none placeholder-slate-400 bg-transparent max-h-28 leading-relaxed py-2.5"
                style={{ minHeight: '44px' }}
                onInput={e => {
                  const t = e.currentTarget;
                  t.style.height = 'auto';
                  t.style.height = `${t.scrollHeight}px`;
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">Shift+Enter para nueva línea</p>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 cursor-not-allowed">
            <Settings size={15} className="text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-400 flex-1">Asistente no disponible — configura VITE_WORKER_URL para activar</p>
            <Send size={14} className="text-slate-300 flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}
