import { Heart, Globe, Shield, Sparkles, Code2 } from 'lucide-react';

const techStack = [
  { name: 'React 18', type: 'Frontend' },
  { name: 'Vite 5', type: 'Bundler' },
  { name: 'Node.js', type: 'Runtime' },
  { name: 'Express.js', type: 'Backend API' },
  { name: 'Google Cloud Translation', type: 'AI Engine' },
  { name: 'Web Speech API', type: 'TTS' },
];

export default function Footer() {
  return (
    <footer id="about" className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="logo footer-logo">
              <div className="logo-badge">
                <Globe size={18} />
              </div>
              <span className="logo-text">LinguaAI</span>
            </div>
            <p className="footer-desc">
              A high-precision, production-grade neural language translation tool.
            </p>
            <div className="footer-meta-tag">
              <Shield size={13} />
              <span>Safe & Secure Client-Server Architecture</span>
            </div>
          </div>

          <div className="footer-stack-col">
            <h4 className="footer-heading">
              <Code2 size={16} /> Technologies & Services
            </h4>
            <div className="footer-badges">
              {techStack.map((tech) => (
                <div key={tech.name} className="tech-badge">
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-type">{tech.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 LinguaAI. All rights reserved.</p>
          <div className="footer-love">
            <span>Built with precision & passion</span>
            <Heart size={14} className="heart-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
