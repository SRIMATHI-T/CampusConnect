import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, BookOpen, CalendarDays, CheckCircle2, FileText, GraduationCap, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { api, uploadUrl } from '../services/api';

const CATEGORIES = ['All', 'General', 'Exam', 'Placement', 'Event'];

const pillars = [
  {
    icon: BookOpen,
    title: 'Academic & Exam Circulars',
    text: 'Access examination schedules, hall ticket notices, seating allocations, and semester grade updates without delay.'
  },
  {
    icon: GraduationCap,
    title: 'Placements & Opportunities',
    text: 'Stay informed on recruitment drives, company visit details, eligibility guidelines, and application deadlines.'
  },
  {
    icon: CalendarDays,
    title: 'Campus Events & Activities',
    text: 'Discover workshops, technical symposiums, sports tournaments, club meetings, and extracurricular opportunities.'
  }
];

export default function Home() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api('/notices/public')
      .then(d => setNotices(d.items || []))
      .catch(() => setNotices([]));
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchCat = category === 'All' || n.category === category;
      const matchSearch =
        !search.trim() ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [notices, category, search]);

  const topLiveNotices = notices.slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> OFFICIAL CAMPUS INFORMATION & NOTICES
              </div>
              <h1>
                Your campus announcements,
                <br />
                <span>clear & connected.</span>
              </h1>
              <p className="hero-lead">
                A single, dependable bulletin for real-time announcements, examination alerts, placement drives, and campus life — designed for students and faculty.
              </p>
              <div className="hero-actions">
                {user ? (
                  <>
                    <Link
                      className="button button-primary"
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    >
                      Go to Dashboard <ArrowRight size={16} />
                    </Link>
                    <a className="button button-outline" href="#notices">
                      Browse notices <ArrowDownRight size={16} />
                    </a>
                  </>
                ) : (
                  <>
                    <Link className="button button-primary" to="/signup">
                      Get started <ArrowRight size={16} />
                    </Link>
                    <Link className="button button-outline" to="/login">
                      Student sign in
                    </Link>
                    <a className="hero-explore-link" href="#notices">
                      Explore notices <ArrowDownRight size={15} />
                    </a>
                  </>
                )}
              </div>
              <div className="hero-badges-row">
                <span className="hero-badge-pill">
                  <CheckCircle2 size={13} /> Verified circulars
                </span>
                <span className="hero-badge-pill">
                  <Sparkles size={13} /> Real-time alerts
                </span>
                <span className="hero-badge-pill">
                  <FileText size={13} /> Direct attachments
                </span>
              </div>
            </div>

            {/* Live Board Preview Card */}
            <div className="hero-visual">
              <div className="visual-glow" />
              <div className="live-board-card">
                <div className="live-board-head">
                  <span className="live-status-pill">
                    <span className="pulse-dot" /> LIVE BULLETIN
                  </span>
                  <span className="live-date-label">Latest updates</span>
                </div>

                <div className="live-board-list">
                  {topLiveNotices.length > 0 ? (
                    topLiveNotices.map(n => (
                      <button
                        key={n._id}
                        type="button"
                        className="live-item"
                        onClick={() => setDetail(n)}
                      >
                        <div className="live-item-content">
                          <div className="live-item-meta">
                            <span className={`category-pill cat-${(n.category || 'general').toLowerCase()}`}>
                              {n.category}
                            </span>
                            <span>
                              {new Date(n.date).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                          <h4 className="live-item-title">{n.title}</h4>
                        </div>
                        <ArrowUpRight size={15} className="live-item-arrow" />
                      </button>
                    ))
                  ) : (
                    <div className="live-board-empty">
                      <BellRing size={20} />
                      <span>Notices will appear here as posted by administration.</span>
                    </div>
                  )}
                </div>

                <div className="live-board-foot">
                  <BookOpen size={14} />
                  <span>Direct from campus departments & administration</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-bottom container">
            <span>OFFICIAL CAMPUS DIGITAL NOTICE BOARD</span>
            <a href="#notices">
              View all circulars <ArrowDownRight size={14} />
            </a>
          </div>
        </section>

        {/* Notices Board Section */}
        <section className="section notice-section" id="notices">
          <div className="container">
            <div className="section-heading notice-heading">
              <div>
                <div className="eyebrow dark-eyebrow">CAMPUS BULLETINS</div>
                <h2>
                  What's happening<span> on campus.</span>
                </h2>
              </div>
              <p>Browse recent announcements and circulars across all departments.</p>
            </div>

            {/* Filter and Search Bar */}
            <div className="home-filter-row">
              <div className="home-tabs">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`home-tab ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="home-search">
                <input
                  type="text"
                  placeholder="Search announcements…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search announcements"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{ border: 0, background: 'transparent', cursor: 'pointer', color: '#888' }}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Notices Cards Grid */}
            {filteredNotices.length > 0 ? (
              <div className="home-cards-grid">
                {filteredNotices.map(n => (
                  <article className="home-notice-card" key={n._id}>
                    <div className="home-card-head">
                      <span className={`category-pill cat-${(n.category || 'general').toLowerCase()}`}>
                        {n.category}
                      </span>
                      <span className="notice-date">
                        <CalendarDays size={13} />
                        {new Date(n.date).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3>{n.title}</h3>
                    <p>{n.content}</p>

                    <div className="home-card-foot">
                      {n.imageUrl ? (
                        <span className="home-attachment-badge">
                          <FileText size={13} /> Attachment
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        className="home-read-btn"
                        onClick={() => setDetail(n)}
                      >
                        Read notice <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-public">
                <BellRing size={22} />
                <div>
                  <strong>No announcements found.</strong>
                  <p>
                    {search || category !== 'All'
                      ? 'Try clearing your search or switching to another category.'
                      : 'New campus updates will appear here once posted.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pillars / Features Section */}
        <section className="section section-light" id="features">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow dark-eyebrow">THE ESSENTIALS</div>
                <h2>
                  Everything important.
                  <br />
                  <span>In one clear space.</span>
                </h2>
              </div>
              <p>
                Eliminate scattered WhatsApp groups and missed circulars with one structured university portal.
              </p>
            </div>

            <div className="pillars-grid">
              {pillars.map(p => (
                <article className="pillar-card" key={p.title}>
                  <div className="pillar-icon-box">
                    <p.icon size={22} />
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="cta-section">
          <div className="container cta-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> STAY INFORMED
              </div>
              <h2>
                Never miss another
                <br />
                <span>campus update.</span>
              </h2>
              <p>
                Sign in to access your student space, view historical archives, and receive direct university broadcasts.
              </p>
            </div>
            <div className="cta-actions">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="button button-light"
                >
                  Go to your dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="button button-light">
                    Create student account <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/login" className="cta-login">
                    Already registered? Sign in <ArrowRight size={15} />
                  </Link>
                </>
              )}
              <span className="cta-caption">CAMPUSCONNECT · STUDENT & FACULTY PORTAL</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Notice Detail Modal */}
      {detail && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={e => e.target === e.currentTarget && setDetail(null)}
        >
          <section
            className="dialog detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-detail-title"
          >
            <div className="dialog-head">
              <span className={`category-pill cat-${(detail.category || 'general').toLowerCase()}`}>
                {detail.category}
              </span>
              <button
                className="icon-button"
                onClick={() => setDetail(null)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>
            {detail.imageUrl && !detail.imageUrl.toLowerCase().endsWith('.pdf') && (
              <img
                className="detail-image"
                src={uploadUrl(detail.imageUrl)}
                alt="Notice attachment"
              />
            )}
            <h2 id="notice-detail-title">{detail.title}</h2>
            <div className="notice-date">
              <CalendarDays size={14} />
              {new Date(detail.date).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
              {detail.postedBy ? ` · ${detail.postedBy}` : ''}
            </div>
            <p className="detail-content">{detail.content}</p>
            {detail.imageUrl && (
              <a
                className="text-link dark-link"
                href={uploadUrl(detail.imageUrl)}
                target="_blank"
                rel="noreferrer"
              >
                Open attachment <ArrowUpRight size={15} />
              </a>
            )}
          </section>
        </div>
      )}
    </>
  );
}
