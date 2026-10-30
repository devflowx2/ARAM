/* =========================================================================
   ARAM PHOTOGRAPHY — SITE CONFIGURATION
   -------------------------------------------------------------------------
   This is the ONLY file you need to edit to put your own content on the site.
   Everything is plain text between quotes "like this".

   • Leave a value as "" (empty quotes) when you do not have it yet — the site
     will show an elegant placeholder instead of a broken image or link.
   • File paths are relative to index.html. Example: "assets/images/one.jpg"
   • Keep the commas between items. If something stops working, check for a
     missing comma or quote.
   ========================================================================= */

window.SITE_CONFIG = {

  /* ---------------------------------------------------------------- BASICS */
  name: "Aram Photography",                                  // shown big on the intro, hero and footer
  siteTitle: "Aram Photography — Visual Stories Through the Lens",   // browser tab title
  description: "Portfolio of Aram Photography — photographer and visual storyteller.",
  introSubtitle: "Photographer · Visual Storyteller",  // text under the name in the camera intro
  heroEyebrow: "Visual stories through the lens",

  /* ------------------------------------------------------------------ HERO */
  hero: {
    tagline: "Every frame holds a story.",
    ctaLabel: "View the frames",

    // ADD YOUR HERO PHOTOGRAPH HERE  (e.g. "assets/images/hero.jpg") — or leave "" and use a video
    image: "",
    imageAlt: "Describe your hero photograph here",

    // ADD YOUR HERO VIDEO FILE HERE  (e.g. "assets/videos/hero.mp4"). Plays muted, looped, no sound.
    video: "",
    // Optional smaller/lighter file used on phones (recommended: under 3 MB).
    videoMobile: "",
    // Optional still image shown before the video loads / when motion is reduced.
    poster: ""
  },

  /* --------------------------------------------------- PHOTOGRAPHY GALLERY */
  gallery: {
    heading: "Selected Frames",
    intro: "A slow reel of moments — hover to linger on a frame, click to step inside it.",
    speed: 45,                 // reel speed in pixels per second (lower = slower)

    /* To add a photograph: copy one { ... }, line and fill it in.
       src      → image shown in the reel (keep it ~1600px wide for speed)
       full     → optional bigger version used in the lightbox
       title    → name of the photograph
       category → short label, e.g. "Portrait", "Street", "Wedding"
       caption  → optional sentence shown in the lightbox
       year     → optional, e.g. "2025"
       alt      → description for screen readers (falls back to the title)
       shape    → frame proportion in the reel:
                  "portrait" | "landscape" | "square" | "tall" | "wide"
                  (your photo is cropped to fit the shape)                    */
    items: [
      // To add another photograph: copy a line below, change the file name in "src" (and title/category if you like).
      { src: "assets/images/photos/photo-01.jpg", full: "", title: "Frame 01", category: "", caption: "", year: "", alt: "Little boy holding a pink flower bouquet in front of a truck grille", shape: "landscape" },
      { src: "assets/images/photos/photo-06.jpg", full: "", title: "Frame 02", category: "", caption: "", year: "", alt: "Couple from behind with a large pink bouquet, selective colour", shape: "tall" },
      { src: "assets/images/photos/photo-02.jpg", full: "", title: "Frame 03", category: "", caption: "", year: "", alt: "Couple facing each other behind a wooden fence in a garden", shape: "wide" },
      { src: "assets/images/photos/photo-07.jpg", full: "", title: "Frame 04", category: "", caption: "", year: "", alt: "Couple showing their engagement rings, kiss on the cheek", shape: "tall" },
      { src: "assets/images/photos/photo-03.jpg", full: "", title: "Frame 05", category: "", caption: "", year: "", alt: "Groom holding the bride's hand in a green park", shape: "wide" },
      { src: "assets/images/photos/photo-09.jpg", full: "", title: "Frame 06", category: "", caption: "", year: "", alt: "Groom in a brown suit adjusting his pocket square among flowers", shape: "tall" },
      { src: "assets/images/photos/photo-04.jpg", full: "", title: "Frame 07", category: "", caption: "", year: "", alt: "Couple making a heart shape with their hands", shape: "wide" },
      { src: "assets/images/photos/photo-10.jpg", full: "", title: "Frame 08", category: "", caption: "", year: "", alt: "Smiling bride in a hijab showing her ring in a garden", shape: "tall" },
      { src: "assets/images/photos/photo-05.jpg", full: "", title: "Frame 09", category: "", caption: "", year: "", alt: "Proposal in front of a white flower heart arch with a neon sign", shape: "wide" },
      { src: "assets/images/photos/photo-13.jpg", full: "", title: "Frame 10", category: "", caption: "", year: "", alt: "Groom dancing with the bride in a pearl-covered veil", shape: "tall" },
      { src: "assets/images/photos/photo-08.jpg", full: "", title: "Frame 11", category: "", caption: "", year: "", alt: "Couple dancing in front of a white flower heart arch", shape: "wide" },
      { src: "assets/images/photos/photo-14.jpg", full: "", title: "Frame 12", category: "", caption: "", year: "", alt: "Bride portrait in a lace gown with a pearl veil", shape: "tall" },
      { src: "assets/images/photos/photo-11.jpg", full: "", title: "Frame 13", category: "", caption: "", year: "", alt: "Black and white wedding portrait with shadows on a wall by a lake", shape: "landscape" },
      { src: "assets/images/photos/photo-16.jpg", full: "", title: "Frame 14", category: "", caption: "", year: "", alt: "Wedding couple under a large tree with red tulips", shape: "portrait" },
      { src: "assets/images/photos/photo-12.jpg", full: "", title: "Frame 15", category: "", caption: "", year: "", alt: "Bride and groom about to kiss beside a brick building", shape: "landscape" },
      { src: "assets/images/photos/photo-18.jpg", full: "", title: "Frame 16", category: "", caption: "", year: "", alt: "Little girl with long curly hair hugging a white dog", shape: "tall" },
      { src: "assets/images/photos/photo-15.jpg", full: "", title: "Frame 17", category: "", caption: "", year: "", alt: "Bride and groom holding hands beside a car decorated with white roses", shape: "landscape" },
      { src: "assets/images/photos/photo-20.jpg", full: "", title: "Frame 18", category: "", caption: "", year: "", alt: "Birthday cake and flowers at night with a woman in a purple dress", shape: "tall" },
      { src: "assets/images/photos/photo-17.jpg", full: "", title: "Frame 19", category: "", caption: "", year: "", alt: "Groom and bride in a pearl veil holding hands, side view", shape: "landscape" },
      { src: "assets/images/photos/photo-19.jpg", full: "", title: "Frame 20", category: "", caption: "", year: "", alt: "Silhouette of a couple kissing at sunset", shape: "landscape" }
    ]
  },

  /* ------------------------------------------------------- VIDEO PORTFOLIO
     (The Motion Stories section is turned OFF in index.html — see the comment there to turn it on.) */
  videos: {
    heading: "Motion Stories",
    subtitle: "Stories that move beyond a single frame.",

    /* The first video is the large featured one (or add  featured: true  to any item).
       src         → ADD YOUR VIDEO FILE HERE, e.g. "assets/videos/film-one.mp4"
       poster      → optional cover image, e.g. "assets/images/film-one.jpg"
       title / category / description / duration ("2:14") → text labels
       orientation → "landscape" (16:9) or "portrait" (3:4)                     */
    items: [
      { src: "", poster: "", title: "Film title 01", category: "Category", description: "Add a short description of this film here.", duration: "", orientation: "landscape", featured: true },
      { src: "", poster: "", title: "Film title 02", category: "Category", description: "", duration: "", orientation: "landscape" },
      { src: "", poster: "", title: "Film title 03", category: "Category", description: "", duration: "", orientation: "landscape" },
      { src: "", poster: "", title: "Film title 04", category: "Category", description: "", duration: "", orientation: "portrait" },
      { src: "", poster: "", title: "Film title 05", category: "Category", description: "", duration: "", orientation: "portrait" },
      { src: "", poster: "", title: "Film title 06", category: "Category", description: "", duration: "", orientation: "landscape" }
    ]
  },

  /* ------------------------------------------------------------ BUSINESS CARD */
  card: {
    heading: "The Card",
    text: "Keep it close — everything you need to reach me, on one card.",
    front: "assets/images/card-front.jpg",     // ADD YOUR CARD FRONT IMAGE HERE  (e.g. "assets/images/card-front.jpg")
    back: "assets/images/card-back.jpg",      // ADD YOUR CARD BACK IMAGE HERE   (e.g. "assets/images/card-back.jpg")
    frontAlt: "Business card front: Aram Photography — Capturing stories through light, form and perspective, with a WhatsApp number",   // describe what is written on it (for screen readers)
    backAlt: "Business card back: Instagram QR code for @aram._photography",
    ratio: "7 / 4" // only used until your image loads — the real proportion is detected automatically
  },

  /* --------------------------------------------------- CONTACT & SOCIAL   */
  contact: {
    heading: "Let's create something timeless.",
    text: "Have a story to tell? Let's capture it.",

    /* Social destinations. Paste the FULL address, including https://
       Leave "" until you have it — the button stays visible but inactive.   */
    socials: {
      facebook:  "https://www.facebook.com/share/18Wov91YyV/",
      instagram: "https://instagram.com/aram._photography?utm_source=qr&obrf=eHF3ajdnMmtpNHQ5",
      whatsapp:  "0031634120526"   // WhatsApp number — country code + number (leading 00 is fine)
    },
    whatsappMessage: "",   // optional pre-filled WhatsApp message, e.g. "Hello Aram, I'd like to book a shoot."

    /* Optional details — any empty one is simply not shown. */
    email: "",              // ADD YOUR EMAIL ADDRESS HERE
    location: "",           // ADD YOUR LOCATION HERE, e.g. "City, Country"
    businessInquiries: ""   // e.g. an email address or a short sentence for business inquiries
  },

  /* ---------------------------------------------------------------- FOOTER */
  footer: {
    phrase: "Some moments deserve to live forever.",
    year: "",                 // leave "" to use the current year automatically
    copyright: "© {year} {name}"   // {year} and {name} are filled in automatically
  },

  /* ------------------------------------------------------ LANGUAGES (EN / AR) */
  /* The site opens in English; visitors can switch to Arabic with the button in the menu bar.
     Everything below is the ARABIC text. If you change an English text above, change its Arabic
     line here too (the key on the left is the same name used above).                           */
  i18n: {
    defaultLanguage: "en",     // "en" or "ar" — which language a new visitor sees first
    ar: {
      "introSubtitle": "مصوّر · راوي قصص بصرية",
      "intro.enter": "ادخل إلى الإطار",
      "intro.skip": "تخطّي المقدمة",
      "skip.content": "انتقل إلى المحتوى",
      "nav.frames": "الصور",
      "nav.card": "البطاقة",
      "nav.contact": "تواصل",
      "heroEyebrow": "قصص بصرية من خلف العدسة",
      "hero.tagline": "كل إطار يحمل حكاية.",
      "hero.ctaLabel": "شاهد الصور",
      "hero.scroll": "مرّر",
      "frames.eyebrow": "الإطار المتحرك",
      "gallery.heading": "لقطات مختارة",
      "gallery.intro": "شريط بطيء من اللحظات — مرّر المؤشر لتتمهّل عند إطار، واضغط لتدخل إليه.",
      "frames.hint": "اضغط على إطار لفتحه · ← → للتنقل",
      "card.eyebrow": "خذها معك",
      "card.heading": "البطاقة",
      "card.text": "احتفظ بها قريبة — كل ما تحتاجه للتواصل معي على بطاقة واحدة.",
      "card.front": "الوجه",
      "card.back": "الظهر",
      "card.hint": "اضغط على البطاقة لقلبها",
      "contact.eyebrow": "المشهد الأخير",
      "contact.heading": "لنصنع شيئاً خالداً.",
      "contact.text": "عندك قصة تريد روايتها؟ دعنا نلتقطها.",
      "footer.phrase": "بعض اللحظات تستحق أن تبقى إلى الأبد.",
      "footer.end": "نهاية الشريط",
      "footer.top": "للأعلى",

      "social.facebook": "فيسبوك",
      "social.instagram": "إنستغرام",
      "social.whatsapp": "واتساب",
      "ui.follow": "تابعني",
      "ui.message": "راسلني",
      "ui.soon": "قريباً",
      "ui.newTab": "يفتح في تبويب جديد",
      "ui.soonToast": "{name} — قريباً",
      "ui.soonAria": "{name} — الرابط قريباً",
      "ui.whatsapp": "واتساب",
      "ui.email": "البريد الإلكتروني",
      "ui.location": "الموقع",
      "ui.business": "للأعمال والحجوزات",
      "ui.pause": "إيقاف الشريط",
      "ui.play": "تشغيل الشريط",
      "ui.frame": "إطار",
      "ui.openPhoto": "افتح الصورة {n} من {total}: {title}",
      "ui.cardAria": "بطاقة العمل، يظهر الآن {side}. اضغط لقلبها.",
      "ui.front": "الوجه",
      "ui.back": "الظهر",
      "ui.menuOpen": "افتح القائمة",
      "ui.menuClose": "أغلق القائمة",
      "aria.enter": "ادخل إلى التجربة",
      "aria.viewer": "عارض الصور",
      "aria.prev": "الصورة السابقة",
      "aria.next": "الصورة التالية",
      "aria.close": "إغلاق",
      "aria.reel": "شريط الصور. كل إطار يفتح عرضاً أكبر.",
      "aria.langSwitch": "التبديل إلى الإنجليزية",
      "aria.toLight": "التبديل إلى الوضع الفاتح",
      "aria.toDark": "التبديل إلى الوضع الداكن"
    }
  },

  /* -------------------------------------------------------- OPTIONAL SOUND */
  sound: {
    enabled: false,     // set to true ONLY after you add at least one audio file below
    startup: "",        // ADD YOUR CAMERA START-UP SOUND HERE   (e.g. "assets/audio/startup.mp3")
    ambient: "",        // ADD YOUR QUIET AMBIENT LOOP HERE      (e.g. "assets/audio/ambient.mp3")
    shutter: "",        // ADD YOUR SHUTTER CLICK SOUND HERE     (e.g. "assets/audio/shutter.mp3")
    volume: 0.35        // 0 (silent) … 1 (full)
  }
};
