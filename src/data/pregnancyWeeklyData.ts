export interface WeekData {
  week: number;
  fruit: string;
  fruitEmoji: string;
  lengthCm: number;
  lengthIn: number;
  weightG: number;
  weightOz: number;
  milestones: string[];
  symptoms: string[];
  bodyChanges: string[];
  nutrition: string[];
  exercise: string[];
  sleep: string[];
}

export const WEEKLY_DEVELOPMENT: WeekData[] = [
  {
    week: 1,
    fruit: "Microscopic (Pre-conception)",
    fruitEmoji: "✨",
    lengthCm: 0.1,
    lengthIn: 0.04,
    weightG: 0.1,
    weightOz: 0.003,
    milestones: [
      "Your body is preparing for ovulation.",
      "The uterine lining is beginning to build up.",
      "Technically, you are not pregnant yet, but medical systems count this as part of the 40-week timeline."
    ],
    symptoms: [
      "Menstrual bleeding.",
      "Mild cramping.",
      "Fatigue or mood swings associated with your period."
    ],
    bodyChanges: [
      "Shedding of the uterine lining (your period).",
      "Estrogen levels are starting low and will begin to rise."
    ],
    nutrition: [
      "Start taking a prenatal vitamin with 400 mcg of folic acid.",
      "Incorporate leafy greens, beans, and fortified grains into your diet."
    ],
    exercise: [
      "Gentle walking or light stretching.",
      "Listen to your body during menstruation."
    ],
    sleep: [
      "Prioritize 7-8 hours of sound sleep.",
      "Establish a relaxing bedtime routine."
    ]
  },
  {
    week: 2,
    fruit: "Microscopic (Ovulation Phase)",
    fruitEmoji: "🥚",
    lengthCm: 0.15,
    lengthIn: 0.06,
    weightG: 0.15,
    weightOz: 0.005,
    milestones: [
      "Your ovaries release an egg (ovulation).",
      "Fertilization occurs if a sperm successfully penetrates the egg.",
      "The fertilized egg (zygote) starts dividing rapidly as it travels toward the uterus."
    ],
    symptoms: [
      "Changes in cervical mucus (becoming clear, stretchy, like egg whites).",
      "Slight rise in basal body temperature.",
      "Mild lower-abdominal discomfort on one side (Mittelschmerz)."
    ],
    bodyChanges: [
      "Luteinizing hormone (LH) peaks.",
      "The uterine lining thickens in anticipation of embryo implantation."
    ],
    nutrition: [
      "Focus on healthy fats like avocado, olive oil, and nuts.",
      "Ensure adequate hydration to support healthy cervical mucus."
    ],
    exercise: [
      "Moderate cardiovascular activities (jogging, swimming, cycling).",
      "Maintains optimal blood flow to reproductive organs."
    ],
    sleep: [
      "Avoid sleeping on your stomach if you find it uncomfortable, though it is perfectly safe at this stage.",
      "Reduce caffeine intake in the afternoon to sleep better."
    ]
  },
  {
    week: 3,
    fruit: "Microscopic (Blastocyst)",
    fruitEmoji: "🌟",
    lengthCm: 0.2,
    lengthIn: 0.08,
    weightG: 0.2,
    weightOz: 0.007,
    milestones: [
      "The fertilized egg is now a blastocyst (a microscopic ball of cells).",
      "It makes its way into the uterus and begins implanting into the uterine wall.",
      "Fetal gender and genetic traits are permanently locked in."
    ],
    symptoms: [
      "Implantation bleeding (very light spotting, pink or light brown).",
      "Mild implantation cramping.",
      "Slight breast tenderness."
    ],
    bodyChanges: [
      "Hormone shifts begin with progesterone rising rapidly.",
      "The fertilized egg starts signaling hCG production, which will soon trigger positive home tests."
    ],
    nutrition: [
      "Increase zinc and vitamin C foods to support cellular division.",
      "Avoid raw meats, unpasteurized dairy, and high-mercury fish."
    ],
    exercise: [
      "Keep exercising at your normal baseline.",
      "Yoga and core stabilization exercises are highly beneficial."
    ],
    sleep: [
      "Fatigue might start to set in early as progesterone surges.",
      "Take short 15-minute power naps if needed."
    ]
  },
  {
    week: 4,
    fruit: "Poppy Seed",
    fruitEmoji: "⚫",
    lengthCm: 0.1,
    lengthIn: 0.04,
    weightG: 0.5,
    weightOz: 0.01,
    milestones: [
      "The blastocyst officially splits into the embryo and the placenta.",
      "The amniotic sac begins to form.",
      "A home pregnancy test can now reliably show a positive result."
    ],
    symptoms: [
      "Missed period.",
      "Bloating and mild abdominal pressure.",
      "Mild fatigue and emotional sensitivity."
    ],
    bodyChanges: [
      "hCG levels rise high enough to be detected in urine.",
      "The cervix softens and creates a mucus plug to protect the womb."
    ],
    nutrition: [
      "Keep up prenatal vitamins with folic acid.",
      "Avoid alcohol, excessive caffeine, and smoking completely."
    ],
    exercise: [
      "Stick with low to moderate impact workouts.",
      "Maintain a steady heart rate, and hydrate well before and after."
    ],
    sleep: [
      "You may start feeling tired earlier in the evening.",
      "Create a quiet, cool, and dark sleeping environment."
    ]
  },
  {
    week: 5,
    fruit: "Apple Seed",
    fruitEmoji: "🍎",
    lengthCm: 0.2,
    lengthIn: 0.08,
    weightG: 0.8,
    weightOz: 0.02,
    milestones: [
      "The embryonic neural tube, which becomes the brain and spinal cord, is forming.",
      "The primitive heart structure begins to pump blood.",
      "Major organs like kidneys and liver start developing."
    ],
    symptoms: [
      "Early morning sickness/nausea.",
      "Sore, tender, and tingling breasts.",
      "Frequent urination as the uterus begins expanding."
    ],
    bodyChanges: [
      "Your blood volume is expanding to support the fetus.",
      "Progesterone surges can cause digestion to slow down."
    ],
    nutrition: [
      "Eat small, frequent meals to stave off nausea.",
      "Ginger tea or peppermint can help settle your stomach."
    ],
    exercise: [
      "Swimming is a wonderful way to boost circulation without putting pressure on joints.",
      "Keep core exercises safe and moderate."
    ],
    sleep: [
      "Rest is your body's top priority right now.",
      "Use pillows to find a comfortable position if breasts are highly tender."
    ]
  },
  {
    week: 6,
    fruit: "Sweet Pea",
    fruitEmoji: "🟢",
    lengthCm: 0.5,
    lengthIn: 0.2,
    weightG: 1.0,
    weightOz: 0.035,
    milestones: [
      "The heart is now beating at 100-160 beats per minute.",
      "Early facial features like eyes, nose, and jaw are beginning to form.",
      "Tiny buds that will become arms and legs emerge."
    ],
    symptoms: [
      "Pronounced morning sickness and smell sensitivities.",
      "Extreme fatigue and lethargy.",
      "Mild mood changes."
    ],
    bodyChanges: [
      "Estrogen and progesterone rise sharply.",
      "The uterus is now about the size of a lemon."
    ],
    nutrition: [
      "Prioritize simple, easily digestible carbs like crackers or dry toast.",
      "Stay hydrated with small sips of water or electrolyte broths."
    ],
    exercise: [
      "Walking 20-30 minutes daily improves energy levels.",
      "Avoid workouts that risk falls or abdominal impact."
    ],
    sleep: [
      "Progesterone acts as a natural sedative, making you feel exhausted.",
      "Aim for 8-9 hours of nightly sleep if possible."
    ]
  },
  {
    week: 7,
    fruit: "Blueberry",
    fruitEmoji: "🫐",
    lengthCm: 1.3,
    lengthIn: 0.5,
    weightG: 1.5,
    weightOz: 0.05,
    milestones: [
      "The brain is developing 100,000 new cells every single minute.",
      "Tiny elbow joints and distinct arm buds are visible.",
      "Lungs, kidneys, and liver continue to mature."
    ],
    symptoms: [
      "Aversion to foods you normally love.",
      "Excessive saliva (ptyalism) and metallic taste in the mouth.",
      "Frequent mood changes."
    ],
    bodyChanges: [
      "Uterus is now twice its original size.",
      "Skin changes like acne can appear due to pregnancy hormones."
    ],
    nutrition: [
      "Eat calcium-rich foods like yogurt, fortified plant milk, or cheese.",
      "Snack on almonds or pumpkin seeds for magnesium."
    ],
    exercise: [
      "Low-impact prenatal aerobics classes.",
      "Stretching keeps pelvic muscles supple."
    ],
    sleep: [
      "Urination can interrupt sleep; try drinking less liquid 2 hours before bed.",
      "Keep a glass of water and crackers on your nightstand."
    ]
  },
  {
    week: 8,
    fruit: "Raspberry",
    fruitEmoji: "🍓",
    lengthCm: 1.6,
    lengthIn: 0.6,
    weightG: 2.0,
    weightOz: 0.07,
    milestones: [
      "Webbed fingers and toes are starting to differentiate.",
      "The baby begins moving inside the womb, though it's too small to feel.",
      "Eyes are developing pigment and eyelids are forming."
    ],
    symptoms: [
      "Abdominal bloating and flatulence.",
      "Occasional headaches from hormone surges.",
      "Lower back achiness."
    ],
    bodyChanges: [
      "Your waistline may thicken slightly.",
      "Your breasts are growing and may require a larger, supportive bra."
    ],
    nutrition: [
      "Focus on foods high in vitamin B6 to combat morning sickness.",
      "Lean meats, eggs, and walnuts are excellent choices."
    ],
    exercise: [
      "Pelvic floor strengthening (Kegels) should start now.",
      "Light cardio preserves lung capacity."
    ],
    sleep: [
      "Begin training yourself to sleep on your side (left side is medically optimal for blood flow).",
      "A body pillow or pregnancy pillow can provide great hip alignment."
    ]
  },
  {
    week: 9,
    fruit: "Green Olive",
    fruitEmoji: "🫒",
    lengthCm: 2.3,
    lengthIn: 0.9,
    weightG: 3.0,
    weightOz: 0.1,
    milestones: [
      "The embryo officially becomes a fetus.",
      "The tail-like structure at the bottom of the spine is gone.",
      "Heart valves are developing and nipples form."
    ],
    symptoms: [
      "Fluctuating energy levels (bursts followed by tiredness).",
      "Frequent urination remains common.",
      "Mild constipation."
    ],
    bodyChanges: [
      "Breasts may leak early translucent colostrum fluid.",
      "Weight changes are minimal but bloating is prominent."
    ],
    nutrition: [
      "Incorporate fiber-rich foods like apples, oats, and chia seeds to ease constipation.",
      "Drink at least 8-10 glasses of water daily."
    ],
    exercise: [
      "Prenatal Pilates focusing on deep core breathwork (no flat-on-back work after trimester 1).",
      "Keep heart rate comfortable (you should be able to speak a sentence without gasping)."
    ],
    sleep: [
      "Vivid, intense dreams are common due to high hormone activity.",
      "Limit screen time before bed to soothe your nervous system."
    ]
  },
  {
    week: 10,
    fruit: "Prune",
    fruitEmoji: "🫐",
    lengthCm: 3.1,
    lengthIn: 1.2,
    weightG: 4.0,
    weightOz: 0.14,
    milestones: [
      "All major vital organs are fully formed and functioning.",
      "Webbing is gone, and distinct fingers and toes are present.",
      "Baby's teeth are forming under the gums."
    ],
    symptoms: [
      "Increased vaginal discharge (leukorrhea - perfectly normal).",
      "Visible veins on your breasts and abdomen.",
      "Round ligament pain (sharp twinges in lower abdomen when moving quickly)."
    ],
    bodyChanges: [
      "Uterus is now the size of a grapefruit.",
      "Blood circulation has increased by 40-50%."
    ],
    nutrition: [
      "Ensure you are getting 1,000 mg of calcium daily.",
      "Include calcium-fortified orange juice, salmon, or broccoli."
    ],
    exercise: [
      "Resistance bands are great for maintaining upper body and back strength.",
      "Avoid heavy weightlifting or straining."
    ],
    sleep: [
      "If you suffer from heartburn, prop up your head with extra pillows.",
      "Eat dinner at least 3 hours before going to sleep."
    ]
  },
  {
    week: 11,
    fruit: "Lime",
    fruitEmoji: "🟢",
    lengthCm: 4.1,
    lengthIn: 1.6,
    weightG: 7.0,
    weightOz: 0.25,
    milestones: [
      "The fetus is active, kicking, and stretching, though still imperceptible.",
      "External genitalia are developing.",
      "Fingernails and hair follicles are starting to grow."
    ],
    symptoms: [
      "Appetite might slowly return as early morning sickness begins to peak and subside.",
      "Occasional dizziness or lightheadedness.",
      "Dry skin or brittle nails."
    ],
    bodyChanges: [
      "Uterine placement starts rising above the pubic bone.",
      "Metabolic rate increased, making you feel warm or sweaty."
    ],
    nutrition: [
      "Incorporate lean protein and iron sources like lentils, beef, or spinach.",
      "Vitamin C paired with iron increases its absorption."
    ],
    exercise: [
      "Walking on inclined treadmills or light hikes.",
      "Listen to your joints, which are starting to loosen up due to the relaxin hormone."
    ],
    sleep: [
      "Practice deep breathing exercises before sleep to settle your mind.",
      "Keep your bedroom temperature on the cooler side."
    ]
  },
  {
    week: 12,
    fruit: "Plum",
    fruitEmoji: "🍑",
    lengthCm: 5.4,
    lengthIn: 2.1,
    weightG: 14.0,
    weightOz: 0.49,
    milestones: [
      "Baby's reflexes are developing; they can open and close their hands.",
      "The kidneys are beginning to secrete urine into the amniotic sac.",
      "The skeleton, made of cartilage, is starting to harden into bone."
    ],
    symptoms: [
      "Morning sickness is significantly reduced for most women.",
      "Reduced fatigue as hormone levels stabilize.",
      "Frequent headaches can still occur."
    ],
    bodyChanges: [
      "Your uterus has filled your pelvis and is rising into your abdomen.",
      "A small baby bump may begin to show, especially in subsequent pregnancies."
    ],
    nutrition: [
      "Prioritize colorful fresh fruits for rich antioxidants.",
      "Drink high-potassium fluids like coconut water to prevent leg cramps."
    ],
    exercise: [
      "Low-impact water aerobics is exceptional.",
      "Focus on lower body strength (squats) to prepare for carrying more weight."
    ],
    sleep: [
      "Your sleep quality should improve this week.",
      "Use this window of returning energy to create clean bedtime habits."
    ]
  },
  {
    week: 13,
    fruit: "Lemon",
    fruitEmoji: "🍋",
    lengthCm: 7.4,
    lengthIn: 2.9,
    weightG: 23.0,
    weightOz: 0.81,
    milestones: [
      "The baby has unique fingerprints on their tiny fingers.",
      "vocal cords are beginning to form.",
      "Intestines, which were growing in the umbilical cord, move into the abdomen."
    ],
    symptoms: [
      "Increased libido (due to pelvic blood flow surge).",
      "Fewer mood swings.",
      "Visible veins on your breasts and tummy."
    ],
    bodyChanges: [
      "End of the First Trimester!",
      "The risk of miscarriage drops significantly after this week.",
      "Uterus is rising higher, reducing bladder pressure and frequent urination."
    ],
    nutrition: [
      "Continue taking vitamins. Eat a varied diet rich in folate, iron, calcium, and protein.",
      "Stay away from mercury-laden seafood like shark or swordfish."
    ],
    exercise: [
      "Gentle jogging or brisk walks are excellent.",
      "Yoga twists should be modified to avoid abdominal compression."
    ],
    sleep: [
      "Get a high-quality side-sleeping pillow.",
      "Sleep on your left side to encourage optimal oxygenation to the uterus."
    ]
  },
  {
    week: 14,
    fruit: "Peach",
    fruitEmoji: "🍑",
    lengthCm: 8.7,
    lengthIn: 3.4,
    weightG: 43.0,
    weightOz: 1.52,
    milestones: [
      "The baby can make facial expressions like squinting and frowning.",
      "Fine, downy hair called lanugo covers the baby's body for warmth.",
      "The thyroid gland begins producing hormones."
    ],
    symptoms: [
      "A major surge of energy (the famous second-trimester honeymoon phase).",
      "Decrease in urinary urgency.",
      "Mild round ligament pain."
    ],
    bodyChanges: [
      "Your abdomen is visibly rounding out.",
      "The placenta is fully functional and has taken over hormone production."
    ],
    nutrition: [
      "You require an extra 300-350 calories per day of nutrient-dense food.",
      "Choose clean snacks like apple slices with peanut butter or Greek yogurt."
    ],
    exercise: [
      "Now is a perfect time to start prenatal yoga.",
      "Improves balance and prepares hips for delivery."
    ],
    sleep: [
      "If you experience nasal congestion (pregnancy rhinitis), use a cool-mist humidifier.",
      "Elevate your head slightly to ease breathing."
    ]
  },
  {
    week: 15,
    fruit: "Apple",
    fruitEmoji: "🍎",
    lengthCm: 10.1,
    lengthIn: 4.0,
    weightG: 70.0,
    weightOz: 2.47,
    milestones: [
      "Baby is swallowing amniotic fluid and practicing breathing motions.",
      "The skeleton is continuing to ossify (harden).",
      "The legs are now growing longer than the arms."
    ],
    symptoms: [
      "Nasal congestion or minor nosebleeds due to increased mucous membrane blood flow.",
      "Occasionally forgetfulness ('pregnancy brain').",
      "Mild skin darkening (Melasma or 'mask of pregnancy')."
    ],
    bodyChanges: [
      "Your bump is becoming clearly defined.",
      "Increased blood flow can give you a healthy, glowing complexion."
    ],
    nutrition: [
      "Focus on dietary iron. Spinach, quinoa, beans, and lean beef are great.",
      "Pair with vitamin C for maximum absorption."
    ],
    exercise: [
      "Low-impact cycling or elliptical machines are wonderful.",
      "Keep joint stress minimal as ligaments soften."
    ],
    sleep: [
      "Ensure your mattress is supportive.",
      "Avoid sleeping flat on your back, as it can compress the vena cava."
    ]
  },
  {
    week: 16,
    fruit: "Avocado",
    fruitEmoji: "🥑",
    lengthCm: 11.6,
    lengthIn: 4.6,
    weightG: 100.0,
    weightOz: 3.53,
    milestones: [
      "The baby's eyes can track slowly behind closed eyelids.",
      "The nervous system is fully connecting to the muscles.",
      "The baby can hear your voice and external sounds through the abdominal wall."
    ],
    symptoms: [
      "Fetal movement (quickening) may be felt for the first time, especially in second pregnancies (feels like butterflies or bubbles).",
      "Dry, itchy skin on the expanding abdomen.",
      "Mild constipation."
    ],
    bodyChanges: [
      "Your uterus is about halfway between your pubic bone and your belly button.",
      "Weight gain of about 1 pound per week may begin."
    ],
    nutrition: [
      "Increase dietary fiber. Choose flaxseeds, chia seeds, pears, and carrots.",
      "Ensure proper magnesium levels to prevent leg cramps."
    ],
    exercise: [
      "Focus on back-strengthening moves to counter your shifting center of gravity.",
      "Seated rows or lat pull-downs with light resistance."
    ],
    sleep: [
      "If sleeping on your side causes hip sore spots, place a pillow between your knees.",
      "Maintain a consistent sleep-wake schedule."
    ]
  },
  {
    week: 17,
    fruit: "Pomegranate",
    fruitEmoji: "🟤",
    lengthCm: 13.0,
    lengthIn: 5.1,
    weightG: 140.0,
    weightOz: 4.94,
    milestones: [
      "Fat stores (adipose tissue) are starting to develop under the baby's skin.",
      "The baby's joints are fully moveable.",
      "The umbilical cord is growing thicker and stronger."
    ],
    symptoms: [
      "Increased appetite.",
      "Mild swelling of ankles or feet (edema).",
      "Vivid dreams continue."
    ],
    bodyChanges: [
      "Your center of gravity is shifting forward.",
      "Veins in legs can become more prominent (varicose veins)."
    ],
    nutrition: [
      "Stay hydrated. Drink plenty of water and clear broths.",
      "Snack on low-sodium foods to help manage water retention."
    ],
    exercise: [
      "Brisk walking. Walking is safe, free, and incredibly healthy.",
      "Wear supportive athletic shoes to cushion loosening joints."
    ],
    sleep: [
      "Try to sleep exclusively on your left side to maximize kidney function and waste clearance.",
      "A warm bath before bed can soothe tense back muscles."
    ]
  },
  {
    week: 18,
    fruit: "Artichoke",
    fruitEmoji: "🥦",
    lengthCm: 14.2,
    lengthIn: 5.6,
    weightG: 190.0,
    weightOz: 6.70,
    milestones: [
      "The baby is busy flexing arms and legs; movements are becoming stronger.",
      "Myelin, a protective coating, is forming around nerves.",
      "If the baby is a girl, her uterus and fallopian tubes are formed."
    ],
    symptoms: [
      "Distinct baby kicks (felt as small thumps).",
      "Occasional lower back pain.",
      "Heartburn or indigestion."
    ],
    bodyChanges: [
      "Your uterus is now roughly the size of a cantaloupe.",
      "Blood pressure can drop slightly, which might cause lightheadedness when standing up."
    ],
    nutrition: [
      "Eat small meals. Avoid greasy, spicy, or fried foods to keep heartburn at bay.",
      "Chew food slowly and remain upright for 30 minutes after eating."
    ],
    exercise: [
      "Prenatal yoga focusing on pelvic tilts to relieve lower back pressure.",
      "Avoid lying flat on your back for exercises."
    ],
    sleep: [
      "Keep the head of your bed elevated if acid reflux is keeping you awake.",
      "Avoid carbonated or caffeinated beverages in the evening."
    ]
  },
  {
    week: 19,
    fruit: "Mango",
    fruitEmoji: "🥭",
    lengthCm: 15.3,
    lengthIn: 6.0,
    weightG: 240.0,
    weightOz: 8.47,
    milestones: [
      "A greasy, cheese-like coating called vernix caseosa covers the baby's skin to protect it from amniotic fluid.",
      "Sensory development peaks; brain areas for smell, taste, hearing, vision, and touch are active.",
      "Baby is developing a regular sleep and wake cycle."
    ],
    symptoms: [
      "Round ligament pain remains common.",
      "Skin pigmentation increases (darker nipples, linea nigra line on stomach).",
      "Mild leg cramps."
    ],
    bodyChanges: [
      "Your uterus is almost at the level of your belly button.",
      "Skin on your belly is stretching, which may cause mild itching."
    ],
    nutrition: [
      "Ensure you are getting enough vitamin D. Sunlight, egg yolks, and fortified cereals help.",
      "Vitamin D assists calcium absorption for fetal bone density."
    ],
    exercise: [
      "Gentle stretching and warm water pool sessions.",
      "Keep core exercises safe and pelvic floor active."
    ],
    sleep: [
      "Use extra pillows under your stomach and between your legs.",
      "If leg cramps wake you up, flex your foot upward toward your shin."
    ]
  },
  {
    week: 20,
    fruit: "Banana",
    fruitEmoji: "🍌",
    lengthCm: 25.6,
    lengthIn: 10.1,
    weightG: 300.0,
    weightOz: 10.58,
    milestones: [
      "Midpoint of pregnancy (20 weeks)!",
      "The baby is swallowing more amniotic fluid, which helps train the digestive tract.",
      "The first stool, meconium, is slowly accumulating in the intestines."
    ],
    symptoms: [
      "Definite, frequent fetal movements.",
      "Increased appetite and high energy.",
      "Mild hand or foot swelling."
    ],
    bodyChanges: [
      "The top of your uterus (fundus) is now exactly level with your navel.",
      "You are likely visibly pregnant to everyone now."
    ],
    nutrition: [
      "Focus on iron. Anemia is common around week 20 due to blood dilution.",
      "Lentils, red meat, pumpkin seeds, and dark chocolate are excellent."
    ],
    exercise: [
      "Bracing and stabilization workouts.",
      "Continue Kegels to build strong pelvic floor control."
    ],
    sleep: [
      "Enjoy this period of relatively easy sleep before the third trimester.",
      "Keep up the side-sleeping habit."
    ]
  },
  {
    week: 21,
    fruit: "Carrot",
    fruitEmoji: "🥕",
    lengthCm: 26.7,
    lengthIn: 10.5,
    weightG: 360.0,
    weightOz: 12.70,
    milestones: [
      "Baby's movements are coordinated, shifting from simple reflexes to purposeful squirming.",
      "Early taste buds are starting to work.",
      "Fetal heartbeat is now strong enough to be heard with a simple stethoscope."
    ],
    symptoms: [
      "Leg cramps, especially at night.",
      "Dry, itchy skin on the belly.",
      "Varicose veins or hemorrhoids due to pelvic pressure."
    ],
    bodyChanges: [
      "The uterus rises about 1 cm above your navel.",
      "Your skin on your belly, thighs, and breasts may begin showing stretch marks (striae)."
    ],
    nutrition: [
      "Boost healthy fats. Snack on olives, walnuts, and wild-caught low-mercury salmon.",
      "Supports rapid fetal brain and nervous system myelination."
    ],
    exercise: [
      "Prenatal yoga or Pilates.",
      "Modified squats build leg strength, helping carry the extra weight safely."
    ],
    sleep: [
      "If leg cramps are severe, take a warm shower before bed or gently stretch your calves.",
      "Keep hydrated during the day to prevent cramping."
    ]
  },
  {
    week: 22,
    fruit: "Papaya",
    fruitEmoji: "🍈",
    lengthCm: 27.8,
    lengthIn: 10.9,
    weightG: 430.0,
    weightOz: 15.17,
    milestones: [
      "The baby's sense of touch is highly active; they touch their own face and grip the umbilical cord.",
      "Lungs are developing rapidly, though they cannot function on their own yet.",
      "Eyelashes and eyebrows are fully formed."
    ],
    symptoms: [
      "Increased vaginal discharge.",
      "Painless tightening of the uterus (Braxton Hicks contractions) may start.",
      "Lower back achiness."
    ],
    bodyChanges: [
      "The uterus is 2 cm above the navel.",
      "Your breasts may increase further in size and sensitivity."
    ],
    nutrition: [
      "Keep up protein intake. Aim for 75-100 grams daily to support tissue expansion.",
      "Beans, eggs, lean chicken, tofu, and quinoa are high-quality sources."
    ],
    exercise: [
      "Maintain active walking routines.",
      "Do not exercise to exhaustion; keep energy reserves high."
    ],
    sleep: [
      "Sleep with a pillow tucked under your lower back for optimal alignment.",
      "Limit fluids 1-2 hours before bed to reduce nighttime bathroom trips."
    ]
  },
  {
    week: 23,
    fruit: "Eggplant",
    fruitEmoji: "🍆",
    lengthCm: 28.9,
    lengthIn: 11.4,
    weightG: 500.0,
    weightOz: 17.64,
    milestones: [
      "The baby's inner ear is developed, allowing them to sense orientation and balance.",
      "Blood vessels in the lungs are forming to prepare for breathing.",
      "Skin is still wrinkled as fat stores continue to build up."
    ],
    symptoms: [
      "Swollen feet and ankles.",
      "Heat intolerance (feeling constantly warm).",
      "Mild forgetfulness."
    ],
    bodyChanges: [
      "Your belly bump is prominent and hard to miss.",
      "Your vascular system has dilated, which can lead to warmer hands and feet."
    ],
    nutrition: [
      "Reduce sodium to help curb ankle and hand swelling.",
      "Snack on fresh water-rich foods like cucumber, celery, and watermelon."
    ],
    exercise: [
      "Water aerobics or swimming is perfect for relieving ankle pressure and hip pain.",
      "Maintains low joint impact."
    ],
    sleep: [
      "Keep a small fan near your bed if you experience night sweats.",
      "Wear breathable cotton sleepwear."
    ]
  },
  {
    week: 24,
    fruit: "Ear of Corn",
    fruitEmoji: "🌽",
    lengthCm: 30.0,
    lengthIn: 11.8,
    weightG: 600.0,
    weightOz: 21.16,
    milestones: [
      "Fetal viability milestone! With intensive medical care, a baby born this week has a chance of survival.",
      "Lungs begin producing surfactant, a chemical that keeps air sacs open.",
      "Real hair is growing on the scalp."
    ],
    symptoms: [
      "Dry, itchy, or sensitive eyes.",
      "Frequent Braxton Hicks contractions.",
      "Lower back and pelvic pelvic discomfort."
    ],
    bodyChanges: [
      "Uterine fundus is about 4 cm above your navel.",
      "Your weight gain will continue steadily at 1 to 1.5 lbs per week."
    ],
    nutrition: [
      "Get plenty of complex carbohydrates for sustained energy (brown rice, oats, sweet potatoes).",
      "Stay strictly away from high-sugar treats to support stable glucose screening results."
    ],
    exercise: [
      "Keep walking and stretching.",
      "Avoid any high-balance activities as joint laxity reaches high levels."
    ],
    sleep: [
      "If you experience restless leg syndrome, check your iron levels with a physician.",
      "A soothing calf massage before bed can promote deep muscle relaxation."
    ]
  },
  {
    week: 25,
    fruit: "Rutabaga",
    fruitEmoji: "🥔",
    lengthCm: 34.6,
    lengthIn: 13.6,
    weightG: 660.0,
    weightOz: 23.28,
    milestones: [
      "Baby's skin becomes less translucent as fat continues to deposit.",
      "The nostrils, which were sealed shut, begin to open.",
      "The baby's sleep-wake cycles are well defined and mimic a newborn's."
    ],
    symptoms: [
      "Increased snoring due to nasal passage congestion.",
      "Mild hemorrhoids or rectal pressure.",
      "Acid reflux and slow digestion."
    ],
    bodyChanges: [
      "Uterus is now the size of a soccer ball.",
      "Your cardiovascular system continues working overtime, pumping extra blood volume."
    ],
    nutrition: [
      "Incorporate natural probiotics (kefir, Greek yogurt, sauerkraut) to optimize digestion and reduce bloating.",
      "Limit deep-fried foods."
    ],
    exercise: [
      "Do gentle core-bracing exercises (transversus abdominis engagement) to prevent diastasis recti.",
      "No traditional crunches or planks."
    ],
    sleep: [
      "Elevate your upper body with a wedge pillow to mitigate snoring and nighttime acid reflux.",
      "Sleep in a well-ventilated room."
    ]
  },
  {
    week: 26,
    fruit: "Scallion",
    fruitEmoji: "🥬",
    lengthCm: 35.6,
    lengthIn: 14.0,
    weightG: 760.0,
    weightOz: 26.81,
    milestones: [
      "The baby's eyes open for the first time and begin to blink.",
      "Brain wave activity shows responses to light and sound.",
      "Lungs continue preparing for air breathing."
    ],
    symptoms: [
      "Mild pelvic girdle pain.",
      "Clumsiness as your center of gravity continues to drift.",
      "Slightly elevated blood pressure."
    ],
    bodyChanges: [
      "Uterine fundus is now 6 cm above the navel.",
      "Your ribs may begin expanding outward to accommodate the rising uterus."
    ],
    nutrition: [
      "Ensure robust lutein and DHA intake for fetal ocular development (eggs, leafy greens, fish oil).",
      "Snack on nutrient-dense pumpkin seeds."
    ],
    exercise: [
      "Incorporate pelvic floor drops alongside Kegels to practice relaxation.",
      "Gentle swimming remains highly beneficial."
    ],
    sleep: [
      "If physical turning in bed is difficult, use satin sheets or pajamas to slide more easily.",
      "Support your tummy with a small wedge pillow."
    ]
  },
  {
    week: 27,
    fruit: "Cauliflower",
    fruitEmoji: "🥦",
    lengthCm: 36.6,
    lengthIn: 14.4,
    weightG: 875.0,
    weightOz: 30.86,
    milestones: [
      "This marks the final week of the Second Trimester.",
      "The baby can recognize the unique pitch of both mother and partner's voices.",
      "Hiccups are common and can be felt as rhythmic, repetitive ticks."
    ],
    symptoms: [
      "Shortness of breath as the uterus presses against the diaphragm.",
      "Leg cramps and backaches.",
      "Mild swelling of feet."
    ],
    bodyChanges: [
      "The top of your uterus is about 7 cm above your belly button.",
      "Stretch marks may become more prominent on the lower stomach."
    ],
    nutrition: [
      "Ensure sufficient calcium intake to protect maternal bone reserves.",
      "Drink calcium-fortified plant milk or snack on low-fat dairy."
    ],
    exercise: [
      "Stretching, walking, and light pelvic tilts.",
      "Focus on slow deep breathing to maximize oxygen intake."
    ],
    sleep: [
      "Practice a firm wind-down routine 1 hour before bed (no blue-light devices).",
      "Read a physical book or meditate to calm fetal movement before sleep."
    ]
  },
  {
    week: 28,
    fruit: "Kabocha Squash",
    fruitEmoji: "🎃",
    lengthCm: 37.6,
    lengthIn: 14.8,
    weightG: 1000.0,
    weightOz: 35.27,
    milestones: [
      "Welcome to the Third Trimester!",
      "The baby's brain develops billions of complex neurons.",
      "Eyelashes are fully formed, and the baby can blink and look around."
    ],
    symptoms: [
      "Pronounced physical fatigue returns.",
      "Increased backaches and sciatica twinges.",
      "Braxton Hicks contractions become more noticeable."
    ],
    bodyChanges: [
      "Uterine fundus is 8 cm above your navel.",
      "Your breasts may feel heavier and colostrum discharge may increase."
    ],
    nutrition: [
      "You need an extra 450 calories per day of nutrient-rich food.",
      "Include a handful of almonds, an orange, and avocado slices."
    ],
    exercise: [
      "Reduce intensity of cardio; focus on functional pelvic mechanics.",
      "Cat-Cow stretches are wonderful to ease back tension."
    ],
    sleep: [
      "Insomnia can emerge due to physical bulkiness. Use a full-body U-shaped pillow.",
      "Keep the room very cool to promote deep, uninterrupted sleep."
    ]
  },
  {
    week: 29,
    fruit: "Butternut Squash",
    fruitEmoji: "🍠",
    lengthCm: 38.6,
    lengthIn: 15.2,
    weightG: 1150.0,
    weightOz: 40.57,
    milestones: [
      "The baby's bones are absorbing calcium at a rate of 250 mg daily.",
      "The baby's head is growing larger to accommodate brain growth.",
      "The testicles are descending into the scrotum (in boys)."
    ],
    symptoms: [
      "Frequent heartburn and indigestion.",
      "Constipation and hemorrhoids.",
      "Occasional lightheadedness."
    ],
    bodyChanges: [
      "The uterus is 9 cm above the navel.",
      "Abdominal skin is tight, and your navel may pop outward."
    ],
    nutrition: [
      "Focus on magnesium-rich foods to relax muscles and combat constipation.",
      "Pumpkin seeds, spinach, and dark chocolate are highly recommended."
    ],
    exercise: [
      "Keep up low-impact stretching.",
      "Avoid any fast twisting motions that put sudden tension on hips."
    ],
    sleep: [
      "If heartburn is intense, sleep in a semi-reclined position with structured pillows.",
      "Do not eat heavy snacks within 2 hours of going to sleep."
    ]
  },
  {
    week: 30,
    fruit: "Cabbage",
    fruitEmoji: "🥬",
    lengthCm: 39.9,
    lengthIn: 15.7,
    weightG: 1319.0,
    weightOz: 46.53,
    milestones: [
      "The baby's bone marrow has taken over red blood cell production.",
      "The baby's lungs are expanding and practicing breathing fluids.",
      "Lanugo (fine hair) is beginning to fall off."
    ],
    symptoms: [
      "Mood shifts can return due to fatigue and physical load.",
      "Shortness of breath is common as uterus rises further.",
      "Varicose veins."
    ],
    bodyChanges: [
      "The top of the uterus is 10 cm above your belly button.",
      "Joints feel increasingly loose due to the relaxin hormone."
    ],
    nutrition: [
      "Eat plenty of iron to prepare for blood loss during delivery.",
      "Lean beef, iron-fortified cereals, and broccoli are exceptional."
    ],
    exercise: [
      "Gentle walking and pelvic floor coordination.",
      "Keep workouts short, around 15-20 minutes, to avoid draining your reserves."
    ],
    sleep: [
      "Rest is highly therapeutic. Allow yourself to lie down during the day.",
      "Keep hydration high earlier in the day to minimize waking up at night."
    ]
  },
  {
    week: 31,
    fruit: "Coconut",
    fruitEmoji: "🥥",
    lengthCm: 41.1,
    lengthIn: 16.2,
    weightG: 1502.0,
    weightOz: 52.98,
    milestones: [
      "The baby can turn their head from side to side.",
      "The nervous system is fully capable of regulating body temperature.",
      "The baby is sleeping longer stretches throughout the day."
    ],
    symptoms: [
      "Leaking breasts (colostrum).",
      "Shortness of breath on mild exertion.",
      "Braxton Hicks contractions are frequent."
    ],
    bodyChanges: [
      "Your uterus is filling the entire upper abdomen.",
      "Breathing becomes shallower as lung expansion is limited."
    ],
    nutrition: [
      "Focus on slow-burning energy foods to combat fatigue.",
      "Oats, quinoa, and brown rice with lean chicken or tofu."
    ],
    exercise: [
      "Modified squats holding onto a stable surface for support.",
      "Keeps the hips loose and strong."
    ],
    sleep: [
      "Prop up your knees with pillows to relieve sciatic nerve strain.",
      "A cool compress on the face or neck can help you relax."
    ]
  },
  {
    week: 32,
    fruit: "Jicama",
    fruitEmoji: "🥔",
    lengthCm: 42.4,
    lengthIn: 16.7,
    weightG: 1702.0,
    weightOz: 60.04,
    milestones: [
      "The baby is likely in the head-down position (vertex) preparing for birth.",
      "Fingernails have reached the tips of the fingers.",
      "Skin is becoming smoother as fat layer rounds out."
    ],
    symptoms: [
      "Lower back and pelvic girdle pressure.",
      "Frequent bathroom trips return as baby's head presses on bladder.",
      "Itchy stomach skin."
    ],
    bodyChanges: [
      "Your uterus is about 12 cm above the navel.",
      "Your belly is very tight and round."
    ],
    nutrition: [
      "Eat calcium-rich foods to finalize baby's skeletal strength.",
      "Almonds, broccoli, kale, and low-fat dairy."
    ],
    exercise: [
      "Prenatal yoga focusing on breathing and delivery positions.",
      "Gentle stretching for hips."
    ],
    sleep: [
      "Try to sleep with a pillow supporting your bump from underneath.",
      "Keep evening activities very calm."
    ]
  },
  {
    week: 33,
    fruit: "Pineapple",
    fruitEmoji: "🍍",
    lengthCm: 43.7,
    lengthIn: 17.2,
    weightG: 1918.0,
    weightOz: 67.65,
    milestones: [
      "The baby's skull bones are soft and pliable to pass through the birth canal.",
      "The immune system is getting a boost with maternal antibodies.",
      "The baby's brain and sensory systems are fully matured."
    ],
    symptoms: [
      "Carpal tunnel symptoms (numbness/tingling in hands and wrists).",
      "Puffiness in hands and feet.",
      "Uncomfortable sleeping positions."
    ],
    bodyChanges: [
      "The top of the uterus is 13 cm above the belly button.",
      "Your weight gain might peak around this time."
    ],
    nutrition: [
      "Drink water constantly. Good hydration reduces water retention and puffiness.",
      "Snack on low-sodium celery sticks and water-rich fruits."
    ],
    exercise: [
      "Stretching your forearms and keeping wrists elevated to combat carpal tunnel pain.",
      "Gentle walks."
    ],
    sleep: [
      "Elevate your hands on pillows at night if they feel numb or tingling.",
      "Sleep in a loose, comfortable environment."
    ]
  },
  {
    week: 34,
    fruit: "Cantaloupe",
    fruitEmoji: "🍈",
    lengthCm: 45.0,
    lengthIn: 17.7,
    weightG: 2146.0,
    weightOz: 75.70,
    milestones: [
      "The baby's lungs are finishing their final surfactant maturation.",
      "The central nervous system is completely mature.",
      "The baby's skin is smooth and vernix is thick."
    ],
    symptoms: [
      "Fatigue, resembling the first trimester.",
      "Frequent urination and bladder pressure.",
      "Braxton Hicks contractions may occur more regularly."
    ],
    bodyChanges: [
      "Uterus fundus is 14 cm above the navel.",
      "Pelvic bones are expanding further, which can cause groin aches."
    ],
    nutrition: [
      "Eat small, easy-to-digest meals to avoid feeling overly full and bloated.",
      "Incorporate chia seeds or fiber to avoid constipation."
    ],
    exercise: [
      "Gentle walking and pelvic floor drops.",
      "Avoid any heavy lifting or prolonged standing."
    ],
    sleep: [
      "Allow yourself a daily afternoon nap if nighttime sleep is poor.",
      "Create a calm, dark sleeping cave."
    ]
  },
  {
    week: 35,
    fruit: "Honeydew Melon",
    fruitEmoji: "🍈",
    lengthCm: 46.2,
    lengthIn: 18.2,
    weightG: 2383.0,
    weightOz: 84.06,
    milestones: [
      "The baby is now taking up most of the space inside your uterus.",
      "Kidneys are fully developed, and the liver can process some waste products.",
      "Most of the physical development is complete; the focus is now on gaining weight."
    ],
    symptoms: [
      "Frequent indigestion or reflux.",
      "Severe bladder pressure.",
      "Pelvic discomfort as the baby's head shifts lower."
    ],
    bodyChanges: [
      "The top of your uterus is just below your rib cage (about 15 cm above navel).",
      "You might feel like you have no more room to grow."
    ],
    nutrition: [
      "Focus on healthy protein. Ensure stable blood sugar with small, balanced meals.",
      "Eat healthy nuts, seeds, and avocado."
    ],
    exercise: [
      "Very gentle, restorative stretches.",
      "Do pelvic tilts on all fours to encourage the baby's optimal head position."
    ],
    sleep: [
      "Prop up your torso with extra pillows to ease rib pressure.",
      "Sleep strictly on your left side."
    ]
  },
  {
    week: 36,
    fruit: "Romaine Lettuce",
    fruitEmoji: "🥬",
    lengthCm: 47.4,
    lengthIn: 18.7,
    weightG: 2629.0,
    weightOz: 92.73,
    milestones: [
      "The baby is gaining about 1 ounce (30 grams) of fat daily.",
      "The baby is shedding the rest of their lanugo and vernix coating.",
      "The lungs are fully prepared for breathing air."
    ],
    symptoms: [
      "Baby may drop down into your pelvis ('lightening'). This makes breathing and eating easier, but increases pelvic pressure.",
      "Difficulty walking (the 'pregnancy waddle').",
      "Very frequent urination."
    ],
    bodyChanges: [
      "The uterus is at its highest point, touching the lower rib cage.",
      "Once the baby drops, your stomach may shape changes slightly, looking lower."
    ],
    nutrition: [
      "If the baby has dropped, enjoy the extra stomach capacity with healthy meals.",
      "Continue nutrient-dense, vitamin-rich foods."
    ],
    exercise: [
      "Gentle hip-opening stretches.",
      "Avoid stairs or uneven ground as your balance is altered."
    ],
    sleep: [
      "If pelvic pressure makes sleeping difficult, place a pillow under your hips.",
      "Keep a nightlight on in the bathroom for safety during frequent trips."
    ]
  },
  {
    week: 37,
    fruit: "Swiss Chard",
    fruitEmoji: "🥬",
    lengthCm: 48.6,
    lengthIn: 19.1,
    weightG: 2859.0,
    weightOz: 100.85,
    milestones: [
      "Early Term! A baby born this week is considered medically mature.",
      "The baby is practicing suction, blinking, and breathing movements.",
      "The baby's digestive tract is ready to process breast milk or formula."
    ],
    symptoms: [
      "Vaginal discharge increases (the mucus plug may discharge).",
      "Braxton Hicks contractions become longer and more intense.",
      "Difficulty finding any comfortable sitting or standing positions."
    ],
    bodyChanges: [
      "The cervix may begin to thin (efface) and dilate (open) in preparation.",
      "Your weight gain will likely taper off or stop completely."
    ],
    nutrition: [
      "Eat energy-boosting, easily absorbable meals.",
      "Oatmeal, bananas, and light smoothies are fantastic."
    ],
    exercise: [
      "Keep exercises extremely light. Focus on short walks to promote pelvic mobility.",
      "Rest is your ultimate priority."
    ],
    sleep: [
      "Sleep whenever you can. Naps are highly recommended.",
      "Keep the bedroom dark and free of distractions."
    ]
  },
  {
    week: 38,
    fruit: "Leek",
    fruitEmoji: "🥬",
    lengthCm: 49.8,
    lengthIn: 19.6,
    weightG: 3083.0,
    weightOz: 108.75,
    milestones: [
      "The baby's brain is coordinating complex tasks like swallowing and breathing.",
      "The baby's lungs are fully functional.",
      "The baby is gaining subcutaneous fat to stay warm after birth."
    ],
    symptoms: [
      "Pelvic pressure and groin twinges.",
      "Anxious feelings about labor.",
      "Loss of mucus plug or spotting."
    ],
    bodyChanges: [
      "The cervix continues to prepare for labor.",
      "Your uterus remains static in size."
    ],
    nutrition: [
      "Dates are traditionally eaten in late pregnancy (4-6 daily) to support cervical ripening.",
      "Eat them with nuts or yogurt."
    ],
    exercise: [
      "Short, gentle walks to encourage the baby's head to press on the cervix.",
      "Rest when tired."
    ],
    sleep: [
      "Practice calming mindfulness or deep breathing if anxiety keeps you awake.",
      "Use pillows to support your back and hips."
    ]
  },
  {
    week: 39,
    fruit: "Watermelon",
    fruitEmoji: "🍉",
    lengthCm: 50.7,
    lengthIn: 20.0,
    weightG: 3288.0,
    weightOz: 115.98,
    milestones: [
      "Full Term! Your baby is completely developed and ready to be born.",
      "The baby's skin is smooth, soft, and plump.",
      "The placenta continues to supply nutrients and antibodies."
    ],
    symptoms: [
      "Increased Braxton Hicks or early labor contractions.",
      "Loose stools as your body prepares for birth.",
      "Surge of nesting energy (the urge to clean and organize)."
    ],
    bodyChanges: [
      "The cervix thins out further.",
      "Your pelvis feels very heavy."
    ],
    nutrition: [
      "Eat light, high-energy meals. Avoid heavy, greasy dishes.",
      "Keep hydration levels exceptionally high."
    ],
    exercise: [
      "Limit workouts to brief, comfortable walks.",
      "Do not overexert yourself; save your energy for labor."
    ],
    sleep: [
      "Get as much rest as possible.",
      "Take warm, relaxing baths before bed to ease body tension."
    ]
  },
  {
    week: 40,
    fruit: "Pumpkin",
    fruitEmoji: "🎃",
    lengthCm: 51.2,
    lengthIn: 20.2,
    weightG: 3462.0,
    weightOz: 122.12,
    milestones: [
      "Due Date Week! Your baby is fully grown and ready to meet you.",
      "Only 5% of babies are born exactly on their due date; most arrive within a week on either side.",
      "All physical systems are fully active and mature."
    ],
    symptoms: [
      "Signs of labor (regular, painful contractions, water breaking).",
      "Very high pelvic pressure.",
      "Fatigue and emotional anticipation."
    ],
    bodyChanges: [
      "Cervical dilation and effacement progress.",
      "The baby's head is deep in your pelvic cavity."
    ],
    nutrition: [
      "Incorporate high-potassium and easy-to-digest carbs to build stamina.",
      "Smoothies, bananas, oatmeal, and clear broth."
    ],
    exercise: [
      "Gentle curb walking or swaying hips to encourage labor progression.",
      "Rest frequently."
    ],
    sleep: [
      "Prioritize horizontal rest even if you can't fall asleep.",
      "Keep comfortable with pillows and support."
    ]
  },
  {
    week: 41,
    fruit: "Jackfruit",
    fruitEmoji: "🍉",
    lengthCm: 51.7,
    lengthIn: 20.4,
    weightG: 3597.0,
    weightOz: 126.88,
    milestones: [
      "Late Term! The baby is fully safe and healthy, just taking a bit more time.",
      "The baby continues to gain fat and mature.",
      "The placenta is monitored closely by healthcare providers."
    ],
    symptoms: [
      "Physical discomfort peaks.",
      "Intense pelvic pressure.",
      "Irritability or anxiousness about labor starting."
    ],
    bodyChanges: [
      "Cervix is highly ripe, ready for dilation.",
      "Physicians may discuss induction options."
    ],
    nutrition: [
      "Stay hydrated and focus on comforting, simple meals.",
      "Avoid overeating to maintain abdominal comfort."
    ],
    exercise: [
      "Very light pacing and deep hip swaying.",
      "Deep, relaxed breathing."
    ],
    sleep: [
      "Rest is critical; your body is preparing for imminent labor.",
      "Sleep whenever you feel tired, ignoring normal schedules."
    ]
  },
  {
    week: 42,
    fruit: "Large Watermelon",
    fruitEmoji: "🍉",
    lengthCm: 52.2,
    lengthIn: 20.6,
    weightG: 3685.0,
    weightOz: 129.98,
    milestones: [
      "Post-term! Baby is completely ready.",
      "Medical practitioners typically recommend induction by the end of this week.",
      "Fetal movements should remain active and monitored closely."
    ],
    symptoms: [
      "Heavy physical pressure.",
      "Irregular or regular contractions.",
      "Frequent back pain."
    ],
    bodyChanges: [
      "Cervix is heavily effaced and ready.",
      "Active medical tracking."
    ],
    nutrition: [
      "Keep energy high with liquid nutrition or small, easy foods.",
      "High electrolyte hydration."
    ],
    exercise: [
      "Rest and relax as much as possible.",
      "Keep pelvic posture open."
    ],
    sleep: [
      "Focus on relaxing your mind.",
      "Use white noise or light music to encourage rest."
    ]
  }
];
