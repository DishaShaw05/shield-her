import { MessageAnalysisResult, WarningSign } from '../types';

interface RuleDefinition {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium';
  patterns: (string | RegExp)[];
  explanation: string;
}

const DETECTION_RULES: RuleDefinition[] = [
  {
    id: 'threats_intimidation',
    title: 'Threats & Physical Intimidation',
    category: 'Safety & Coercion',
    severity: 'high',
    patterns: [
      /\b(kick|slap|punch|hit|beat|smack|strike|shove|push|choke|strangle|stab|shoot|cut|slice|assault|attack|kill|murder|drown|burn|harm|hurt|injure|maim|cripple|torture) (you|u)\b/i,
      /\b(i\s*will|i'll|inwill|i\s*wil|im\s*gonna|gonna|going\s*to|will)\s+.*?\b(kick|slap|punch|hit|beat|hurt|kill|murder|harm|break|push|throw|attack|choke|strangle|stab|shoot|destroy|end|bury|torture)\b/i,
      /\b(throw|push|drag|drop|fling) (you|u|someone).*?(out|off|down|from|into|window|balcony|roof|stairs|bridge|traffic)\b/i,
      /\b(break|smash|fracture|twist|crack|ruin|cut) (your|ur) (face|bones?|legs?|hands?|neck|head|teeth|jaw|nose|skull|body|eyes?)\b/i,
      /\b(kill|murder|strangle|choke|stab|shoot|acid attack|gangrape|rape|molest)\b/i,
      /\b(kidnap|abduct|trap|hostage)\b/i,
      /\b(watch(ing)? (you|u)|stalk(ing)?|follow(ing)? (you|u))\b/i,
      /\bknow where (you|u) (live|work|study|stay)\b/i,
      /\boutside (your|ur) (house|hostel|office|college|door)\b/i,
      /\b(harm|target|get|attack) (your|ur) (family|parents|sister|brother|kids|mother|father)\b/i,
      /\b(ruin (your|ur) life|regret this|teach (you|u) a lesson|make (you|u) pay)\b/i,
      /\b(end (your|ur) life|take (your|ur) life|finish (you|u)|hunt (you|u) down)\b/i,
      /\b(you will|you'll|u will) (suffer|die|bleed)\b/i,
      /\b(mar\s*dunga|jaan\s*se\s*mar|thappad|chappal\s*mar|dekh\s*lunga|hath\s*pair\s*tod|goli\s*mar)\b/i,
    ],
    explanation: 'The message contains explicit or implicit threats of physical harm, violence, stalking, harassment, or retaliation.',
  },
  {
    id: 'blackmail_sextortion',
    title: 'Blackmail & Digital Extortion',
    category: 'Sexual Harassment & Extortion',
    severity: 'high',
    patterns: [
      /\b(nude|naked|intimate|private|compromising) (photo|picture|pic|video|recording|clip|mms)/i,
      /\b(leak|expose|post|share|distribute|upload) (your|these|the) (photos?|videos?|pics?|clips?)\b/i,
      /\b(send to|tell) your (father|mother|parents|husband|family|friends|colleagues|office)\b/i,
      /\bmake (it|you) (go )?viral\b/i,
      /\b(recorded your screen|hacked your webcam|spyware installed)\b/i,
      /\b(blackmail|extort)\b/i,
    ],
    explanation: 'The message attempts extortion or sextortion by threatening non-consensual disclosure of private or fabricated intimate media.',
  },
  {
    id: 'intimate_images_requests',
    title: 'Unsolicited Requests for Intimate Imagery',
    category: 'Sexual Harassment',
    severity: 'high',
    patterns: [
      /\b(send|share|show) (me )?(nudes?|naked|intimate|without clothes|bikini|cleavage|body)/i,
      /\b(take off|remove) (your )?(clothes|top|shirt)\b/i,
      /\b(private|adult|sexy) (video ?call|chat)\b/i,
    ],
    explanation: 'The sender is coercing or soliciting intimate photographs or video calls.',
  },
  {
    id: 'otp_password_theft',
    title: 'Credential & OTP Harvesting',
    category: 'Account Takeover',
    severity: 'high',
    patterns: [
      /\b(otp|one[- ]time password|passcode|verification pin|6[- ]digit code|security code)\b/i,
      /\bshare (your )?(otp|password|pin|passcode|code)\b/i,
      /\bsend (the )?(otp|code|digits) (received|you got|on your phone)\b/i,
      /\breset your password by clicking\b/i,
      /\blogin with this code\b/i,
    ],
    explanation: 'Legitimate organizations and services never ask for OTPs or passwords. This is a direct attempt to hijack an account.',
  },
  {
    id: 'banking_upi_fraud',
    title: 'Financial & UPI Theft Request',
    category: 'Financial Scam',
    severity: 'high',
    patterns: [
      /\b(cvv|atm pin|netbanking password|credit card number)\b/i,
      /\benter (your )?upi pin to (receive|claim|accept) (money|cashback|refund)\b/i,
      /\b(gpay|phonepe|paytm) pin\b/i,
      /\b(electricity|power supply).*?(cut[- ]?off|disconnect)/i,
      /\b(bank account|sim card|pan card).*?(blocked|suspended|deactivated|kyc expired)/i,
    ],
    explanation: 'The message seeks banking credentials or falsely claims receiving funds requires entering a UPI PIN (a hallmark of UPI fraud).',
  },
  {
    id: 'urgent_demands',
    title: 'Artificial Urgency & Pressure Tactics',
    category: 'Social Engineering',
    severity: 'medium',
    patterns: [
      /\b(immediately|urgent(ly)?|right now|within (\d+|10|15|30|60) (minutes|mins|hours))\b/i,
      /\bpay (now|today) or (face|we will|police will)\b/i,
      /\blast warning|final notice|immediate action required\b/i,
      /\botherwise (you will be )?arrest(ed)?\b/i,
    ],
    explanation: 'Attackers create false urgency to prevent the victim from calmly verifying claims with family or authorities.',
  },
  {
    id: 'authority_spoofing',
    title: 'Impersonation of Police or Authority',
    category: 'Legal Intimidation',
    severity: 'high',
    patterns: [
      /\b(police|cyber crime department|cyber cell|cbi|ed|narcotics bureau|ncb|customs)\b/i,
      /\b(fedex|dhl|courier) parcel (contained|contains) (drugs|illegal items|fake passports)\b/i,
      /\b(arrest warrant|court notice|legal summons) issued against you\b/i,
      /\bdigital arrest\b/i,
      /\b(telecom department|trai) disconnecting all your numbers\b/i,
    ],
    explanation: 'Known "digital arrest" / courier scam tactic where scammers masquerade as law enforcement officers to intimidate victims into paying.',
  },
  {
    id: 'suspicious_links',
    title: 'Suspicious Links & Phishing URLs',
    category: 'Malware / Phishing',
    severity: 'medium',
    patterns: [
      /\b(https?:\/\/)?(bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|ngrok\.io|duckdns\.org)\/[a-zA-Z0-9_\-]+/i,
      /\bhttps?:\/\/[^\s]+(\.xyz|\.top|\.club|\.work|\.download|\.click|\.gq|\.cf)\b/i,
      /\b(click here|tap link|visit link) to (verify|claim|update|unlock|login)\b/i,
      /\bhttp:\/\/[^\s]+/i, // unencrypted http
    ],
    explanation: 'The message includes shortened or suspicious web links often used to steal credentials or download spyware.',
  },
  {
    id: 'lottery_task_scams',
    title: 'Fake Job, Lottery, or Prize Claims',
    category: 'Deceptive Offer',
    severity: 'medium',
    patterns: [
      /\b(congratulations|lucky winner|won (a prize|lottery|lucky draw|cashback|iphone))\b/i,
      /\b(kbc|kaun banega crorepati) lucky winner\b/i,
      /\b(part[- ]time job|work from home|wfh|earn (\d+|5000|10000) (daily|per day))\b/i,
      /\b(like youtube videos|subscribe channels) to earn money\b/i,
      /\bjoin telegram (channel|group) for tasks\b/i,
    ],
    explanation: 'Pretends to offer money or jobs to lure victims into advance fee fraud or fake investment tasks.',
  },
];

export function analyzeSuspiciousMessage(rawText: string): MessageAnalysisResult {
  const text = rawText.trim();
  const detectedSigns: WarningSign[] = [];

  if (!text) {
    return {
      riskLevel: 'low',
      label: 'No Common Warning Signs Detected',
      summary: 'Please paste a message into the analyzer to examine its content.',
      detectedSigns: [],
      recommendations: [],
      rawTextLength: 0,
      analyzedAt: new Date().toISOString(),
    };
  }

  for (const rule of DETECTION_RULES) {
    const matchedTerms: string[] = [];

    for (const pattern of rule.patterns) {
      if (typeof pattern === 'string') {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
          matchedTerms.push(pattern);
        }
      } else {
        try {
          const globalRegex = new RegExp(
            pattern.source,
            pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
          );
          const matches = [...text.matchAll(globalRegex)];
          for (const m of matches) {
            if (m[0]) matchedTerms.push(m[0].trim());
          }
        } catch {
          const matches = text.match(pattern);
          if (matches && matches[0]) {
            matchedTerms.push(matches[0].trim());
          }
        }
      }
    }

    if (matchedTerms.length > 0) {
      // Deduplicate matched terms
      const uniqueMatched = Array.from(new Set(matchedTerms));
      detectedSigns.push({
        id: rule.id,
        title: rule.title,
        category: rule.category,
        severity: rule.severity,
        explanation: rule.explanation,
        matchedKeywords: uniqueMatched,
      });
    }
  }

  // Determine overall risk level
  const highSeverityCount = detectedSigns.filter(s => s.severity === 'high').length;
  const totalCount = detectedSigns.length;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let label: 'No Common Warning Signs Detected' | 'Some Warning Signs Detected' | 'Several Warning Signs Detected' = 
    'No Common Warning Signs Detected';
  let summary = '';

  if (totalCount === 0) {
    riskLevel = 'low';
    label = 'No Common Warning Signs Detected';
    summary = 'No common scam or harassment keywords were detected in this text. However, scammers frequently evolve their language. Always trust your instincts.';
  } else if (totalCount <= 2 && highSeverityCount === 0) {
    riskLevel = 'medium';
    label = 'Some Warning Signs Detected';
    summary = `Detected ${totalCount} warning sign(s). Exercise caution and verify the sender's identity through trusted channels before taking any action.`;
  } else {
    riskLevel = 'high';
    label = 'Several Warning Signs Detected';
    summary = `Critical risk detected: ${totalCount} warning sign(s) identified (${highSeverityCount} high-severity, including coercion, extortion, or credential harvesting).`;
  }

  // Compile tailored recommendations
  const recommendations: string[] = [];

  if (detectedSigns.some(s => s.id === 'threats_intimidation' || s.id === 'blackmail_sextortion')) {
    recommendations.push('Do NOT pay money or send additional images; giving in almost always results in higher extortion demands.');
    recommendations.push('Do not delete the messages. Take full-screen screenshots displaying the sender phone number/username, date, and timestamps.');
    recommendations.push('Log the incident in the SHIELD HER Evidence Vault for timestamped recordkeeping.');
    recommendations.push('File a confidential complaint on India’s official portal: cybercrime.gov.in or call 1930.');
    recommendations.push('Confide in a trusted friend, family member, or professional counselor.');
  }

  if (detectedSigns.some(s => s.id === 'otp_password_theft' || s.id === 'banking_upi_fraud')) {
    recommendations.push('NEVER share your OTP, password, or UPI PIN with anyone, even if they claim to be bank officials.');
    recommendations.push('Remember: Receiving money via UPI NEVER requires entering your PIN.');
    recommendations.push('Immediately contact your bank’s official fraud helpline to freeze your card/account if credentials were submitted.');
  }

  if (detectedSigns.some(s => s.id === 'authority_spoofing')) {
    recommendations.push('Indian law enforcement (Police, CBI, Customs) never conducts "digital arrests" or interrogations over Skype/WhatsApp.');
    recommendations.push('Disconnect the call immediately and dial 112 or visit your local police station to verify.');
  }

  if (detectedSigns.some(s => s.id === 'suspicious_links')) {
    recommendations.push('Do NOT click the link. Phishing links can mimic login pages or trigger malware downloads.');
  }

  if (totalCount === 0) {
    recommendations.push('Verify the sender through a secondary trusted communication channel.');
    recommendations.push('Never share one-time passwords (OTPs) or private credentials regardless of how official the sender looks.');
  }

  return {
    riskLevel,
    label,
    summary,
    detectedSigns,
    recommendations,
    rawTextLength: text.length,
    analyzedAt: new Date().toISOString(),
  };
}

// Preset sample test messages for quick threat analysis demonstrations
export const PRESET_TEST_MESSAGES = [
  {
    title: 'Extortion & Intimate Media Threat',
    text: 'I have recorded your private video from your webcam. If you do not transfer 15,000 rupees to this UPI immediately within 30 minutes, I will make it go viral and send to your father, family and all your Instagram followers.',
    description: 'Triggers blackmail, sextortion, physical coercion & urgency warnings.'
  },
  {
    title: 'Fake CBI "Digital Arrest" & Courier Scam',
    text: 'This is Officer Sharma from Crime Branch Cyber Cell. A FedEx courier parcel in your name was seized containing illegal narcotics and fake passports. An arrest warrant has been issued. You are placed under digital arrest right now. Transfer verification deposit immediately or police will come to your house.',
    description: 'Triggers authority spoofing, fake arrest threats & urgent money demands.'
  },
  {
    title: 'Electricity Bill Disconnection / Banking Fraud',
    text: 'Dear Customer, your electricity power supply will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Please call our power officer immediately at 9876543210 and share your OTP or update via link http://bit.ly/power-bill-pay-xyz to avoid cutoff.',
    description: 'Triggers credential harvesting, urgency, suspicious link & banking fraud.'
  },
  {
    title: 'Safe Everyday Conversation',
    text: 'Hey Priya, are we still meeting for lunch near Cyber City today around 1:30 PM? Let me know if you want me to book a table at the cafe.',
    description: 'Clean message with zero warning signs.'
  }
];
