import re

with open("css/redesign.css", "r", encoding="utf-8") as f:
    css = f.read()

# Split to keep the original top part untouched
parts = css.split(".mobile-only { display: none; }")
if len(parts) >= 2:
    clean_top = parts[0] + ".mobile-only { display: none; }\n\n"
    
    correct_bottom = """
@media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .how-grid { grid-template-columns: repeat(2, 1fr); }
    .projects-grid-v2 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
    section, .stats-section, .how-section { padding: 3rem 5% !important; overflow: hidden; }
    .big-cta-section { padding: 5rem 5% 3rem !important; overflow: hidden; }
    .section-title-v2, .projects-page-header h1 { font-size: clamp(2.2rem, 8vw, 3rem) !important; margin-bottom: 2rem !important; }
    .projects-page-header { padding: 2rem 5% 1rem !important; }
    
    .hero-v2-content { flex-direction: column; align-items: flex-start; padding-top: 5rem; }
    .hero-v2-avatar { width: 180px; align-self: flex-end; }
    .hero-line { font-size: clamp(3.2rem, 16vw, 5rem); }
    
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.8rem !important; width: 100% !important; box-sizing: border-box; }
    .stat-card { padding: 1.5rem 1rem !important; min-width: 0 !important; overflow: hidden; word-wrap: break-word; }
    .stat-value { font-size: 2.5rem !important; }
    .stat-label { font-size: 0.9rem !important; line-height: 1.3; }
    .stat-card .stat-icon { width: 44px !important; height: 44px !important; margin-bottom: 0.8rem !important; }
    
    .how-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.8rem !important; width: 100% !important; box-sizing: border-box; }
    .how-item { padding: 1.2rem 0.8rem !important; min-width: 0 !important; word-wrap: break-word; }
    .how-item h3 { font-size: 1.1rem !important; margin-bottom: 0.4rem !important; }
    .how-item p { font-size: 0.85rem !important; line-height: 1.3 !important; }
    .how-item .how-icon { width: 44px !important; height: 44px !important; margin-bottom: 0.8rem !important; }
    
    .projects-grid-v2 { grid-template-columns: 1fr; gap: 1.5rem; padding: 0 5% 3rem; }
    
    .big-cta-card { padding: 3rem 1.5rem !important; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .big-cta-text { font-size: clamp(2.8rem, 11vw, 4rem) !important; margin: 1.5rem 0 !important; line-height: 1.1; }
    .big-cta-images { position: static !important; display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-top: 1rem; }
    
    .desktop-only { display: none !important; }
    .mobile-only { display: block !important; }
    
    .hero-mobile-nav .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 4rem;
        right: 5%;
        background: rgba(15, 23, 42, 0.95);
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 99;
        backdrop-filter: blur(10px);
    }
    .hero-mobile-nav .nav-links.active { display: flex; }
    .hero-mobile-nav .nav-links li { margin: 0.5rem 0; }
}
"""
    final_css = clean_top + correct_bottom
    with open("css/redesign.css", "w", encoding="utf-8") as f:
        f.write(final_css)
