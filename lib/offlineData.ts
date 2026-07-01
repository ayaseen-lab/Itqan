/**
 * Bundled Quran metadata used so the app ALWAYS renders the complete list of
 * all 114 Surahs instantly — even before/without the live Quran.com API. Full
 * verse text is fetched live per Surah (with a small offline verse fallback for
 * a few short Surahs below).
 */

import type { Chapter, Verse, Word } from "./quran";

export const OFFLINE_CHAPTERS: Chapter[] = [
  { id: 1, revelationPlace: "makkah", nameArabic: "الفاتحة", nameSimple: "Al-Fatihah", translatedName: "The Opener", versesCount: 7 },
  { id: 2, revelationPlace: "madinah", nameArabic: "البقرة", nameSimple: "Al-Baqarah", translatedName: "The Cow", versesCount: 286 },
  { id: 3, revelationPlace: "madinah", nameArabic: "آل عمران", nameSimple: "Ali 'Imran", translatedName: "Family of Imran", versesCount: 200 },
  { id: 4, revelationPlace: "madinah", nameArabic: "النساء", nameSimple: "An-Nisa", translatedName: "The Women", versesCount: 176 },
  { id: 5, revelationPlace: "madinah", nameArabic: "المائدة", nameSimple: "Al-Ma'idah", translatedName: "The Table Spread", versesCount: 120 },
  { id: 6, revelationPlace: "makkah", nameArabic: "الأنعام", nameSimple: "Al-An'am", translatedName: "The Cattle", versesCount: 165 },
  { id: 7, revelationPlace: "makkah", nameArabic: "الأعراف", nameSimple: "Al-A'raf", translatedName: "The Heights", versesCount: 206 },
  { id: 8, revelationPlace: "madinah", nameArabic: "الأنفال", nameSimple: "Al-Anfal", translatedName: "The Spoils of War", versesCount: 75 },
  { id: 9, revelationPlace: "madinah", nameArabic: "التوبة", nameSimple: "At-Tawbah", translatedName: "The Repentance", versesCount: 129 },
  { id: 10, revelationPlace: "makkah", nameArabic: "يونس", nameSimple: "Yunus", translatedName: "Jonah", versesCount: 109 },
  { id: 11, revelationPlace: "makkah", nameArabic: "هود", nameSimple: "Hud", translatedName: "Hud", versesCount: 123 },
  { id: 12, revelationPlace: "makkah", nameArabic: "يوسف", nameSimple: "Yusuf", translatedName: "Joseph", versesCount: 111 },
  { id: 13, revelationPlace: "madinah", nameArabic: "الرعد", nameSimple: "Ar-Ra'd", translatedName: "The Thunder", versesCount: 43 },
  { id: 14, revelationPlace: "makkah", nameArabic: "ابراهيم", nameSimple: "Ibrahim", translatedName: "Abraham", versesCount: 52 },
  { id: 15, revelationPlace: "makkah", nameArabic: "الحجر", nameSimple: "Al-Hijr", translatedName: "The Rocky Tract", versesCount: 99 },
  { id: 16, revelationPlace: "makkah", nameArabic: "النحل", nameSimple: "An-Nahl", translatedName: "The Bee", versesCount: 128 },
  { id: 17, revelationPlace: "makkah", nameArabic: "الإسراء", nameSimple: "Al-Isra", translatedName: "The Night Journey", versesCount: 111 },
  { id: 18, revelationPlace: "makkah", nameArabic: "الكهف", nameSimple: "Al-Kahf", translatedName: "The Cave", versesCount: 110 },
  { id: 19, revelationPlace: "makkah", nameArabic: "مريم", nameSimple: "Maryam", translatedName: "Mary", versesCount: 98 },
  { id: 20, revelationPlace: "makkah", nameArabic: "طه", nameSimple: "Taha", translatedName: "Ta-Ha", versesCount: 135 },
  { id: 21, revelationPlace: "makkah", nameArabic: "الأنبياء", nameSimple: "Al-Anbya", translatedName: "The Prophets", versesCount: 112 },
  { id: 22, revelationPlace: "madinah", nameArabic: "الحج", nameSimple: "Al-Hajj", translatedName: "The Pilgrimage", versesCount: 78 },
  { id: 23, revelationPlace: "makkah", nameArabic: "المؤمنون", nameSimple: "Al-Mu'minun", translatedName: "The Believers", versesCount: 118 },
  { id: 24, revelationPlace: "madinah", nameArabic: "النور", nameSimple: "An-Nur", translatedName: "The Light", versesCount: 64 },
  { id: 25, revelationPlace: "makkah", nameArabic: "الفرقان", nameSimple: "Al-Furqan", translatedName: "The Criterion", versesCount: 77 },
  { id: 26, revelationPlace: "makkah", nameArabic: "الشعراء", nameSimple: "Ash-Shu'ara", translatedName: "The Poets", versesCount: 227 },
  { id: 27, revelationPlace: "makkah", nameArabic: "النمل", nameSimple: "An-Naml", translatedName: "The Ant", versesCount: 93 },
  { id: 28, revelationPlace: "makkah", nameArabic: "القصص", nameSimple: "Al-Qasas", translatedName: "The Stories", versesCount: 88 },
  { id: 29, revelationPlace: "makkah", nameArabic: "العنكبوت", nameSimple: "Al-'Ankabut", translatedName: "The Spider", versesCount: 69 },
  { id: 30, revelationPlace: "makkah", nameArabic: "الروم", nameSimple: "Ar-Rum", translatedName: "The Romans", versesCount: 60 },
  { id: 31, revelationPlace: "makkah", nameArabic: "لقمان", nameSimple: "Luqman", translatedName: "Luqman", versesCount: 34 },
  { id: 32, revelationPlace: "makkah", nameArabic: "السجدة", nameSimple: "As-Sajdah", translatedName: "The Prostration", versesCount: 30 },
  { id: 33, revelationPlace: "madinah", nameArabic: "الأحزاب", nameSimple: "Al-Ahzab", translatedName: "The Combined Forces", versesCount: 73 },
  { id: 34, revelationPlace: "makkah", nameArabic: "سبأ", nameSimple: "Saba", translatedName: "Sheba", versesCount: 54 },
  { id: 35, revelationPlace: "makkah", nameArabic: "فاطر", nameSimple: "Fatir", translatedName: "Originator", versesCount: 45 },
  { id: 36, revelationPlace: "makkah", nameArabic: "يس", nameSimple: "Ya-Sin", translatedName: "Ya Sin", versesCount: 83 },
  { id: 37, revelationPlace: "makkah", nameArabic: "الصافات", nameSimple: "As-Saffat", translatedName: "Those who set the Ranks", versesCount: 182 },
  { id: 38, revelationPlace: "makkah", nameArabic: "ص", nameSimple: "Sad", translatedName: "The Letter Saad", versesCount: 88 },
  { id: 39, revelationPlace: "makkah", nameArabic: "الزمر", nameSimple: "Az-Zumar", translatedName: "The Troops", versesCount: 75 },
  { id: 40, revelationPlace: "makkah", nameArabic: "غافر", nameSimple: "Ghafir", translatedName: "The Forgiver", versesCount: 85 },
  { id: 41, revelationPlace: "makkah", nameArabic: "فصلت", nameSimple: "Fussilat", translatedName: "Explained in Detail", versesCount: 54 },
  { id: 42, revelationPlace: "makkah", nameArabic: "الشورى", nameSimple: "Ash-Shuraa", translatedName: "The Consultation", versesCount: 53 },
  { id: 43, revelationPlace: "makkah", nameArabic: "الزخرف", nameSimple: "Az-Zukhruf", translatedName: "The Ornaments of Gold", versesCount: 89 },
  { id: 44, revelationPlace: "makkah", nameArabic: "الدخان", nameSimple: "Ad-Dukhan", translatedName: "The Smoke", versesCount: 59 },
  { id: 45, revelationPlace: "makkah", nameArabic: "الجاثية", nameSimple: "Al-Jathiyah", translatedName: "The Crouching", versesCount: 37 },
  { id: 46, revelationPlace: "makkah", nameArabic: "الأحقاف", nameSimple: "Al-Ahqaf", translatedName: "The Wind-Curved Sandhills", versesCount: 35 },
  { id: 47, revelationPlace: "madinah", nameArabic: "محمد", nameSimple: "Muhammad", translatedName: "Muhammad", versesCount: 38 },
  { id: 48, revelationPlace: "madinah", nameArabic: "الفتح", nameSimple: "Al-Fath", translatedName: "The Victory", versesCount: 29 },
  { id: 49, revelationPlace: "madinah", nameArabic: "الحجرات", nameSimple: "Al-Hujurat", translatedName: "The Rooms", versesCount: 18 },
  { id: 50, revelationPlace: "makkah", nameArabic: "ق", nameSimple: "Qaf", translatedName: "The Letter Qaf", versesCount: 45 },
  { id: 51, revelationPlace: "makkah", nameArabic: "الذاريات", nameSimple: "Adh-Dhariyat", translatedName: "The Winnowing Winds", versesCount: 60 },
  { id: 52, revelationPlace: "makkah", nameArabic: "الطور", nameSimple: "At-Tur", translatedName: "The Mount", versesCount: 49 },
  { id: 53, revelationPlace: "makkah", nameArabic: "النجم", nameSimple: "An-Najm", translatedName: "The Star", versesCount: 62 },
  { id: 54, revelationPlace: "makkah", nameArabic: "القمر", nameSimple: "Al-Qamar", translatedName: "The Moon", versesCount: 55 },
  { id: 55, revelationPlace: "madinah", nameArabic: "الرحمن", nameSimple: "Ar-Rahman", translatedName: "The Beneficent", versesCount: 78 },
  { id: 56, revelationPlace: "makkah", nameArabic: "الواقعة", nameSimple: "Al-Waqi'ah", translatedName: "The Inevitable", versesCount: 96 },
  { id: 57, revelationPlace: "madinah", nameArabic: "الحديد", nameSimple: "Al-Hadid", translatedName: "The Iron", versesCount: 29 },
  { id: 58, revelationPlace: "madinah", nameArabic: "المجادلة", nameSimple: "Al-Mujadila", translatedName: "The Pleading Woman", versesCount: 22 },
  { id: 59, revelationPlace: "madinah", nameArabic: "الحشر", nameSimple: "Al-Hashr", translatedName: "The Exile", versesCount: 24 },
  { id: 60, revelationPlace: "madinah", nameArabic: "الممتحنة", nameSimple: "Al-Mumtahanah", translatedName: "She that is to be examined", versesCount: 13 },
  { id: 61, revelationPlace: "madinah", nameArabic: "الصف", nameSimple: "As-Saff", translatedName: "The Ranks", versesCount: 14 },
  { id: 62, revelationPlace: "madinah", nameArabic: "الجمعة", nameSimple: "Al-Jumu'ah", translatedName: "The Congregation, Friday", versesCount: 11 },
  { id: 63, revelationPlace: "madinah", nameArabic: "المنافقون", nameSimple: "Al-Munafiqun", translatedName: "The Hypocrites", versesCount: 11 },
  { id: 64, revelationPlace: "madinah", nameArabic: "التغابن", nameSimple: "At-Taghabun", translatedName: "The Mutual Disillusion", versesCount: 18 },
  { id: 65, revelationPlace: "madinah", nameArabic: "الطلاق", nameSimple: "At-Talaq", translatedName: "The Divorce", versesCount: 12 },
  { id: 66, revelationPlace: "madinah", nameArabic: "التحريم", nameSimple: "At-Tahrim", translatedName: "The Prohibition", versesCount: 12 },
  { id: 67, revelationPlace: "makkah", nameArabic: "الملك", nameSimple: "Al-Mulk", translatedName: "The Sovereignty", versesCount: 30 },
  { id: 68, revelationPlace: "makkah", nameArabic: "القلم", nameSimple: "Al-Qalam", translatedName: "The Pen", versesCount: 52 },
  { id: 69, revelationPlace: "makkah", nameArabic: "الحاقة", nameSimple: "Al-Haqqah", translatedName: "The Reality", versesCount: 52 },
  { id: 70, revelationPlace: "makkah", nameArabic: "المعارج", nameSimple: "Al-Ma'arij", translatedName: "The Ascending Stairways", versesCount: 44 },
  { id: 71, revelationPlace: "makkah", nameArabic: "نوح", nameSimple: "Nuh", translatedName: "Noah", versesCount: 28 },
  { id: 72, revelationPlace: "makkah", nameArabic: "الجن", nameSimple: "Al-Jinn", translatedName: "The Jinn", versesCount: 28 },
  { id: 73, revelationPlace: "makkah", nameArabic: "المزمل", nameSimple: "Al-Muzzammil", translatedName: "The Enshrouded One", versesCount: 20 },
  { id: 74, revelationPlace: "makkah", nameArabic: "المدثر", nameSimple: "Al-Muddaththir", translatedName: "The Cloaked One", versesCount: 56 },
  { id: 75, revelationPlace: "makkah", nameArabic: "القيامة", nameSimple: "Al-Qiyamah", translatedName: "The Resurrection", versesCount: 40 },
  { id: 76, revelationPlace: "madinah", nameArabic: "الانسان", nameSimple: "Al-Insan", translatedName: "The Man", versesCount: 31 },
  { id: 77, revelationPlace: "makkah", nameArabic: "المرسلات", nameSimple: "Al-Mursalat", translatedName: "The Emissaries", versesCount: 50 },
  { id: 78, revelationPlace: "makkah", nameArabic: "النبأ", nameSimple: "An-Naba", translatedName: "The Tidings", versesCount: 40 },
  { id: 79, revelationPlace: "makkah", nameArabic: "النازعات", nameSimple: "An-Nazi'at", translatedName: "Those who drag forth", versesCount: 46 },
  { id: 80, revelationPlace: "makkah", nameArabic: "عبس", nameSimple: "'Abasa", translatedName: "He Frowned", versesCount: 42 },
  { id: 81, revelationPlace: "makkah", nameArabic: "التكوير", nameSimple: "At-Takwir", translatedName: "The Overthrowing", versesCount: 29 },
  { id: 82, revelationPlace: "makkah", nameArabic: "الإنفطار", nameSimple: "Al-Infitar", translatedName: "The Cleaving", versesCount: 19 },
  { id: 83, revelationPlace: "makkah", nameArabic: "المطففين", nameSimple: "Al-Mutaffifin", translatedName: "The Defrauding", versesCount: 36 },
  { id: 84, revelationPlace: "makkah", nameArabic: "الإنشقاق", nameSimple: "Al-Inshiqaq", translatedName: "The Sundering", versesCount: 25 },
  { id: 85, revelationPlace: "makkah", nameArabic: "البروج", nameSimple: "Al-Buruj", translatedName: "The Mansions of the Stars", versesCount: 22 },
  { id: 86, revelationPlace: "makkah", nameArabic: "الطارق", nameSimple: "At-Tariq", translatedName: "The Nightcomer", versesCount: 17 },
  { id: 87, revelationPlace: "makkah", nameArabic: "الأعلى", nameSimple: "Al-A'la", translatedName: "The Most High", versesCount: 19 },
  { id: 88, revelationPlace: "makkah", nameArabic: "الغاشية", nameSimple: "Al-Ghashiyah", translatedName: "The Overwhelming", versesCount: 26 },
  { id: 89, revelationPlace: "makkah", nameArabic: "الفجر", nameSimple: "Al-Fajr", translatedName: "The Dawn", versesCount: 30 },
  { id: 90, revelationPlace: "makkah", nameArabic: "البلد", nameSimple: "Al-Balad", translatedName: "The City", versesCount: 20 },
  { id: 91, revelationPlace: "makkah", nameArabic: "الشمس", nameSimple: "Ash-Shams", translatedName: "The Sun", versesCount: 15 },
  { id: 92, revelationPlace: "makkah", nameArabic: "الليل", nameSimple: "Al-Layl", translatedName: "The Night", versesCount: 21 },
  { id: 93, revelationPlace: "makkah", nameArabic: "الضحى", nameSimple: "Ad-Duhaa", translatedName: "The Morning Hours", versesCount: 11 },
  { id: 94, revelationPlace: "makkah", nameArabic: "الشرح", nameSimple: "Ash-Sharh", translatedName: "The Relief", versesCount: 8 },
  { id: 95, revelationPlace: "makkah", nameArabic: "التين", nameSimple: "At-Tin", translatedName: "The Fig", versesCount: 8 },
  { id: 96, revelationPlace: "makkah", nameArabic: "العلق", nameSimple: "Al-'Alaq", translatedName: "The Clot", versesCount: 19 },
  { id: 97, revelationPlace: "makkah", nameArabic: "القدر", nameSimple: "Al-Qadr", translatedName: "The Power", versesCount: 5 },
  { id: 98, revelationPlace: "madinah", nameArabic: "البينة", nameSimple: "Al-Bayyinah", translatedName: "The Clear Proof", versesCount: 8 },
  { id: 99, revelationPlace: "madinah", nameArabic: "الزلزلة", nameSimple: "Az-Zalzalah", translatedName: "The Earthquake", versesCount: 8 },
  { id: 100, revelationPlace: "makkah", nameArabic: "العاديات", nameSimple: "Al-'Adiyat", translatedName: "The Courser", versesCount: 11 },
  { id: 101, revelationPlace: "makkah", nameArabic: "القارعة", nameSimple: "Al-Qari'ah", translatedName: "The Calamity", versesCount: 11 },
  { id: 102, revelationPlace: "makkah", nameArabic: "التكاثر", nameSimple: "At-Takathur", translatedName: "The Rivalry in world increase", versesCount: 8 },
  { id: 103, revelationPlace: "makkah", nameArabic: "العصر", nameSimple: "Al-'Asr", translatedName: "The Declining Day", versesCount: 3 },
  { id: 104, revelationPlace: "makkah", nameArabic: "الهمزة", nameSimple: "Al-Humazah", translatedName: "The Traducer", versesCount: 9 },
  { id: 105, revelationPlace: "makkah", nameArabic: "الفيل", nameSimple: "Al-Fil", translatedName: "The Elephant", versesCount: 5 },
  { id: 106, revelationPlace: "makkah", nameArabic: "قريش", nameSimple: "Quraysh", translatedName: "Quraysh", versesCount: 4 },
  { id: 107, revelationPlace: "makkah", nameArabic: "الماعون", nameSimple: "Al-Ma'un", translatedName: "The Small Kindnesses", versesCount: 7 },
  { id: 108, revelationPlace: "makkah", nameArabic: "الكوثر", nameSimple: "Al-Kawthar", translatedName: "The Abundance", versesCount: 3 },
  { id: 109, revelationPlace: "makkah", nameArabic: "الكافرون", nameSimple: "Al-Kafirun", translatedName: "The Disbelievers", versesCount: 6 },
  { id: 110, revelationPlace: "madinah", nameArabic: "النصر", nameSimple: "An-Nasr", translatedName: "The Divine Support", versesCount: 3 },
  { id: 111, revelationPlace: "makkah", nameArabic: "المسد", nameSimple: "Al-Masad", translatedName: "The Palm Fiber", versesCount: 5 },
  { id: 112, revelationPlace: "makkah", nameArabic: "الإخلاص", nameSimple: "Al-Ikhlas", translatedName: "The Sincerity", versesCount: 4 },
  { id: 113, revelationPlace: "makkah", nameArabic: "الفلق", nameSimple: "Al-Falaq", translatedName: "The Daybreak", versesCount: 5 },
  { id: 114, revelationPlace: "makkah", nameArabic: "الناس", nameSimple: "An-Nas", translatedName: "Mankind", versesCount: 6 },
];

interface RawVerse {
  arabic: string;
  english: string;
  urdu: string;
}

const RAW: Record<number, RawVerse[]> = {
  1: [
    { arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", urdu: "شروع الله کے نام سے جو بڑا مہربان نہایت رحم والا ہے" },
    { arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", english: "[All] praise is [due] to Allah, Lord of the worlds -", urdu: "سب طرح کی تعریف خدا ہی کو (سزاوار) ہے جو تمام مخلوقات کا پروردگار ہے" },
    { arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", english: "The Entirely Merciful, the Especially Merciful,", urdu: "بڑا مہربان نہایت رحم والا" },
    { arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ", english: "Sovereign of the Day of Recompense.", urdu: "انصاف کے دن کا حاکم" },
    { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "It is You we worship and You we ask for help.", urdu: "(اے پروردگار) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں" },
    { arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", english: "Guide us to the straight path -", urdu: "ہم کو سیدھے رستے چلا" },
    { arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", urdu: "ان لوگوں کے رستے جن پر تو اپنا فضل کرتا رہا نہ ان کے جن پر غصے ہوتا رہا اور نہ گمراہوں کے" },
  ],
  112: [
    { arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", english: 'Say, "He is Allah, [who is] One,', urdu: "کہو کہ وہ (ذات پاک جس کا نام) الله (ہے) ایک ہے" },
    { arabic: "ٱللَّهُ ٱلصَّمَدُ", english: "Allah, the Eternal Refuge.", urdu: "معبود برحق جو بےنیاز ہے" },
    { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", english: "He neither begets nor is born,", urdu: "نہ کسی کا باپ ہے اور نہ کسی کا بیٹا" },
    { arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", english: "Nor is there to Him any equivalent.", urdu: "اور کوئی اس کا ہمسر نہیں" },
  ],
  113: [
    { arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", english: 'Say, "I seek refuge in the Lord of daybreak', urdu: "کہو کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں" },
    { arabic: "مِن شَرِّ مَا خَلَقَ", english: "From the evil of that which He created", urdu: "ہر چیز کی بدی سے جو اس نے پیدا کی" },
    { arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", english: "And from the evil of darkness when it settles", urdu: "اور اندھیری رات کی برائی سے جب اس کا اندھیرا چھا جائے" },
    { arabic: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ", english: "And from the evil of the blowers in knots", urdu: "اور گنڈوں پر (پڑھ پڑھ کر) پھونکنے والیوں کی برائی سے" },
    { arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", english: "And from the evil of an envier when he envies.", urdu: "اور حسد کرنے والے کی برائی سے جب حسد کرنے لگے" },
  ],
  114: [
    { arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", english: 'Say, "I seek refuge in the Lord of mankind,', urdu: "کہو کہ میں لوگوں کے پروردگار کی پناہ مانگتا ہوں" },
    { arabic: "مَلِكِ ٱلنَّاسِ", english: "The Sovereign of mankind.", urdu: "(یعنی) لوگوں کے بادشاہ کی" },
    { arabic: "إِلَٰهِ ٱلنَّاسِ", english: "The God of mankind,", urdu: "لوگوں کے معبود کی" },
    { arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", english: "From the evil of the retreating whisperer -", urdu: "(شیطان) وسوسہ انداز کی برائی سے جو (خدا کا نام سن کر) پیچھے ہٹ جاتا ہے" },
    { arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", english: "Who whispers [evil] into the breasts of mankind -", urdu: "جو لوگوں کے دلوں میں وسوسے ڈالتا ہے" },
    { arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", english: "From among the jinn and mankind.", urdu: "وہ جنوں میں سے (ہو) خواہ انسانوں میں سے" },
  ],
};

function toWords(arabic: string): Word[] {
  return arabic
    .split(/\s+/)
    .filter(Boolean)
    .map((text, i) => ({
      position: i + 1,
      text,
      transliteration: null,
      translation: null,
      translationUrdu: null,
      audioUrl: null,
    }));
}

export function getOfflineVerses(chapterId: number): Verse[] {
  const raw = RAW[chapterId];
  if (!raw) return [];
  return raw.map((v, i) => ({
    id: chapterId * 1000 + i + 1,
    verseKey: `${chapterId}:${i + 1}`,
    chapterId,
    verseNumber: i + 1,
    textUthmani: v.arabic,
    textTajweed: null,
    audioUrl: null,
    translations: { urdu: v.urdu, english: v.english },
    words: toWords(v.arabic),
  }));
}

export function getOfflineChapter(chapterId: number): Chapter | null {
  return OFFLINE_CHAPTERS.find((c) => c.id === chapterId) ?? null;
}

export function hasOfflineChapter(chapterId: number): boolean {
  return chapterId in RAW;
}
