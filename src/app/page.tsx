'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Atom, Play, Lock, Search, Bell, FileText, LogOut, ChevronLeft,
  ChevronDown, Menu, X, Check, Plus, Trash2, Edit, Settings,
  Copy, Phone, MessageCircle, BookOpen, Award, TrendingUp,
  LayoutGrid, Video, Download, ArrowUp, Star, Eye, Clock,
  Shield, Zap, Users, BarChart3, Send, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useWikiStore, type Page, type DbView, type AdminView } from '@/lib/wiki-store'

/* ═══════════════════════════════════════════
   WIKI PHYSICS — FULL REDESIGN
   ═══════════════════════════════════════════ */

/* ─── Logo Component ─── */
function Logo({ onClick, onSecretTrigger }: { onClick: () => void; onSecretTrigger?: () => void }) {
  const tapCount = useRef(0)
  const tapTimer = useRef<NodeJS.Timeout>()
  const pressTimer = useRef<NodeJS.Timeout>()

  const handleClick = () => {
    if (onSecretTrigger) {
      tapCount.current++
      clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => { tapCount.current = 0 }, 1800)
      if (tapCount.current >= 7) {
        tapCount.current = 0
        onSecretTrigger()
        return
      }
    }
    onClick()
  }

  const handlePressStart = () => {
    if (onSecretTrigger) {
      pressTimer.current = setTimeout(() => {
        onSecretTrigger()
      }, 5000)
    }
  }
  const handlePressEnd = () => clearTimeout(pressTimer.current)

  return (
    <div
      className="flex items-center gap-3 cursor-pointer group select-none"
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF9D40] flex items-center justify-center glow-orange-sm group-hover:glow-orange transition-all duration-300">
        <span className="text-[#050505] font-black text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>W</span>
      </div>
      <div className="hidden sm:block">
        <span className="text-white font-bold text-sm leading-none block">ويكي فيزياء</span>
        <span className="text-[10px] text-[#FF7A00] tracking-[0.15em] leading-none" style={{ fontFamily: 'var(--font-geist-mono)' }}>WIKI PHYSICS</span>
      </div>
    </div>
  )
}

/* ─── Navbar ─── */
function Navbar() {
  const { currentPage, setCurrentPage, mobileNavOpen, setMobileNavOpen, session } = useWikiStore()

  const links: { label: string; page: Page }[] = [
    { label: 'الرئيسية', page: 'home' },
    { label: 'المنصة', page: 'about' },
    { label: 'احصل على كود', page: 'howto' },
    { label: 'الأسئلة', page: 'faq' },
  ]

  const showFooter = currentPage !== 'login' && currentPage !== 'dashboard'

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        true ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-[rgba(255,122,0,0.1)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo onClick={() => setCurrentPage('home')} onSecretTrigger={() => {
            // Admin trigger handled in main component
            const event = new CustomEvent('openAdmin')
            window.dispatchEvent(event)
          }} />

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => setCurrentPage(l.page)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                  currentPage === l.page
                    ? 'text-[#FF7A00] bg-[rgba(255,122,0,0.08)]'
                    : 'text-white/60 hover:text-[#FF7A00] hover:bg-[rgba(255,122,0,0.05)]'
                }`}
              >
                {l.label}
              </button>
            ))}
            <Button
              onClick={() => setCurrentPage('login')}
              className="mr-2 bg-[#FF7A00] text-[#050505] font-bold hover:bg-[#FF9D40] glow-orange-sm hover:glow-orange transition-all duration-300"
              size="sm"
            >
              دخول المنصة
            </Button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d0d0d]/98 backdrop-blur-xl border-t border-[rgba(255,122,0,0.1)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <button
                  key={l.page}
                  onClick={() => { setCurrentPage(l.page); setMobileNavOpen(false) }}
                  className="block w-full text-right px-4 py-3 text-white/70 hover:text-[#FF7A00] hover:bg-[rgba(255,122,0,0.05)] rounded-lg transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setCurrentPage('login'); setMobileNavOpen(false) }}
                className="block w-full text-right px-4 py-3 text-[#FF7A00] font-bold"
              >
                دخول المنصة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ─── Hero Section ─── */
function HeroSection() {
  const { setCurrentPage } = useWikiStore()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 radial-glow" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[rgba(255,122,0,0.04)] blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-[rgba(255,122,0,0.03)] blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.2)] text-[#FF7A00] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
            منصة الفيزياء الأولى بالعربي
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            افهم الفيزياء
            <br />
            <span className="orange-gradient-text">بطريقة مختلفة</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/50 leading-relaxed">
            منصة تعليمية متخصصة في الفيزياء، تعيد بناء الفهم الحقيقي للمادة من الأساس — بأسلوب واضح وعميق ومصمم للطالب العربي.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setCurrentPage('login')}
              className="bg-[#FF7A00] text-[#050505] font-bold text-base sm:text-lg px-8 py-6 glow-orange hover:scale-105 transition-all duration-300"
            >
              ابدأ التعلم الآن
              <ChevronLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage('about')}
              className="border-[rgba(255,122,0,0.3)] text-[#FF7A00] hover:bg-[rgba(255,122,0,0.08)] text-base sm:text-lg px-8 py-6"
            >
              تعرف على المنصة
            </Button>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-16"
        >
          {['ميكانيكا', 'حرارة', 'كهرباء', 'مغناطيسية', 'غازات', 'حركة'].map((tag) => (
            <span key={tag} className="px-4 py-2 text-sm bg-[#111] border border-[rgba(255,255,255,0.07)] rounded-full text-white/40 hover:text-[#FF7A00] hover:border-[rgba(255,122,0,0.2)] transition-all cursor-default">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-[#FF7A00]/40" />
      </motion.div>
    </section>
  )
}

/* ─── About Section ─── */
function AboutSection() {
  const features = [
    { icon: BookOpen, title: 'فهم لا حفظ', desc: 'نبني الفهم من الأساس — كل مفهوم يُشرح بالحدس أولاً ثم بالرياضيات.' },
    { icon: Zap, title: 'محتوى عربي أصيل', desc: 'مصمم خصيصاً للطالب العربي، ليس مجرد ترجمة — بل إعادة صياغة كاملة.' },
    { icon: TrendingUp, title: 'تتبع تقدمك', desc: 'شاهد تقدمك في كل درس ووحدة، واعرف بالضبط أين وصلت.' },
    { icon: Award, title: 'محتوى متجدد', desc: 'وحدات جديدة تُضاف باستمرار — الميكانيكا، الحرارة، الكهرباء، والمزيد.' },
  ]

  return (
    <div className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.2)] text-[#FF7A00] text-sm font-medium mb-6">عن المنصة</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
            فيزياء <span className="orange-gradient-text">بأسلوب مختلف</span>
          </h2>
          <p className="max-w-3xl mx-auto text-white/40 text-base sm:text-lg leading-relaxed">
            ويكي فيزياء ليست مجرد منصة دروس — إنها رحلة فهم حقيقي تبدأ من الحدس وتنتهي بالتمكن. صُممت بعناية للطالب العربي الجاد.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#111] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,122,0,0.25)] transition-all duration-300 p-6 h-full group">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,122,0,0.1)] border border-[rgba(255,122,0,0.2)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-[#FF7A00]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── HowTo Section ─── */
function HowToSection() {
  const { setGetCodePopupOpen } = useWikiStore()
  const steps = [
    { num: '01', title: 'تواصل معنا', desc: 'تواصل معنا عبر الرقم الموضح لطلب كود الدخول الخاص بك.' },
    { num: '02', title: 'استلم الكود', desc: 'سنرسل لك كود وصول شخصي بصيغة WIKI-XXXX-XXXX.' },
    { num: '03', title: 'ادخل المنصة', desc: 'أدخل الكود في صفحة الدخول وابدأ رحلتك في الفيزياء.' },
  ]

  return (
    <div className="py-20 sm:py-28 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.2)] text-[#FF7A00] text-sm font-medium mb-6">احصل على كود</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
            ثلاث خطوات <span className="orange-gradient-text">فقط</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[rgba(255,255,255,0.07)] group-hover:border-[rgba(255,122,0,0.3)] flex items-center justify-center transition-all group-hover:scale-105">
                  <span className="text-2xl font-black text-[#FF7A00]" style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.num}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setGetCodePopupOpen(true)}
            className="bg-[#FF7A00] text-[#050505] font-bold px-8 py-6 glow-orange hover:scale-105 transition-all duration-300"
          >
            <Phone className="w-5 h-5 ml-2" />
            احصل على كودك الآن
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─── FAQ Section ─── */
function FAQSection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [faqCat, setFaqCat] = useState('all')

  const faqs = [
    { id: 'f1', cat: 'access', q: 'ما هو كود الوصول وكيف يعمل؟', a: 'كود الوصول هو رمز فريد مكوّن من 8 خانات يمنحك الدخول إلى منصة ويكي فيزياء. كل كود شخصي ومرتبط بمشترك واحد فقط، ويكون صالحاً للمدة المحددة عند شرائه.' },
    { id: 'f2', cat: 'access', q: 'نسيت كودي أو فقدته، ماذا أفعل؟', a: 'تواصل معنا عبر أي من القنوات المتاحة مع إثبات الدفع الأصلي، وسيتم استعادة كودك أو إصدار كود جديد بسرعة.' },
    { id: 'f3', cat: 'access', q: 'هل يمكنني مشاركة الكود مع غيري؟', a: 'لا. كل كود مرتبط بمشترك واحد فقط. المشاركة تؤدي إلى إلغاء الكود تلقائياً دون استرداد.' },
    { id: 'f4', cat: 'content', q: 'ما المحتوى المتاح حالياً على المنصة؟', a: 'المنصة في مرحلتها الأولى وتُطلق محتواها بشكل تدريجي. الوحدات الأولى تغطي الميكانيكا الكلاسيكية والديناميكا الحرارية. يضاف محتوى جديد بانتظام.' },
    { id: 'f5', cat: 'content', q: 'هل المنصة مناسبة لجميع المراحل؟', a: 'المنصة مصممة لطلاب المرحلة الثانوية (السنة الأولى والثانية والثالثة)، لكن المحتوى العميق يناسب أيضاً طلاب الجامعات في السنوات الأولى.' },
    { id: 'f6', cat: 'tech', q: 'هل يمكنني استخدام المنصة على الهاتف؟', a: 'نعم! المنصة مصممة لتعمل بكفاءة على جميع الأجهزة — حاسوب، تابلت، وموبايل.' },
  ]

  const filtered = faqCat === 'all' ? faqs : faqs.filter(f => f.cat === faqCat)
  const cats = [
    { id: 'all', label: 'الكل' },
    { id: 'access', label: 'الأكواد' },
    { id: 'content', label: 'المحتوى' },
    { id: 'tech', label: 'تقني' },
  ]

  return (
    <div className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(255,122,0,0.08)] border border-[rgba(255,122,0,0.2)] text-[#FF7A00] text-sm font-medium mb-6">الأسئلة الشائعة</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
            عندك <span className="orange-gradient-text">سؤال؟</span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {cats.map(c => (
            <button
              key={c.id}
              onClick={() => setFaqCat(c.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                faqCat === c.id
                  ? 'bg-[rgba(255,122,0,0.1)] text-[#FF7A00] border border-[rgba(255,122,0,0.2)]'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(faq => (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all duration-300 ${
                openFaq === faq.id
                  ? 'bg-[#111] border-[rgba(255,122,0,0.2)]'
                  : 'bg-[#0d0d0d] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,122,0,0.15)]'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <span className="text-white font-medium text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#FF7A00] shrink-0 mr-4 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-white/40 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Footer ─── */
function Footer() {
  const { currentPage, setCurrentPage } = useWikiStore()
  if (currentPage === 'login' || currentPage === 'dashboard') return null

  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00] flex items-center justify-center">
                <span className="text-[#050505] font-black text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>W</span>
              </div>
              <span className="text-white font-bold">ويكي فيزياء</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">منصة تعليمية متخصصة في الفيزياء للطالب العربي — مبنية على الفهم الحقيقي لا الحفظ.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">المنصة</h4>
            <div className="space-y-2">
              {[
                { label: 'الرئيسية', page: 'home' as Page },
                { label: 'عن المنصة', page: 'about' as Page },
                { label: 'احصل على كود', page: 'howto' as Page },
                { label: 'الأسئلة الشائعة', page: 'faq' as Page },
              ].map(l => (
                <button key={l.page} onClick={() => setCurrentPage(l.page)} className="block text-white/30 hover:text-[#FF7A00] text-sm transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">الحساب</h4>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('login')} className="block text-white/30 hover:text-[#FF7A00] text-sm transition-colors">دخول المنصة</button>
              <button onClick={() => setCurrentPage('howto')} className="block text-white/30 hover:text-[#FF7A00] text-sm transition-colors">الاشتراك</button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Wiki Physics — ويكي فيزياء</p>
          <p className="text-white/15 text-xs">صُنع بعناية للطالب العربي الجاد</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Login Page ─── */
function LoginPage() {
  const { login, adminCodes } = useWikiStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const formatCode = (val: string) => {
    let v = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    if (v.length > 8) v = v.slice(0, 4) + '-' + v.slice(4, 8) + '-' + v.slice(8, 12)
    else if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4, 8)
    return v
  }

  const attemptLogin = () => {
    const c = code.trim().toUpperCase()
    if (!c || c.length < 14) { setError('أدخل كود وصول صحيح.'); return }
    setLoading(true)
    setError('')

    setTimeout(() => {
      // Check admin codes first
      const adminEntry = adminCodes.find(ac => ac.code === c)
      if (adminEntry) {
        if (adminEntry.status !== 'active') { setError('الكود غير صالح'); setLoading(false); return }
        if (adminEntry.expiresAt && new Date(adminEntry.expiresAt) < new Date()) { setError('انتهت صلاحية الكود'); setLoading(false); return }
        if (adminEntry.usageLimit && adminEntry.usedCount >= adminEntry.usageLimit) { setError('الكود غير صالح'); setLoading(false); return }
        setSuccess(true)
        setTimeout(() => login(c, adminEntry.name, adminEntry.grade), 1000)
        setLoading(false)
        return
      }

      // Demo codes
      const demoCodes: Record<string, { name: string; grade: number }> = {
        'WIKI-TEST-1234': { name: 'طالب تجريبي', grade: 1 },
        'WIKI-GRADE-0002': { name: 'طالب السنة الثانية', grade: 2 },
        'WIKI-GRADE-0003': { name: 'طالب السنة الثالثة', grade: 3 },
      }
      const demo = demoCodes[c]
      if (demo) {
        setSuccess(true)
        setTimeout(() => login(c, demo.name, demo.grade), 1000)
        setLoading(false)
        return
      }

      setError('الكود غير صالح')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.15)] border-2 border-green-500 flex items-center justify-center mx-auto mb-4 success-pop">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xl font-bold text-white">تم تسجيل الدخول بنجاح</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,122,0,0.1)] border border-[rgba(255,122,0,0.2)] flex items-center justify-center mx-auto mb-4">
            <Atom className="w-8 h-8 text-[#FF7A00]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">دخول المنصة</h1>
          <p className="text-white/40 text-sm">أدخل كود الوصول الخاص بك</p>
        </div>

        <Card className="bg-[#111] border-[rgba(255,255,255,0.07)] p-6 sm:p-8 rounded-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">كود الوصول</label>
              <Input
                value={code}
                onChange={(e) => setCode(formatCode(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && attemptLogin()}
                placeholder="WIKI-XXXX-XXXX"
                maxLength={14}
                className="bg-[#0d0d0d] border-[rgba(255,255,255,0.08)] text-white placeholder:text-white/20 text-center text-lg tracking-widest font-mono input-wiki"
                dir="ltr"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              onClick={attemptLogin}
              disabled={loading}
              className="w-full bg-[#FF7A00] text-[#050505] font-bold py-6 glow-orange-sm hover:glow-orange transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '...' : 'دخول'}
            </Button>
          </div>
        </Card>

        <p className="text-center text-white/20 text-xs mt-6">
          ليس لديك كود؟ <button onClick={() => useWikiStore.getState().setCurrentPage('howto')} className="text-[#FF7A00] hover:underline">احصل على واحد</button>
        </p>
      </motion.div>
    </div>
  )
}

/* ─── Video Card ─── */
function VideoCard({ video, progress, onClick }: { video: { id: string; title: string; desc: string; moduleName: string; duration: string; order: number; status: string }; progress: number; onClick: () => void }) {
  const locked = video.status === 'locked'
  return (
    <div
      onClick={locked ? undefined : onClick}
      className={`rounded-xl border bg-[#111] overflow-hidden transition-all duration-300 ${
        locked
          ? 'border-[rgba(255,255,255,0.04)] opacity-60 cursor-not-allowed'
          : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,122,0,0.25)] cursor-pointer video-card-hover'
      }`}
    >
      {/* Thumb */}
      <div className="relative aspect-video bg-[#0d0d0d] flex items-center justify-center">
        {locked ? (
          <Lock className="w-8 h-8 text-white/20" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.3)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-[#FF7A00] mr-[-2px]" />
          </div>
        )}
        <span className="absolute top-3 right-3 w-6 h-6 rounded-md bg-[rgba(0,0,0,0.6)] text-white/60 text-xs font-bold flex items-center justify-center" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {video.order}
        </span>
        {!locked && (
          <span className="absolute bottom-3 left-3 text-xs text-white/40 bg-[rgba(0,0,0,0.6)] px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {video.duration}
          </span>
        )}
      </div>
      {/* Meta */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{video.title}</h3>
        <p className="text-xs text-white/30 line-clamp-2 mb-3 leading-relaxed">{video.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#FF7A00]/60">{video.moduleName}</span>
          {locked ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-white/25">قريباً</span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                <div className="h-full rounded-full bg-[#FF7A00] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard ─── */
function Dashboard() {
  const store = useWikiStore()
  const { session, currentDbView, setDbView, currentGrade, setCurrentGrade, videos, progressStore, markProgress, notifications, markNotifRead, markAllNotifsRead, files, currentVideoId, setCurrentVideoId, logout } = store
  const [videoSearch, setVideoSearch] = useState('')
  const [fileSearch, setFileSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!session) return null

  const gradeNames: Record<number, string> = { 1: 'أولى', 2: 'تانية', 3: 'تالتة' }
  const gradeLabels: Record<number, string> = { 1: 'الأولى', 2: 'الثانية', 3: 'الثالثة' }
  const gradeEn: Record<number, string> = { 1: 'Grade 1', 2: 'Grade 2', 3: 'Grade 3' }

  const gradeVideos = videos.filter(v => v.grade === currentGrade)
  const available = gradeVideos.filter(v => v.status === 'available')
  const watched = available.filter(v => (progressStore[v.id] || 0) > 0)
  const totalPct = available.length ? Math.round(available.reduce((s, v) => s + (progressStore[v.id] || 0), 0) / available.length) : 0
  const inProgress = available.filter(v => (progressStore[v.id] || 0) > 0 && progressStore[v.id] < 100)
  const lastInProgress = inProgress.length ? inProgress[inProgress.length - 1] : null
  const lastPct = lastInProgress ? progressStore[lastInProgress.id] || 0 : 0

  const currentVideo = currentVideoId ? videos.find(v => v.id === currentVideoId) : null
  const currentPct = currentVideoId ? progressStore[currentVideoId] || 0 : 0
  const playlistVideos = currentVideo ? videos.filter(v => v.moduleId === currentVideo.moduleId && v.grade === currentVideo.grade) : []

  const filteredVideos = videos.filter(v => v.grade === currentGrade && (
    !videoSearch.trim() ||
    v.title.includes(videoSearch.trim()) ||
    v.moduleName.includes(videoSearch.trim()) ||
    v.desc.includes(videoSearch.trim())
  ))

  const unreadNotifs = notifications.filter(n => !n.read).length
  const gradeFiles = files[currentGrade] || []
  const filteredFiles = fileSearch.trim()
    ? gradeFiles.filter(f => f.name.includes(fileSearch.trim()) || f.module.includes(fileSearch.trim()))
    : gradeFiles

  const sidebarItems: { view: DbView; label: string; icon: typeof LayoutGrid; badge?: number }[] = [
    { view: 'overview', label: 'نظرة عامة', icon: LayoutGrid },
    { view: 'videos', label: 'الدروس', icon: Video },
    { view: 'notifications', label: 'الإشعارات', icon: Bell, badge: unreadNotifs },
    { view: 'files', label: 'الملفات', icon: FileText },
  ]

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-[#0d0d0d] border-b border-[rgba(255,255,255,0.05)] px-2 py-2">
        <div className="flex gap-1">
          {sidebarItems.map(si => (
            <button
              key={si.view}
              onClick={() => setDbView(si.view)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${
                currentDbView === si.view ? 'bg-[rgba(255,122,0,0.1)] text-[#FF7A00]' : 'text-white/40'
              }`}
            >
              <si.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{si.label}</span>
              {si.badge ? <span className="w-4 h-4 rounded-full bg-[#FF7A00] text-[#050505] text-[9px] font-bold flex items-center justify-center">{si.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0a0a0a] border-l border-[rgba(255,255,255,0.05)] pt-6 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="px-5 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF9D40] flex items-center justify-center text-[#050505] font-bold">
              {session.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{session.name}</p>
              <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-geist-mono)' }}>{gradeEn[session.grade]}</p>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1">
          <p className="text-[10px] text-white/20 font-bold tracking-wider px-3 mb-2">القائمة</p>
          {sidebarItems.map(si => (
            <button
              key={si.view}
              onClick={() => setDbView(si.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                currentDbView === si.view
                  ? 'bg-[rgba(255,122,0,0.1)] text-[#FF7A00]'
                  : 'text-white/40 hover:text-white/60 hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <si.icon className="w-4 h-4" />
              {si.label}
              {si.badge ? <span className="mr-auto w-5 h-5 rounded-full bg-[#FF7A00] text-[#050505] text-[10px] font-bold flex items-center justify-center">{si.badge}</span> : null}
            </button>
          ))}
        </div>

        <div className="px-3 pb-4">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400 hover:bg-[rgba(248,113,113,0.05)] transition-all">
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pt-6 pt-20 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        {/* OVERVIEW */}
        {currentDbView === 'overview' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">مرحباً، {session.name}</h1>
                <p className="text-white/30 text-sm">استكمل رحلتك في الفيزياء</p>
              </div>
              <div className="flex gap-1 bg-[#111] rounded-lg p-1">
                {[1, 2, 3].map(g => (
                  <button
                    key={g}
                    onClick={() => setCurrentGrade(g)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      currentGrade === g ? 'bg-[#FF7A00] text-[#050505]' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {gradeNames[g]}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { val: watched.length, label: 'دروس شاهدتها' },
                { val: totalPct + '%', label: 'نسبة التقدم' },
                { val: available.length, label: 'دروس متاحة' },
              ].map((s, i) => (
                <Card key={i} className="bg-[#111] border-[rgba(255,255,255,0.05)] p-4 sm:p-6 text-center">
                  <p className="text-xl sm:text-3xl font-black text-[#FF7A00] mb-1" style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.val}</p>
                  <p className="text-white/30 text-xs sm:text-sm">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Continue watching */}
            {lastInProgress && (
              <Card
                className="bg-[#111] border-[rgba(255,122,0,0.15)] p-4 cursor-pointer hover:border-[rgba(255,122,0,0.3)] transition-all"
                onClick={() => { setCurrentVideoId(lastInProgress.id); setDbView('player') }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
                  <span className="text-sm font-bold text-white">أكمل من حيث توقفت</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[rgba(255,122,0,0.1)] flex items-center justify-center shrink-0">
                    <Play className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#FF7A00]/60 mb-0.5">{lastInProgress.moduleName}</p>
                    <p className="text-white font-semibold text-sm truncate">{lastInProgress.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                        <div className="h-full rounded-full bg-[#FF7A00]" style={{ width: `${lastPct}%` }} />
                      </div>
                      <span className="text-[10px] text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>{lastPct}%</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#FF7A00] text-[#050505] font-bold shrink-0">استكمال</Button>
                </div>
              </Card>
            )}

            {/* Recent videos */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                دروس السنة {gradeLabels[currentGrade]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gradeVideos.slice(0, 8).map(v => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    progress={progressStore[v.id] || 0}
                    onClick={() => { setCurrentVideoId(v.id); setDbView('player') }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {currentDbView === 'videos' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-white">مكتبة الدروس</h1>
                <p className="text-white/30 text-sm">جميع الدروس حسب السنة والوحدة</p>
              </div>
              <div className="flex gap-1 bg-[#111] rounded-lg p-1">
                {[1, 2, 3].map(g => (
                  <button key={g} onClick={() => setCurrentGrade(g)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentGrade === g ? 'bg-[#FF7A00] text-[#050505]' : 'text-white/40 hover:text-white/60'}`}>
                    {gradeNames[g]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input
                value={videoSearch}
                onChange={(e) => setVideoSearch(e.target.value)}
                placeholder="ابحث عن درس..."
                className="bg-[#111] border-[rgba(255,255,255,0.07)] text-white placeholder:text-white/20 pr-10 input-wiki"
              />
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 font-medium">لا توجد نتائج</p>
                <p className="text-white/15 text-sm">جرّب كلمة بحث مختلفة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map(v => (
                  <VideoCard key={v.id} video={v} progress={progressStore[v.id] || 0} onClick={() => { setCurrentVideoId(v.id); setDbView('player') }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLAYER */}
        {currentDbView === 'player' && currentVideo && (
          <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => { setCurrentVideoId(null); setDbView('videos') }} className="flex items-center gap-2 text-white/40 hover:text-[#FF7A00] text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" />
              العودة إلى الدروس
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Player embed */}
                <div className="aspect-video bg-[#111] rounded-xl border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
                  {currentVideo.videoId ? (
                    <iframe src={`https://www.youtube.com/embed/${currentVideo.videoId}`} className="w-full h-full rounded-xl" allowFullScreen />
                  ) : (
                    <div className="text-center">
                      <Video className="w-12 h-12 text-white/10 mx-auto mb-2" />
                      <p className="text-white/20 text-sm">الفيديو سيظهر هنا عند الإضافة</p>
                    </div>
                  )}
                </div>

                <span className="inline-block px-3 py-1 text-xs bg-[rgba(255,122,0,0.1)] text-[#FF7A00] rounded-lg">{currentVideo.moduleName} — السنة {gradeLabels[currentVideo.grade]}</span>
                <h2 className="text-xl font-bold text-white">{currentVideo.title}</h2>

                {/* Progress */}
                <Card className="bg-[#111] border-[rgba(255,255,255,0.05)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/50">تقدمك في هذا الدرس</span>
                    <span className="text-sm font-bold text-[#FF7A00]" style={{ fontFamily: 'var(--font-geist-mono)' }}>{currentPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)] mb-4">
                    <div className="h-full rounded-full bg-[#FF7A00] transition-all duration-500" style={{ width: `${currentPct}%` }} />
                  </div>
                  <div className="flex gap-2">
                    {[25, 50, 100].map(pct => (
                      <Button key={pct} size="sm" onClick={() => markProgress(currentVideo.id, pct)} className="bg-[rgba(255,122,0,0.1)] text-[#FF7A00] hover:bg-[rgba(255,122,0,0.2)] border-none">
                        +{pct}%
                      </Button>
                    ))}
                    <Button size="sm" onClick={() => markProgress(currentVideo.id, 0)} className="bg-[rgba(255,255,255,0.05)] text-white/40 hover:bg-[rgba(255,255,255,0.08)] border-none">
                      <RotateCcw className="w-3 h-3 ml-1" /> إعادة
                    </Button>
                  </div>
                </Card>

                <div>
                  <h3 className="text-sm font-bold text-white mb-2">عن هذا الدرس</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{currentVideo.desc}</p>
                </div>
              </div>

              {/* Playlist */}
              <div>
                <Card className="bg-[#111] border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden sticky top-24">
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
                    <p className="text-sm font-bold text-white">قائمة تشغيل الوحدة</p>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {playlistVideos.map(pv => (
                      <button
                        key={pv.id}
                        onClick={() => pv.status !== 'locked' && setCurrentVideoId(pv.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-all border-b border-[rgba(255,255,255,0.03)] ${
                          pv.id === currentVideoId ? 'bg-[rgba(255,122,0,0.08)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
                        } ${pv.status === 'locked' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                          pv.id === currentVideoId ? 'bg-[#FF7A00] text-[#050505]' : 'bg-[rgba(255,255,255,0.05)] text-white/30'
                        }`}>
                          {pv.status === 'locked' ? <Lock className="w-3 h-3" /> : pv.order}
                        </span>
                        <span className={`text-sm flex-1 truncate ${pv.id === currentVideoId ? 'text-[#FF7A00] font-medium' : 'text-white/50'}`}>
                          {pv.title}
                        </span>
                        {pv.status !== 'locked' && (
                          <span className="text-[10px] text-white/20 shrink-0" style={{ fontFamily: 'var(--font-geist-mono)' }}>{pv.duration}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {currentDbView === 'notifications' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-white">الإشعارات</h1>
                <p className="text-white/30 text-sm">{unreadNotifs ? `${unreadNotifs} إشعارات غير مقروءة` : 'كل الإشعارات مقروءة'}</p>
              </div>
              {unreadNotifs > 0 && (
                <Button size="sm" variant="outline" onClick={markAllNotifsRead} className="border-[rgba(255,122,0,0.2)] text-[#FF7A00]">
                  تعليم الكل كمقروء
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotifRead(n.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    n.read ? 'bg-[#0d0d0d] border-[rgba(255,255,255,0.04)]' : 'bg-[#111] border-[rgba(255,122,0,0.15)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-white/10' : 'bg-[#FF7A00]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-sm font-semibold ${n.read ? 'text-white/40' : 'text-white'}`}>{n.title}</p>
                        {!n.read && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,122,0,0.1)] text-[#FF7A00] shrink-0">جديد</span>}
                      </div>
                      <p className="text-white/30 text-xs leading-relaxed mb-1">{n.desc}</p>
                      <p className="text-white/15 text-[10px]">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILES */}
        {currentDbView === 'files' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-white">الملفات والمراجع</h1>
                <p className="text-white/30 text-sm">ملخصات وأوراق عمل وتمارين محلولة</p>
              </div>
              <div className="flex gap-1 bg-[#111] rounded-lg p-1">
                {[1, 2, 3].map(g => (
                  <button key={g} onClick={() => setCurrentGrade(g)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentGrade === g ? 'bg-[#FF7A00] text-[#050505]' : 'text-white/40'}`}>
                    {gradeNames[g]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input value={fileSearch} onChange={(e) => setFileSearch(e.target.value)} placeholder="ابحث عن ملف..." className="bg-[#111] border-[rgba(255,255,255,0.07)] text-white placeholder:text-white/20 pr-10 input-wiki" />
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 font-medium">لا توجد ملفات بعد</p>
              </div>
            ) : (
              (() => {
                const grouped: Record<string, typeof filteredFiles> = {}
                filteredFiles.forEach(f => { if (!grouped[f.module]) grouped[f.module] = []; grouped[f.module].push(f) })
                return Object.entries(grouped).map(([mod, list]) => (
                  <div key={mod}>
                    <p className="text-xs font-bold text-[#FF7A00] tracking-wider mb-3" style={{ fontFamily: 'var(--font-geist-mono)' }}>{mod}</p>
                    <div className="space-y-2">
                      {list.map(f => (
                        <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,122,0,0.2)] transition-all cursor-pointer group">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(255,122,0,0.1)] border border-[rgba(255,122,0,0.15)] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-[#FF7A00]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                            <p className="text-[10px] text-white/25" style={{ fontFamily: 'var(--font-geist-mono)' }}>{f.type.toUpperCase()} · {f.size}</p>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[rgba(255,122,0,0.08)] flex items-center justify-center group-hover:bg-[rgba(255,122,0,0.15)] transition-colors">
                            <Download className="w-4 h-4 text-[#FF7A00]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              })()
            )}
          </div>
        )}
      </main>
    </div>
  )
}

/* ─── Admin Panel ─── */
function AdminPanel() {
  const store = useWikiStore()
  const { isAdminLoggedIn, setAdminLoggedIn, adminView, setAdminView, videos, adminCodes, addAdminCode, removeAdminCode, toggleCodeStatus, addVideo, removeVideo } = store
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminAttempts, setAdminAttempts] = useState(0)
  const [adminLocked, setAdminLocked] = useState(false)
  const [newCodeName, setNewCodeName] = useState('')
  const [newCodeGrade, setNewCodeGrade] = useState(1)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [newVideo, setNewVideo] = useState({ title: '', grade: 1, moduleName: '', duration: '', desc: '', status: 'available' as const })
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // Listen for admin trigger
  useEffect(() => {
    const handler = () => {
      if (isAdminLoggedIn) return
      setAdminModalOpen(true)
    }
    window.addEventListener('openAdmin', handler)
    return () => window.removeEventListener('openAdmin', handler)
  }, [isAdminLoggedIn])

  const submitAdminLogin = () => {
    if (adminLocked) return
    if (adminUser === 'admin' && adminPass === 'WIKI_Admin_2026') {
      setAdminLoggedIn(true)
      setAdminModalOpen(false)
      setAdminAttempts(0)
    } else {
      const attempts = adminAttempts + 1
      setAdminAttempts(attempts)
      setAdminError(attempts >= 3 ? 'تم تجاوز الحد. انتظر دقيقة.' : 'بيانات خاطئة')
      if (attempts >= 3) {
        setAdminLocked(true)
        setTimeout(() => { setAdminLocked(false); setAdminAttempts(0) }, 60000)
      }
    }
  }

  const generateCode = () => {
    if (!newCodeName.trim()) return
    const code = 'WIKI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    addAdminCode({
      code,
      name: newCodeName.trim(),
      grade: newCodeGrade,
      status: 'active',
      usageLimit: 1,
      usedCount: 0,
      expiresAt: '2026-12-31',
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setNewCodeName('')
    showToast('تم إنشاء الكود: ' + code)
  }

  const addNewVideo = () => {
    if (!newVideo.title.trim()) return
    addVideo({
      id: 'v' + Date.now(),
      grade: newVideo.grade,
      moduleId: 'm' + Date.now(),
      moduleName: newVideo.moduleName || 'عام',
      order: videos.filter(v => v.grade === newVideo.grade).length + 1,
      title: newVideo.title,
      desc: newVideo.desc || 'درس جديد',
      duration: newVideo.duration || '00:00',
      videoId: null,
      status: newVideo.status,
    })
    setVideoModalOpen(false)
    setNewVideo({ title: '', grade: 1, moduleName: '', duration: '', desc: '', status: 'available' })
    showToast('تم إضافة الدرس')
  }

  if (!isAdminLoggedIn) {
    return (
      <AnimatePresence>
        {adminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setAdminModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-[#0e0e0e] border border-[rgba(255,122,0,0.2)] rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-white mb-4">لوحة التحكم</h2>
              <div className="space-y-3">
                <Input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="اسم المستخدم" className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki" />
                <Input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} type="password" placeholder="كلمة المرور" className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki" onKeyDown={(e) => e.key === 'Enter' && submitAdminLogin()} />
                {adminError && <p className="text-red-400 text-sm">{adminError}</p>}
                <div className="flex gap-2">
                  <Button onClick={() => setAdminModalOpen(false)} variant="outline" className="flex-1 border-[rgba(255,255,255,0.08)] text-white/40">إلغاء</Button>
                  <Button onClick={submitAdminLogin} className="flex-1 bg-[#FF7A00] text-[#050505] font-bold">دخول</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Admin dashboard
  const publishedVids = videos.filter(v => v.status === 'available')
  const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0)
  const activeCodes = adminCodes.filter(c => c.status === 'active')

  const adminNavItems: { view: AdminView; label: string; icon: typeof BarChart3 }[] = [
    { view: 'stats', label: 'نظرة عامة', icon: BarChart3 },
    { view: 'videos', label: 'الدروس', icon: Video },
    { view: 'codes', label: 'الأكواد', icon: Shield },
    { view: 'settings', label: 'الإعدادات', icon: Settings },
  ]

  return (
    <>
      {/* Admin overlay */}
      <div className="fixed inset-0 z-[150] bg-[#0a0a0a] flex">
        <aside className="hidden md:flex flex-col w-56 bg-[#080808] border-l border-[rgba(255,255,255,0.05)] p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#FF7A00] flex items-center justify-center text-[#050505] font-bold text-sm">A</div>
            <span className="text-white font-bold text-sm">Admin Panel</span>
          </div>
          {adminNavItems.map(ni => (
            <button
              key={ni.view}
              onClick={() => setAdminView(ni.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 ${
                adminView === ni.view ? 'bg-[rgba(255,122,0,0.1)] text-[#FF7A00] pulse-glow' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <ni.icon className="w-4 h-4" />
              {ni.label}
            </button>
          ))}
          <button onClick={() => setAdminLoggedIn(false)} className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" />
            إغلاق
          </button>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Mobile admin nav */}
          <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            {adminNavItems.map(ni => (
              <button key={ni.view} onClick={() => setAdminView(ni.view)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${adminView === ni.view ? 'bg-[rgba(255,122,0,0.1)] text-[#FF7A00]' : 'text-white/40'}`}>
                <ni.icon className="w-3.5 h-3.5" />
                {ni.label}
              </button>
            ))}
            <button onClick={() => setAdminLoggedIn(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/60 whitespace-nowrap">
              <LogOut className="w-3.5 h-3.5" /> إغلاق
            </button>
          </div>

          {/* STATS */}
          {adminView === 'stats' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-6">نظرة عامة</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { val: videos.length, label: 'إجمالي الدروس', color: 'text-[#FF7A00]' },
                  { val: publishedVids.length, label: 'دروس منشورة', color: 'text-green-400' },
                  { val: totalViews, label: 'مجموع المشاهدات', color: 'text-[#FF7A00]' },
                  { val: activeCodes.length, label: 'أكواد نشطة', color: 'text-blue-400' },
                ].map((s, i) => (
                  <Card key={i} className="bg-[#111] border-[rgba(255,255,255,0.06)] p-4">
                    <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.val}</p>
                    <p className="text-[11px] text-white/30 mt-1">{s.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* VIDEOS */}
          {adminView === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">إدارة الدروس</h2>
                <Button onClick={() => setVideoModalOpen(true)} size="sm" className="bg-[#FF7A00] text-[#050505] font-bold">
                  <Plus className="w-4 h-4 ml-1" /> درس جديد
                </Button>
              </div>
              <div className="space-y-2">
                {videos.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.04)]">
                    <span className={`w-2 h-2 rounded-full ${v.status === 'available' ? 'bg-green-400' : 'bg-white/15'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{v.title}</p>
                      <p className="text-[10px] text-white/25">{v.moduleName} · السنة {v.grade} · {v.duration}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${v.status === 'available' ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/25'}`}>
                      {v.status === 'available' ? 'منشور' : 'مخفي'}
                    </span>
                    <button onClick={() => { removeVideo(v.id); showToast('تم حذف الدرس') }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CODES */}
          {adminView === 'codes' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-6">إدارة الأكواد</h2>
              <Card className="bg-[#111] border-[rgba(255,255,255,0.06)] p-5 mb-6">
                <p className="text-sm font-bold text-white mb-3">إنشاء كود جديد</p>
                <div className="flex gap-3">
                  <Input value={newCodeName} onChange={(e) => setNewCodeName(e.target.value)} placeholder="اسم المشترك" className="bg-[#0d0d0d] border-[rgba(255,255,255,0.08)] text-white input-wiki" />
                  <select value={newCodeGrade} onChange={(e) => setNewCodeGrade(Number(e.target.value))} className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-md px-3 text-white text-sm">
                    <option value={1}>أولى</option>
                    <option value={2}>تانية</option>
                    <option value={3}>تالتة</option>
                  </select>
                  <Button onClick={generateCode} className="bg-[#FF7A00] text-[#050505] font-bold shrink-0">إنشاء</Button>
                </div>
              </Card>

              <div className="space-y-2">
                {adminCodes.length === 0 ? (
                  <p className="text-white/20 text-sm text-center py-8">لا توجد أكواد بعد</p>
                ) : adminCodes.map(c => (
                  <div key={c.code} className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.04)]">
                    <span className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white" style={{ fontFamily: 'var(--font-geist-mono)' }}>{c.code}</p>
                      <p className="text-[10px] text-white/25">{c.name} · السنة {c.grade}</p>
                    </div>
                    <button onClick={() => { toggleCodeStatus(c.code); showToast('تم تغيير حالة الكود') }} className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {c.status === 'active' ? 'نشط' : 'معطل'}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(c.code); showToast('تم نسخ الكود') }} className="p-1.5 rounded-lg hover:bg-[rgba(255,122,0,0.1)] text-white/20 hover:text-[#FF7A00] transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { removeAdminCode(c.code); showToast('تم حذف الكود') }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {adminView === 'settings' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-6">الإعدادات</h2>
              <Card className="bg-[#111] border-[rgba(255,255,255,0.06)] p-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-white mb-1">اسم الموقع</p>
                  <p className="text-white/30 text-xs">Wiki Physics — ويكي فيزياء</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">بادئة الأكواد</p>
                  <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-geist-mono)' }}>WIKI-XXXX-XXXX</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">API Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400 text-xs">Client DB — نشط</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md bg-[#0e0e0e] border border-[rgba(255,122,0,0.2)] rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-white mb-4">رفع درس جديد</h3>
              <div className="space-y-3">
                <Input value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} placeholder="عنوان الدرس" className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={newVideo.grade} onChange={(e) => setNewVideo({ ...newVideo, grade: Number(e.target.value) })} className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-2 text-white text-sm">
                    <option value={1}>أولى</option><option value={2}>تانية</option><option value={3}>تالتة</option>
                  </select>
                  <Input value={newVideo.moduleName} onChange={(e) => setNewVideo({ ...newVideo, moduleName: e.target.value })} placeholder="الوحدة" className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} placeholder="المدة (22:30)" className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki" dir="ltr" />
                  <select value={newVideo.status} onChange={(e) => setNewVideo({ ...newVideo, status: e.target.value as 'available' | 'locked' })} className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-2 text-white text-sm">
                    <option value="locked">مخفي</option><option value="available">منشور</option>
                  </select>
                </div>
                <Textarea value={newVideo.desc} onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })} placeholder="وصف الدرس..." className="bg-[#111] border-[rgba(255,255,255,0.08)] text-white input-wiki min-h-[80px]" />
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => setVideoModalOpen(false)} variant="outline" className="flex-1 border-[rgba(255,255,255,0.08)] text-white/40">إلغاء</Button>
                  <Button onClick={addNewVideo} className="flex-1 bg-[#FF7A00] text-[#050505] font-bold">حفظ</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[220] bg-[#1a1a1a] border border-[rgba(255,122,0,0.3)] text-white px-5 py-3 rounded-xl text-sm shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Get Code Popup ─── */
function GetCodePopup() {
  const { getCodePopupOpen, setGetCodePopupOpen } = useWikiStore()
  const [copied, setCopied] = useState(false)
  const phone = '01003553304'

  const copyNumber = () => {
    navigator.clipboard.writeText(phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {getCodePopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setGetCodePopupOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm bg-[#0e0e0e] border border-[rgba(255,122,0,0.2)] rounded-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setGetCodePopupOpen(false)} className="absolute top-4 left-4 text-white/30 hover:text-white/60">✕</button>
            <span className="text-xs text-[#FF7A00] tracking-wider font-bold">الاشتراك</span>
            <h3 className="text-xl font-black text-white mt-3 mb-6">توجه هنا للحصول على<br />كود الدخول</h3>
            <p className="text-3xl font-black text-[#FF7A00] mb-4" dir="ltr" style={{ fontFamily: 'var(--font-geist-mono)' }}>{phone}</p>
            <Button onClick={copyNumber} className="bg-[rgba(255,122,0,0.1)] text-[#FF7A00] border border-[rgba(255,122,0,0.2)] hover:bg-[rgba(255,122,0,0.2)] mb-4">
              {copied ? <Check className="w-4 h-4 ml-1" /> : <Copy className="w-4 h-4 ml-1" />}
              {copied ? 'تم النسخ!' : 'نسخ الرقم'}
            </Button>
            <p className="text-white/25 text-xs">تواصل معنا على هذا الرقم وسنرسل لك كود الدخول الخاص بك</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Scroll to Top ─── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-[#FF7A00] text-[#050505] flex items-center justify-center shadow-lg hover:bg-[#FF9D40] transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const { currentPage, init, isAdminLoggedIn } = useWikiStore()

  useEffect(() => {
    init()
  }, [init])

  const showFooter = currentPage !== 'login' && currentPage !== 'dashboard'

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {currentPage !== 'login' && currentPage !== 'dashboard' && <Navbar />}

      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <HeroSection />
            <AboutSection />
            <HowToSection />
            <FAQSection />
          </>
        )}
        {currentPage === 'about' && <AboutSection />}
        {currentPage === 'howto' && <HowToSection />}
        {currentPage === 'faq' && <FAQSection />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'dashboard' && <Dashboard />}
      </main>

      {showFooter && <Footer />}
      <GetCodePopup />
      <AdminPanel />
      <ScrollToTop />
    </div>
  )
}
