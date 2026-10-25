import React, { useState } from 'react';
import { 
  BookOpen, 
  Phone, 
  ExternalLink, 
  ShieldAlert, 
  AlertTriangle, 
  Scale, 
  Lock, 
  FileCheck, 
  UserX, 
  EyeOff, 
  HelpCircle,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const SafetyResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'helplines' | 'legal'>('guides');

  const practicalGuides = [
    {
      id: 'danger',
      title: 'Responding to Immediate Physical Danger',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      steps: [
        'Prioritize escape over confrontation: Move immediately toward high-footfall, brightly lit areas (metro stations, fuel stations, banks with security guards, active 24x7 supermarkets).',
        'If inside a taxi/cab and route deviates: Lower your window slightly and make a loud call to a family member stating the cab registration number and current street intersection.',
        'Use native SOS shortcuts: On most smartphones, clicking the side power button 3 to 5 times rapidly triggers native SOS calling without looking at the screen.',
        'Do not go straight to an empty home if pursued: Duck into an open commercial business, notify staff, and dial 112 from behind locked doors.'
      ]
    },
    {
      id: 'harassment',
      title: 'Blocking Abusive Accounts & Preserving Evidence',
      icon: <UserX className="w-5 h-5 text-pink-400" />,
      steps: [
        'Crucial Order of Operations: NEVER block or delete messages before capturing admissible digital evidence.',
        'Capture uncropped, full-screen screenshots displaying: (1) The sender handle/URL, (2) Date and time timestamps, (3) The entire message thread.',
        'Export WhatsApp Chat: Tap More > Export Chat > Without Media to generate a timestamped text transcript.',
        'Log the incident with full details into the SHIELD HER Evidence Vault for date-stamped personal recordkeeping.',
        'Report the account to the platform (Instagram, X, LinkedIn, Telegram), then apply platform blocking and restrict privacy.'
      ]
    },
    {
      id: 'extortion',
      title: 'Defending Against Sextortion & Digital Arrest Scams',
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
      steps: [
        'Rule 1: NEVER pay extortion money. Paying demonstrates vulnerability and triggers escalating ransom demands.',
        'Understand "Digital Arrest" Fraud: Neither the Indian Police, CBI, ED, nor Customs ever issue arrest warrants or conduct judicial proceedings over Skype/WhatsApp video calls. There is no such legal concept as "Digital Arrest".',
        'If scammers threaten to share morphed or hacked media: Immediately contact the National Cyber Crime Portal (cybercrime.gov.in) or call 1930. Under Section 67 of the IT Act, publishing obscene material carries severe prison penalties for perpetrators.',
        'Use StopNCII.org: If intimate images are being threatened, generate secure hashes via StopNCII.org to prevent their upload across Meta platforms.'
      ]
    },
    {
      id: 'location',
      title: 'Protecting Location Privacy & Countering Stalkerware',
      icon: <EyeOff className="w-5 h-5 text-cyan-400" />,
      steps: [
        'Audit Background Location Permissions: Regularly inspect Android / iOS Settings > Privacy > Location Services to see which apps have "Always Allow" access.',
        'Turn off Snap Map & Google Maps Location Sharing: Verify who has permission to view your real-time pin. Turn on Ghost Mode on Snapchat.',
        'Bluetooth Tracker Detection: If you suspect an AirTag or tile tracker has been placed in your bag or car, use Apple’s built-in "Tracker Detect" (or the Android Tracker Detect app) to scan for unknown moving beacons.',
        'Watch for Stalkerware Indicators: Unusually rapid battery drain, phone feeling warm when idle, or sudden spikes in mobile data usage often indicate spyware.'
      ]
    },
    {
      id: 'security',
      title: 'Account Security & Phishing Defense',
      icon: <Lock className="w-5 h-5 text-indigo-400" />,
      steps: [
        'Golden UPI Rule: You NEVER need to enter your UPI PIN to receive money, cashbacks, or refunds. PIN entry is solely for money leaving your bank account.',
        'Switch from SMS OTP to Authenticator Apps: Use Google Authenticator or Microsoft Authenticator to protect against SIM swap hijacking.',
        'Audit Active Login Sessions: Check Instagram (Settings > Accounts Center > Where You’re Logged In) and Google (myaccount.google.com/device-activity) to terminate old devices.'
      ]
    }
  ];

  const officialHelplines = [
    {
      number: '112',
      name: 'National Emergency Response Support System (ERSS)',
      desc: 'All-in-one national emergency number in India for Police, Fire, and Ambulance.',
      url: 'https://112.gov.in/',
      highlight: true,
      category: 'Immediate Police & Emergency'
    },
    {
      number: '1930',
      name: 'National Cyber Crime Financial Fraud Helpline',
      desc: 'Toll-free emergency helpline for reporting cyber fraud, unauthorized banking transfers, and digital scams.',
      url: 'https://cybercrime.gov.in/',
      highlight: true,
      category: 'Cyber & Financial Crime'
    },
    {
      number: '1091',
      name: 'Women Helpline (In Distress)',
      desc: 'Dedicated 24/7 helpline for women facing physical harassment, stalking, or distress in public/private spaces.',
      url: 'https://112.gov.in/',
      highlight: false,
      category: 'Women Safety'
    },
    {
      number: '181',
      name: 'Women Helpline (Domestic Violence & Crisis)',
      desc: '24-hour toll-free telecom service providing integrated support and assistance to women affected by violence.',
      url: 'https://wcd.nic.in/',
      highlight: false,
      category: 'Crisis Support'
    },
    {
      number: '+91 7827170170',
      name: 'National Commission for Women (NCW) 24x7 Helpline',
      desc: 'NCW 24/7 dedicated helpline for women in distress, including legal guidance and complaint facilitation.',
      url: 'http://ncw.nic.in/',
      highlight: false,
      category: 'Statutory Body'
    },
    {
      number: '1098',
      name: 'Childline India',
      desc: 'Emergency 24x7 service for children in need of care and protection, handling underage cyber safety cases.',
      url: 'https://www.childlineindia.org/',
      highlight: false,
      category: 'Minors & Students'
    }
  ];

  const legalProvisions = [
    {
      law: 'Section 354D IPC / Section 78 BNS',
      title: 'Stalking (Physical & Electronic)',
      desc: 'Criminalizes monitoring a woman’s internet usage, email, or digital communications, as well as following or attempting to contact her repeatedly against her will.'
    },
    {
      law: 'Section 66E Information Technology Act',
      title: 'Violation of Privacy',
      desc: 'Punishes capturing, publishing, or transmitting images of private body parts without consent with up to 3 years imprisonment or fine.'
    },
    {
      law: 'Section 67 & 67A IT Act',
      title: 'Publishing Obscene or Sexually Explicit Content',
      desc: 'Strict non-bailable penalties (up to 5 to 7 years imprisonment) for publishing, transmitting, or causing to be published sexually explicit material in electronic form.'
    },
    {
      law: 'Section 503 & 506 IPC / Section 351 BNS',
      title: 'Criminal Intimidation & Blackmail',
      desc: 'Penalizes threatening injury to person, reputation, or property to compel action or extort money.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Safety Resources & Official Helplines
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verified Indian emergency dispatches, cyber legal frameworks, and battle-tested protocols for physical and digital defense.
        </p>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'guides'
              ? 'bg-purple-900/60 text-white border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Practical Action Guides
        </button>

        <button
          onClick={() => setActiveTab('helplines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'helplines'
              ? 'bg-purple-900/60 text-white border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Official Helplines (India)
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'legal'
              ? 'bg-purple-900/60 text-white border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Legal Rights & Cyber Law
        </button>
      </div>

      {/* TAB 1: PRACTICAL GUIDES */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {practicalGuides.map((guide) => (
            <div key={guide.id} className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800">
                  {guide.icon}
                </div>
                <h3 className="font-bold text-base text-white">
                  {guide.title}
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {guide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-purple-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFICIAL HELPLINES */}
      {activeTab === 'helplines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialHelplines.map((item, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  item.highlight
                    ? 'bg-purple-950/20 border-pink-500/50 shadow-glow-purple'
                    : 'bg-navy-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1.5">{item.name}</h3>
                  </div>

                  <a
                    href={`tel:${item.number.replace(/\D/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial {item.number}</span>
                  </a>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-pink-400 font-bold">{item.number}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Direct Government Links Card */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Official Indian Government Cyber Safety Portals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="https://112.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-navy-950 border border-slate-800 hover:border-pink-500/50 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div>
                  <span className="font-bold block text-white">112 India (ERSS)</span>
                  <span className="text-slate-500 text-[11px]">https://112.gov.in/</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-navy-950 border border-slate-800 hover:border-pink-500/50 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div>
                  <span className="font-bold block text-white">Cyber Crime Portal</span>
                  <span className="text-slate-500 text-[11px]">https://cybercrime.gov.in/</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEGAL RIGHTS */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalProvisions.map((item, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-mono font-bold text-purple-300">{item.law}</span>
                </div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-purple-900/40 text-xs text-slate-400 leading-relaxed space-y-2">
            <span className="font-bold text-slate-200 block">Filing Zero FIR & Virtual Cyber Complaints:</span>
            <p>
              In India, a woman can lodge a complaint from any location without physically visiting the police station having local jurisdiction. If needed, a "Zero FIR" can be registered at any station and transferred to the appropriate jurisdiction. Online cyber harassment complaints filed at <strong>cybercrime.gov.in</strong> receive an official tracking acknowledgement for magistrate review.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
