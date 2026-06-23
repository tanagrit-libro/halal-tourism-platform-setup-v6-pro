import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'th' | 'ms' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  ms: {
    // App & Portals
    'app.name': 'GoSafar Thailand',
    'app.tagline': 'Trusted Travel Information for Thailand',
    'portal.admin': 'Portal Admin',
    'portal.entrepreneur': 'Portal Usahawan',
    'portal.tourist': 'Portal Pelancong',
    'portal.landing': 'Halaman Utama',

    // Landing Page
    'landing.hero.title': 'GoSafar Thailand',
    'landing.hero.subtitle': 'Trusted Travel Information for Thailand',
    'landing.trust.title': 'Source Records & Travel Information',
    'landing.trust.body': 'GoSafar Thailand brings together travel information, source records, certificate status, and reviewed operator submissions from recognized agencies and partner datasets. Certification authority remains with the issuing agency; the platform does not issue halal certificates.',
    'landing.start': 'Mula Meneroka',
    'landing.choose': 'Pilih Portal Anda',
    'landing.tourist.desc': 'Cari tempat halal, rancang perjalanan dengan AI, dan terokai destinasi',
    'landing.admin.desc': 'Urus pengguna, sederhanakan kandungan, dan pantau operasi platform',
    'landing.entrepreneur.desc': 'Daftarkan perniagaan mesra halal anda dan capai pelancong di seluruh dunia',
    'landing.enter': 'Masuk',
    'landing.login': 'Log Masuk',
    'landing.getStarted': 'Mulakan',
    'landing.back': 'Kembali ke Laman Utama',

    // Navigation - Common
    'nav.dashboard': 'Papan Pemuka',
    'nav.prayer': 'Waktu Solat',
    'nav.logout': 'Log Keluar',
    'nav.settings': 'Tetapan',

    // Navigation - Tourist
    'nav.home': 'Utama',
    'nav.search': 'Carian',
    'nav.map': 'Penjelajah Peta',
    'nav.favorites': 'Kegemaran',
    'nav.myTrips': 'Perjalanan Saya',
    'nav.articles': 'Article',
    'nav.planner': 'Perancang AI',

    // Navigation - Entrepreneur
    'nav.submitPlace': 'Hantar Tempat',
    'nav.tracking': 'Penjejakan',
    'nav.myListings': 'Senarai Saya',
    'nav.support': 'Sokongan',
    'nav.profile': 'Profil Perniagaan',

    // Navigation - Admin
    'nav.users': 'Pengurusan Pengguna',
    'nav.moderation': 'Sederhana',
    'nav.places': 'Tempat',
    'nav.content': 'Kandungan',
    'nav.masterData': 'Data Utama',
    'nav.reports': 'Laporan',
    'nav.apiKeys': 'Kunci API',
    'nav.audit': 'Log Audit',

    // Tourist Home
    'tourist.hero.title': 'GoSafar Thailand',
    'tourist.hero.subtitle': 'Trusted Travel Information for Thailand',
    'tourist.search.placeholder': 'Cari tempat, restoran, hotel...',
    'tourist.search.location': 'Lokasi',
    'tourist.search.button': 'Cari',
    'tourist.action.planner': 'Perancang Perjalanan AI',
    'tourist.action.map': 'Terokai Peta',
    'tourist.action.search': 'Carian Lanjutan',
    'tourist.featured.title': 'Tempat Pilihan',
    'tourist.featured.subtitle': 'Destinasi mesra halal dengan penarafan tertinggi',
    'tourist.featured.viewAll': 'Lihat Semua',
    'tourist.stats.verified': 'Tempat Sumber Disahkan',
    'tourist.stats.travelers': 'Pelancong Gembira',
    'tourist.stats.cities': 'Bandar Diliputi',
    'tourist.stats.rating': 'Penarafan Purata',

    // Admin Dashboard
    'admin.dashboard.title': 'Gambaran Keseluruhan Papan Pemuka',
    'admin.dashboard.subtitle': 'Selamat kembali! Inilah yang berlaku hari ini.',
    'admin.dashboard.totalRevenue': 'Jumlah Hasil',
    'admin.dashboard.activeUsers': 'Pengguna Aktif',
    'admin.dashboard.pendingApprovals': 'Kelulusan Tertunggak',
    'admin.dashboard.systemHealth': 'Kesihatan Sistem',

    // Entrepreneur Dashboard
    'entrepreneur.dashboard.title': 'Papan Pemuka',
    'entrepreneur.dashboard.welcome': 'Selamat kembali! Inilah yang berlaku dengan perniagaan anda.',
    'entrepreneur.action.settings': 'Tetapan',
    'entrepreneur.action.addPlace': 'Tambah Tempat Baharu',
    'entrepreneur.stats.views': 'Jumlah Tontonan',
    'entrepreneur.stats.reviews': 'Jumlah Ulasan',
    'entrepreneur.stats.rating': 'Penarafan Purata',
    'entrepreneur.stats.activePlaces': 'Tempat Aktif',
    'entrepreneur.chart.performance': 'Gambaran Keseluruhan Prestasi',
    'entrepreneur.chart.demographics': 'Demografi Pelawat',
    'entrepreneur.section.activity': 'Aktiviti Terkini',
    'entrepreneur.section.tips': 'Tips Pantas untuk Pertumbuhan',
  },
  en: {
    // App & Portals
    'app.name': 'GoSafar Thailand',
    'app.tagline': 'Trusted Travel Information for Thailand',
    'portal.admin': 'Admin Portal',
    'portal.entrepreneur': 'Entrepreneur Portal',
    'portal.tourist': 'Tourist Portal',
    'portal.landing': 'Landing Page',

    // Landing Page
    'landing.hero.title': 'GoSafar Thailand',
    'landing.hero.subtitle': 'Trusted Travel Information for Thailand',
    'landing.trust.title': 'Source Records & Travel Information',
    'landing.trust.body': 'GoSafar Thailand brings together travel information, source records, certificate status, and reviewed operator submissions from recognized agencies and partner datasets. Certification authority remains with the issuing agency; the platform does not issue halal certificates.',
    'landing.start': 'Start Exploring',
    'landing.choose': 'Choose Your Portal',
    'landing.tourist.desc': 'Find halal places, plan trips with AI, and explore destinations',
    'landing.admin.desc': 'Manage users, moderate content, and oversee platform operations',
    'landing.entrepreneur.desc': 'Submit your halal-friendly business and reach travelers worldwide',
    'landing.enter': 'Enter',
    'landing.login': 'Login',
    'landing.getStarted': 'Get Started',
    'landing.back': 'Back to Home',

    // Navigation - Common
    'nav.dashboard': 'Dashboard',
    'nav.prayer': 'Prayer Times',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',

    // Navigation - Tourist
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.map': 'Map Explorer',
    'nav.favorites': 'Favorites',
    'nav.myTrips': 'My Trips',
    'nav.articles': 'Article',
    'nav.planner': 'AI Planner',
    
    // Navigation - Entrepreneur
    'nav.submitPlace': 'Submit Place',
    'nav.tracking': 'Tracking',
    'nav.myListings': 'My Listings',
    'nav.support': 'Support',
    'nav.profile': 'Business Profile',

    // Navigation - Admin
    'nav.users': 'User Management',
    'nav.moderation': 'Moderation',
    'nav.places': 'Places',
    'nav.content': 'Content',
    'nav.masterData': 'Master Data',
    'nav.reports': 'Reports',
    'nav.apiKeys': 'API Keys',
    'nav.audit': 'Audit Logs',

    // Tourist Home
    'tourist.hero.title': 'GoSafar Thailand',
    'tourist.hero.subtitle': 'Trusted Travel Information for Thailand',
    'tourist.search.placeholder': 'Search for places, restaurants, hotels...',
    'tourist.search.location': 'Location',
    'tourist.search.button': 'Search',
    'tourist.action.planner': 'AI Trip Planner',
    'tourist.action.map': 'Explore Map',
    'tourist.action.search': 'Advanced Search',
    'tourist.featured.title': 'Featured Places',
    'tourist.featured.subtitle': 'Top rated halal-friendly destinations',
    'tourist.featured.viewAll': 'View All',
    'tourist.stats.verified': 'Source-Verified Places',
    'tourist.stats.travelers': 'Happy Travelers',
    'tourist.stats.cities': 'Cities Covered',
    'tourist.stats.rating': 'Average Rating',

    // Admin Dashboard
    'admin.dashboard.title': 'Dashboard Overview',
    'admin.dashboard.subtitle': "Welcome back! Here's what's happening today.",
    'admin.dashboard.totalRevenue': 'Total Revenue',
    'admin.dashboard.activeUsers': 'Active Users',
    'admin.dashboard.pendingApprovals': 'Pending Approvals',
    'admin.dashboard.systemHealth': 'System Health',

    // Entrepreneur Dashboard
    'entrepreneur.dashboard.title': 'Dashboard',
    'entrepreneur.dashboard.welcome': "Welcome back! Here's what's happening with your business.",
    'entrepreneur.action.settings': 'Settings',
    'entrepreneur.action.addPlace': 'Add New Place',
    'entrepreneur.stats.views': 'Total Views',
    'entrepreneur.stats.reviews': 'Total Reviews',
    'entrepreneur.stats.rating': 'Avg. Rating',
    'entrepreneur.stats.activePlaces': 'Active Places',
    'entrepreneur.chart.performance': 'Performance Overview',
    'entrepreneur.chart.demographics': 'Visitor Demographics',
    'entrepreneur.section.activity': 'Recent Activity',
    'entrepreneur.section.tips': 'Quick Tips for Growth',
  },
  th: {
    // App & Portals
    'app.name': 'GoSafar Thailand',
    'app.tagline': 'Trusted Travel Information for Thailand',
    'portal.admin': 'ผู้ดูแลระบบ',
    'portal.entrepreneur': 'ผู้ประกอบการ',
    'portal.tourist': 'นักท่องเที่ยว',
    'portal.landing': 'หน้าหลัก',

    // Landing Page
    'landing.hero.title': 'GoSafar Thailand',
    'landing.hero.subtitle': 'Trusted Travel Information for Thailand',
    'landing.trust.title': 'Source Records & Travel Information',
    'landing.trust.body': 'GoSafar Thailand brings together travel information, source records, certificate status, and reviewed operator submissions from recognized agencies and partner datasets. Certification authority remains with the issuing agency; the platform does not issue halal certificates.',
    'landing.start': 'เริ่มสำรวจ',
    'landing.choose': 'เลือกพอร์ทัลของคุณ',
    'landing.tourist.desc': 'ค้นหาสถานที่ฮาลาล วางแผนทริปด้วย AI และสำรวจจุดหมายปลายทาง',
    'landing.admin.desc': 'จัดการผู้ใช้ ตรวจสอบเนื้อหา และดูแลระบบ',
    'landing.entrepreneur.desc': 'ลงทะเบียนธุรกิจที่เป็นมิตรกับมุสลิมและเข้าถึงนักเดินทางทั่วโลก',
    'landing.enter': 'เข้าสู่ระบบ',
    'landing.login': 'เข้าสู่ระบบ',
    'landing.getStarted': 'เริ่มต้นใช้งาน',
    'landing.back': 'กลับหน้าหลัก',

    // Navigation - Common
    'nav.dashboard': 'แดชบอร์ด',
    'nav.prayer': 'เวลาละหมาด',
    'nav.logout': 'ออกจากระบบ',
    'nav.settings': 'ตั้งค่า',

    // Navigation - Tourist
    'nav.home': 'หน้าหลัก',
    'nav.search': 'ค้นหา',
    'nav.map': 'แผนที่',
    'nav.favorites': 'รายการโปรด',
    'nav.myTrips': 'ทริปของฉัน',
    'nav.articles': 'Article',
    'nav.planner': 'AI วางแผนเที่ยว',
    
    // Navigation - Entrepreneur
    'nav.submitPlace': 'ลงทะเบียนสถานที่',
    'nav.tracking': 'ติดตามสถานะ',
    'nav.myListings': 'รายการของฉัน',
    'nav.support': 'ช่วยเหลือ',
    'nav.profile': 'ข้อมูลธุรกิจ',

    // Navigation - Admin
    'nav.users': 'จัดการผู้ใช้',
    'nav.moderation': 'ตรวจสอบข้อมูล',
    'nav.places': 'จัดการสถานที่',
    'nav.content': 'จัดการเนื้อหา',
    'nav.masterData': 'ข้อมูลหลัก',
    'nav.reports': 'รายงาน',
    'nav.apiKeys': 'API Keys',
    'nav.audit': 'บันทึกการใช้งาน',

    // Tourist Home
    'tourist.hero.title': 'GoSafar Thailand',
    'tourist.hero.subtitle': 'Trusted Travel Information for Thailand',
    'tourist.search.placeholder': 'ค้นหาสถานที่ ร้านอาหาร โรงแรม...',
    'tourist.search.location': 'ทำเลที่ตั้ง',
    'tourist.search.button': 'ค้นหา',
    'tourist.action.planner': 'AI วางแผนเที่ยว',
    'tourist.action.map': 'สำรวจแผนที่',
    'tourist.action.search': 'ค้นหาขั้นสูง',
    'tourist.featured.title': 'สถานที่แนะนำ',
    'tourist.featured.subtitle': 'จุดหมายปลายทางยอดนิยมที่เป็นมิตรกับมุสลิม',
    'tourist.featured.viewAll': 'ดูทั้งหมด',
    'tourist.stats.verified': 'สถานที่ที่ตรวจสอบแหล่งที่มาแล้ว',
    'tourist.stats.travelers': 'นักท่องเที่ยวที่มีความสุข',
    'tourist.stats.cities': 'เมืองที่ครอบคลุม',
    'tourist.stats.rating': 'คะแนนเฉลี่ย',

    // Admin Dashboard
    'admin.dashboard.title': 'ภาพรวมแดชบอร์ด',
    'admin.dashboard.subtitle': 'ยินดีต้อนรับกลับ! นี่คือความเคลื่อนไหววันนี้',
    'admin.dashboard.totalRevenue': 'รายได้รวม',
    'admin.dashboard.activeUsers': 'ผู้ใช้งาน',
    'admin.dashboard.pendingApprovals': 'รอการอนุมัติ',
    'admin.dashboard.systemHealth': 'สถานะระบบ',

    // Entrepreneur Dashboard
    'entrepreneur.dashboard.title': 'แดชบอร์ด',
    'entrepreneur.dashboard.welcome': 'ยินดีต้อนรับกลับ! นี่คือภาพรวมธุรกิจของคุณ',
    'entrepreneur.action.settings': 'ตั้งค่า',
    'entrepreneur.action.addPlace': 'เพิ่มสถานที่ใหม่',
    'entrepreneur.stats.views': 'ยอดเข้าชม',
    'entrepreneur.stats.reviews': 'รีวิวทั้งหมด',
    'entrepreneur.stats.rating': 'คะแนนเฉลี่ย',
    'entrepreneur.stats.activePlaces': 'สถานที่เปิดให้บริการ',
    'entrepreneur.chart.performance': 'ภาพรวมประสิทธิภาพ',
    'entrepreneur.chart.demographics': 'ข้อมูลประชากรผู้เยี่ยมชม',
    'entrepreneur.section.activity': 'กิจกรรมล่าสุด',
    'entrepreneur.section.tips': 'เคล็ดลับเพื่อการเติบโต',
  },
  ar: {
    // App & Portals
    'app.name': 'GoSafar Thailand',
    'app.tagline': 'Trusted Travel Information for Thailand',
    'portal.admin': 'بوابة الإدارة',
    'portal.entrepreneur': 'بوابة رواد الأعمال',
    'portal.tourist': 'بوابة السياح',
    'portal.landing': 'الصفحة المقصودة',

    // Landing Page
    'landing.hero.title': 'GoSafar Thailand',
    'landing.hero.subtitle': 'Trusted Travel Information for Thailand',
    'landing.trust.title': 'Source Records & Travel Information',
    'landing.trust.body': 'GoSafar Thailand brings together travel information, source records, certificate status, and reviewed operator submissions from recognized agencies and partner datasets. Certification authority remains with the issuing agency; the platform does not issue halal certificates.',
    'landing.start': 'ابدأ الاستكشاف',
    'landing.choose': 'اختر بوابتك',
    'landing.tourist.desc': 'ابحث عن أماكن حلال، وخطط للرحلات باستخدام الذكاء الاصطناعي، واستكشف الوجهات',
    'landing.admin.desc': 'إدارة المستخدمين، والإشراف على المحتوى، ومراقبة عمليات المنصة',
    'landing.entrepreneur.desc': 'أدرج عملك الصديق للمسلمين وتواصل مع المسافرين حول العالم',
    'landing.enter': 'دخول',
    'landing.login': 'تسجيل الدخول',
    'landing.getStarted': 'ابدأ الآن',
    'landing.back': 'العودة للصفحة الرئيسية',

    // Navigation - Common
    'nav.dashboard': 'لوحة القيادة',
    'nav.prayer': 'أوقات الصلاة',
    'nav.logout': 'تسجيل الخروج',
    'nav.settings': 'إعدادات',

    // Navigation - Tourist
    'nav.home': 'الرئيسية',
    'nav.search': 'بحث',
    'nav.map': 'الخريطة',
    'nav.favorites': 'المفضلة',
    'nav.myTrips': 'رحلاتي',
    'nav.articles': 'Article',
    'nav.planner': 'مخطط الرحلات AI',
    
    // Navigation - Entrepreneur
    'nav.submitPlace': 'إرسال مكان',
    'nav.tracking': 'تتبع',
    'nav.myListings': 'قوائمي',
    'nav.support': 'الدعم',
    'nav.profile': 'ملف العمل',

    // Navigation - Admin
    'nav.users': 'إدارة المستخدمين',
    'nav.moderation': 'الإشراف',
    'nav.places': 'أماكن',
    'nav.content': 'محتوى',
    'nav.masterData': 'البيانات الرئيسية',
    'nav.reports': 'التقارير',
    'nav.apiKeys': 'مفاتيح API',
    'nav.audit': 'سجلات التدقيق',

    // Tourist Home
    'tourist.hero.title': 'GoSafar Thailand',
    'tourist.hero.subtitle': 'Trusted Travel Information for Thailand',
    'tourist.search.placeholder': 'ابحث عن أماكن، مطاعم، فنادق...',
    'tourist.search.location': 'الموقع',
    'tourist.search.button': 'بحث',
    'tourist.action.planner': 'مخطط الرحلات AI',
    'tourist.action.map': 'استكشاف الخريطة',
    'tourist.action.search': 'بحث متقدم',
    'tourist.featured.title': 'أماكن مميزة',
    'tourist.featured.subtitle': 'وجهات صديقة للمسلمين ذات تصنيف عالي',
    'tourist.featured.viewAll': 'عرض الكل',
    'tourist.stats.verified': 'أماكن موثقة المصدر',
    'tourist.stats.travelers': 'مسافرون سعداء',
    'tourist.stats.cities': 'مدن مغطاة',
    'tourist.stats.rating': 'متوسط التقييم',

    // Admin Dashboard
    'admin.dashboard.title': 'نظرة عامة على لوحة القيادة',
    'admin.dashboard.subtitle': 'مرحباً بعودتك! إليك ما يحدث اليوم.',
    'admin.dashboard.totalRevenue': 'إجمالي الإيرادات',
    'admin.dashboard.activeUsers': 'المستخدمين النشطين',
    'admin.dashboard.pendingApprovals': 'بانتظار الموافقة',
    'admin.dashboard.systemHealth': 'صحة النظام',

    // Entrepreneur Dashboard
    'entrepreneur.dashboard.title': 'لوحة القيادة',
    'entrepreneur.dashboard.welcome': 'مرحباً بعودتك! إليك ما يحدث في عملك.',
    'entrepreneur.action.settings': 'إعدادات',
    'entrepreneur.action.addPlace': 'إضافة مكان جديد',
    'entrepreneur.stats.views': 'إجمالي المشاهدات',
    'entrepreneur.stats.reviews': 'إجمالي المراجعات',
    'entrepreneur.stats.rating': 'متوسط التقييم',
    'entrepreneur.stats.activePlaces': 'أماكن نشطة',
    'entrepreneur.chart.performance': 'نظرة عامة على الأداء',
    'entrepreneur.chart.demographics': 'ديموغرافية الزوار',
    'entrepreneur.section.activity': 'النشاط الأخير',
    'entrepreneur.section.tips': 'نصائح سريعة للنمو',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
