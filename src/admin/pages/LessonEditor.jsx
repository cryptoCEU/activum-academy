import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '../../supabase'

// ── Toolbar button ────────────────────────────────────────────────────────────

function TBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1.5 text-xs font-medium transition-colors border ${
        active
          ? 'bg-act-burg text-white border-act-burg'
          : 'text-act-black/70 border-transparent hover:bg-act-beige1 hover:border-act-beige2'
      } disabled:opacity-30`}
      style={{ borderRadius: '2px' }}
    >
      {children}
    </button>
  )
}

// ── TipTap Toolbar ────────────────────────────────────────────────────────────

function Toolbar({ editor }) {
  if (!editor) return null

  const insertSnippet = (html) => {
    editor.chain().focus().insertContent(html).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-act-beige2 bg-act-beige1">
      {/* Text format */}
      <TBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita">B</TBtn>
      <TBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva"><em>I</em></TBtn>

      <div className="w-px h-5 bg-act-beige2 mx-1" />

      {/* Headings */}
      <TBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título H2">H2</TBtn>
      <TBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subtítulo H3">H3</TBtn>

      <div className="w-px h-5 bg-act-beige2 mx-1" />

      {/* Lists */}
      <TBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista con viñetas">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
      </TBtn>
      <TBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
      </TBtn>

      <div className="w-px h-5 bg-act-beige2 mx-1" />

      {/* Block utilities */}
      <TBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador">—</TBtn>

      <div className="w-px h-5 bg-act-beige2 mx-1" />

      {/* Custom snippets */}
      <TBtn onClick={() => insertSnippet('<div class="highlight-box"><p>Texto destacado aquí</p></div>')} title="Caja destacada">
        <span className="text-act-burg font-bold">HB</span>
      </TBtn>
      <TBtn onClick={() => insertSnippet('<div class="info-grid"><div class="info-card"><strong>0%</strong><span>Etiqueta</span></div><div class="info-card"><strong>0</strong><span>Etiqueta</span></div></div>')} title="Grid de estadísticas">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m7.5-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c-.621 0-1.125.504-1.125 1.125v1.5m2.25-2.625h.008v.008H12v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 4.5h.008v.008H12v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
      </TBtn>

      <div className="w-px h-5 bg-act-beige2 mx-1" />

      {/* Undo/redo */}
      <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
      </TBtn>
    </div>
  )
}

// ── Video helpers ─────────────────────────────────────────────────────────────

function getEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1)
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const v = u.pathname.split('/').filter(Boolean).pop()
      return v ? `https://player.vimeo.com/video/${v}` : null
    }
  } catch {}
  return null
}

// ── LessonEditor ──────────────────────────────────────────────────────────────

export default function LessonEditor({ lessonId, moduleId, courseId, onNavigate }) {
  const [lesson,   setLesson]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [fb,       setFb]       = useState(null)
  const [tab,      setTab]      = useState('visual')   // visual | html | preview
  const [rawHtml,  setRawHtml]  = useState('')
  const [title,    setTitle]    = useState('')
  const [duration, setDuration] = useState('10 min')
  const [videoUrl, setVideoUrl] = useState('')

  const msg = (type, text) => { setFb({ type, text }); setTimeout(() => setFb(null), 4000) }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escribe el contenido de la lección aquí...' }),
    ],
    content: '',
    editorProps: {
      attributes: { class: 'lesson-prose focus:outline-none min-h-[400px] px-6 py-5' },
    },
  })

  useEffect(() => {
    if (!lessonId) return
    supabase.from('lessons').select('*').eq('id', lessonId).single().then(({ data }) => {
      if (data) {
        setLesson(data)
        setTitle(data.title)
        setDuration(data.duration ?? '10 min')
        setVideoUrl(data.video_url ?? '')
        setRawHtml(data.content ?? '')
        editor?.commands.setContent(data.content ?? '')
      }
      setLoading(false)
    })
  }, [lessonId, editor])

  // Sync visual ↔ html tabs
  const handleTabChange = (next) => {
    if (tab === 'visual' && next !== 'visual') {
      setRawHtml(editor?.getHTML() ?? '')
    }
    if (tab === 'html' && next === 'visual') {
      editor?.commands.setContent(rawHtml)
    }
    setTab(next)
  }

  const getContent = useCallback(() => {
    return tab === 'html' ? rawHtml : (editor?.getHTML() ?? '')
  }, [tab, rawHtml, editor])

  const handleSave = async () => {
    setSaving(true)
    const content = getContent()
    const { error } = await supabase.from('lessons').update({
      title:     title.trim(),
      duration:  duration.trim(),
      content,
      video_url: videoUrl.trim() || null,
    }).eq('id', lessonId)
    setSaving(false)
    if (error) msg('error', error.message)
    else msg('success', 'Lección guardada.')
  }

  if (!lessonId) return <div className="py-16 text-center text-act-beige3 text-sm">Selecciona una lección desde el editor de curso.</div>

  if (loading) return (
    <div className="flex items-center gap-2 text-act-beige3 py-16">
      <div className="w-4 h-4 border-2 border-act-burg border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Cargando lección...</span>
    </div>
  )

  const previewHtml = tab === 'html' ? rawHtml : (editor?.getHTML() ?? '')

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('course-editor', { courseId })}
          className="flex items-center gap-1.5 text-xs text-act-beige3 hover:text-act-black transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Editor de curso
        </button>
        <div className="h-px flex-1 bg-act-beige2" />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-act-burg text-white px-5 py-2 text-sm font-medium hover:bg-act-burg-l transition-colors disabled:opacity-50"
          style={{ borderRadius: '2px' }}
        >{saving ? 'Guardando…' : 'Guardar lección'}</button>
      </div>

      {fb && (
        <div className={`text-xs border px-3 py-2.5 ${fb.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-act-burg bg-red-50 border-red-100'}`} style={{ borderRadius: '2px' }}>
          {fb.text}
        </div>
      )}

      {/* Title + duration row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">Título de la lección</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg"
            style={{ borderRadius: '2px' }} />
        </div>
        <div className="w-32">
          <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">Duración</label>
          <input value={duration} onChange={e => setDuration(e.target.value)}
            placeholder="10 min"
            className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg"
            style={{ borderRadius: '2px' }} />
        </div>
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-xs font-medium text-act-black/50 tracking-widest uppercase mb-1.5">URL de vídeo (YouTube / Vimeo)</label>
        <input
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border border-act-beige2 bg-act-white text-act-black px-3 py-2.5 text-sm focus:outline-none focus:border-act-burg placeholder:text-act-beige3"
          style={{ borderRadius: '2px' }}
        />
        {videoUrl && !getEmbedUrl(videoUrl) && (
          <p className="text-xs text-act-burg mt-1">URL no reconocida — usa un enlace de YouTube o Vimeo.</p>
        )}
        {getEmbedUrl(videoUrl) && (
          <div className="mt-2 border border-act-beige2 overflow-hidden" style={{ borderRadius: '2px', aspectRatio: '16/9' }}>
            <iframe src={getEmbedUrl(videoUrl)} className="w-full h-full" allowFullScreen title="preview" />
          </div>
        )}
      </div>

      {/* Editor + preview */}
      <div className="grid lg:grid-cols-2 gap-5 items-start">

        {/* Editor panel */}
        <div className="border border-act-beige2" style={{ borderRadius: '2px' }}>
          {/* Tabs */}
          <div className="flex border-b border-act-beige2">
            {[['visual', 'Visual'], ['html', 'HTML']].map(([id, label]) => (
              <button key={id} onClick={() => handleTabChange(id)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === id ? 'border-act-burg text-act-burg' : 'border-transparent text-act-beige3 hover:text-act-black'}`}
              >{label}</button>
            ))}
          </div>

          {tab === 'visual' && (
            <>
              <Toolbar editor={editor} />
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                <EditorContent editor={editor} />
              </div>
            </>
          )}

          {tab === 'html' && (
            <textarea
              value={rawHtml}
              onChange={e => setRawHtml(e.target.value)}
              spellCheck={false}
              className="w-full font-mono text-xs text-act-black bg-act-white px-4 py-4 focus:outline-none resize-none"
              style={{ minHeight: '500px', borderRadius: '0 0 2px 2px' }}
            />
          )}
        </div>

        {/* Preview panel */}
        <div className="border border-act-beige2" style={{ borderRadius: '2px' }}>
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-act-beige2 bg-act-beige1">
            <div className="h-px w-4 bg-act-burg" />
            <span className="text-xs text-act-beige3 tracking-widest uppercase">Vista previa</span>
          </div>
          <div
            className="lesson-prose overflow-y-auto px-6 py-5"
            style={{ maxHeight: '600px' }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>

      {/* Raw ID info */}
      <p className="text-[10px] text-act-beige3 font-mono">ID: {lessonId}</p>
    </div>
  )
}
