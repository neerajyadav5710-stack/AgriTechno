import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#064e3b', color: '#cbd5e1' }} className="pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Col 1: Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-white p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                <Sprout size={20} className="text-success" />
              </div>
              <h5 className="mb-0 text-white fw-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Agri<span style={{ color: '#fbbf24' }}>Techno</span>
              </h5>
            </div>
            <p className="small text-white-50 lh-base">
              Empowering progressive and smallholder farmers with digital precision tools: real-time NPK fertilizer optimization, hyperlocal weather advisories, IoT field telemetry, and certified direct farm supplies.
            </p>
            <div className="small text-white-50">
              <div className="d-flex align-items-center gap-2 mb-1">
                <MapPin size={14} className="text-warning" /> Central Farm Research Centre, Karnal & Ludhiana
              </div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Phone size={14} className="text-warning" /> Kisan Helpline: 1800-180-1551 (Toll-free)
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={14} className="text-warning" /> contact@agritechno.org
              </div>
            </div>
          </div>

          {/* Col 2: Precision Tools */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Smart Tools</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50">
              <li><Link to="/soil-analytics" className="text-reset hover-white">Soil Health Card</Link></li>
              <li><Link to="/weather" className="text-reset hover-white">Hyperlocal Weather</Link></li>
              <li><Link to="/crops" className="text-reset hover-white">Crop Monitoring</Link></li>
              <li><Link to="/farms" className="text-reset hover-white">Plot GPS Mapping</Link></li>
              <li><Link to="/marketplace" className="text-reset hover-white">Subsidized Inputs</Link></li>
            </ul>
          </div>

          {/* Col 3: Support & Community */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Community & Advisory</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50">
              <li><Link to="/ask-doctor" className="text-reset hover-white">Ask Agri-Doctor (Consultation)</Link></li>
              <li><Link to="/community" className="text-reset hover-white">Kisan Discussion Forum</Link></li>
              <li><Link to="/weather" className="text-reset hover-white">Pest Early Warning Radar</Link></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="text-reset hover-white d-flex align-items-center gap-1">PM-KISAN Portal <ExternalLink size={12} /></a></li>
              <li><a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="text-reset hover-white d-flex align-items-center gap-1">Soil Health Mission <ExternalLink size={12} /></a></li>
            </ul>
          </div>

          {/* Col 4: Evaluator Note & Git Info */}
          <div className="col-lg-3 col-md-6">
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="badge bg-warning text-dark mb-2 fw-semibold">Academic & Mentor Review</div>
              <p className="small text-white-50 mb-2">
                Designed & Developed for digital farmer empowerment with the full MERN stack.
              </p>
              <div className="small text-white font-monospace">
                Repo: <a href="https://github.com/neerajyadav5710-stack/AgriTechno" target="_blank" rel="noreferrer" className="text-warning text-decoration-underline">AgriTechno</a>
              </div>
              <div className="small text-white-50 font-monospace">
                Developer: neerajyadav5710-stack
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-white-50">
          <div>&copy; {new Date().getFullYear()} AgriTechno System. All rights reserved.</div>
          <div className="d-flex align-items-center gap-1 mt-2 mt-sm-0">
            Dedicated to Indian Farmers <Heart size={14} className="text-danger fill-danger" /> Digital Krishi
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
