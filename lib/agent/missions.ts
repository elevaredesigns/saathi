/**
 * The scripted missions Saathi AI can carry out, in English, Hindi, Bengali
 * and Tamil. Hindi, Bengali and Tamil are best-effort and flagged for native
 * review before any real use.
 */
import { APPLICATIONS, getScheme, loc, type L } from "@/lib/mockData";
import { buildTimeline } from "@/lib/timeline";
import { detectLanguageRequest, routeOne, splitQuestions } from "./intents";
import { closestTopics, detectFocus, faqAnswer, POPULAR, topicAnswer, topicName, type FaqId } from "./knowledge";
import type { Block, Mission, MissionContext, MissionId, Suggestion } from "./types";
import { availableLocales, isAvailableLocale, isCoreLocale, localeMeta, type Locale } from "@/lib/i18n/config";

const l = (en: string, hi: string, bn: string, ta: string): L => ({ en, hi, bn, ta });

/* ------------------------------------------------------------ shared --- */

const S = {
  birth: { label: l("Get my daughter's birth certificate", "बेटी का जन्म प्रमाणपत्र बनवाना है", "মেয়ের জন্ম সনদ করাতে চাই", "என் மகளின் பிறப்புச் சான்றிதழ் வேண்டும்") },
  owed: { label: l("Which schemes am I owed?", "मुझे कौन सी योजनाएँ मिल सकती हैं?", "আমি কোন প্রকল্পগুলো পেতে পারি?", "எனக்கு எந்தத் திட்டங்கள் கிடைக்கும்?") },
  tax: { label: l("Pay my property tax", "मेरा संपत्ति कर भरना है", "আমার সম্পত্তি কর দিতে চাই", "என் சொத்து வரியைச் செலுத்த வேண்டும்") },
  ayushman: { label: l("Where is my Ayushman card?", "मेरा आयुष्मान कार्ड कहाँ है?", "আমার আয়ুষ্মান কার্ড কোথায়?", "என் ஆயுஷ்மான் அட்டை எங்கே?") },
  father: { label: l("Submit my father's pension life certificate", "पिताजी का पेंशन जीवन प्रमाण जमा करना है", "বাবার পেনশনের জীবন প্রমাণপত্র জমা দিতে চাই", "அப்பாவின் ஓய்வூதிய வாழ்நாள் சான்றிதழைச் சமர்ப்பிக்க வேண்டும்") },
  hindi: { label: l("Talk to me in Hindi", "हिंदी में बात करो", "হিন্দিতে কথা বলো", "இந்தியில் பேசு") },
  human: { label: l("Talk to a person", "किसी व्यक्ति से बात करनी है", "একজন মানুষের সাথে কথা বলতে চাই", "ஒரு மனிதரிடம் பேச வேண்டும்") },
};

const ask = (s: { label: L }): Suggestion => ({ label: s.label, send: s.label });

const GO_TRACK: Suggestion = { label: l("Open Track", "ट्रैक खोलें", "ট্র্যাক খুলুন", "கண்காணிப்பைத் திற"), href: "/prototype/track/" };

/* ---------------------------------------------------------- missions --- */

function newBaby(): Block[] {
  return [
    { kind: "thinking", label: l("Understanding your request", "आपका अनुरोध समझ रहा हूँ", "আপনার অনুরোধ বুঝছি", "உங்கள் கோரிக்கையைப் புரிந்துகொள்கிறேன்"), ms: 900 },
    {
      kind: "text",
      text: l(
        "Congratulations on Aanya! I can register her birth with Nagar Nigam, Kanpur. Here's my plan — nothing is sent until you approve.",
        "आन्या के जन्म की बधाई! मैं नगर निगम, कानपुर में उसका जन्म पंजीकरण कर सकता हूँ। मेरी योजना यह है — आपकी मंज़ूरी के बिना कुछ नहीं भेजा जाएगा।",
        "আন্যার জন্য অভিনন্দন! আমি নগর নিগম, কানপুরে ওর জন্ম নিবন্ধন করতে পারি। এই আমার পরিকল্পনা — আপনার অনুমতি ছাড়া কিছুই পাঠানো হবে না।",
        "ஆன்யாவுக்கு வாழ்த்துகள்! கான்பூர் நகர நிகத்தில் அவளுடைய பிறப்பைப் பதிவு செய்ய முடியும். இதோ என் திட்டம் — உங்கள் ஒப்புதல் இல்லாமல் எதுவும் அனுப்பப்படாது.",
      ),
    },
    {
      kind: "plan",
      title: l("Plan", "योजना", "পরিকল্পনা", "திட்டம்"),
      steps: [
        l("Fetch the hospital birth record", "अस्पताल का जन्म रिकॉर्ड लाना", "হাসপাতালের জন্ম রেকর্ড আনা", "மருத்துவமனை பிறப்புப் பதிவைப் பெறுதல்"),
        l("Fill Form 1 for e-District", "ई-डिस्ट्रिक्ट के लिए फ़ॉर्म 1 भरना", "ই-ডিস্ট্রিক্টের ফর্ম ১ পূরণ", "இ-டிஸ்ட்ரிக்ட் படிவம் 1 நிரப்புதல்"),
        l("Check maternity benefits", "मातृत्व लाभ जाँचना", "মাতৃত্ব সুবিধা যাচাই", "மகப்பேறு நலன்களைச் சரிபார்த்தல்"),
        l("Submit with your approval", "आपकी मंज़ूरी से जमा करना", "আপনার অনুমতিতে জমা দেওয়া", "உங்கள் ஒப்புதலுடன் சமர்ப்பித்தல்"),
      ],
    },
    { kind: "tool", source: "DigiLocker", planStep: 0, ms: 1300, action: l("Hallet Hospital birth record", "हैलट अस्पताल जन्म रिकॉर्ड", "হ্যালেট হাসপাতাল জন্ম রেকর্ড", "ஹாலெட் மருத்துவமனை பிறப்புப் பதிவு"), result: l("Found · 12 Mar 2026", "मिला · 12 मार्च 2026", "পাওয়া গেছে · 12 মার্চ 2026", "கிடைத்தது · 12 மார்ச் 2026") },
    { kind: "tool", source: "e-District", planStep: 1, ms: 1100, action: l("Form 1 pre-filled", "फ़ॉर्म 1 पहले से भरा", "ফর্ম ১ আগে থেকে পূরণ", "படிவம் 1 முன்நிரப்பப்பட்டது"), result: l("9 of 9 fields", "9 में से 9 फ़ील्ड", "৯টির মধ্যে ৯টি ঘর", "9-இல் 9 புலங்கள்") },
    { kind: "tool", source: "NHM", planStep: 2, ms: 1000, action: l("Janani Suraksha Yojana", "जननी सुरक्षा योजना", "জননী সুরক্ষা যোজনা", "ஜனனி சுரக்ஷா யோஜனா"), result: l("Likely eligible · ₹1,400", "संभवतः पात्र · ₹1,400", "সম্ভবত যোগ্য · ₹1,400", "தகுதி வாய்ப்பு · ₹1,400") },
    {
      kind: "consent",
      title: l("Share with Nagar Nigam, Kanpur?", "नगर निगम, कानपुर के साथ साझा करें?", "নগর নিগম, কানপুরের সাথে শেয়ার করবেন?", "கான்பூர் நகர நிகத்துடன் பகிரவா?"),
      recipient: l("Registrar of Births, Nagar Nigam", "जन्म रजिस्ट्रार, नगर निगम", "জন্ম নিবন্ধক, নগর নিগম", "பிறப்புப் பதிவாளர், நகர நிகம்"),
      items: [
        l("Your name, Aadhaar and address", "आपका नाम, आधार और पता", "আপনার নাম, আধার ও ঠিকানা", "உங்கள் பெயர், ஆதார் மற்றும் முகவரி"),
        l("Aanya's hospital birth record", "आन्या का अस्पताल जन्म रिकॉर्ड", "আন্যার হাসপাতালের জন্ম রেকর্ড", "ஆன்யாவின் மருத்துவமனை பிறப்புப் பதிவு"),
      ],
      validity: l("Until the application closes", "आवेदन बंद होने तक", "আবেদন বন্ধ হওয়া পর্যন্ত", "விண்ணப்பம் முடியும் வரை"),
      approve: l("Approve and submit", "मंज़ूर करें और जमा करें", "অনুমোদন করে জমা দিন", "ஒப்புதல் அளித்துச் சமர்ப்பி"),
      editHref: "/prototype/apply/?id=cert_birth",
    },
    { kind: "thinking", label: l("Submitting to e-District", "ई-डिस्ट्रिक्ट पर जमा कर रहा हूँ", "ই-ডিস্ট্রিক্টে জমা দিচ্ছি", "இ-டிஸ்ட்ரிக்டில் சமர்ப்பிக்கிறேன்"), ms: 1200 },
    {
      kind: "outcome",
      title: l("Birth certificate application submitted", "जन्म प्रमाणपत्र आवेदन जमा हुआ", "জন্ম সনদের আবেদন জমা হয়েছে", "பிறப்புச் சான்றிதழ் விண்ணப்பம் சமர்ப்பிக்கப்பட்டது"),
      refPrefix: "SAA",
      lines: [
        l("Priya Nair, verifying officer, will review it", "सत्यापन अधिकारी प्रिया नायर समीक्षा करेंगी", "যাচাই আধিকারিক প্রিয়া নায়ার পর্যালোচনা করবেন", "சரிபார்ப்பு அதிகாரி பிரியா நாயர் பரிசீலிப்பார்"),
        l("Certificate expected in 7–10 days", "प्रमाणपत्र 7–10 दिनों में अपेक्षित", "সনদ ৭–১০ দিনে প্রত্যাশিত", "சான்றிதழ் 7–10 நாட்களில் எதிர்பார்க்கப்படுகிறது"),
      ],
      href: "/prototype/track/",
      hrefLabel: l("View in Track", "ट्रैक में देखें", "ট্র্যাকে দেখুন", "கண்காணிப்பில் பார்"),
      effects: [{ type: "addApplication", service: l("Birth Certificate", "जन्म प्रमाणपत्र", "জন্ম সনদ", "பிறப்புச் சான்றிதழ்"), refPrefix: "SAA", status: "submitted" }],
    },
    {
      kind: "text",
      text: l(
        "One more thing: you may be eligible for ₹1,400 under Janani Suraksha Yojana, and you can open a Sukanya Samriddhi account for Aanya.",
        "एक और बात: जननी सुरक्षा योजना में आपको ₹1,400 मिल सकते हैं, और आप आन्या के लिए सुकन्या समृद्धि खाता खोल सकते हैं।",
        "আরও একটি কথা: জননী সুরক্ষা যোজনায় আপনি ₹1,400 পেতে পারেন, আর আন্যার জন্য সুকন্যা সমৃদ্ধি অ্যাকাউন্ট খুলতে পারেন।",
        "இன்னொன்று: ஜனனி சுரக்ஷா யோஜனாவில் ₹1,400 கிடைக்கலாம், ஆன்யாவுக்கு சுகன்யா சம்ரித்தி கணக்கும் திறக்கலாம்.",
      ),
    },
    {
      kind: "suggestions",
      items: [
        { label: l("Apply for JSY", "जेएसवाई के लिए आवेदन", "জেএসওয়াই-এর আবেদন", "JSY-க்கு விண்ணப்பி"), href: "/prototype/apply/?id=jsy" },
        { label: l("Open Sukanya account", "सुकन्या खाता खोलें", "সুকন্যা অ্যাকাউন্ট খুলুন", "சுகன்யா கணக்கைத் திற"), href: "/prototype/apply/?id=sukanya" },
        GO_TRACK,
      ],
    },
  ];
}

function owed(): Block[] {
  return [
    { kind: "thinking", label: l("Checking your profile against 12 schemes", "12 योजनाओं से आपकी प्रोफ़ाइल मिला रहा हूँ", "১২টি প্রকল্পের সাথে আপনার প্রোফাইল মেলাচ্ছি", "12 திட்டங்களுடன் உங்கள் சுயவிவரத்தை ஒப்பிடுகிறேன்"), ms: 1100 },
    { kind: "tool", source: "myScheme", ms: 1300, action: l("Eligibility rules", "पात्रता नियम", "যোগ্যতার নিয়ম", "தகுதி விதிகள்"), result: l("3 strong matches", "3 मज़बूत मिलान", "৩টি জোরালো মিল", "3 வலுவான பொருத்தங்கள்") },
    {
      kind: "text",
      text: l(
        "Based on what you've told me and your records, these are worth claiming. I've shown why for each.",
        "आपकी जानकारी और रिकॉर्ड के आधार पर ये योजनाएँ लेने लायक हैं। हर एक का कारण दिखाया है।",
        "আপনার তথ্য ও রেকর্ডের ভিত্তিতে এগুলো নেওয়ার মতো। প্রতিটির কারণ দেখিয়েছি।",
        "நீங்கள் சொன்னதும் உங்கள் பதிவுகளும் அடிப்படையில் இவை பெறத் தகுந்தவை. ஒவ்வொன்றுக்கும் காரணம் காட்டியுள்ளேன்.",
      ),
    },
    {
      kind: "cards",
      cards: [
        { kind: "scheme", schemeId: "pmkisan", reason: l("You own farmland in Kanpur Nagar", "कानपुर नगर में आपके नाम खेत है", "কানপুর নগরে আপনার কৃষিজমি আছে", "கான்பூர் நகரில் உங்களுக்கு விவசாய நிலம் உள்ளது") },
        { kind: "scheme", schemeId: "apy", reason: l("You're 34 with a savings account", "आपकी उम्र 34 है और बचत खाता है", "আপনার বয়স ৩৪ ও সঞ্চয় অ্যাকাউন্ট আছে", "உங்களுக்கு 34 வயது, சேமிப்புக் கணக்கு உள்ளது") },
        { kind: "scheme", schemeId: "pmsby", reason: l("Accident cover for ₹20 a year", "₹20 सालाना में दुर्घटना बीमा", "বছরে ₹20-তে দুর্ঘটনা বিমা", "ஆண்டுக்கு ₹20-க்கு விபத்துக் காப்பீடு") },
      ],
    },
    {
      kind: "consent",
      title: l("Register you for PM-KISAN?", "पीएम-किसान में पंजीकरण करें?", "পিএম-কিসানে নিবন্ধন করব?", "பிஎம்-கிசானில் பதிவு செய்யவா?"),
      recipient: l("Dept. of Agriculture & Farmers Welfare", "कृषि एवं किसान कल्याण विभाग", "কৃষি ও কৃষক কল্যাণ দপ্তর", "வேளாண் மற்றும் விவசாயிகள் நலத் துறை"),
      items: [
        l("Name and Aadhaar", "नाम और आधार", "নাম ও আধার", "பெயர் மற்றும் ஆதார்"),
        l("Land record (Bhulekh)", "भूमि अभिलेख (भूलेख)", "জমির রেকর্ড (ভুলেখ)", "நில பதிவு (புலேக்)"),
        l("Aadhaar-linked bank account", "आधार से जुड़ा बैंक खाता", "আধার-সংযুক্ত ব্যাঙ্ক অ্যাকাউন্ট", "ஆதார் இணைந்த வங்கிக் கணக்கு"),
      ],
      validity: l("Until you opt out", "जब तक आप बाहर न निकलें", "যতক্ষণ না আপনি বেরিয়ে যান", "நீங்கள் விலகும் வரை"),
      approve: l("Approve and register", "मंज़ूर करें और पंजीकरण करें", "অনুমোদন করে নিবন্ধন করুন", "ஒப்புதல் அளித்துப் பதிவு செய்"),
      editHref: "/prototype/apply/?id=pmkisan",
    },
    { kind: "tool", source: "PM-KISAN", ms: 1200, action: l("Registration", "पंजीकरण", "নিবন্ধন", "பதிவு"), result: l("Accepted", "स्वीकार", "গৃহীত", "ஏற்கப்பட்டது") },
    {
      kind: "outcome",
      title: l("PM-KISAN registration submitted", "पीएम-किसान पंजीकरण जमा हुआ", "পিএম-কিসান নিবন্ধন জমা হয়েছে", "பிஎம்-கிசான் பதிவு சமர்ப்பிக்கப்பட்டது"),
      refPrefix: "PMK",
      lines: [
        l("₹6,000 a year in three instalments", "₹6,000 सालाना, तीन किस्तों में", "বছরে ₹6,000, তিন কিস্তিতে", "ஆண்டுக்கு ₹6,000, மூன்று தவணைகளில்"),
        l("Land record check within 14 days", "14 दिनों में भूमि अभिलेख जाँच", "১৪ দিনের মধ্যে জমির রেকর্ড যাচাই", "14 நாட்களில் நில பதிவுச் சரிபார்ப்பு"),
      ],
      href: "/prototype/track/",
      hrefLabel: l("View in Track", "ट्रैक में देखें", "ট্র্যাকে দেখুন", "கண்காணிப்பில் பார்"),
      effects: [{ type: "addApplication", service: l("PM-KISAN Registration", "पीएम-किसान पंजीकरण", "পিএম-কিসান নিবন্ধন", "பிஎம்-கிசான் பதிவு"), refPrefix: "PMK", status: "submitted" }],
    },
    { kind: "suggestions", items: [{ label: l("See all schemes for me", "मेरी सभी योजनाएँ देखें", "আমার সব প্রকল্প দেখুন", "எனக்கான எல்லாத் திட்டங்களும்"), href: "/prototype/eligibility/" }, GO_TRACK] },
  ];
}

function tax(ctx: MissionContext): Block[] {
  if (ctx.paidBills.includes("taxes_property")) {
    return [
      { kind: "tool", source: "Nagar Nigam", ms: 1000, action: l("Property tax dues", "संपत्ति कर बकाया", "সম্পত্তি কর বকেয়া", "சொத்து வரி நிலுவை"), result: l("₹0 due", "₹0 बकाया", "₹0 বকেয়া", "₹0 நிலுவை") },
      { kind: "text", text: l("Good news — your property tax for this year is already paid. The receipt is saved in Track.", "अच्छी खबर — इस साल का संपत्ति कर पहले ही भर दिया गया है। रसीद ट्रैक में सहेजी है।", "সুখবর — এ বছরের সম্পত্তি কর আগেই দেওয়া হয়েছে। রসিদ ট্র্যাকে রাখা আছে।", "நல்ல செய்தி — இந்த ஆண்டுச் சொத்து வரி ஏற்கனவே செலுத்தப்பட்டது. ரசீது கண்காணிப்பில் உள்ளது.") },
      { kind: "suggestions", items: [GO_TRACK, ask(S.owed)] },
    ];
  }
  return [
    { kind: "thinking", label: l("Looking up your property", "आपकी संपत्ति खोज रहा हूँ", "আপনার সম্পত্তি খুঁজছি", "உங்கள் சொத்தைத் தேடுகிறேன்"), ms: 900 },
    { kind: "tool", source: "Nagar Nigam", ms: 1300, action: l("Property KNP-4471, Civil Lines", "संपत्ति KNP-4471, सिविल लाइन्स", "সম্পত্তি KNP-4471, সিভিল লাইনস", "சொத்து KNP-4471, சிவில் லைன்ஸ்"), result: l("1 bill due", "1 बिल बकाया", "১টি বিল বকেয়া", "1 கட்டணம் நிலுவை") },
    {
      kind: "cards",
      cards: [
        {
          kind: "bill",
          title: l("Property tax 2026–27", "संपत्ति कर 2026–27", "সম্পত্তি কর 2026–27", "சொத்து வரி 2026–27"),
          amount: "₹2,450",
          due: l("Due 29 May", "29 मई तक देय", "২৯ মে-র মধ্যে দেয়", "மே 29-க்குள்"),
          payee: l("Nagar Nigam, Kanpur", "नगर निगम, कानपुर", "নগর নিগম, কানপুর", "நகர நிகம், கான்பூர்"),
        },
      ],
    },
    {
      kind: "text",
      text: l(
        "Paying before the due date avoids a 2% monthly penalty. I'll pay from your SBI account using UPI.",
        "नियत तारीख से पहले भरने पर 2% मासिक जुर्माना नहीं लगेगा। मैं आपके एसबीआई खाते से यूपीआई द्वारा भुगतान करूँगा।",
        "নির্ধারিত তারিখের আগে দিলে মাসিক ২% জরিমানা এড়ানো যায়। আমি আপনার এসবিআই অ্যাকাউন্ট থেকে ইউপিআই-তে দেব।",
        "கெடுவுக்கு முன் செலுத்தினால் மாதம் 2% அபராதம் இல்லை. உங்கள் SBI கணக்கிலிருந்து UPI மூலம் செலுத்துவேன்.",
      ),
    },
    {
      kind: "consent",
      title: l("Pay ₹2,450 to Nagar Nigam, Kanpur?", "नगर निगम, कानपुर को ₹2,450 भरें?", "নগর নিগম, কানপুরকে ₹2,450 দেবেন?", "கான்பூர் நகர நிகத்துக்கு ₹2,450 செலுத்தவா?"),
      recipient: l("Verified government payee", "सत्यापित सरकारी प्राप्तकर्ता", "যাচাই করা সরকারি প্রাপক", "சரிபார்க்கப்பட்ட அரசு பெறுநர்"),
      items: [l("From rakesh.verma@sbi", "rakesh.verma@sbi से", "rakesh.verma@sbi থেকে", "rakesh.verma@sbi இலிருந்து"), l("Property KNP-4471", "संपत्ति KNP-4471", "সম্পত্তি KNP-4471", "சொத்து KNP-4471")],
      validity: l("One-time payment", "एक बार का भुगतान", "এককালীন অর্থপ্রদান", "ஒருமுறைக் கட்டணம்"),
      approve: l("Approve in UPI app", "यूपीआई ऐप में मंज़ूर करें", "ইউপিআই অ্যাপে অনুমোদন", "UPI செயலியில் ஒப்புதல்"),
      editHref: "/prototype/apply/?id=taxes_property",
    },
    { kind: "tool", source: "UPI", ms: 1600, action: l("Payment approved in your bank app", "आपके बैंक ऐप में भुगतान मंज़ूर", "আপনার ব্যাঙ্ক অ্যাপে অর্থপ্রদান অনুমোদিত", "உங்கள் வங்கிச் செயலியில் கட்டணம் ஒப்புதல்"), result: l("Success", "सफल", "সফল", "வெற்றி") },
    {
      kind: "outcome",
      title: l("Property tax paid", "संपत्ति कर भर दिया गया", "সম্পত্তি কর পরিশোধ হয়েছে", "சொத்து வரி செலுத்தப்பட்டது"),
      refPrefix: "TXN",
      lines: [l("₹2,450 to Nagar Nigam, Kanpur", "₹2,450 नगर निगम, कानपुर को", "₹2,450 নগর নিগম, কানপুরকে", "₹2,450 கான்பூர் நகர நிகத்துக்கு"), l("No dues left this year", "इस साल कोई बकाया नहीं", "এ বছর কোনো বকেয়া নেই", "இந்த ஆண்டு நிலுவை இல்லை")],
      href: "/prototype/track/",
      hrefLabel: l("View receipt", "रसीद देखें", "রসিদ দেখুন", "ரசீதைப் பார்"),
      effects: [
        { type: "markBillPaid", id: "taxes_property" },
        { type: "addApplication", service: l("Property tax 2026–27", "संपत्ति कर 2026–27", "সম্পত্তি কর 2026–27", "சொத்து வரி 2026–27"), refPrefix: "TXN", status: "approved" },
      ],
    },
    { kind: "suggestions", items: [ask(S.owed), GO_TRACK] },
  ];
}

function ayushman(): Block[] {
  return [
    { kind: "tool", source: "PM-JAY", ms: 1300, action: l("Ayushman card AB-2026-9921-3382", "आयुष्मान कार्ड AB-2026-9921-3382", "আয়ুষ্মান কার্ড AB-2026-9921-3382", "ஆயுஷ்மான் அட்டை AB-2026-9921-3382"), result: l("Ready", "तैयार", "প্রস্তুত", "தயார்") },
    {
      kind: "text",
      text: l(
        "Your Ayushman card was approved on 19 May and is ready. It gives your family ₹5 lakh of hospital cover a year. You can collect it from CSC Civil Lines, or I can save it to your DigiLocker right now.",
        "आपका आयुष्मान कार्ड 19 मई को स्वीकृत हुआ और तैयार है। इससे आपके परिवार को सालाना ₹5 लाख का अस्पताल कवर मिलता है। आप इसे सीएससी सिविल लाइन्स से ले सकते हैं, या मैं इसे अभी आपके डिजीलॉकर में सहेज सकता हूँ।",
        "আপনার আয়ুষ্মান কার্ড ১৯ মে অনুমোদিত হয়েছে এবং প্রস্তুত। এতে আপনার পরিবার বছরে ₹৫ লাখের হাসপাতাল কভার পায়। সিএসসি সিভিল লাইনস থেকে নিতে পারেন, অথবা আমি এখনই আপনার ডিজিলকারে রাখতে পারি।",
        "உங்கள் ஆயுஷ்மான் அட்டை மே 19 அன்று அங்கீகரிக்கப்பட்டு தயாராக உள்ளது. இது உங்கள் குடும்பத்துக்கு ஆண்டுக்கு ₹5 லட்சம் மருத்துவமனைக் காப்பீடு தரும். CSC சிவில் லைன்ஸில் பெறலாம், அல்லது இப்போதே உங்கள் டிஜிலாக்கரில் சேமிக்கலாம்.",
      ),
    },
    { kind: "cards", cards: [{ kind: "app", appId: "app_ayushman", note: l("Approved by S. Reddy · 19 May", "एस. रेड्डी द्वारा स्वीकृत · 19 मई", "এস. রেড্ডি অনুমোদিত · ১৯ মে", "எஸ். ரெட்டி அங்கீகரித்தார் · மே 19") }] },
    {
      kind: "consent",
      title: l("Save your Ayushman card to DigiLocker?", "आयुष्मान कार्ड डिजीलॉकर में सहेजें?", "আয়ুষ্মান কার্ড ডিজিলকারে রাখবেন?", "ஆயுஷ்மான் அட்டையை டிஜிலாக்கரில் சேமிக்கவா?"),
      recipient: l("National Health Authority → DigiLocker", "राष्ट्रीय स्वास्थ्य प्राधिकरण → डिजीलॉकर", "জাতীয় স্বাস্থ্য কর্তৃপক্ষ → ডিজিলকার", "தேசிய சுகாதார ஆணையம் → டிஜிலாக்கர்"),
      items: [l("Card number and family members", "कार्ड नंबर और परिवार के सदस्य", "কার্ড নম্বর ও পরিবারের সদস্য", "அட்டை எண் மற்றும் குடும்ப உறுப்பினர்கள்")],
      validity: l("Until you remove it", "जब तक आप न हटाएँ", "যতক্ষণ না আপনি সরান", "நீங்கள் நீக்கும் வரை"),
      approve: l("Approve and save", "मंज़ूर करें और सहेजें", "অনুমোদন করে রাখুন", "ஒப்புதல் அளித்துச் சேமி"),
    },
    {
      kind: "outcome",
      title: l("Ayushman card saved", "आयुष्मान कार्ड सहेजा गया", "আয়ুষ্মান কার্ড রাখা হয়েছে", "ஆயுஷ்மான் அட்டை சேமிக்கப்பட்டது"),
      refPrefix: "ACK",
      lines: [l("Show it at any empanelled hospital", "किसी भी सूचीबद्ध अस्पताल में दिखाएँ", "যেকোনো তালিকাভুক্ত হাসপাতালে দেখান", "எந்தப் பட்டியலிடப்பட்ட மருத்துவமனையிலும் காட்டலாம்")],
      href: "/prototype/me/#wallet",
      hrefLabel: l("Open wallet", "वॉलेट खोलें", "ওয়ালেট খুলুন", "பணப்பையைத் திற"),
      effects: [{ type: "addApplication", service: l("Ayushman card download", "आयुष्मान कार्ड डाउनलोड", "আয়ুষ্মান কার্ড ডাউনলোড", "ஆயுஷ்மான் அட்டை பதிவிறக்கம்"), refPrefix: "ACK", status: "ready" }],
    },
    { kind: "suggestions", items: [{ label: l("Find a hospital", "अस्पताल खोजें", "হাসপাতাল খুঁজুন", "மருத்துவமனையைத் தேடு"), href: "/prototype/apply/?id=health_hospital" }, ask(S.owed)] },
  ];
}

function father(): Block[] {
  return [
    { kind: "thinking", label: l("Checking Ramesh Verma's pension", "रमेश वर्मा की पेंशन जाँच रहा हूँ", "রমেশ ভার্মার পেনশন দেখছি", "ரமேஷ் வர்மாவின் ஓய்வூதியத்தைச் சரிபார்க்கிறேன்"), ms: 1000 },
    { kind: "tool", source: "NSAP", ms: 1200, action: l("Old-age pension · Ramesh Verma", "वृद्धावस्था पेंशन · रमेश वर्मा", "বার্ধক্য পেনশন · রমেশ ভার্মা", "முதியோர் ஓய்வூதியம் · ரமேஷ் வர்மா"), result: l("Life certificate due 30 Nov", "जीवन प्रमाण 30 नवंबर तक", "জীবন প্রমাণ ৩০ নভেম্বরের মধ্যে", "வாழ்நாள் சான்று நவ. 30-க்குள்") },
    {
      kind: "text",
      text: l(
        "Your father's pension continues only if his life certificate is renewed every year. He can do it from home with a face scan on this phone — no bank visit. I'll switch to helping him so every step is clearly marked as his.",
        "आपके पिताजी की पेंशन तभी जारी रहेगी जब हर साल जीवन प्रमाण जमा हो। वे इस फ़ोन पर चेहरा स्कैन करके घर से ही यह कर सकते हैं — बैंक जाने की ज़रूरत नहीं। मैं उनकी मदद वाले मोड में जा रहा हूँ ताकि हर कदम साफ़ तौर पर उनके नाम दिखे।",
        "প্রতি বছর জীবন প্রমাণপত্র নবীকরণ হলে তবেই আপনার বাবার পেনশন চলবে। এই ফোনে মুখ স্ক্যান করে বাড়ি থেকেই করা যায় — ব্যাঙ্কে যেতে হবে না। আমি তাঁকে সাহায্য করার মোডে যাচ্ছি, যাতে প্রতিটি ধাপ স্পষ্টভাবে তাঁর নামে থাকে।",
        "ஒவ்வொரு ஆண்டும் வாழ்நாள் சான்றிதழ் புதுப்பிக்கப்பட்டால் மட்டுமே உங்கள் அப்பாவின் ஓய்வூதியம் தொடரும். இந்தத் தொலைபேசியில் முக ஸ்கேன் மூலம் வீட்டிலிருந்தே செய்யலாம் — வங்கி செல்ல வேண்டாம். ஒவ்வொரு படியும் அவருடையது எனத் தெளிவாகத் தெரிய, அவருக்கு உதவும் பயன்முறைக்கு மாறுகிறேன்.",
      ),
    },
    {
      kind: "plan",
      title: l("Plan", "योजना", "পরিকল্পনা", "திட்டம்"),
      steps: [
        l("Help Ramesh Verma (proxy mode)", "रमेश वर्मा की मदद (प्रॉक्सी मोड)", "রমেশ ভার্মাকে সাহায্য (প্রক্সি মোড)", "ரமேஷ் வர்மாவுக்கு உதவி (பதிலாள் பயன்முறை)"),
        l("Face authentication with Jeevan Pramaan", "जीवन प्रमाण से चेहरा सत्यापन", "জীবন প্রমাণে মুখ যাচাই", "ஜீவன் பிரமாணில் முக அங்கீகாரம்"),
        l("Send certificate to the pension office", "प्रमाण पेंशन कार्यालय भेजना", "প্রমাণপত্র পেনশন অফিসে পাঠানো", "சான்றை ஓய்வூதிய அலுவலகத்துக்கு அனுப்புதல்"),
      ],
    },
    {
      kind: "consent",
      title: l("Act for Ramesh Verma and share his details?", "रमेश वर्मा की ओर से कार्य करें और विवरण साझा करें?", "রমেশ ভার্মার হয়ে কাজ করে তাঁর তথ্য শেয়ার করবেন?", "ரமேஷ் வர்மாவுக்காகச் செயல்பட்டு விவரங்களைப் பகிரவா?"),
      recipient: l("Pension disbursing office, Kanpur", "पेंशन वितरण कार्यालय, कानपुर", "পেনশন বিতরণ অফিস, কানপুর", "ஓய்வூதியம் வழங்கும் அலுவலகம், கான்பூர்"),
      items: [
        l("Ramesh's Aadhaar face authentication", "रमेश का आधार चेहरा सत्यापन", "রমেশের আধার মুখ যাচাই", "ரமேஷின் ஆதார் முக அங்கீகாரம்"),
        l("Pension ID and bank account", "पेंशन आईडी और बैंक खाता", "পেনশন আইডি ও ব্যাঙ্ক অ্যাকাউন্ট", "ஓய்வூதிய அடையாள எண் மற்றும் வங்கிக் கணக்கு"),
      ],
      validity: l("For this certificate only", "केवल इस प्रमाण के लिए", "শুধু এই প্রমাণপত্রের জন্য", "இந்தச் சான்றிதழுக்கு மட்டும்"),
      approve: l("Ramesh approves", "रमेश मंज़ूर करते हैं", "রমেশ অনুমোদন করছেন", "ரமேஷ் ஒப்புதல் அளிக்கிறார்"),
      editHref: "/prototype/apply/?id=money_oldage",
    },
    { kind: "tool", source: "Jeevan Pramaan", planStep: 1, ms: 1700, action: l("Face matched with Aadhaar", "चेहरा आधार से मिला", "মুখ আধারের সাথে মিলেছে", "முகம் ஆதாருடன் பொருந்தியது"), result: l("Verified", "सत्यापित", "যাচাই হয়েছে", "சரிபார்க்கப்பட்டது") },
    { kind: "tool", source: "NSAP", planStep: 2, ms: 1000, action: l("Certificate delivered", "प्रमाण भेजा गया", "প্রমাণপত্র পাঠানো হয়েছে", "சான்றிதழ் அனுப்பப்பட்டது"), result: l("Valid till Nov 2027", "नवंबर 2027 तक मान्य", "নভেম্বর 2027 পর্যন্ত বৈধ", "நவ. 2027 வரை செல்லும்") },
    {
      kind: "outcome",
      title: l("Life certificate submitted for Ramesh Verma", "रमेश वर्मा का जीवन प्रमाण जमा हुआ", "রমেশ ভার্মার জীবন প্রমাণপত্র জমা হয়েছে", "ரமேஷ் வர்மாவின் வாழ்நாள் சான்றிதழ் சமர்ப்பிக்கப்பட்டது"),
      refPrefix: "JPR",
      lines: [
        l("Pension continues without a break", "पेंशन बिना रुकावट जारी रहेगी", "পেনশন কোনো বিরতি ছাড়াই চলবে", "ஓய்வூதியம் தடையின்றித் தொடரும்"),
        l("You're now helping Ramesh — see the banner at the top", "अब आप रमेश की मदद कर रहे हैं — ऊपर बैनर देखें", "এখন আপনি রমেশকে সাহায্য করছেন — উপরে ব্যানার দেখুন", "இப்போது ரமேஷுக்கு உதவுகிறீர்கள் — மேலே பதாகையைப் பாருங்கள்"),
      ],
      href: "/prototype/track/",
      hrefLabel: l("View in Track", "ट्रैक में देखें", "ট্র্যাকে দেখুন", "கண்காணிப்பில் பார்"),
      effects: [
        { type: "setProxy", id: "m_ramesh" },
        { type: "addApplication", service: l("Life certificate · Ramesh Verma", "जीवन प्रमाण · रमेश वर्मा", "জীবন প্রমাণ · রমেশ ভার্মা", "வாழ்நாள் சான்று · ரமேஷ் வர்மா"), refPrefix: "JPR", status: "approved" },
      ],
    },
    { kind: "suggestions", items: [{ label: l("Stop helping Ramesh", "रमेश की मदद बंद करें", "রমেশকে সাহায্য বন্ধ করুন", "ரமேஷுக்கு உதவுவதை நிறுத்து"), href: "/prototype/me/" }, GO_TRACK] },
  ];
}

const LANGUAGE_REPLY: Record<"en" | "hi" | "bn" | "ta", L> = {
  hi: l("Okay — I'll speak Hindi from now on. Everything in Saathi has switched.", "ठीक है — अब से मैं हिंदी में बात करूँगा। साथी में सब कुछ बदल गया है।", "ঠিক আছে — এখন থেকে আমি হিন্দিতে কথা বলব। সাথীর সবকিছু বদলে গেছে।", "சரி — இனி இந்தியில் பேசுவேன். சாத்தியில் அனைத்தும் மாறிவிட்டது."),
  bn: l("Okay — I'll speak Bengali from now on.", "ठीक है — अब से मैं बांग्ला में बात करूँगा।", "ঠিক আছে — এখন থেকে আমি বাংলায় কথা বলব। সাথীর সবকিছু বদলে গেছে।", "சரி — இனி வங்காளத்தில் பேசுவேன்."),
  ta: l("Okay — I'll speak Tamil from now on.", "ठीक है — अब से मैं तमिल में बात करूँगा।", "ঠিক আছে — এখন থেকে আমি তামিলে কথা বলব।", "சரி — இனி தமிழில் பேசுவேன். சாத்தியில் அனைத்தும் மாறிவிட்டது."),
  en: l("Okay — I'll speak English from now on. Everything in Saathi has switched.", "ठीक है — अब से मैं अंग्रेज़ी में बात करूँगा।", "ঠিক আছে — এখন থেকে আমি ইংরেজিতে কথা বলব।", "சரி — இனி ஆங்கிலத்தில் பேசுவேன்."),
};

/** The confirmation, written in the language just switched to (the reply renders after the switch). */
const SWITCHED: Partial<Record<Locale, string>> = {
  te: "సరే — సాథీ ఇప్పుడు తెలుగులో ఉంది. ప్రతి స్క్రీన్ మారిపోయింది.",
  mr: "ठीक आहे — साथी आता मराठीत आहे. प्रत्येक स्क्रीन बदलली आहे.",
  ur: "ٹھیک ہے — ساتھی اب اردو میں ہے۔ ہر اسکرین بدل گئی ہے۔",
  gu: "સારું — સાથી હવે ગુજરાતીમાં છે. દરેક સ્ક્રીન બદલાઈ ગઈ છે.",
  kn: "ಸರಿ — ಸಾಥಿ ಈಗ ಕನ್ನಡದಲ್ಲಿದೆ. ಪ್ರತಿಯೊಂದು ಪರದೆಯೂ ಬದಲಾಗಿದೆ.",
  ml: "ശരി — സാഥി ഇപ്പോൾ മലയാളത്തിലാണ്. എല്ലാ സ്ക്രീനുകളും മാറി.",
  or: "ଠିକ୍ ଅଛି — ସାଥୀ ଏବେ ଓଡ଼ିଆରେ। ପ୍ରତ୍ୟେକ ସ୍କ୍ରିନ୍ ବଦଳିଗଲା।",
  pa: "ਠੀਕ ਹੈ — ਸਾਥੀ ਹੁਣ ਪੰਜਾਬੀ ਵਿੱਚ ਹੈ। ਹਰ ਸਕ੍ਰੀਨ ਬਦਲ ਗਈ ਹੈ।",
  as: "ঠিক আছে — সাথী এতিয়া অসমীয়াত। প্ৰতিখন স্ক্ৰীণ সলনি হৈছে।",
  ne: "ठिक छ — साथी अब नेपालीमा छ। हरेक स्क्रिन बदलिएको छ।",
  mai: "ठीक अछि — साथी आब मैथिलीमे अछि। सभ स्क्रीन बदलि गेल अछि।",
  sd: "ٺيڪ آهي — ساٿي هاڻي سنڌيءَ ۾ آهي. هر اسڪرين بدلجي وئي آهي.",
  kok: "बरें — साथी आतां कोंकणींत आसा. दरेक स्क्रीन बदल्ला.",
};

const switchedTo = (target: Locale) => {
  const name = localeMeta[target].native;
  return {
    ...l(`Okay — Saathi is now in ${name}. Every screen has switched.`, `ठीक है — साथी अब ${name} में है। हर स्क्रीन बदल गई है।`, `ঠিক আছে — সাথী এখন ${name}-এ। প্রতিটি স্ক্রিন বদলে গেছে।`, `சரி — சாத்தி இப்போது ${name}-இல். ஒவ்வொரு திரையும் மாறிவிட்டது.`),
    ...(SWITCHED[target] ? { [target]: SWITCHED[target] } : {}),
  };
};

/** A planned language was asked for: say so plainly, in the language Saathi is speaking now, and don't switch. */
const comingSoon = (target: Locale) => {
  const name = localeMeta[target].native;
  const n = availableLocales.length;
  return {
    ...l(
      `${name} (${localeMeta[target].label}) is coming soon to Saathi. Until then, choose from the ${n} languages that are ready.`,
      `${name} जल्द ही साथी में आ रही है। तब तक, तैयार ${n} भाषाओं में से कोई चुनें।`,
      `${name} শিগগিরই সাথীতে আসছে। ততদিন, প্রস্তুত ${n}টি ভাষা থেকে একটি বেছে নিন।`,
      `${name} விரைவில் சாத்தியில் வருகிறது. அதுவரை, தயாராக உள்ள ${n} மொழிகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.`,
    ),
    te: `${name} త్వరలో సాథీలోకి వస్తోంది. అప్పటివరకు, సిద్ధంగా ఉన్న ${n} భాషల్లో ఒకదాన్ని ఎంచుకోండి.`,
    mr: `${name} लवकरच साथीमध्ये येत आहे. तोपर्यंत, तयार असलेल्या ${n} भाषांपैकी एक निवडा.`,
    ur: `${name} جلد ہی ساتھی میں آ رہی ہے۔ تب تک، تیار ${n} زبانوں میں سے کوئی ایک چنیں۔`,
    gu: `${name} ટૂંક સમયમાં સાથીમાં આવી રહી છે. ત્યાં સુધી, તૈયાર ${n} ભાષાઓમાંથી એક પસંદ કરો.`,
    kn: `${name} ಶೀಘ್ರದಲ್ಲೇ ಸಾಥಿಗೆ ಬರಲಿದೆ. ಅಲ್ಲಿಯವರೆಗೆ, ಸಿದ್ಧವಿರುವ ${n} ಭಾಷೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ.`,
    ml: `${name} ഉടൻ സാഥിയിൽ എത്തും. അതുവരെ, തയ്യാറായ ${n} ഭാഷകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കൂ.`,
    or: `${name} ଶୀଘ୍ର ସାଥୀକୁ ଆସୁଛି। ସେପର୍ଯ୍ୟନ୍ତ, ପ୍ରସ୍ତୁତ ${n}ଟି ଭାଷାରୁ ଗୋଟିଏ ବାଛନ୍ତୁ।`,
    pa: `${name} ਜਲਦੀ ਹੀ ਸਾਥੀ ਵਿੱਚ ਆ ਰਹੀ ਹੈ। ਉਦੋਂ ਤੱਕ, ਤਿਆਰ ${n} ਭਾਸ਼ਾਵਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ।`,
    as: `${name} সোনকালে সাথীলৈ আহিব। তেতিয়ালৈকে, সাজু হৈ থকা ${n}টা ভাষাৰ পৰা এটা বাছি লওক।`,
    ne: `${name} छिट्टै साथीमा आउँदैछ। त्यतिन्जेल, तयार ${n} भाषामध्ये एउटा छान्नुहोस्।`,
    mai: `${name} जल्दी साथीमे आबि रहल अछि। ता धरि, तैयार ${n} भाषामे सँ कोनो एकटा चुनू।`,
    sd: `${name} جلد ساٿيءَ ۾ اچي رهي آهي. تيستائين، تيار ${n} ٻولين مان ڪا هڪ چونڊيو.`,
    kok: `${name} बेगीनूच साथींत येता. तोमेरेन, तयार आशिल्ल्या ${n} भासां मदली एक वेंचात.`,
  };
};

function language(text: string, ctx: MissionContext): Block[] {
  const target = detectLanguageRequest(text) ?? (ctx.locale === "hi" ? "en" : "hi");
  if (!isAvailableLocale(target)) {
    return [
      { kind: "text", text: comingSoon(target) },
      { kind: "suggestions", items: [ask(S.birth), ask(S.owed), ask(S.tax)] },
    ];
  }
  return [
    { kind: "thinking", label: l("Switching language", "भाषा बदल रहा हूँ", "ভাষা বদলাচ্ছি", "மொழியை மாற்றுகிறேன்"), ms: 700 },
    {
      kind: "outcome",
      title: isCoreLocale(target) ? LANGUAGE_REPLY[target] : switchedTo(target),
      refPrefix: "",
      lines: [],
      effects: [{ type: "setLocale", locale: target }],
    },
    { kind: "suggestions", items: [ask(S.birth), ask(S.owed), ask(S.tax)] },
  ];
}

function help(): Block[] {
  return [
    {
      kind: "text",
      text: l(
        "Of course. A trained person can help you in person or on the phone, free of charge. I'll share what you've done so far so you don't have to repeat yourself.",
        "ज़रूर। एक प्रशिक्षित व्यक्ति आपकी सामने या फ़ोन पर मुफ़्त में मदद कर सकता है। आपने अब तक जो किया है, मैं वह साझा कर दूँगा ताकि आपको दोहराना न पड़े।",
        "অবশ্যই। একজন প্রশিক্ষিত মানুষ বিনামূল্যে সরাসরি বা ফোনে সাহায্য করতে পারেন। আপনি এ পর্যন্ত যা করেছেন তা শেয়ার করব, যাতে আবার বলতে না হয়।",
        "நிச்சயமாக. பயிற்சி பெற்ற ஒருவர் நேரிலோ தொலைபேசியிலோ இலவசமாக உதவுவார். இதுவரை நீங்கள் செய்ததைப் பகிர்வேன், மீண்டும் சொல்ல வேண்டியதில்லை.",
      ),
    },
    {
      kind: "cards",
      cards: [
        { kind: "place", title: "CSC Civil Lines", sub: l("Mall Road, Kanpur Nagar · open till 7 PM", "मॉल रोड, कानपुर नगर · शाम 7 बजे तक खुला", "মল রোড, কানপুর নগর · সন্ধ্যা ৭টা পর্যন্ত খোলা", "மால் ரோடு, கான்பூர் நகர் · மாலை 7 வரை"), distance: "0.8 km" },
        { kind: "place", title: "Helpline 1800 000 0000", sub: l("8 AM – 10 PM · 12 languages (sample number)", "सुबह 8 – रात 10 · 12 भाषाएँ (नमूना नंबर)", "সকাল ৮ – রাত ১০ · ১২টি ভাষা (নমুনা নম্বর)", "காலை 8 – இரவு 10 · 12 மொழிகள் (மாதிரி எண்)"), distance: "" },
      ],
    },
    { kind: "suggestions", items: [ask(S.birth), ask(S.tax), ask(S.ayushman)] },
  ];
}

function track(): Block[] {
  return [
    { kind: "tool", source: "Saathi", ms: 900, action: l("Your applications", "आपके आवेदन", "আপনার আবেদন", "உங்கள் விண்ணப்பங்கள்"), result: l("2 in progress", "2 प्रगति में", "২টি চলছে", "2 நடப்பில்") },
    {
      kind: "text",
      text: l("Here's where things stand. Tap any card for the full timeline.", "यह रही स्थिति। पूरी समयरेखा के लिए किसी भी कार्ड पर टैप करें।", "এই হলো অবস্থা। পুরো সময়রেখার জন্য যেকোনো কার্ডে ট্যাপ করুন।", "நிலவரம் இதோ. முழுக் காலவரிசைக்கு எந்த அட்டையையும் தட்டுங்கள்."),
    },
    {
      kind: "cards",
      cards: [
        { kind: "app", appId: "app_birth", note: l("Document verification · about 5 days", "दस्तावेज़ सत्यापन · लगभग 5 दिन", "নথি যাচাই · প্রায় ৫ দিন", "ஆவணச் சரிபார்ப்பு · சுமார் 5 நாட்கள்") },
        { kind: "app", appId: "app_pmkisan", note: l("Under review · about 3 days", "समीक्षा में · लगभग 3 दिन", "পর্যালোচনাধীন · প্রায় ৩ দিন", "பரிசீலனையில் · சுமார் 3 நாட்கள்") },
      ],
    },
    { kind: "suggestions", items: [GO_TRACK, ask(S.ayushman)] },
  ];
}

function fallback(text = ""): Block[] {
  const near = closestTopics(text);
  if (near.length) {
    return [
      {
        kind: "text",
        text: l(
          "I want to be sure I get this right. Did you mean one of these? I can explain any of them in detail — or connect you to a person.",
          "मैं यह सही समझना चाहता हूँ। क्या आपका मतलब इनमें से किसी से था? मैं इनमें से कुछ भी विस्तार से समझा सकता हूँ — या किसी व्यक्ति से जोड़ सकता हूँ।",
          "আমি ঠিকঠাক বুঝতে চাই। আপনি কি এগুলোর কোনোটি বোঝাতে চেয়েছেন? যেকোনোটি বিস্তারিত বোঝাতে পারি — বা একজন মানুষের সাথে যুক্ত করতে পারি।",
          "இதைச் சரியாகப் புரிந்துகொள்ள விரும்புகிறேன். இவற்றில் ஒன்றைக் குறிப்பிட்டீர்களா? எதையும் விரிவாக விளக்குவேன் — அல்லது ஒரு மனிதருடன் இணைப்பேன்.",
        ),
      },
      { kind: "suggestions", items: [...near, ask(S.human)] },
    ];
  }
  return [
    {
      kind: "text",
      text: l(
        "I'm not sure I understood that yet. You can ask me about any government service — its documents, fees, time or steps — or ask me to do it for you. A few ideas:",
        "मैं अभी यह ठीक से समझ नहीं पाया। आप किसी भी सरकारी सेवा के बारे में पूछ सकते हैं — दस्तावेज़, शुल्क, समय या चरण — या मुझसे वह काम करवा सकते हैं। कुछ सुझाव:",
        "আমি এখনও ঠিক বুঝতে পারিনি। যেকোনো সরকারি পরিষেবা নিয়ে জিজ্ঞেস করতে পারেন — নথি, ফি, সময় বা ধাপ — বা কাজটি আমাকে দিয়ে করাতে পারেন। কয়েকটি ভাবনা:",
        "அதை இன்னும் சரியாகப் புரிந்துகொள்ளவில்லை. எந்த அரசுச் சேவையைப் பற்றியும் கேட்கலாம் — ஆவணங்கள், கட்டணம், நேரம், படிகள் — அல்லது அதை என்னிடம் செய்யச் சொல்லலாம். சில யோசனைகள்:",
      ),
    },
    { kind: "suggestions", items: [...POPULAR.slice(0, 3), ask(S.birth), ask(S.human)] },
  ];
}

/* ------------------------------------------------- several questions --- */

const ACTING: MissionId[] = ["newBaby", "tax", "ayushman", "father", "owed", "language"];

function compound(text: string, ctx: MissionContext): Block[] {
  const parts = splitQuestions(text);
  const routed = parts.map((p) => ({ text: p, route: routeOne(p) })).filter((r) => r.route.mission !== "fallback" && r.route.mission !== "compound");
  // Explanations first; at most one task, last — so a consent pause never hides an answer.
  const answers = routed.filter((r) => !ACTING.includes(r.route.mission));
  const tasks = routed.filter((r) => ACTING.includes(r.route.mission));
  const ordered = [...answers, ...tasks.slice(0, 1)];
  const deferred = tasks.slice(1);

  const n = ordered.length;
  const blocks: Block[] = [
    {
      kind: "text",
      text: {
        en: `You asked about ${n} things — I'll take them one at a time.`,
        hi: `आपने ${n} बातें पूछीं — मैं एक-एक करके बताता हूँ।`,
        bn: `আপনি ${n}টি বিষয় জিজ্ঞেস করেছেন — একে একে বলছি।`,
        ta: `நீங்கள் ${n} விஷயங்கள் கேட்டீர்கள் — ஒவ்வொன்றாகச் சொல்கிறேன்.`,
      },
    },
  ];
  const suggestions: Suggestion[] = [];
  ordered.forEach((r, i) => {
    const label: L =
      r.route.mission === "answer" && r.route.param
        ? topicName(r.route.param)
        : { en: `“${r.text}”`, hi: `“${r.text}”`, bn: `“${r.text}”`, ta: `“${r.text}”` };
    blocks.push({
      kind: "text",
      text: { en: `${i + 1} of ${n} — ${label.en}`, hi: `${n} में से ${i + 1} — ${label.hi}`, bn: `${n}-এর ${i + 1} — ${label.bn}`, ta: `${n}-இல் ${i + 1} — ${label.ta}` },
    });
    const part = buildMission(r.route.mission, ctx, r.text, r.route.param).blocks;
    for (const b of part) {
      if (b.kind === "suggestions") suggestions.push(...b.items);
      else blocks.push(b);
    }
  });
  for (const d of deferred) suggestions.unshift({ label: { en: d.text, hi: d.text, bn: d.text, ta: d.text }, send: { en: d.text, hi: d.text, bn: d.text, ta: d.text } });
  const seen = new Set<string>();
  const unique = suggestions.filter((s) => (seen.has(s.label.en) ? false : (seen.add(s.label.en), true))).slice(0, 5);
  // A task's own suggestions arrive after its consent; keep them there by appending last.
  if (unique.length) blocks.push({ kind: "suggestions", items: unique });
  return blocks;
}

function schemeExplain(schemeId: string): Block[] {
  const scheme = getScheme(schemeId);
  if (!scheme) return fallback();
  const name = scheme.name;
  const reasons = scheme.eligibility.map((e) => loc(e, "en"));
  return [
    { kind: "tool", source: "myScheme", ms: 1000, action: name, result: l("Rules checked", "नियम जाँचे", "নিয়ম যাচাই হয়েছে", "விதிகள் சரிபார்க்கப்பட்டன") },
    {
      kind: "text",
      text: {
        en: `${name.en}: ${scheme.desc.en}. You may qualify because: ${reasons.join("; ")}. I'll verify these with official records when you apply.`,
        hi: `${name.hi}: ${scheme.desc.hi}। आप पात्र हो सकते हैं क्योंकि: ${scheme.eligibility.map((e) => e.hi).join("; ")}। आवेदन के समय मैं इन्हें आधिकारिक रिकॉर्ड से जाँचूँगा।`,
        bn: `${name.bn}: ${scheme.desc.bn}। আপনি যোগ্য হতে পারেন কারণ: ${scheme.eligibility.map((e) => e.bn).join("; ")}। আবেদনের সময় সরকারি রেকর্ডে যাচাই করব।`,
        ta: `${name.ta}: ${scheme.desc.ta}. நீங்கள் தகுதி பெறலாம்: ${scheme.eligibility.map((e) => e.ta).join("; ")}. விண்ணப்பிக்கும்போது அதிகாரப்பூர்வப் பதிவுகளுடன் சரிபார்ப்பேன்.`,
      },
    },
    { kind: "cards", cards: [{ kind: "scheme", schemeId, reason: scheme.eligibility[0] }] },
    {
      kind: "suggestions",
      items: [
        { label: l("Apply now", "अभी आवेदन करें", "এখনই আবেদন করুন", "இப்போது விண்ணப்பி"), href: `/prototype/apply/?id=${schemeId}` },
        ask(S.owed),
      ],
    },
  ];
}

function statusExplain(appId: string, ctx: MissionContext): Block[] {
  const app = APPLICATIONS.find((a) => a.id === appId);
  if (!app) return track();
  const steps = buildTimeline(app, ctx.locale);
  const current = steps.find((s) => s.state === "current");
  const done = !current;
  const text: L = done
    ? l("This application is complete — nothing is waiting on you.", "यह आवेदन पूरा हो गया है — आपकी ओर से कुछ बाकी नहीं।", "এই আবেদন সম্পূর্ণ — আপনার দিক থেকে কিছু বাকি নেই।", "இந்த விண்ணப்பம் முடிந்தது — உங்கள் பக்கம் எதுவும் நிலுவையில் இல்லை.")
    : l(
        "It's at the stage shown below, with a named officer and an expected date. It's within the normal time, so no action is needed yet. If it passes the date, I can raise a grievance on CPGRAMS for you.",
        "यह नीचे दिखाए चरण पर है, नामित अधिकारी और अपेक्षित तारीख के साथ। यह सामान्य समय के भीतर है, इसलिए अभी कुछ करने की ज़रूरत नहीं। तारीख निकल जाए तो मैं सीपीग्राम्स पर शिकायत दर्ज कर सकता हूँ।",
        "এটি নিচে দেখানো ধাপে আছে, নির্দিষ্ট আধিকারিক ও প্রত্যাশিত তারিখ সহ। স্বাভাবিক সময়ের মধ্যেই আছে, তাই এখন কিছু করার দরকার নেই। তারিখ পেরোলে আমি সিপিগ্রামসে অভিযোগ করতে পারি।",
        "கீழே காட்டிய நிலையில், பெயரிடப்பட்ட அதிகாரி மற்றும் எதிர்பார்க்கும் தேதியுடன் உள்ளது. இயல்பான நேரத்துக்குள் உள்ளது, இப்போது எதுவும் செய்ய வேண்டாம். தேதி கடந்தால் CPGRAMS-இல் புகார் பதிவு செய்யலாம்.",
      );
  return [
    { kind: "tool", source: "e-District", ms: 1000, action: app.service, result: current ? { en: current.name, hi: current.name, bn: current.name, ta: current.name } : l("Complete", "पूर्ण", "সম্পূর্ণ", "முடிந்தது") },
    { kind: "text", text },
    { kind: "cards", cards: [{ kind: "app", appId, note: current?.dateLabel ? { en: current.dateLabel, hi: current.dateLabel, bn: current.dateLabel, ta: current.dateLabel } : app.service }] },
    {
      kind: "suggestions",
      items: [
        { label: l("Open full timeline", "पूरी समयरेखा खोलें", "পুরো সময়রেখা খুলুন", "முழுக் காலவரிசையைத் திற"), href: `/prototype/status/?id=${appId}` },
        { label: l("Raise a grievance", "शिकायत दर्ज करें", "অভিযোগ দাখিল করুন", "புகார் பதிவு செய்"), href: "/prototype/apply/?id=griev_file" },
      ],
    },
  ];
}

/* ---------------------------------------------------------- builder --- */

export function buildMission(id: MissionId, ctx: MissionContext, text = "", param?: string): Mission {
  const blocks: Record<MissionId, () => Block[]> = {
    newBaby,
    owed,
    tax: () => tax(ctx),
    ayushman,
    father,
    language: () => language(text, ctx),
    help,
    track,
    fallback: () => fallback(text),
    scheme: () => schemeExplain(param ?? ""),
    status: () => statusExplain(param ?? "", ctx),
    answer: () => (param ? topicAnswer(param, detectFocus(text), ctx.locale) : fallback(text)),
    faq: () => (param ? faqAnswer(param as FaqId) : fallback(text)),
    compound: () => compound(text, ctx),
  };
  return { id, blocks: blocks[id]() };
}

/** Starter suggestions for an empty conversation. */
export const STARTERS: Suggestion[] = [ask(S.birth), ask(S.owed), ask(S.tax), ask(S.ayushman), ask(S.father), ask(S.hindi)];

export const ALL_MISSIONS: MissionId[] = ["newBaby", "owed", "tax", "ayushman", "father", "language", "help", "track", "fallback"];
