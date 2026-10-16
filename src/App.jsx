import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Bookmark,
  Building2, Check, ChevronDown, CircleHelp, Command, Compass, Database, Download,
  ExternalLink, Filter, Globe2, Layers3, MapPin, Menu, MessageSquareText, Search,
  Send, Settings2, ShieldCheck, Sparkles, Target, TrendingUp, Users, X, Zap
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
  { city: 'Bengaluru', score: 94, talent: 96, cost: 74, momentum: '+18%', focus: 'Product, AI & engineering', hue: '#9b8cff' },
  { city: 'Hyderabad', score: 91, talent: 91, cost: 82, momentum: '+22%', focus: 'Cloud, pharma & enterprise tech', hue: '#67d8ff' },
  { city: 'Pune', score: 84, talent: 84, cost: 86, momentum: '+14%', focus: 'Engineering & manufacturing', hue: '#f3b96a' },
  { city: 'Chennai', score: 82, talent: 81, cost: 88, momentum: '+12%', focus: 'Auto, BFSI & SaaS', hue: '#80e0bb' },
  { city: 'Gurugram', score: 80, talent: 82, cost: 69, momentum: '+11%', focus: 'BFSI, consulting & analytics', hue: '#f38cba' },
  { city: 'Mumbai', score: 78, talent: 78, cost: 61, momentum: '+9%', focus: 'Finance, risk & fintech', hue: '#ff9b75' }
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: Layers3 },
  { id: 'directory', label: 'GCC directory', icon: Building2 },
  { id: 'cities', label: 'City intelligence', icon: Globe2 },
  { id: 'signals', label: 'Market signals', icon: Activity },
  { id: 'analyst', label: 'AI analyst', icon: Sparkles },
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
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
      let pointerX = 0, pointerY = 0
      const move = (event) => {
        const rect = mount.getBoundingClientRect()
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.25
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.18
      }
      mount.addEventListener('pointermove', move)
      const animate = () => {
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
  const [active, setActive] = useState('overview')
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All sectors')
  const [city, setCity] = useState('All cities')
  const [selectedCity, setSelectedCity] = useState('Bengaluru')
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('gcc-intel-saved') || '[]') } catch { return [] } })
  const [reports, setReports] = useState([])
  const [reportStatus, setReportStatus] = useState('Loading saved research…')
  const [mobileNav, setMobileNav] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi. I’m your GCC research copilot. Ask me to compare cities, map competitors, or build a shortlist. I’ll keep this prototype’s sample data clearly labelled.' }
  ])
  const [timeframe, setTimeframe] = useState('12 months')

  useEffect(() => {
    try { localStorage.setItem('gcc-intel-saved', JSON.stringify(saved)) } catch { /* storage may be unavailable */ }
  }, [saved])

  useEffect(() => {
    let cancelled = false
    fetch('/api/session', { credentials: 'same-origin' })
      .then(response => response.ok ? fetch('/api/saved', { credentials: 'same-origin' }) : Promise.reject(new Error('Session unavailable')))
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Saved list unavailable')))
      .then(payload => { if (!cancelled && Array.isArray(payload.data)) setSaved(payload.data.map(item => item.name)) })
      .catch(() => { /* Local saved list remains available without database configuration. */ })
    fetch('/api/session', { credentials: 'same-origin' })
      .then(response => response.ok ? fetch('/api/reports', { credentials: 'same-origin' }) : Promise.reject(new Error('Session unavailable')))
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Reports API unavailable')))
      .then(payload => { if (!cancelled && Array.isArray(payload.data)) { setReports(payload.data); setReportStatus('Synced to your research session') } else if (!cancelled) setReportStatus('No saved reports yet') })
      .catch(() => { if (!cancelled) setReportStatus('Local session · add DATABASE_URL to enable cloud persistence') })
    fetch('/api/directory')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Directory API unavailable')))
      .then(payload => { if (!cancelled && Array.isArray(payload.data)) setCompanyData(payload.data) })
      .catch(() => { /* Keep the bundled demo data available when running without serverless functions. */ })
    return () => { cancelled = true }
  }, [])

  const filteredCompanies = useMemo(() => companyData.filter(c =>
    (c.name + ' ' + c.sector + ' ' + c.city + ' ' + c.signal).toLowerCase().includes(query.toLowerCase()) &&
    (sector === 'All sectors' || c.sector === sector) &&
    (city === 'All cities' || c.city === city)
  ), [query, sector, city])

  const ask = async (text = question) => {
    const q = text.trim()
    if (!q) return
    let answer = 'Based on the illustrative sample dataset, start with Bengaluru and Hyderabad for a broad technology-led GCC search, then validate role mix, hiring activity, compensation, and office footprint against current primary sources before making a decision.'
    const lower = q.toLowerCase()
    if (lower.includes('cheapest') || lower.includes('cost') || lower.includes('affordable')) answer = 'In this prototype’s illustrative cost index, Chennai (88), Pune (86), and Hyderabad (82) score above Bengaluru (74). These are directional demo indices—not real estate quotes or verified salary benchmarks. Validate current compensation and occupancy costs before shortlisting.'
    else if (lower.includes('bank') || lower.includes('finance') || lower.includes('bfsi')) answer = 'For a BFSI-led shortlist, explore Mumbai, Bengaluru, Gurugram, and Hyderabad. The sample directory includes JPMorgan Chase, Goldman Sachs, American Express, and Wells Fargo as starting points. Confirm each company’s current team scope and hiring signals from its official newsroom or careers page.'
    else if (lower.includes('ai') || lower.includes('technology') || lower.includes('tech')) answer = 'For AI and technology capability, start with Bengaluru and Hyderabad, then compare Pune and Chennai by talent availability and role fit. Sample company signals include product engineering, AI research, cloud platforms, and enterprise technology. Treat these as research prompts rather than verified live hiring signals.'
    else if (lower.includes('company') || lower.includes('competitor') || lower.includes('directory')) answer = 'The prototype directory contains ' + companies.length + ' sample company records across ' + [...new Set(companies.map(c => c.sector))].length + ' sectors. Use the directory filters to narrow by sector and city; each record links to an official company newsroom or site for follow-up verification.'
    else if (lower.includes('hyderabad') || lower.includes('bengaluru') || lower.includes('bangalore')) answer = 'Bengaluru’s illustrative talent score is 96 and Hyderabad’s is 91; Hyderabad’s momentum marker is +22% versus Bengaluru’s +18% in this demo. These are mock values to demonstrate the comparison workflow, not sourced market statistics.'
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
    } catch {
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.text === 'Thinking…' ? { ...m, text: answer + ' (Local demo response — configure GROQ_API_KEY on the server to enable live answers.)' } : m))
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
      const response = await fetch('/api/reports', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: userQuestion.slice(0, 90), prompt: userQuestion, body: answer, model: 'groq-or-demo' }) })
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
      <nav>{navItems.map(item => <button key={item.id} onClick={() => jump(item.id)} className={'nav-item ' + (active === item.id ? 'active' : '')}><item.icon size={17}/><span>{item.label}</span>{item.id === 'analyst' && <span className="nav-new">AI</span>}</button>)}</nav>
      <div className="sidebar-divider" />
      <div className="nav-label">YOUR RESEARCH</div>
      <button className="nav-item" onClick={() => jump('library')}><Bookmark size={17}/><span>Saved companies</span><span className="nav-count">{saved.length}</span></button>
      <button className="nav-item" onClick={() => jump('signals')}><TrendingUp size={17}/><span>Signal watchlist</span><span className="status-dot" /></button>
      <div className="sidebar-bottom">
        <div className="plan-card"><div className="plan-icon"><Zap size={16}/></div><div><strong>Intel Pro workspace</strong><span>Prototype environment</span></div><ArrowUpRight size={15}/></div>
        <div className="profile"><div className="avatar">TS</div><div className="profile-info"><strong>Research analyst</strong><span>Local demo session</span></div><Settings2 size={16} className="muted"/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)}><Menu size={19}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{navItems.find(n => n.id === active)?.label || 'Overview'}</strong></div><div className="top-actions"><div className="live-pill"><span/> DATA DEMO</div><button className="icon-button notification" aria-label="Notifications"><Bell size={17}/><i/></button><div className="top-avatar">TS</div></div></header>

      <section className="hero" id="overview">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> GCC INTELLIGENCE / INDIA <span className="eyebrow-pill">BETA 01</span></div>
          <h1>See the future<br/>of <span>global capability.</span></h1>
          <p className="hero-description">A sharper view of India’s GCC landscape. Discover talent hubs, map company footprints, and turn fragmented market signals into your next strategic move.</p>
          <div className="hero-buttons"><button className="primary-button" onClick={() => jump('directory')}>Explore the ecosystem <ArrowRight size={16}/></button><button className="secondary-button" onClick={() => jump('analyst')}><Sparkles size={15}/> Ask the AI analyst</button></div>
          <div className="hero-proof"><div className="proof-avatars"><span>G</span><span>M</span><span>A</span><span>+</span></div><div><strong>One view. Better decisions.</strong><span>Company intelligence · City insights · Research copilot</span></div></div>
        </div>
        <div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="globe-glow"/><GlobeScene/><div className="float-tag tag-north"><span className="tag-pulse"/> INDIA / 06 HUBS</div><div className="float-tag tag-east"><MapPin size={13}/> HYDERABAD <b>+22%</b></div><div className="float-tag tag-south"><MapPin size={13}/> BENGALURU <b>CORE</b></div><div className="globe-caption"><span>GLOBAL NETWORK</span><span>17°23′N · 78°29′E</span></div></div>
        <div className="hero-bottom-line"><span>INTELLIGENCE THAT MOVES WITH YOU</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></div>
      </section>

      <section className="content-section" id="signals">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> THE LANDSCAPE</div><h2>India, in focus.</h2><p className="section-subtitle">A live-feeling command centre for your GCC research workflow.</p></div><div className="select-wrap"><span>HORIZON</span><select value={timeframe} onChange={e => setTimeframe(e.target.value)}><option>12 months</option><option>6 months</option><option>24 months</option></select><ChevronDown size={13}/></div></div>
        <div className="demo-notice"><span><Activity size={14}/></span><div><strong>Prototype data environment</strong><p>Metrics and momentum indicators below are illustrative UI data, not verified market statistics. Company names link to official sources for independent validation.</p></div><span className="notice-mark">DEMO</span></div>
        <div className="metrics-grid">
          <MetricCard label="COMPANY RECORDS" value="16" delta="+4.8%" icon={Building2} foot="In this sample directory" bars={[28,42,34,58,49,73,61,85]} />
          <MetricCard label="CITY HUBS MAPPED" value="06" delta="+2 hubs" icon={Globe2} foot="Illustrative coverage map" bars={[35,32,47,44,66,60,77,84]} color="cyan"/>
          <MetricCard label="SECTOR CLUSTERS" value="05" delta="+1 cluster" icon={Target} foot="Across demo records" bars={[25,39,32,53,48,68,59,80]} color="orange"/>
          <MetricCard label="RESEARCH SIGNALS" value="24" delta="Demo" icon={Activity} foot="Sample research prompts" bars={[38,28,51,44,61,53,75,68]} color="green"/>
        </div>
        <div className="overview-grid">
          <article className="panel city-panel"><div className="panel-heading"><div><span className="panel-kicker">01 / CITY INTELLIGENCE</span><h3>Where capability clusters.</h3></div><button className="text-button" onClick={() => jump('cities')}>Compare cities <ArrowRight size={14}/></button></div><div className="city-chart">{cityData.slice(0,5).map((c,i) => <button className="city-row" key={c.city} onClick={() => { setSelectedCity(c.city); jump('cities') }}><span className="city-rank">0{i+1}</span><span className="city-name">{c.city}</span><div className="bar-track"><div className="bar-fill" style={{width: c.score + '%', background: 'linear-gradient(90deg, ' + c.hue + ', ' + c.hue + '55)'}}/></div><span className="city-score">{c.score}</span><span className="city-momentum">{c.momentum}</span></button>)}</div><div className="chart-foot"><span><i className="legend-dot"/> Illustrative capability score (0–100)</span><span>Not a market benchmark</span></div></article>
          <article className="panel signal-panel"><div className="panel-heading"><div><span className="panel-kicker">02 / SIGNAL RADAR</span><h3>What to watch next.</h3></div><div className="radar-icon"><Activity size={17}/></div></div><div className="signal-list"><div className="signal-item"><div className="signal-symbol purple"><Sparkles size={16}/></div><div className="signal-text"><strong>AI capability build-out</strong><p>Track new AI labs, platform teams, and research roles.</p><span className="signal-tag">TECHNOLOGY</span></div><ArrowUpRight size={15} className="muted"/></div><div className="signal-item"><div className="signal-symbol blue"><Layers3 size={16}/></div><div className="signal-text"><strong>Multi-city operating models</strong><p>Compare talent depth with cost and retention needs.</p><span className="signal-tag">LOCATION STRATEGY</span></div><ArrowUpRight size={15} className="muted"/></div><div className="signal-item"><div className="signal-symbol amber"><ShieldCheck size={16}/></div><div className="signal-text"><strong>Risk & resilience teams</strong><p>Map BFSI and enterprise control functions.</p><span className="signal-tag">BFSI</span></div><ArrowUpRight size={15} className="muted"/></div></div><button className="panel-bottom-link" onClick={() => jump('analyst')}>Turn a signal into a research brief <ArrowRight size={14}/></button></article>
        </div>
      </section>

      <section className="content-section directory-section" id="directory">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> COMPANY INTELLIGENCE</div><h2>Know who’s building here.</h2><p className="section-subtitle">Search the sample directory, filter by footprint, and open primary-source links.</p></div><button className="secondary-button compact" onClick={() => { setQuery(''); setSector('All sectors'); setCity('All cities') }}><Filter size={15}/> Reset filters</button></div>
        <div className="panel directory-panel"><div className="directory-toolbar"><div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search company, sector, city or signal…"/><kbd>⌘ K</kbd></div><div className="filter-group"><div className="filter-select"><select value={sector} onChange={e => setSector(e.target.value)}>{sectorOptions.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={13}/></div><div className="filter-select"><select value={city} onChange={e => setCity(e.target.value)}>{cityOptions.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={13}/></div></div></div>
          <div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>SECTOR</th><th>INDIA HUB</th><th>RESEARCH SIGNAL</th><th>SIZE</th><th></th></tr></thead><tbody>{filteredCompanies.map(c => <tr key={c.name}><td><div className="company-cell"><div className={'company-logo logo-' + (c.name.charCodeAt(0) % 5)}>{c.name.split(/\s/).map(s => s[0]).join('').slice(0,2)}</div><div><strong>{c.name}</strong><span>Sample record</span></div></div></td><td><span className="sector-chip">{c.sector}</span></td><td><span className="hub-cell"><MapPin size={12}/>{c.city}</span></td><td><span className="signal-cell">{c.signal}</span></td><td><span className="size-chip">{c.size}</span></td><td><div className="row-actions"><button className={'icon-button save-button ' + (saved.includes(c.name) ? 'is-saved' : '')} onClick={() => toggleSaved(c.name)} title="Save company"><Bookmark size={15}/></button><a className="icon-button" href={c.source} target="_blank" rel="noreferrer" title="Open official source"><ExternalLink size={15}/></a></div></td></tr>)}</tbody></table>{filteredCompanies.length === 0 && <div className="empty-state"><Search size={20}/><strong>No matching companies</strong><span>Try a different search or clear your filters.</span></div>}</div>
          <div className="table-footer"><span>Showing <strong>{filteredCompanies.length}</strong> of {companies.length} sample records</span><span><span className="source-dot"/> Official-source links included · Verify current footprint independently</span></div>
        </div>
      </section>

      <section className="content-section cities-section" id="cities">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> LOCATION STRATEGY</div><h2>Choose your next hub.</h2><p className="section-subtitle">Explore how the city comparison experience works with editable city selection.</p></div><div className="select-wrap"><span>FOCUS CITY</span><select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>{cityData.map(c => <option key={c.city}>{c.city}</option>)}</select><ChevronDown size={13}/></div></div>
        <div className="city-detail-grid"><div className="panel city-detail-card"><div className="city-detail-top"><div><span className="panel-kicker">SELECTED CITY</span><h3>{selectedCity}</h3><p>{cityData.find(c => c.city === selectedCity)?.focus}</p></div><div className="city-orb" style={{'--orb-color': cityData.find(c => c.city === selectedCity)?.hue}}><MapPin size={25}/></div></div><div className="city-detail-score"><span>Illustrative capability score</span><strong>{cityData.find(c => c.city === selectedCity)?.score}<small>/100</small></strong></div><div className="score-track"><span style={{width: cityData.find(c => c.city === selectedCity)?.score + '%', background: cityData.find(c => c.city === selectedCity)?.hue}}/></div><div className="city-facts"><div><span>TALENT INDEX</span><strong>{cityData.find(c => c.city === selectedCity)?.talent}<small>/100</small></strong></div><div><span>COST INDEX</span><strong>{cityData.find(c => c.city === selectedCity)?.cost}<small>/100</small></strong></div><div><span>DEMO MOMENTUM</span><strong className="momentum">{cityData.find(c => c.city === selectedCity)?.momentum}</strong></div></div><div className="city-disclaimer"><CircleHelp size={14}/> All scores are mock values used to demonstrate the product. Replace with sourced methodology and current market data.</div></div>
          <div className="panel compare-card"><div className="panel-heading"><div><span className="panel-kicker">CITY BENCHMARK</span><h3>Compare the hubs.</h3></div><span className="demo-label">ILLUSTRATIVE</span></div><div className="compare-head"><span>CITY</span><span>TALENT</span><span>COST</span><span>MOMENTUM</span></div>{cityData.map(c => <button className={'compare-row ' + (selectedCity === c.city ? 'chosen' : '')} key={c.city} onClick={() => setSelectedCity(c.city)}><span className="compare-city"><i style={{background:c.hue}}/>{c.city}</span><span>{c.talent}</span><span>{c.cost}</span><span className="momentum">{c.momentum}</span></button>)}</div></div>
      </section>

      <section className="content-section analyst-section" id="analyst">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> RESEARCH COPILOT</div><h2>Ask better questions.</h2><p className="section-subtitle">A conversational interface ready to connect to your Groq API.</p></div><div className="ai-status"><span/> GROQ-READY / SERVER KEY REQUIRED</div></div>
        <div className="analyst-layout"><div className="analyst-intro"><div className="ai-orb"><div className="ai-orb-inner"><Sparkles size={28}/></div><span className="orb-ring ring-a"/><span className="orb-ring ring-b"/></div><h3>Research, without<br/><span>the blank page.</span></h3><p>Use prompts to shape a city shortlist, identify sector clusters, or turn an emerging signal into a structured research brief.</p><div className="capability-list"><span><Check size={14}/> City comparisons</span><span><Check size={14}/> Company discovery</span><span><Check size={14}/> Research brief drafts</span></div><div className="connect-note"><Database size={15}/><span>Demo responses are local. Add your Groq endpoint on the server before enabling live AI.</span></div></div>
          <div className="panel chat-panel"><div className="chat-header"><div className="chat-avatar"><Sparkles size={16}/></div><div><strong>GCC Research Analyst</strong><span><i/> Groq endpoint · Demo market data</span></div><button className="icon-button" onClick={() => setMessages([{role:'assistant',text:'Hi. I’m your GCC research copilot. Ask me to compare cities, map competitors, or build a shortlist. I’ll keep this prototype’s sample data clearly labelled.'}])} title="Reset chat"><Activity size={16}/></button></div><div className="chat-messages">{messages.map((m,i) => <div className={'chat-message ' + m.role} key={i}>{m.role === 'assistant' && <div className="message-avatar"><Sparkles size={13}/></div>}<div className="message-bubble">{m.text}</div></div>)}</div><div className="prompt-chips"><button onClick={() => ask('Compare Bengaluru and Hyderabad for an AI GCC')}>Compare tech hubs <ArrowUpRight size={12}/></button><button onClick={() => ask('Which cities are more affordable?')}>Explore cost signals <ArrowUpRight size={12}/></button><button onClick={() => ask('Build a BFSI company shortlist')}>Find BFSI companies <ArrowUpRight size={12}/></button></div><form className="chat-input-row" onSubmit={e => {e.preventDefault(); ask()}}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about cities, companies or sector signals…"/><button type="submit" disabled={!question.trim()} aria-label="Send message"><Send size={16}/></button></form><div className="chat-footnote">Server-side AI endpoint · Responses can be wrong; verify important claims.</div><div style={{padding:'0 14px 14px',display:'flex',justifyContent:'flex-end'}}><button className="text-button" onClick={saveLatestReport}><Bookmark size={13}/> Save latest answer</button></div></div></div>
      </section>

      <section className="content-section" id="library">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR WORKSPACE</div><h2>Research library.</h2><p className="section-subtitle">Saved companies and research answers, kept in one place.</p></div><span className="demo-label">{reportStatus}</span></div>
        <div className="overview-grid">
          <article className="panel city-panel">
            <div className="panel-heading"><div><span className="panel-kicker">SAVED COMPANIES</span><h3>Your shortlist</h3></div><span className="demo-label">{saved.length} SAVED</span></div>
            {saved.length ? <div className="signal-list">{saved.map(name => { const company = companyData.find(c => c.name === name) || companies.find(c => c.name === name); return <div className="signal-item" key={name}><div className="signal-symbol purple"><Building2 size={16}/></div><div className="signal-text"><strong>{name}</strong><p>{company ? company.city + ' · ' + company.sector : 'Saved company'}</p></div><button className="icon-button" onClick={() => toggleSaved(name)} aria-label={'Remove ' + name}><X size={14}/></button></div> })}</div> : <div className="empty-state"><Bookmark size={20}/><strong>No saved companies yet</strong><span>Save a company from the directory to start a shortlist.</span><button className="text-button" onClick={() => jump('directory')}>Browse directory <ArrowRight size={13}/></button></div>}
          </article>
          <article className="panel city-panel">
            <div className="panel-heading"><div><span className="panel-kicker">RESEARCH REPORTS</span><h3>Saved AI answers</h3></div><span className="demo-label">{reports.length} REPORTS</span></div>
            {reports.length ? <div className="signal-list">{reports.map(report => <div className="signal-item" key={report.id}><div className="signal-symbol blue"><Sparkles size={16}/></div><div className="signal-text"><strong>{report.title}</strong><p>{report.body}</p><span className="signal-tag">{new Date(report.created_at).toLocaleDateString()}</span></div><button className="icon-button" onClick={() => deleteReport(report)} aria-label="Delete report"><X size={14}/></button></div>)}</div> : <div className="empty-state"><Database size={20}/><strong>No reports saved</strong><span>Ask the AI analyst a question, then choose “Save latest answer”.</span><button className="text-button" onClick={() => jump('analyst')}>Open AI analyst <ArrowRight size={13}/></button></div>}
          </article>
        </div>
        <p className="section-subtitle" style={{marginTop:14}}>Cloud persistence requires a Neon PostgreSQL DATABASE_URL. Without it, saved items use local/session fallback.</p>
      </section>

      <footer className="footer"><div className="footer-brand"><div className="brand-mark small"><span/><span/><span/></div><span>gcc<span className="footer-purple">intel</span></span></div><span>BUILT FOR THE NEXT WAVE OF GLOBAL CAPABILITY.</span><div className="footer-right"><span><span className="footer-status"/> SYSTEM ONLINE</span><span>v0.1.0 · DEMO</span></div></footer>
    </main>
  </div>
}

export default App