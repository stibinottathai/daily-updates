"use client";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className, style }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...style }} className={className}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-gold) 0%, #ff5e62 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        color: '#fff',
        fontSize: '20px',
        fontFamily: 'var(--font-sans)',
        boxShadow: '0 4px 12px rgba(232, 197, 71, 0.35)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
      }}>
        I
      </div>
      <span style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '1.6rem', 
        fontWeight: 800, 
        letterSpacing: '-0.03em',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center'
      }}>
        Ink<span style={{ color: 'var(--accent-gold)' }}>Flow</span>
      </span>
    </div>
  );
}

