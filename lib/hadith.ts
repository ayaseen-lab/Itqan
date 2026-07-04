/**
 * Curated authentic Hadith collection for daily rotation.
 * Rotates by day-of-year so the same hadith shows all day for every user.
 */

export interface Hadith {
  id: number;
  arabic: string;
  english: string;
  urdu: string;
  source: string;
  /** Classic collection reference number(s), e.g. "Bukhari 1". */
  reference?: string;
  narrator?: string;
}

/** Classic reference numbers for display. */
const HADITH_REFS: Record<number, string> = {
  1: "Bukhari 1 · Muslim 1907",
  2: "Bukhari 6018 · Muslim 47",
  3: "Bukhari 13 · Muslim 45",
  4: "Bukhari 10 · Muslim 40",
  5: "Tirmidhi 1987",
  6: "Bukhari 5027",
  7: "Muslim 55",
  8: "Ibn Majah 2340",
  9: "Tirmidhi 1956",
  10: "Bukhari 2989 · Muslim 1009",
  11: "Bukhari 5997 · Muslim 2318",
  12: "Muslim 2664",
  13: "Muslim 91",
  14: "Muslim 223",
  15: "Muslim 2699",
  16: "Muslim 36",
  17: "Bukhari 6064 · Muslim 2559",
  18: "Bukhari 2442 · Muslim 2580",
  19: "Tirmidhi 1162",
  20: "Ahmad 3/12",
  21: "Tirmidhi 1924",
  22: "Bukhari 6014 · Muslim 47",
  23: "Ibn Majah 224",
  24: "Tirmidhi 2501",
  25: "Nasa'i 3104",
  26: "Bukhari 1426",
  27: "Ahmad 1/387",
  28: "Muslim 35",
  29: "Tirmidhi 1920",
  30: "Bukhari 69",
};

export function formatHadithRef(h: Hadith): string {
  return h.reference || HADITH_REFS[h.id] || `No. ${h.id}`;
}

export const HADITH_COLLECTION: Hadith[] = [
  {
    id: 1,
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    english: "Actions are judged by intentions, and every person will get what they intended.",
    urdu: "اعمال تو نیتوں کے مطابق ہیں اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Umar ibn al-Khattab (RA)",
  },
  {
    id: 2,
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    english: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    urdu: "جو اللہ اور آخرت پر ایمان رکھتا ہے وہ اچھی بات کہے یا چپ رہے۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 3,
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    urdu: "تم میں سے کوئی مومن نہیں جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    id: 4,
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    english: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    urdu: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abdullah ibn Amr (RA)",
  },
  {
    id: 5,
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
    english: "Fear Allah wherever you are, and follow a bad deed with a good deed to erase it.",
    urdu: "جہاں کہیں بھی ہو اللہ سے ڈرو، برے کام کے بعد نیک کام کرو تاکہ وہ مٹ جائے۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abu Dharr (RA)",
  },
  {
    id: 6,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    english: "The best among you are those who learn the Quran and teach it.",
    urdu: "تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
    source: "Sahih al-Bukhari",
    narrator: "Uthman ibn Affan (RA)",
  },
  {
    id: 7,
    arabic: "الدِّينُ النَّصِيحَةُ",
    english: "Religion is sincere advice.",
    urdu: "دین نصیحت ہے۔",
    source: "Sahih Muslim",
    narrator: "Tamim al-Dari (RA)",
  },
  {
    id: 8,
    arabic: "لَا ضَرَرَ وَلَا ضِرَارَ",
    english: "There should be neither harm nor reciprocating harm.",
    urdu: "نہ نقصان پہنچانا اور نہ نقصان کا بدلہ لینا۔",
    source: "Ibn Majah",
    narrator: "Abu Sa'id al-Khudri (RA)",
  },
  {
    id: 9,
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    english: "Your smile in the face of your brother is charity.",
    urdu: "اپنے بھائی کے سامنے مسکرانا صدقہ ہے۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abu Dharr (RA)",
  },
  {
    id: 10,
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    english: "A good word is charity.",
    urdu: "اچھی بات صدقہ ہے۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 11,
    arabic: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ",
    english: "Whoever does not show mercy will not be shown mercy.",
    urdu: "جو رحم نہیں کرتا اس پر رحم نہیں کیا جائے گا۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Jarir ibn Abdullah (RA)",
  },
  {
    id: 12,
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    english: "The strong believer is better and more beloved to Allah than the weak believer.",
    urdu: "مضبوط مومن کمزور مومن سے بہتر اور اللہ کو زیادہ محبوب ہے۔",
    source: "Sahih Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 13,
    arabic: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ",
    english: "Indeed Allah is Beautiful and loves beauty.",
    urdu: "بے شک اللہ خوبصورت ہے اور خوبصورتی کو پسند کرتا ہے۔",
    source: "Sahih Muslim",
    narrator: "Abdullah ibn Mas'ud (RA)",
  },
  {
    id: 14,
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    english: "Purity is half of faith.",
    urdu: "پاکیزگی ایمان کا آدھا حصہ ہے۔",
    source: "Sahih Muslim",
    narrator: "Abu Malik al-Ash'ari (RA)",
  },
  {
    id: 15,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    english: "Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise.",
    urdu: "جو علم کی تلاش میں کوئی راستہ اختیار کرے اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔",
    source: "Sahih Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 16,
    arabic: "الْحَيَاءُ مِنَ الْإِيمَانِ",
    english: "Modesty is part of faith.",
    urdu: "حیا ایمان کا حصہ ہے۔",
    source: "Sahih Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 17,
    arabic: "لَا تَحَاسَدُوا وَلَا تَبَاغَضُوا",
    english: "Do not envy one another, and do not hate one another.",
    urdu: "ایک دوسرے سے حسد نہ کرو اور نہ بغض رکھو۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 18,
    arabic: "الْمُسْلِمُ أَخُو الْمُسْلِمِ",
    english: "A Muslim is the brother of a Muslim; he does not wrong him nor abandon him.",
    urdu: "مسلمان مسلمان کا بھائی ہے، وہ اس پر ظلم نہیں کرتا اور نہ اسے چھوڑتا ہے۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abdullah ibn Umar (RA)",
  },
  {
    id: 19,
    arabic: "إِنَّ مِنْ أَكْمَلِ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
    english: "The most complete of believers in faith are those with the best character.",
    urdu: "ایمان میں کامل ترین مومن وہ ہے جس کا اخلاق سب سے اچھا ہو۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 20,
    arabic: "الصَّبْرُ نِصْفُ الْإِيمَانِ",
    english: "Patience is half of faith.",
    urdu: "صبر ایمان کا آدھا حصہ ہے۔",
    source: "Musnad Ahmad",
    narrator: "Abu Sa'id al-Khudri (RA)",
  },
  {
    id: 21,
    arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ",
    english: "The merciful are shown mercy by the Most Merciful.",
    urdu: "رحم کرنے والوں پر رحمٰن رحم فرماتا ہے۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abdullah ibn Amr (RA)",
  },
  {
    id: 22,
    arabic: "اتَّقِ اللَّهَ وَأَحْسِنْ إِلَى جَارِكَ",
    english: "Fear Allah and treat your neighbor well.",
    urdu: "اللہ سے ڈرو اور اپنے پڑوسی کے ساتھ اچھا سلوک کرو۔",
    source: "Sahih al-Bukhari & Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 23,
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    english: "Seeking knowledge is an obligation upon every Muslim.",
    urdu: "علم حاصل کرنا ہر مسلمان پر فرض ہے۔",
    source: "Ibn Majah",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    id: 24,
    arabic: "مَنْ صَمَتَ نَجَا",
    english: "Whoever remains silent is saved.",
    urdu: "جو چپ رہا وہ نجات پا گیا۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 25,
    arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    english: "Paradise lies at the feet of mothers.",
    urdu: "جنت ماؤں کے قدموں تلے ہے۔",
    source: "Sunan an-Nasa'i",
    narrator: "Mu'awiyah ibn Jahimah (RA)",
  },
  {
    id: 26,
    arabic: "خَيْرُ الصَّدَقَةِ مَا كَانَ عَنْ ظَهْرِ غِنًى",
    english: "The best charity is that given when one is in need yet still gives.",
    urdu: "بہترین صدقہ وہ ہے جو ضرورت کے باوجود دی جائے۔",
    source: "Sahih al-Bukhari",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 27,
    arabic: "لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا لَمْ يَتَنَاجَوْا بِالْمَعَاصِي",
    english: "My Ummah will remain upon goodness as long as they do not openly discuss sins.",
    urdu: "میری امت بھلائی پر رہے گی جب تک وہ گناہوں کی باتیں نہ کریں۔",
    source: "Musnad Ahmad",
    narrator: "Abdullah ibn Mas'ud (RA)",
  },
  {
    id: 28,
    arabic: "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    english: "Faith has seventy-odd branches; the highest is La ilaha illallah.",
    urdu: "ایمان کے ستر سے زیادہ شعبے ہیں، سب سے اعلیٰ لا الہ الا اللہ ہے۔",
    source: "Sahih Muslim",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 29,
    arabic: "مَنْ لَمْ يَرْحَمْ صَغِيرَنَا وَيُوَقِّرْ كَبِيرَنَا فَلَيْسَ مِنَّا",
    english: "Whoever does not show mercy to our young and respect our elders is not one of us.",
    urdu: "جو ہمارے چھوٹوں پر رحم نہ کرے اور بڑوں کا احترام نہ کرے وہ ہم میں سے نہیں۔",
    source: "Jami at-Tirmidhi",
    narrator: "Abdullah ibn Amr (RA)",
  },
  {
    id: 30,
    arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا",
    english: "Make things easy and do not make them difficult.",
    urdu: "آسانیاں پیدا کرو اور مشکل نہ بناؤ۔",
    source: "Sahih al-Bukhari",
    narrator: "Anas ibn Malik (RA)",
  },
];

export function getDailyHadith(date = new Date()): Hadith {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % HADITH_COLLECTION.length;
  return HADITH_COLLECTION[index];
}

export function getHadithById(id: number): Hadith | undefined {
  return HADITH_COLLECTION.find((h) => h.id === id);
}
