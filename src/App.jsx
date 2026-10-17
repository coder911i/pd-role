import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { getCompanyArticleUrl, getCompanyLogoUrl, getCompanyFallbackLogoUrl, getPublisherLogoUrl } from './lib/companyLinks.js'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Bookmark,
  Building2, Check, ChevronDown, CircleHelp, Command, Compass, Database, Download,
  ExternalLink, Filter, Globe2, Layers3, MapPin, Menu, MessageSquareText, Search,
  Send, Settings2, ShieldCheck, Radar, Target, TrendingUp, Users, X, Zap
} from 'lucide-react'

const companies = [
  { name: 'Microsoft', sector: 'Technology', city: 'Hyderabad', signal: 'AI & cloud engineering', size: 'Large', source: 'https://news.microsoft.com/' },
  { name: 'Google', sector: 'Technology', city: 'Bengaluru', signal: 'Product & AI research', size: 'Large', source: 'https://blog.google/intl/en-in/' },
  { name: 'Amazon', sector: 'Technology', city: 'Hyderabad', signal: 'Cloud & operations', size: 'Large', source: 'https://www.aboutamazon.in/news' },
  { name: 'JPMorgan Chase', sector: 'Financial services', city: 'Mumbai', signal: 'Global technology & risk', size: 'Large', source: 'https://www.jpmorganchase.com/newsroom' },
  { name: 'Walmart Global Tech', sector: 'Retail technology', city: 'Bengaluru', signal: 'Supply chain & commerce', size: 'Large', source: 'https://tech.walmart.com/' },
  { name: 'Goldman Sachs', sector: 'Financial services', city: 'Bengaluru', signal: 'Engineering & analytics', size: 'Large', source: 'https://www.goldmansachs.com/our-firm/locations' },
  { name: 'Bosch', sector: 'Engineering', city: 'Bengaluru', signal: 'Mobility & R&D', size: 'Large', source: 'https://www.bosch.in/' },
  { name: 'Siemens', sector: 'Engineering', city: 'Pune', signal: 'Digital industries', size: 'Large', source: 'https://www.siemens.com/in/en.html' },
  { name: 'Adobe', sector: 'Technology', city: 'Noida', signal: 'Product engineering', size: 'Large', source: 'https://blog.adobe.com/en/publish' },
  { name: 'American Express', sector: 'Financial services', city: 'Gurugram', signal: 'Payments & data', size: 'Large', source: 'https://www.americanexpress.com/en-us/newsroom/' },
  { name: 'Target', sector: 'Retail technology', city: 'Bengaluru', signal: 'Digital commerce', size: 'Large', source: 'https://corporate.target.com/press' },
  { name: 'Ericsson', sector: 'Telecommunications', city: 'Noida', signal: 'Networks & software', size: 'Large', source: 'https://www.ericsson.com/en/press-releases' },
  { name: 'NVIDIA', sector: 'Technology', city: 'Pune', signal: 'AI ecosystem', size: 'Growing', source: 'https://nvidianews.nvidia.com/' },
  { name: 'Wells Fargo', sector: 'Financial services', city: 'Hyderabad', signal: 'Enterprise technology', size: 'Large', source: 'https://newsroom.wf.com/' },
  { name: 'Airbus', sector: 'Engineering', city: 'Bengaluru', signal: 'Aerospace engineering', size: 'Growing', source: 'https://www.airbus.com/en/newsroom' },
  { name: 'Uber', sector: 'Technology', city: 'Hyderabad', signal: 'Platform engineering', size: 'Growing', source: 'https://www.uber.com/newsroom/' }
]


const cityData = [
  { city: 'Bengaluru', focus: 'Product, AI & engineering', hue: '#9b8cff' },
  { city: 'Hyderabad', focus: 'Cloud, pharma & enterprise tech', hue: '#67d8ff' },
  { city: 'Pune', focus: 'Engineering & manufacturing', hue: '#f3b96a' },
  { city: 'Chennai', focus: 'Auto, BFSI & SaaS', hue: '#80e0bb' },
  { city: 'Gurugram', focus: 'BFSI, consulting & analytics', hue: '#f38cba' },
  { city: 'Mumbai', focus: 'Finance, risk & fintech', hue: '#ff9b75' }
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: Layers3 },
  { id: 'landscape', label: 'Market overview', icon: BarChart3 },
  { id: 'directory', label: 'GCC directory', icon: Building2 },
  { id: 'cities', label: 'City intelligence', icon: Globe2 },
  { id: 'signals', label: 'Market signals', icon: Activity },
  { id: 'analyst', label: 'Research desk', icon: Radar },
  { id: 'library', label: 'Research library', icon: Database }
]

function GlobeScene() {
  const mountRef = useRef(null)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer, scene, camera, globe, frame
    try {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
      camera.position.z = 4.3
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      globe = new THREE.Group()
      scene.add(globe)
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x7468ff, wireframe: true, transparent: true, opacity: 0.27 })
      )
      globe.add(sphere)
      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x141a3c, transparent: true, opacity: 0.23 })
      )
      globe.add(inner)

      const points = []
      for (let i = 0; i < 190; i++) {
        const y = 1 - (i / 189) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = Math.PI * (3 - Math.sqrt(5)) * i
        points.push(new THREE.Vector3(Math.cos(theta) * radius * 1.205, y * 1.205, Math.sin(theta) * radius * 1.205))
      }
      const dotGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const dots = new THREE.Points(dotGeometry, new THREE.PointsMaterial({ color: 0x8d85ff, size: 0.027, transparent: true, opacity: 0.9 }))
      globe.add(dots)

      const cities = [
        [0.35, 0.42, 0.94], [0.55, 0.15, 0.82], [-0.35, 0.3, 0.88],
        [0.05, -0.45, 0.89], [-0.55, -0.12, 0.82], [0.7, -0.2, 0.67]
      ]
      cities.forEach((p, i) => {
        const v = new THREE.Vector3(...p).normalize().multiplyScalar(1.23)
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(i === 0 ? 0.055 : 0.035, 12, 12),
          new THREE.MeshBasicMaterial({ color: i === 0 ? 0x73e7ff : 0xb2aaff })
        )
        marker.position.copy(v)
        globe.add(marker)
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(i === 0 ? 0.09 : 0.065, 0.006, 6, 28),
          new THREE.MeshBasicMaterial({ color: 0x8c83ff, transparent: true, opacity: 0.65 })
        )
        ring.position.copy(v)
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize())
        globe.add(ring)
      })

      const arcMaterial = new THREE.LineBasicMaterial({ color: 0x68dfff, transparent: true, opacity: 0.7 })
      const makeArc = (a, b, lift) => {
        const start = new THREE.Vector3(...a).normalize().multiplyScalar(1.23)
        const end = new THREE.Vector3(...b).normalize().multiplyScalar(1.23)
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.23 + lift)
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)), arcMaterial))
      }
      makeArc(cities[0], cities[1], 0.42)
      makeArc(cities[1], cities[3], 0.52)
      makeArc(cities[2], cities[0], 0.38)
      makeArc(cities[4], cities[0], 0.48)

      const resize = () => {
        if (!mount || !renderer || !camera) return
        const w = Math.max(mount.clientWidth, 1), h = Math.max(mount.clientHeight, 1)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      const observer = new ResizeObserver(resize)
      observer.observe(mount)
      let isVisible = true
      const visibilityObserver = new IntersectionObserver(entries => {
        isVisible = entries.some(entry => entry.isIntersecting)
        if (isVisible && !frame) animate()
        else if (!isVisible && frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      }, { threshold: 0 })
      visibilityObserver.observe(mount)
      let pointerX = 0, pointerY = 0
      const move = (event) => {
        const rect = mount.getBoundingClientRect()
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.25
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.18
      }
      mount.addEventListener('pointermove', move)
      const animate = () => {
        if (!isVisible) {
          frame = 0
          return
        }
        frame = requestAnimationFrame(animate)
        globe.rotation.y += 0.0017
        globe.rotation.x += (pointerY - globe.rotation.x) * 0.015
        globe.rotation.y += (pointerX - 0.0) * 0.0008
        renderer.render(scene, camera)
      }
      animate()
      return () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        visibilityObserver.disconnect()
        mount.removeEventListener('pointermove', move)
        renderer.dispose()
        mount.querySelectorAll('canvas').forEach(el => el.remove())
        scene.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose())
        })
      }
    } catch (e) {
      mount.classList.add('globe-fallback')
      return () => { if (renderer) renderer.dispose() }
    }
  }, [])
  return <div className="globe-canvas" ref={mountRef} aria-label="Animated 3D intelligence globe" />
}

function MiniBars({ values }) {
  return <div className="mini-bars">{values.map((v, i) => <span key={i} style={{ height: v + '%' }} />)}</div>
}

function MetricCard({ label, value, delta, icon: Icon, foot, bars, color = 'violet' }) {
  return <article className="metric-card">
    <div className="metric-top"><span className="metric-label">{label}</span><span className={'metric-icon ' + color}><Icon size={17} /></span></div>
    <div className="metric-value-row"><strong>{value}</strong><span className="metric-delta"><ArrowUpRight size={13} />{delta}</span></div>
    <div className="metric-foot">{foot}<MiniBars values={bars} /></div>
  </article>
}

function App() {
  const [companyData, setCompanyData] = useState(companies)
  const [landscape, setLandscape] = useState(null)
  const [booting, setBooting] = useState(true)
  const [liveSignals, setLiveSignals] = useState([])
  const [signalsStatus, setSignalsStatus] = useState('Loading live news…')
  const [signalsUpdatedAt, setSignalsUpdatedAt] = useState(null)
  const [signalsRetrying, setSignalsRetrying] = useState(false)
  const [active, setActive] = useState('overview')
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All sectors')
  const [city, setCity] = useState('All cities')
  const [selectedCity, setSelectedCity] = useState('Bengaluru')
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('gcc-intel-saved') || '[]') } catch { return [] } })
  const [reports, setReports] = useState(() => { try { return JSON.parse(localStorage.getItem('gcc-intel-reports') || '[]') } catch { return [] } })
  const [reportStatus, setReportStatus] = useState('Loading saved research…')
  const [mobileNav, setMobileNav] = useState(false)
  const [question, setQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi. I’m your GCC research copilot. I can answer from current news coverage when the live feed is available. I will not invent city scores, hiring numbers, or market metrics.' }
  ])
  const [timeframe, setTimeframe] = useState('7 days')

  useEffect(() => {
    const boot = window.setTimeout(() => setBooting(false), 950)
    fetch('/api/landscape').then(r => r.ok ? r.json() : Promise.reject()).then(d => setLandscape(d)).catch(() => setLandscape(null))
    return () => window.clearTimeout(boot)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('gcc-intel-saved', JSON.stringify(saved)) } catch { /* storage may be unavailable */ }
  }, [saved])

  useEffect(() => {
    try { localStorage.setItem('gcc-intel-reports', JSON.stringify(reports)) } catch { /* storage may be unavailable */ }
  }, [reports])

  useEffect(() => {
    let cancelled = false
    fetch('/api/session', { credentials: 'same-origin' })
      .then(response => response.ok ? fetch('/api/saved', { credentials: 'same-origin' }) : Promise.reject(new Error('Session unavailable')))
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Saved list unavailable')))
      .then(payload => { if (!cancelled && Array.isArray(payload.data)) setSaved(prev => [...new Set([...prev, ...payload.data.map(item => item.name)])]) })
      .catch(() => { /* Local saved list remains available without database configuration. */ })
    fetch('/api/session', { credentials: 'same-origin' })
      .then(response => response.ok ? fetch('/api/reports', { credentials: 'same-origin' }) : Promise.reject(new Error('Session unavailable')))
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Reports API unavailable')))
      .then(payload => { if (!cancelled && Array.isArray(payload.data)) { setReports(payload.data); setReportStatus('Synced to your research session') } else if (!cancelled) setReportStatus('No saved reports yet') })
      .catch(() => { if (!cancelled) setReportStatus('Local session · add DATABASE_URL to enable cloud persistence') })
    fetch('/api/directory')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Directory API unavailable')))
      .then(payload => {
        if (!cancelled && Array.isArray(payload.data) && payload.data.length) setCompanyData(payload.data)
        // Keep the curated, source-linked reference directory visible if the API is temporarily unavailable.
      })
      .catch(() => { /* The built-in source-linked directory remains available. */ })
    const loadLiveSignals = () => fetch('/api/signals')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Live news unavailable')))
      .then(payload => {
        if (!cancelled && Array.isArray(payload.data)) {
          setLiveSignals(payload.data)
          setSignalsUpdatedAt(payload.meta?.fetchedAt || new Date().toISOString())
          setSignalsStatus(payload.meta?.live ? 'LIVE · ' + (payload.meta?.provider || 'NEWS') : 'Live feed unavailable')
        } else if (!cancelled) setSignalsStatus('Live feed returned no articles')
      })
      .catch(() => { if (!cancelled) { setLiveSignals([]); setSignalsStatus('Live feed unavailable · retry later') } })
    loadLiveSignals()
    const refreshId = setInterval(loadLiveSignals, 5 * 60 * 1000)
    return () => { cancelled = true; clearInterval(refreshId) }
  }, [])

  const retryLiveSignals = async () => {
    setSignalsRetrying(true)
    setSignalsStatus('Reconnecting to live news…')
    try {
      const response = await fetch('/api/signals?refresh=' + Date.now(), { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Feed unavailable')
      setLiveSignals(Array.isArray(payload.data) ? payload.data : [])
      setSignalsUpdatedAt(payload.meta?.fetchedAt || new Date().toISOString())
      setSignalsStatus(payload.data?.length ? 'LIVE · ' + (payload.meta?.provider || 'NEWS') : 'No matching articles found')
    } catch {
      setLiveSignals([])
      setSignalsStatus('Live feed is unreachable · try again shortly')
    } finally {
      setSignalsRetrying(false)
    }
  }

  const citySignalCount = cityName => liveSignals.filter(item => (item.title + ' ' + item.domain).toLowerCase().includes(cityName.toLowerCase())).length
  const filteredCompanies = useMemo(() => companyData.filter(c =>
    (c.name + ' ' + c.sector + ' ' + c.city + ' ' + c.signal).toLowerCase().includes(query.toLowerCase()) &&
    (sector === 'All sectors' || c.sector === sector) &&
    (city === 'All cities' || c.city === city)
  ), [query, sector, city])

  const ask = async (text = question) => {
    const q = text.trim()
    if (!q || isAsking) return
    setIsAsking(true)
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'assistant', text: 'Thinking…' }])
    setQuestion('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      })
      const data = await response.json()
      if (!response.ok || !data.answer) throw new Error(data.error || 'AI endpoint is not configured')
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.text === 'Thinking…' ? { ...m, text: data.answer } : m))
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : 'Unknown request error. Check the Vercel function logs.'
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.text === 'Thinking…' ? { ...m, text: `AI request failed: ${message}` } : m))
    } finally {
      setIsAsking(false)
    }
  }

  const saveLatestReport = async () => {
    const userQuestion = [...messages].reverse().find(m => m.role === 'user')?.text
    const answer = [...messages].reverse().find(m => m.role === 'assistant' && m.text !== 'Thinking…')?.text
    if (!userQuestion || !answer) return
    setReportStatus('Saving report…')
    try {
      const session = await fetch('/api/session', { credentials: 'same-origin' })
      if (!session.ok) throw new Error('Session unavailable')
      const response = await fetch('/api/reports', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: userQuestion.slice(0, 90), prompt: userQuestion, body: answer, model: 'groq' }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not save report')
      setReports(prev => [payload.data, ...prev.filter(item => item.id !== payload.data.id)])
      setReportStatus('Report saved')
    } catch {
      const localReport = { id: 'local-' + Date.now(), title: userQuestion.slice(0, 90), prompt: userQuestion, body: answer, model: 'local-only', created_at: new Date().toISOString() }
      setReports(prev => [localReport, ...prev])
      setReportStatus('Saved in this session only · configure database for cloud storage')
    }
  }
  const deleteReport = async report => {
    setReports(prev => prev.filter(item => item.id !== report.id))
    if (String(report.id).startsWith('local-')) return
    try { await fetch('/api/reports', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: report.id }) }) } catch { /* UI remains responsive; refresh to retry. */ }
  }

  const toggleSaved = name => {
    const company = companyData.find(item => item.name === name) || companies.find(item => item.name === name)
    const wasSaved = saved.includes(name)
    setSaved(prev => wasSaved ? prev.filter(n => n !== name) : [...prev, name])
    if (!company) return
    fetch('/api/session', { credentials: 'same-origin' })
      .then(response => response.ok ? fetch('/api/saved', {
        method: wasSaved ? 'DELETE' : 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: String(company.id || company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')), name: company.name, city: company.city, sector: company.sector })
      }) : Promise.reject(new Error('Session unavailable')))
      .catch(() => { /* Local saved list is the offline fallback. */ })
  }
  const jump = id => { setActive(id); setMobileNav(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const sectorOptions = ['All sectors', ...new Set(companies.map(c => c.sector))]
  const cityOptions = ['All cities', ...new Set(companies.map(c => c.city))]

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      <div className="brand"><div className="brand-mark"><span /><span /><span /></div><div><div className="brand-name">gcc<span>intel</span></div><div className="brand-sub">INTELLIGENCE PLATFORM</div></div><button className="mobile-close icon-button" onClick={() => setMobileNav(false)}><X size={17}/></button></div>
      <div className="workspace"><div className="workspace-icon"><Command size={15}/></div><div><strong>Research workspace</strong><span>India · GCC ecosystem</span></div><ChevronDown size={14} className="muted"/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map(item => <button key={item.id} onClick={() => jump(item.id)} className={'nav-item ' + (active === item.id ? 'active' : '')}><item.icon size={17}/><span>{item.label}</span>{item.id === 'analyst' && <span className="nav-new">ASK</span>}</button>)}</nav>
      <div className="sidebar-divider" />
      <div className="nav-label">YOUR RESEARCH</div>
      <button className="nav-item" onClick={() => jump('library')}><Bookmark size={17}/><span>Saved companies</span><span className="nav-count">{saved.length}</span></button>
      <button className="nav-item" onClick={() => jump('signals')}><TrendingUp size={17}/><span>Signal watchlist</span><span className="status-dot" /></button>
      <div className="sidebar-bottom">
        <div className="plan-card"><div className="plan-icon"><Zap size={16}/></div><div><strong>GCC Intelligence</strong><span>Live research workspace</span></div><ArrowUpRight size={15}/></div>
        <div className="profile"><div className="avatar">TS</div><div className="profile-info"><strong>Research analyst</strong><span>Session workspace</span></div><Settings2 size={16} className="muted"/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)}><Menu size={19}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{navItems.find(n => n.id === active)?.label || 'Overview'}</strong></div><div className="top-actions"><div className="live-pill"><span/> {signalsStatus}</div><button className="icon-button notification" onClick={() => jump('signals')} aria-label="Open live signal feed" title="Open live signal feed"><Bell size={17}/><i/></button><div className="top-avatar">TS</div></div></header>

      <section className="hero" id="overview">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> GCC INTELLIGENCE / INDIA <span className="eyebrow-pill">BETA 01</span></div>
          <h1>India’s GCC<br/><span>decision layer.</span></h1>
          <p className="hero-description">A sharper view of the companies, cities and signals shaping India’s global capability centres.</p>
          <div className="hero-buttons"><button className="primary-button" onClick={() => jump('directory')}>Explore the directory <ArrowRight size={16}/></button><button className="secondary-button" onClick={() => jump('analyst')}><Radar size={15}/> Ask the research desk</button></div>
          <div className="hero-proof"><div className="proof-avatars"><span>G</span><span>M</span><span>A</span><span>+</span></div><div><strong>Research, connected.</strong><span>Companies / Cities / Live signals / Source links</span></div></div>
        </div>
        <div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="globe-glow"/><GlobeScene/><div className="float-tag tag-north"><span className="tag-pulse"/> INDIA / LIVE SIGNALS</div><div className="float-tag tag-east"><MapPin size={13}/> HYDERABAD <b>NEWS</b></div><div className="float-tag tag-south"><MapPin size={13}/> BENGALURU <b>HUB</b></div><div className="globe-caption"><span>GLOBAL NETWORK</span><span>17°23′N · 78°29′E</span></div></div>
        <div className="hero-bottom-line"><span>INTELLIGENCE THAT MOVES WITH YOU</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></div>
      </section>

      {booting && <div className="brand-loader" role="status" aria-label="Loading GCC Intelligence"><div className="loader-mark"><i/><i/><i/></div><div className="loader-wordmark">gcc<span>intel</span></div><div className="loader-track"><span/></div><small>CONNECTING TO LIVE INTELLIGENCE</small></div>}

      <section className="content-section landscape-section" id="landscape">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> MARKET CONTEXT · INDIA</div><h2>The map is changing. See where.</h2><p className="section-subtitle">Company footprints, city signals and source-linked research — brought into one working view.</p></div><span className="source-stamp"><ShieldCheck size={13}/> SOURCED DATA</span></div>
        <div className="landscape-metrics">{(landscape?.metrics || [{label:'GCCs in India',value:'2,117',detail:'FY26 estimate'},{label:'GCC units',value:'3,728',detail:'Across India'},{label:'Professionals',value:'2.36M',detail:'Installed talent'},{label:'Market revenue',value:'$98.4B',detail:'FY26 estimate'}]).map((metric,i) => <article className="landscape-metric" key={metric.label} style={{'--metric-delay':(i*75)+'ms'}}><span className="metric-index">0{i+1}</span><div className="landscape-value">{metric.value}</div><strong>{metric.label}</strong><span className="landscape-detail">{metric.detail}</span></article>)}</div>
        <div className="capability-strip">{(landscape?.capabilityMetrics || [{label:'GCCs with AI/ML capabilities',value:'1,200+'},{label:'Dedicated Centres of Excellence',value:'250+'},{label:'AI professionals',value:'250,000+'}]).map((item,i) => <div className="capability-stat" key={item.label}><span className="capability-rail">0{i+1}</span><div><strong>{item.value}</strong><span>{item.label}</span></div></div>)}</div>
        <div className="landscape-source-row"><div><Database size={15}/><span>{landscape?.sourceLabel || 'NASSCOM–Zinnov · India GCC Landscape Report 2026'}</span></div><a href={landscape?.sourceUrl || 'https://www.prnewswire.com/in/news-releases/india-s-gccs-are-increasingly-leading-the-ai-mandate-for-global-enterprises-driving-global-value-creation-nasscom--zinnov-report-302817463.html'} target="_blank" rel="noreferrer">Open source <ExternalLink size={13}/></a><span className="source-date">{landscape?.publishedAt || 'Published 3 Jul 2026'}</span></div>
        <div className="city-unit-block"><div className="city-unit-heading"><div><span className="panel-kicker">GLOBAL 2000 FOOTPRINT</span><h3>Where capability clusters.</h3></div><a href={landscape?.citySourceUrl || 'https://zinnov.com/centers-of-excellence/5-reasons-why-bengaluru-is-top-choice-for-your-next-gcc-setup-blog/'} target="_blank" rel="noreferrer">City source <ExternalLink size={12}/></a></div><div className="city-unit-grid">{(landscape?.cityUnits || []).map((city,i) => <article className="city-unit-card" key={city.city}><div className="city-unit-rank">0{i+1}</div><div className="city-unit-name">{city.city}</div><strong>{city.display || (city.units + '+')}</strong><span>Global 2000 units</span><div className="city-unit-track"><i style={{width:Math.min(city.units/320*100,100)+'%'}}/></div></article>)}</div><p className="method-note">{landscape?.methodology || 'City-unit figures are a Global 2000 subset, not all GCCs in each city.'}</p></div>
      </section>

      <section className="content-section" id="signals">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> THE LANDSCAPE</div><h2>India, in focus.</h2><p className="section-subtitle">Live news coverage from the past seven days, with links to original publishers.</p></div><div className="select-wrap"><span>LIVE WINDOW</span><select value={timeframe} onChange={e => setTimeframe(e.target.value)}><option>7 days</option></select><ChevronDown size={13}/></div></div>
        <div className="demo-notice"><span><Activity size={14}/></span><div><strong>{signalsStatus}</strong><p>News mentions only — not verified GCC counts or hiring numbers.</p></div><span className="notice-mark">{liveSignals.length ? 'LIVE' : 'NO DATA'}</span></div>
        <div className="panel signal-panel live-news-panel">
          <div className="panel-heading"><div><span className="panel-kicker">LIVE NEWS MONITOR</span><h3>Latest GCC intelligence signals.</h3></div><span className="demo-label">{liveSignals.length} ARTICLES</span></div>
          {liveSignals.length ? <div className="signal-list">{liveSignals.slice(0, 12).map(item => { const publisherLogo = getPublisherLogoUrl(item); return <article className="signal-item news-signal-item" key={item.id || item.url}><a className="publisher-logo-tile" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={'Open article from ' + (item.domain || 'publisher')} title={'Open ' + (item.domain || 'publisher')}><span className="publisher-logo-fallback">{String(item.domain || 'NEWS').split(/[.\s-]+/).filter(Boolean).map(part => part[0]).join('').slice(0,2).toUpperCase()}</span>{publisherLogo && <img src={publisherLogo} alt="" loading="lazy" onLoad={e => { e.currentTarget.previousElementSibling.style.display = 'none' }} onError={e => { e.currentTarget.style.display = 'none' }}/>}</a><div className="signal-text"><strong><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></strong><p>{item.domain}{item.publishedAt ? ' · ' + item.publishedAt : ''}</p><span className="signal-tag">SOURCE-LINKED NEWS</span></div><a className="icon-button" href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open source article"><ExternalLink size={15}/></a></article> })}</div> : <div className="empty-state live-empty-state"><span className="empty-glass-icon"><Activity size={22}/></span><strong>{signalsRetrying ? 'Reconnecting to live news…' : 'No live headlines received'}</strong><span>We only show publisher-linked articles. No placeholder headlines or fabricated metrics.</span><button className="secondary-button compact" onClick={retryLiveSignals} disabled={signalsRetrying}><Activity size={14}/>{signalsRetrying ? 'Retrying…' : 'Retry live feed'}</button></div>}
          <div className="chart-foot"><span>Source: Public news index · provider shown above</span><span>{signalsUpdatedAt ? 'Updated ' + new Date(signalsUpdatedAt).toLocaleString() : 'Waiting for feed'}</span></div>
        </div>
      </section>

      <section className="content-section directory-section" id="directory">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> COMPANY INTELLIGENCE</div><h2>Know who’s building here.</h2><p className="section-subtitle">Company directory with official-source links. Verify current footprints independently.</p></div><button className="secondary-button compact" onClick={() => { setQuery(''); setSector('All sectors'); setCity('All cities') }}><Filter size={15}/> Reset filters</button></div>
        <div className="panel directory-panel"><div className="directory-toolbar"><div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search company, sector, city or signal…"/><kbd>⌘ K</kbd></div><div className="filter-group"><div className="filter-select"><select value={sector} onChange={e => setSector(e.target.value)}>{sectorOptions.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={13}/></div><div className="filter-select"><select value={city} onChange={e => setCity(e.target.value)}>{cityOptions.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={13}/></div></div></div>
          <div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>SECTOR</th><th>INDIA HUB</th><th>RESEARCH SIGNAL</th><th>SIZE</th><th></th></tr></thead><tbody>{filteredCompanies.map(c => { const articleUrl = getCompanyArticleUrl(c, liveSignals); return <tr key={c.name}><td><div className="company-cell"><a className="company-brand-link" href={articleUrl} target="_blank" rel="noopener noreferrer" title={articleUrl !== c.source ? 'Open matching news article' : 'Open official company news'}><div className={'company-logo logo-' + (c.name.charCodeAt(0) % 5)}><span className="company-logo-fallback">{c.name.split(/\s/).map(s => s[0]).join('').slice(0,2)}</span><img src={getCompanyLogoUrl(c)} alt={c.name + ' logo'} loading="lazy" onLoad={e => { const fallback = e.currentTarget.previousElementSibling; if (fallback) fallback.style.display = 'none' }} onError={e => { const img = e.currentTarget; if (img.dataset.fallback !== '1') { img.dataset.fallback = '1'; img.src = getCompanyFallbackLogoUrl(c); } else { img.style.display = 'none'; } }}/></div></a><div><a className="company-name-link" href={articleUrl} target="_blank" rel="noopener noreferrer" title="Open related article or official news">{c.name}</a><span>Reference company · verify current footprint</span></div></div></td><td><span className="sector-chip">{c.sector}</span></td><td><span className="hub-cell"><MapPin size={12}/>{c.city}</span></td><td><span className="signal-cell">{(() => { const match = liveSignals.find(item => item.title?.toLowerCase().includes(c.name.toLowerCase())); return match ? <a className="company-evidence-link" href={match.url} target="_blank" rel="noreferrer">Live news match <ExternalLink size={11}/></a> : c.signal })()}</span></td><td><span className="size-chip">{c.size}</span></td><td><div className="row-actions"><button className={'icon-button save-button ' + (saved.includes(c.name) ? 'is-saved' : '')} onClick={() => toggleSaved(c.name)} title="Save company"><Bookmark size={15}/></button><a className="icon-button" href={c.source} target="_blank" rel="noreferrer" title="Open official source"><ExternalLink size={15}/></a></div></td></tr> })}</tbody></table>{filteredCompanies.length === 0 && <div className="empty-state"><Search size={20}/><strong>No matching companies</strong><span>Try a different search or clear your filters.</span></div>}</div>
          <div className="table-footer"><span>Showing <strong>{filteredCompanies.length}</strong> of {companyData.length} reference companies</span><span><span className="source-dot"/> Official-source links included · Verify current footprint independently</span></div>
        </div>
      </section>

      <section className="content-section cities-section" id="cities">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> LIVE LOCATION SIGNALS</div><h2>Follow the city coverage.</h2><p className="section-subtitle">Explore city coverage using live news matches.</p></div><div className="select-wrap"><span>FOCUS CITY</span><select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>{cityData.map(c => <option key={c.city}>{c.city}</option>)}</select><ChevronDown size={13}/></div></div>
        <div className="city-detail-grid">
          <div className="panel city-detail-card">
            <div className="city-detail-top"><div><span className="panel-kicker">SELECTED CITY</span><h3>{selectedCity}</h3><p>{cityData.find(c => c.city === selectedCity)?.focus}</p></div><div className="city-orb" style={{'--orb-color': cityData.find(c => c.city === selectedCity)?.hue}}><MapPin size={25}/></div></div>
            <div className="city-detail-score"><span>Live news headlines mentioning this city</span><strong>{citySignalCount(selectedCity)}<small> matches</small></strong></div>
            <div className="score-track"><span style={{width: Math.min(citySignalCount(selectedCity) * 12, 100) + '%', background: cityData.find(c => c.city === selectedCity)?.hue}}/></div>
            <div className="city-facts"><div><span>FEED WINDOW</span><strong>7<small> days</small></strong></div><div><span>LIVE ARTICLES</span><strong>{liveSignals.length}</strong></div><div><span>FEED STATUS</span><strong className="momentum">{liveSignals.length ? 'LIVE' : 'OFFLINE'}</strong></div></div>
            <div className="city-disclaimer"><CircleHelp size={14}/> News mentions measure media coverage only; they do not represent GCC count, hiring volume, talent supply, or city cost.</div>
          </div>
          <div className="panel compare-card"><div className="panel-heading"><div><span className="panel-kicker">LIVE COVERAGE COMPARISON</span><h3>News mentions by city.</h3></div><span className="demo-label">{signalsStatus}</span></div><div className="compare-head"><span>CITY</span><span>MENTIONS</span><span>FOCUS</span><span>STATUS</span></div>{cityData.map(c => <button className={'compare-row ' + (selectedCity === c.city ? 'chosen' : '')} key={c.city} onClick={() => setSelectedCity(c.city)}><span className="compare-city"><i style={{background:c.hue}}/>{c.city}</span><span>{citySignalCount(c.city)}</span><span>{c.focus}</span><span className="momentum">{liveSignals.length ? 'LIVE FEED' : 'NO DATA'}</span></button>)}</div>
        </div>
      </section>

      <section className="content-section analyst-section" id="analyst">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> GCC RESEARCH DESK</div><h2>Make the next move clearer.</h2><p className="section-subtitle">Grounded research answers using current news evidence when available.</p></div><div className="ai-status"><span/> SOURCE-GROUNDED / LIVE RESEARCH</div></div>
        <div className="analyst-layout"><div className="analyst-intro"><div className="ai-orb"><div className="ai-orb-inner"><Radar size={28}/></div><span className="orb-ring ring-a"/><span className="orb-ring ring-b"/></div><h3>A clearer view.<br/><span>One decision at a time.</span></h3><p>Use prompts to shape a city shortlist, identify sector clusters, or turn an emerging signal into a structured research brief.</p><div className="capability-list"><span><Check size={14}/> City comparisons</span><span><Check size={14}/> Company discovery</span><span><Check size={14}/> Research brief drafts</span></div><div className="connect-note"><Database size={15}/><span>Research answers use the configured server endpoint and available current news. Unsupported market claims are not invented.</span></div></div>
          <div className="panel chat-panel"><div className="chat-header"><div className="chat-avatar"><Radar size={16}/></div><div><strong>GCC Research Desk</strong><span><i/> Research desk · Current news evidence</span></div><button className="icon-button" onClick={() => setMessages([{role:'assistant',text:'Hi. I’m your GCC research copilot. I can answer from current news coverage when the live feed is available. I will not invent city scores, hiring numbers, or market metrics.'}])} title="Reset chat"><Activity size={16}/></button></div><div className="chat-messages">{messages.map((m,i) => <div className={'chat-message ' + m.role} key={i}>{m.role === 'assistant' && <div className="message-avatar"><Radar size={13}/></div>}<div className="message-bubble">{m.text}</div></div>)}</div><div className="prompt-chips"><button onClick={() => ask('Compare Bengaluru and Hyderabad for an AI GCC')}>Compare tech hubs <ArrowUpRight size={12}/></button><button onClick={() => ask('Which cities are more affordable?')}>Explore cost signals <ArrowUpRight size={12}/></button><button onClick={() => ask('Build a BFSI company shortlist')}>Find BFSI companies <ArrowUpRight size={12}/></button></div><form className="chat-input-row" onSubmit={e => {e.preventDefault(); ask()}}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about cities, companies or sector signals…"/><button type="submit" disabled={!question.trim() || isAsking} aria-label="Send message"><Send size={16}/></button></form><div className="chat-footnote">Server-side AI endpoint · Responses can be wrong; verify important claims.</div><div style={{padding:'0 14px 14px',display:'flex',justifyContent:'flex-end'}}><button className="text-button" onClick={saveLatestReport} disabled={isAsking || messages[messages.length - 1]?.text === 'Thinking…'}><Bookmark size={13}/> Save latest answer</button></div></div></div>
      </section>

      <section className="content-section" id="library">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR WORKSPACE</div><h2>Research library.</h2><p className="section-subtitle">Saved companies and research answers, kept in one place.</p></div><span className="demo-label">{reportStatus}</span></div>
        <div className="overview-grid">
          <article className="panel city-panel">
            <div className="panel-heading"><div><span className="panel-kicker">SAVED COMPANIES</span><h3>Your shortlist</h3></div><span className="demo-label">{saved.length} SAVED</span></div>
            {saved.length ? <div className="signal-list">{saved.map(name => { const company = companyData.find(c => c.name === name) || companies.find(c => c.name === name); const logoUrl = company ? getCompanyLogoUrl(company) : ''; const initials = name.split(/\s+/).map(part => part[0]).join('').slice(0,2).toUpperCase(); return <div className="signal-item saved-company-item" key={name}><div className="saved-company-logo"><span className="saved-company-logo-fallback">{initials}</span>{logoUrl && <img src={logoUrl} alt={name + ' logo'} loading="lazy" onLoad={e => { e.currentTarget.previousElementSibling.style.display = 'none' }} onError={e => { const img = e.currentTarget; if (img.dataset.fallback !== '1' && company) { img.dataset.fallback = '1'; img.src = getCompanyFallbackLogoUrl(company); } else { img.style.display = 'none'; } }}/>}</div><div className="signal-text"><strong>{name}</strong><p>{company ? company.city + ' · ' + company.sector : 'Saved company'}</p></div><button className="icon-button" onClick={() => toggleSaved(name)} aria-label={'Remove ' + name}><X size={14}/></button></div> })}</div> : <div className="empty-state"><Bookmark size={20}/><strong>No saved companies yet</strong><span>Save a company from the directory to start a shortlist.</span><button className="text-button" onClick={() => jump('directory')}>Browse directory <ArrowRight size={13}/></button></div>}
          </article>
          <article className="panel city-panel">
            <div className="panel-heading"><div><span className="panel-kicker">RESEARCH REPORTS</span><h3>Saved research</h3></div><span className="demo-label">{reports.length} REPORTS</span></div>
            {reports.length ? <div className="signal-list">{reports.map(report => <div className="signal-item" key={report.id}><div className="signal-symbol blue"><Radar size={16}/></div><div className="signal-text"><strong>{report.title}</strong><p>{report.body}</p><span className="signal-tag">{new Date(report.created_at).toLocaleDateString()}</span></div><button className="icon-button" onClick={() => deleteReport(report)} aria-label="Delete report"><X size={14}/></button></div>)}</div> : <div className="empty-state"><Database size={20}/><strong>No reports saved</strong><span>Ask a research question, then choose “Save latest answer”.</span><button className="text-button" onClick={() => jump('analyst')}>Open research desk <ArrowRight size={13}/></button></div>}
          </article>
        </div>
      </section>

      <footer className="footer"><div className="footer-brand"><div className="brand-mark small"><span/><span/><span/></div><span>gcc<span className="footer-purple">intel</span></span></div><span>BUILT FOR THE NEXT WAVE OF GLOBAL CAPABILITY.</span><div className="footer-right"><span><span className="footer-status"/> SYSTEM ONLINE</span><span>v0.2.0 · LIVE NEWS</span></div></footer>
    </main>
  </div>
}

export default App