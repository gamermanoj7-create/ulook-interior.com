ULOOK INTERIOR — TEXT COLOUR FIX

যা ঠিক করবে:
1. 3D cabinet section-এর “Every shelf,” text হবে dark charcoal (#252B33)।
2. “made to fit.” হবে readable deep blue (#176A8A)।
3. Projects section-এর “Plan yours” link dark charcoal থাকবে।

যা বদলাবে না:
Photo, 3D model, animation, video, gallery, layout, spacing বা JavaScript।

Termux-এ ব্যবহার:
1. ZIP extract করে তিনটি ফাইল website project root-এ রাখুন।
2. Termux-এ চালান:
   cd ~/ulook-v40-local
   python apply_text_colour_fix.py
3. SUCCESS দেখালে preview দেখে নিন। তারপর চাইলে Hosting deploy করুন:
   firebase deploy --only hosting --project ulook-interior

Script public/index.html-এর backup তৈরি করে। আগেই patch থাকলে দ্বিতীয়বার duplicate CSS যোগ করবে না।
যদি source structure মেলে না, script কোনো ফাইল বদলাবে না।
