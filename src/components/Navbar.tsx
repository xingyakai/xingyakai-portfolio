'use client';
import { useState, useEffect, useRef } from 'react';

const MENU_LINKS = [
  { label: 'Work',           href: '#work' },
  { label: 'About',          href: '#about' },
  { label: 'Skills',         href: '#skills' },
  { label: 'Contact',        href: '#contact' },
  { label: 'My Archives',    href: '#archives' },
  { label: 'Knowledge Base', href: '#knowledge' },
  { label: 'Mindscape',      href: '#mindscape' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Custom cursor
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let rx = 0, ry = 0;
    const move = (e: MouseEvent) => { rx = e.clientX; ry = e.clientY; };
    let raf: number;
    const tick = () => {
      el.style.left = rx + 'px';
      el.style.top  = ry + 'px';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', move);
    const addHover = () => {
      document.querySelectorAll('a, button').forEach(b => {
        b.addEventListener('mouseenter', () => el.classList.add('hover'));
        b.addEventListener('mouseleave', () => el.classList.remove('hover'));
      });
    };
    addHover();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const closeAndNav = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <>
      {/* Cursor dot */}
      <div ref={cursorRef} className="cursor" />

      {/* Nav bar */}
      <nav className="nav">
        <div className="nav-left">
          <img src="/logo.jpeg" alt="YXK" className="nav-logo-img" />
          <a href="#work"  className="nav-link">Work</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <div className="nav-right">
          <a href="#skills"  className="nav-link">Skills</a>
          <a href="#contact" className="nav-link">Contact</a>
          <button className="nav-menu-btn" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
      <div className={`menu-overlay${menuOpen ? ' open' : ''}`}>
        <div className="menu-overlay-top">
          <img src="/logo.jpeg" alt="YXK" className="nav-logo-img" />
          <button className="menu-close-btn" onClick={() => setMenuOpen(false)}>
            Close
          </button>
        </div>

        <nav className="menu-links">
          {MENU_LINKS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="menu-link-item"
              style={{ transitionDelay: menuOpen ? `${i * 0.055}s` : '0s' }}
              onClick={(e) => { e.preventDefault(); closeAndNav(item.href); }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="menu-bottom">
          <a href="mailto:yakaixing626@gmail.com" className="menu-social">Email</a>
          <span className="menu-social" style={{ opacity: 0.12 }}>·</span>
          <a href="https://github.com" target="_blank" rel="noopener" className="menu-social">GitHub</a>
        </div>
      </div>
    </>
  );
}
