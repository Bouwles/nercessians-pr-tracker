// Default exercise library — loaded on first launch
// Categories: Chest, Back, Shoulders, Arms, Legs, Core, Olympic/Powerlifting, Cardio

export const DEFAULT_EXERCISES = [
  // ─── Chest ────────────────────────────────────────────────────────────────
  { name: 'Bench Press (Barbell)',       category: 'Chest' },
  { name: 'Incline Bench Press',         category: 'Chest' },
  { name: 'Decline Bench Press',         category: 'Chest' },
  { name: 'Dumbbell Bench Press',        category: 'Chest' },
  { name: 'Incline Dumbbell Press',      category: 'Chest' },
  { name: 'Dumbbell Flyes',              category: 'Chest' },
  { name: 'Cable Flyes',                 category: 'Chest' },
  { name: 'Chest Press Machine',         category: 'Chest' },
  { name: 'Pec Deck',                    category: 'Chest' },
  { name: 'Dips (Chest)',                category: 'Chest' },

  // ─── Back ─────────────────────────────────────────────────────────────────
  { name: 'Deadlift',                    category: 'Back' },
  { name: 'Barbell Row',                 category: 'Back' },
  { name: 'Pull-Ups',                    category: 'Back' },
  { name: 'Chin-Ups',                    category: 'Back' },
  { name: 'Lat Pulldown',                category: 'Back' },
  { name: 'Seated Cable Row',            category: 'Back' },
  { name: 'T-Bar Row',                   category: 'Back' },
  { name: 'Single Arm Dumbbell Row',     category: 'Back' },
  { name: 'Face Pulls',                  category: 'Back' },
  { name: 'Straight Arm Pulldown',       category: 'Back' },
  { name: 'Hyperextensions',             category: 'Back' },

  // ─── Shoulders ────────────────────────────────────────────────────────────
  { name: 'Overhead Press (Barbell)',    category: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press',     category: 'Shoulders' },
  { name: 'Arnold Press',                category: 'Shoulders' },
  { name: 'Lateral Raises',              category: 'Shoulders' },
  { name: 'Front Raises',                category: 'Shoulders' },
  { name: 'Rear Delt Flyes',             category: 'Shoulders' },
  { name: 'Cable Lateral Raises',        category: 'Shoulders' },
  { name: 'Upright Row',                 category: 'Shoulders' },
  { name: 'Shrugs',                      category: 'Shoulders' },
  { name: 'Machine Shoulder Press',      category: 'Shoulders' },

  // ─── Arms ─────────────────────────────────────────────────────────────────
  { name: 'Barbell Curl',                category: 'Arms' },
  { name: 'Dumbbell Curl',               category: 'Arms' },
  { name: 'Hammer Curl',                 category: 'Arms' },
  { name: 'Preacher Curl',               category: 'Arms' },
  { name: 'Cable Curl',                  category: 'Arms' },
  { name: 'Tricep Pushdown',             category: 'Arms' },
  { name: 'Skull Crushers',              category: 'Arms' },
  { name: 'Close Grip Bench Press',      category: 'Arms' },
  { name: 'Tricep Dips',                 category: 'Arms' },
  { name: 'Overhead Tricep Extension',   category: 'Arms' },

  // ─── Legs ─────────────────────────────────────────────────────────────────
  { name: 'Squat (Barbell)',             category: 'Legs' },
  { name: 'Front Squat',                 category: 'Legs' },
  { name: 'Leg Press',                   category: 'Legs' },
  { name: 'Romanian Deadlift',           category: 'Legs' },
  { name: 'Leg Curl (Hamstring)',        category: 'Legs' },
  { name: 'Leg Extension (Quad)',        category: 'Legs' },
  { name: 'Calf Raises',                 category: 'Legs' },
  { name: 'Lunges (Barbell)',            category: 'Legs' },
  { name: 'Bulgarian Split Squat',       category: 'Legs' },
  { name: 'Hack Squat',                  category: 'Legs' },
  { name: 'Goblet Squat',                category: 'Legs' },
  { name: 'Sumo Deadlift',               category: 'Legs' },

  // ─── Core ─────────────────────────────────────────────────────────────────
  { name: 'Plank',                       category: 'Core' },
  { name: 'Weighted Crunches',           category: 'Core' },
  { name: 'Hanging Leg Raises',          category: 'Core' },
  { name: 'Ab Wheel Rollouts',           category: 'Core' },
  { name: 'Cable Crunches',              category: 'Core' },
  { name: 'Russian Twists',              category: 'Core' },
  { name: 'Decline Sit-Ups',             category: 'Core' },
  { name: 'Dragon Flag',                 category: 'Core' },

  // ─── Olympic / Powerlifting ───────────────────────────────────────────────
  { name: 'Clean and Jerk',              category: 'Olympic/Powerlifting' },
  { name: 'Snatch',                      category: 'Olympic/Powerlifting' },
  { name: 'Power Clean',                 category: 'Olympic/Powerlifting' },
  { name: 'Push Press',                  category: 'Olympic/Powerlifting' },
  { name: 'Box Squat',                   category: 'Olympic/Powerlifting' },
  { name: 'Pause Squat',                 category: 'Olympic/Powerlifting' },
  { name: 'Deficit Deadlift',            category: 'Olympic/Powerlifting' },
  { name: 'Rack Pull',                   category: 'Olympic/Powerlifting' },

  // ─── Cardio ───────────────────────────────────────────────────────────────
  { name: 'Running (Treadmill)',         category: 'Cardio' },
  { name: 'Cycling (Stationary)',        category: 'Cardio' },
  { name: 'Rowing Machine',              category: 'Cardio' },
  { name: 'Jump Rope',                   category: 'Cardio' },
  { name: 'Stair Climber',               category: 'Cardio' },
  { name: 'Battle Ropes',                category: 'Cardio' },
];

export const CATEGORIES = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Olympic/Powerlifting',
  'Cardio',
];

export const CATEGORY_COLORS = {
  Chest:                 '#ef4444',
  Back:                  '#3b82f6',
  Shoulders:             '#f59e0b',
  Arms:                  '#10b981',
  Legs:                  '#8b5cf6',
  Core:                  '#f97316',
  'Olympic/Powerlifting':'#ec4899',
  Cardio:                '#06b6d4',
};
