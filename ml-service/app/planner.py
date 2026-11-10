"""
SmartFit Comprehensive Diet and Activity Planner Engine
Generates science-based, personalized workout schedules and nutrition plans.
"""

from typing import Dict, Any, List, Optional

def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """Mifflin-St Jeor Equation for Basal Metabolic Rate."""
    if gender.upper() == "FEMALE":
        return round(10.0 * weight_kg + 6.25 * height_cm - 5.0 * age - 161.0, 1)
    # Default to Male / General
    return round(10.0 * weight_kg + 6.25 * height_cm - 5.0 * age + 5.0, 1)

def get_activity_multiplier(weekly_workouts: int) -> float:
    if weekly_workouts <= 1:
        return 1.2    # Sedentary / very light
    elif weekly_workouts <= 3:
        return 1.375  # Lightly active
    elif weekly_workouts <= 5:
        return 1.55   # Moderately active
    else:
        return 1.725  # Very active

def calculate_diet_plan(
    age: int,
    weight_kg: float,
    fitness_level: str,
    goal: str,
    weekly_workouts: int,
    dietary_preference: str = "STANDARD",
    height_cm: float = 175.0,
    gender: str = "MALE"
) -> Dict[str, Any]:
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    multiplier = get_activity_multiplier(weekly_workouts)
    tdee = round(bmr * multiplier)

    # Caloric target adjustment
    goal_upper = goal.upper()
    if goal_upper == "WEIGHT_LOSS":
        daily_calories = max(1200, tdee - 500)
        calorie_note = "Caloric deficit of ~500 kcal/day for healthy fat loss (-0.5kg/week)."
    elif goal_upper in ("MUSCLE_GAIN", "STRENGTH"):
        daily_calories = tdee + 350
        calorie_note = "Lean caloric surplus of ~350 kcal/day to support muscle protein synthesis."
    elif goal_upper == "ENDURANCE":
        daily_calories = tdee + 150
        calorie_note = "Slight surplus with high carbohydrate availability for glycogen restoration."
    else:  # GENERAL_FITNESS, FLEXIBILITY
        daily_calories = tdee
        calorie_note = "Maintenance calories to optimize energy balance and recovery."

    # Macronutrient distribution
    diet_pref = dietary_preference.upper()
    if diet_pref == "KETO":
        p_pct, c_pct, f_pct = 25, 5, 70
    elif goal_upper in ("MUSCLE_GAIN", "STRENGTH"):
        p_pct, c_pct, f_pct = 30, 45, 25
    elif goal_upper == "WEIGHT_LOSS":
        p_pct, c_pct, f_pct = 35, 35, 30
    elif goal_upper == "ENDURANCE":
        p_pct, c_pct, f_pct = 20, 60, 20
    else:
        p_pct, c_pct, f_pct = 25, 50, 25

    protein_grams = round((daily_calories * (p_pct / 100)) / 4)
    carbs_grams = round((daily_calories * (c_pct / 100)) / 4)
    fat_grams = round((daily_calories * (f_pct / 100)) / 9)

    hydration_liters = round(max(2.2, (weight_kg * 0.035) + (0.5 if weekly_workouts >= 3 else 0.0)), 1)

    # Meal templates customized by dietary preference
    meals = _generate_meals(diet_pref, daily_calories, goal_upper)

    guidelines = [
        f"Drink at least {hydration_liters}L of water daily to support metabolic rate and performance.",
        f"Target {protein_grams}g of protein evenly distributed across 3–4 meals (30–45g per meal).",
        "Consume your pre-workout meal 60–90 minutes before training to fuel workout intensity.",
        "Eat a recovery snack rich in protein and carbohydrates within 45 minutes post-exercise.",
        "Prioritize whole, minimally processed foods, dietary fiber (25–35g/day), and quality sleep (7–9 hrs)."
    ]

    return {
        "dailyCalories": daily_calories,
        "bmr": bmr,
        "tdee": tdee,
        "calorieNote": calorie_note,
        "macros": {
            "proteinGrams": protein_grams,
            "proteinPercent": p_pct,
            "carbsGrams": carbs_grams,
            "carbsPercent": c_pct,
            "fatGrams": fat_grams,
            "fatPercent": f_pct
        },
        "hydrationLiters": hydration_liters,
        "meals": meals,
        "guidelines": guidelines
    }

def _generate_meals(diet_pref: str, daily_cal: int, goal: str) -> List[Dict[str, Any]]:
    b_cal = round(daily_cal * 0.25)
    s1_cal = round(daily_cal * 0.10)
    l_cal = round(daily_cal * 0.30)
    s2_cal = round(daily_cal * 0.10)
    d_cal = round(daily_cal * 0.25)

    if diet_pref == "VEGETARIAN":
        return [
            {
                "name": "Power Breakfast",
                "targetCalories": b_cal,
                "proteinEst": "28g",
                "items": [
                    "Rolled oats (60g) cooked in soy or low-fat dairy milk",
                    "1 scoop whey or plant protein powder with chia seeds (10g)",
                    "Handful of blueberries or 1 sliced banana"
                ]
            },
            {
                "name": "Mid-Morning Fuel",
                "targetCalories": s1_cal,
                "proteinEst": "14g",
                "items": [
                    "Low-fat Greek yogurt or cottage cheese (150g)",
                    "Handful of raw almonds or walnuts (15g)"
                ]
            },
            {
                "name": "Nutrient-Dense Lunch",
                "targetCalories": l_cal,
                "proteinEst": "34g",
                "items": [
                    "Grilled paneer or firm tofu (150g) seasoned with herbs",
                    "Cooked quinoa or brown basmati rice (1 cup)",
                    "Steamed broccoli, carrots, and spinach salad with 1 tsp olive oil"
                ]
            },
            {
                "name": "Pre / Post Workout Snack",
                "targetCalories": s2_cal,
                "proteinEst": "18g",
                "items": [
                    "2 brown rice cakes with 1 tbsp natural peanut butter",
                    "Small protein shake or roasted edamame (30g)"
                ]
            },
            {
                "name": "Recovery Dinner",
                "targetCalories": d_cal,
                "proteinEst": "30g",
                "items": [
                    "Lentil dahl or black bean chili (1.5 cups)",
                    "Roasted sweet potato wedges (150g)",
                    "Large mixed green salad with cucumber and lemon dressing"
                ]
            }
        ]
    elif diet_pref == "VEGAN":
        return [
            {
                "name": "Plant-Powered Breakfast",
                "targetCalories": b_cal,
                "proteinEst": "26g",
                "items": [
                    "Tofu scramble with nutritional yeast, spinach, and bell peppers",
                    "2 slices wholegrain sourdough toast with sliced avocado",
                    "1 cup unsweetened soy milk"
                ]
            },
            {
                "name": "Mid-Morning Snack",
                "targetCalories": s1_cal,
                "proteinEst": "12g",
                "items": [
                    "Roasted chickpeas or spicy edamame beans (40g)",
                    "1 small green apple"
                ]
            },
            {
                "name": "Balanced Macro Lunch",
                "targetCalories": l_cal,
                "proteinEst": "32g",
                "items": [
                    "Tempeh or seitan strips (140g) stir-fried in sesame oil",
                    "Brown rice and green peas bowl (1.5 cups)",
                    "Steamed bok choy and shredded purple cabbage"
                ]
            },
            {
                "name": "Pre/Post Training Boost",
                "targetCalories": s2_cal,
                "proteinEst": "20g",
                "items": [
                    "Pea/Rice protein isolate shake with almond milk",
                    "1 medium ripe banana"
                ]
            },
            {
                "name": "Restorative Dinner",
                "targetCalories": d_cal,
                "proteinEst": "28g",
                "items": [
                    "Red lentil and sweet potato curry with turmeric and coconut milk",
                    "Cooked quinoa (1 cup)",
                    "Cruciferous salad (kale, broccoli slaw, pumpkin seeds)"
                ]
            }
        ]
    elif diet_pref == "KETO":
        return [
            {
                "name": "Keto Kickstart Breakfast",
                "targetCalories": b_cal,
                "proteinEst": "26g",
                "items": [
                    "3 whole eggs scrambled in grass-fed butter or coconut oil",
                    "1/2 ripe avocado with sea salt and hemp hearts",
                    "Handful of baby spinach sautéed with olive oil"
                ]
            },
            {
                "name": "Mid-Morning High-Fat Fuel",
                "targetCalories": s1_cal,
                "proteinEst": "8g",
                "items": [
                    "Macadamia nuts or pecans (25g)",
                    "Keto black coffee with 1 tsp MCT oil"
                ]
            },
            {
                "name": "Sustained Energy Lunch",
                "targetCalories": l_cal,
                "proteinEst": "38g",
                "items": [
                    "Grilled salmon fillet or chicken thighs (180g)",
                    "Cauliflower rice with garlic herb butter",
                    "Arugula and cucumber salad with olive oil and parmesan"
                ]
            },
            {
                "name": "Keto Training Fuel",
                "targetCalories": s2_cal,
                "proteinEst": "14g",
                "items": [
                    "Boiled egg and 1 string cheese stick",
                    "Celery sticks with 1 tbsp almond butter"
                ]
            },
            {
                "name": "Low-Carb Recovery Dinner",
                "targetCalories": d_cal,
                "proteinEst": "35g",
                "items": [
                    "Grass-fed beef steak or grilled tofu/paneer (160g)",
                    "Roasted asparagus and zucchini spears in garlic butter",
                    "Side mixed salad with avocado oil vinaigrette"
                ]
            }
        ]
    else:  # STANDARD / HIGH_PROTEIN
        return [
            {
                "name": "High-Protein Breakfast",
                "targetCalories": b_cal,
                "proteinEst": "35g",
                "items": [
                    "3 whole eggs or 2 eggs + 2 egg whites with herbs",
                    "Rolled oats (50g) with blueberries and cinnamon",
                    "1 slice wholegrain toast with olive spread"
                ]
            },
            {
                "name": "Mid-Morning Snack",
                "targetCalories": s1_cal,
                "proteinEst": "18g",
                "items": [
                    "Low-fat Greek yogurt (170g) with 1 tsp honey",
                    "Handful of raw almonds (15g)"
                ]
            },
            {
                "name": "Performance Lunch",
                "targetCalories": l_cal,
                "proteinEst": "42g",
                "items": [
                    "Grilled chicken breast or lean turkey (160g)",
                    "Cooked quinoa or jasmine rice (1 cup)",
                    "Steamed broccoli, zucchini, and baby spinach drizzled with olive oil"
                ]
            },
            {
                "name": "Pre / Post Workout Fuel",
                "targetCalories": s2_cal,
                "proteinEst": "25g",
                "items": [
                    "Whey protein shake in water or skim milk",
                    "1 medium banana or 2 medjool dates for rapid glycogen replenishment"
                ]
            },
            {
                "name": "Recovery Dinner",
                "targetCalories": d_cal,
                "proteinEst": "38g",
                "items": [
                    "Baked Atlantic salmon or white fish fillet (160g)",
                    "Medium baked sweet potato (180g)",
                    "Mixed green salad with cherry tomatoes, cucumbers, and balsamic glaze"
                ]
            }
        ]

def generate_workout_plan(
    activity: str,
    fitness_level: str,
    goal: str,
    weekly_workouts: int,
    duration_min: float = 45.0
) -> Dict[str, Any]:
    act = activity.upper()
    dur = int(max(25, min(90, duration_min)))
    level = fitness_level.upper()

    schedule = _build_weekly_schedule(act, level, goal.upper(), weekly_workouts, dur)
    warmup, cooldown = _get_warmup_and_cooldown(act)
    progression_tips = _get_progression_tips(act, level, goal.upper())

    return {
        "activity": act,
        "fitnessLevel": level,
        "workoutsPerWeek": weekly_workouts,
        "averageDurationMinutes": dur,
        "weeklySchedule": schedule,
        "warmup": warmup,
        "cooldown": cooldown,
        "progressionTips": progression_tips
    }

def _build_weekly_schedule(activity: str, level: str, goal: str, days: int, dur: int) -> List[Dict[str, Any]]:
    days = max(2, min(6, days))
    schedule = []

    if activity == "WEIGHTLIFTING":
        if days <= 3:
            templates = [
                ("Day 1", "Full Body Strength (Focus: Squat & Bench)", "WORKOUT", [
                    "Barbell Back Squat: 3 sets x 8 reps (Rest 2m)",
                    "Barbell Flat Bench Press: 3 sets x 8 reps (Rest 2m)",
                    "Bent-Over Barbell Row: 3 sets x 10 reps (Rest 90s)",
                    "Standing Dumbbell Overhead Press: 3 sets x 10 reps",
                    "Hanging Leg Raises: 3 sets x 12 reps"
                ]),
                ("Day 2", "Active Recovery & Mobility", "REST", [
                    "20 min light walk or cycling (Zone 1)",
                    "Thoracic spine and hip flexor dynamic mobility drills",
                    "Hydrate and hit your protein target"
                ]),
                ("Day 3", "Full Body Hypertrophy (Focus: Deadlift & Pull)", "WORKOUT", [
                    "Romanian Deadlift: 3 sets x 8 reps (Rest 2m)",
                    "Incline Dumbbell Press: 3 sets x 10 reps",
                    "Lat Pulldown or Pull-ups: 3 sets x 8-10 reps",
                    "Dumbbell Walking Lunges: 3 sets x 10 reps/leg",
                    "Plank Hold: 3 sets x 45-60s"
                ]),
                ("Day 4", "Rest & Muscle Repair", "REST", [
                    "Full rest day. Foam rolling quads, hamstrings, and upper back."
                ]),
                ("Day 5", "Full Body Conditioning & Core", "WORKOUT", [
                    "Goblet Squats: 3 sets x 12 reps",
                    "Dumbbell Push Press: 3 sets x 10 reps",
                    "Seated Cable Rows: 3 sets x 12 reps",
                    "Dumbbell Bicep Curls superset with Tricep Rope Pushdowns: 3 x 12",
                    "Farmer's Walks: 4 sets x 40m"
                ]),
                ("Day 6", "Active Mobility & Recovery Walk", "REST", [
                    "30 min leisurely outdoor walk",
                    "Full-body yoga stretch routine"
                ]),
                ("Day 7", "Complete Rest", "REST", [
                    "Meal prep and plan for the upcoming training week."
                ])
            ]
        else: # 4 to 6 days: Upper / Lower or Push / Pull / Legs
            templates = [
                ("Day 1", "Upper Body Power (Chest, Back, Shoulders)", "WORKOUT", [
                    "Barbell Bench Press: 4 sets x 6-8 reps",
                    "Barbell Barbell Bent-Over Row: 4 sets x 8 reps",
                    "Overhead Dumbbell Shoulder Press: 3 sets x 10 reps",
                    "Chest-Supported Machine Row: 3 sets x 10 reps",
                    "Incline Dumbbell Bicep Curl + Overhead Tricep Ext: 3 x 12"
                ]),
                ("Day 2", "Lower Body Power (Quads, Hamstrings, Glutes)", "WORKOUT", [
                    "Barbell Back Squat: 4 sets x 6-8 reps",
                    "Romanian Deadlift: 3 sets x 8 reps",
                    "Bulgarian Split Squats: 3 sets x 10 reps/leg",
                    "Standing Calf Raises: 4 sets x 12-15 reps",
                    "Hanging Knee to Elbows: 3 sets x 12 reps"
                ]),
                ("Day 3", "Active Recovery & Soft Tissue Work", "REST", [
                    "Light 25-min brisk walk",
                    "Foam rolling and dynamic stretching routine"
                ]),
                ("Day 4", "Upper Body Hypertrophy", "WORKOUT", [
                    "Incline Barbell/Dumbbell Press: 3 sets x 10 reps",
                    "Lat Pulldowns or Weighted Pull-ups: 3 sets x 8-10 reps",
                    "Dumbbell Lateral Raises: 4 sets x 12-15 reps",
                    "Cable Face Pulls: 3 sets x 15 reps",
                    "Dips or Cable Tricep Pushdowns: 3 sets x 12 reps"
                ]),
                ("Day 5", "Lower Body Hypertrophy & Posterior Chain", "WORKOUT", [
                    "Leg Press: 3 sets x 10-12 reps",
                    "Hamstring Lying Leg Curls: 3 sets x 12 reps",
                    "Dumbbell Walking Lunges: 3 sets x 12 steps/leg",
                    "Seated Calf Raises: 3 sets x 15 reps",
                    "Ab Wheel Rollouts or Weighted Planks: 3 x 12"
                ]),
                ("Day 6", "Conditioning or Weak Point Training" if days >= 5 else "Active Recovery", "WORKOUT" if days >= 5 else "REST", [
                    "Cardio acceleration: 20 min Zone 2 incline treadmill",
                    "Core stability and rotational medicine ball throws",
                    "Full body mobility flow"
                ]),
                ("Day 7", "Complete Rest & Recovery", "REST", [
                    "Rest day. Focus on quality sleep, hydration, and nutrition."
                ])
            ]
    elif activity == "RUNNING":
        templates = [
            ("Day 1", "Easy Aerobic Base Run (Zone 2)", "WORKOUT", [
                f"{dur} mins continuous easy jogging at conversation pace (Zone 2 HR)",
                "Focus on upright posture, high cadence (170-180 spm)",
                "4 x 20-second post-run accelerations/strides on grass"
            ]),
            ("Day 2", "Cross Training & Core Stability", "REST" if days < 3 else "WORKOUT", [
                "25 mins bodyweight strength (lunges, glute bridges, planks)",
                "Ankle and calf mobility drills"
            ]),
            ("Day 3", "Interval Speed Session", "WORKOUT", [
                "10 min warm-up jog + dynamic drills",
                "6 to 8 sets of 400m fast pace (5K pace) with 90s walk recovery",
                "10 min easy cool-down jog"
            ]),
            ("Day 4", "Rest & Active Recovery", "REST", [
                "20 min light walk or gentle yoga",
                "Foam roll calves, IT bands, and hip flexors"
            ]),
            ("Day 5", "Tempo / Lactate Threshold Run", "WORKOUT" if days >= 4 else "REST", [
                "10 min warm-up jog",
                f"{max(15, dur - 15)} mins continuous steady-hard tempo (comfortably hard, Zone 3-4)",
                "5 min easy jog cool-down"
            ]),
            ("Day 6", "Rest & Preparation", "REST", [
                "Hydration and carb loading for the weekly long run",
                "Gentle lower body stretching"
            ]),
            ("Day 7", "Weekly Long Run (Endurance Foundation)", "WORKOUT", [
                f"{int(dur * 1.3)} mins continuous steady run at easy conversational pace",
                "Focus on fat oxidation and aerobic capacity",
                "Immediate rehydration with electrolytes"
            ])
        ]
    elif activity == "CYCLING":
        templates = [
            ("Day 1", "Zone 2 Base Endurance Ride", "WORKOUT", [
                f"{dur} mins steady spin at 85-95 RPM cadence",
                "Keep heart rate strictly in Zone 2 aerobic zone",
                "5 min easy spin cool-down"
            ]),
            ("Day 2", "Rest & Lower Body Mobility", "REST", [
                "Hip flexor and hamstring dynamic stretching",
                "Hydration and recovery"
            ]),
            ("Day 3", "High-Intensity Cadence & Hill Intervals", "WORKOUT", [
                "10 min progressive warm-up",
                "5 x 3 min high-resistance / hill climbs (Zone 4) with 2 min spin recovery",
                "10 min light spin cool-down"
            ]),
            ("Day 4", "Recovery Spin or Rest", "REST", [
                "Optional 20 min very light recovery spin on flat terrain"
            ]),
            ("Day 5", "Threshold Power Intervals", "WORKOUT" if days >= 3 else "REST", [
                "10 min warm-up",
                "3 x 8 min sweet-spot / threshold intervals with 4 min easy spinning",
                "10 min cool-down"
            ]),
            ("Day 6", "Active Recovery & Core Work", "REST", [
                "Core planks, bird-dogs, and glute activation drills"
            ]),
            ("Day 7", "Long Weekend Outdoor / Virtual Ride", "WORKOUT", [
                f"{int(dur * 1.4)} mins progressive endurance ride",
                "Maintain consistent power output throughout"
            ])
        ]
    elif activity == "SWIMMING":
        templates = [
            ("Day 1", "Aerobic Base & Technique Focus", "WORKOUT", [
                "200m easy freestyle warm-up",
                "4 x 50m catch-up drill with kickboard",
                "4 x 100m freestyle at steady Zone 2 pace (30s rest)",
                "100m backstroke easy cool-down"
            ]),
            ("Day 2", "Rest & Shoulder Prehab", "REST", [
                "Rotator cuff external rotations with light band",
                "Thoracic mobility stretches"
            ]),
            ("Day 3", "Speed & Sprint Intervals", "WORKOUT", [
                "200m mixed stroke warm-up",
                "8 x 50m sprint freestyle (85-90% effort) with 45s rest",
                "4 x 25m dolphin kick underwater",
                "200m easy cool-down"
            ]),
            ("Day 4", "Rest & Recovery", "REST", [
                "Active walking and hydration"
            ]),
            ("Day 5", "Endurance Distance Pyramids", "WORKOUT" if days >= 4 else "REST", [
                "Pyramid: 100m - 200m - 300m - 200m - 100m steady pace",
                "4 x 50m pull buoy only (upper body focus)",
                "150m choice cool-down"
            ]),
            ("Day 6", "Rest & Upper Body Mobility", "REST", [
                "Lat, pec, and neck gentle stretches"
            ]),
            ("Day 7", "Continuous Open Distance / Recovery Swim", "WORKOUT", [
                f"{dur} mins continuous smooth swimming focusing on breathing rhythm and streamline glide"
            ])
        ]
    elif activity == "HIIT":
        templates = [
            ("Day 1", "Full Body Metabolic Circuit", "WORKOUT", [
                "4 rounds of 45s work / 15s rest:",
                "- Dumbbell Thrusters or Bodyweight Squat Jumps",
                "- Mountain Climbers",
                "- Kettlebell Swings or Dumbbell Deadlifts",
                "- Push-ups to Renegade Rows",
                "- Burpees (Rest 2 min between rounds)"
            ]),
            ("Day 2", "Active Recovery & Joint Mobility", "REST", [
                "20 min light walk",
                "Hip opener and shoulder mobility flow"
            ]),
            ("Day 3", "Tabata Explosive Cardio & Core", "WORKOUT", [
                "Tabata 1 (20s on / 10s off x 8): High Knees & Jump Rope",
                "Rest 2 mins",
                "Tabata 2: Russian Twists & Bicycle Crunches",
                "Rest 2 mins",
                "Tabata 3: Speed Skaters & Plank Jacks",
                "Cool-down and static stretch"
            ]),
            ("Day 4", "Rest & Hydration", "REST", [
                "Rest day. Focus on balanced nutrition and cellular hydration."
            ]),
            ("Day 5", "Strength Endurance AMRAP (As Many Rounds As Possible)", "WORKOUT" if days >= 4 else "REST", [
                f"20 min AMRAP:",
                "- 10 Dumbbell Goblet Squats",
                "- 10 Push-ups",
                "- 12 Walking Lunges",
                "- 15 Kettlebell Swings",
                "- 200m sprint or 45s rowing sprint"
            ]),
            ("Day 6", "Rest & Foam Rolling", "REST", [
                "Full-body self-myofascial release (foam rolling quads, calves, lats)"
            ]),
            ("Day 7", "Outdoor Sprint Intervals or Active Play", "WORKOUT" if days >= 5 else "REST", [
                "6 x 50m hill sprints with walk-back recovery",
                "15 min restorative yoga stretch"
            ])
        ]
    elif activity == "YOGA":
        templates = [
            ("Day 1", "Dynamic Vinyasa Power Flow", "WORKOUT", [
                "Sun Salutations A & B (5 rounds)",
                "Warrior I, II, and Reverse Warrior sequences",
                "Chair pose with rotational twist",
                "Core boat pose (Navasana) holds",
                "Savasana relaxation (5 mins)"
            ]),
            ("Day 2", "Hip Opening & Spine Mobility", "WORKOUT", [
                "Lizard pose, Pigeon pose, and Butterfly pose holds (90s each)",
                "Cat-Cow and Thread-the-Needle spinal waves",
                "Seated forward fold with deep diaphragmatic breathing"
            ]),
            ("Day 3", "Rest & Meditative Recovery", "REST", [
                "15 min guided mindfulness breathing / Pranayama",
                "Full joint wrist and ankle gentle circles"
            ]),
            ("Day 4", "Balance & Inversion Fundamentals", "WORKOUT", [
                "Tree pose, Eagle pose, and Warrior III stability drills",
                "Dolphin pose and Crow pose balance progression",
                "Bridge pose and gentle wheel prep",
                "Savasana"
            ]),
            ("Day 5", "Rest & Rejuvenation", "REST", [
                "Hydration, gentle walk, and posture alignment check"
            ]),
            ("Day 6", "Yin Yoga & Deep Fascial Release", "WORKOUT" if days >= 4 else "REST", [
                "Long-hold Yin postures (3-5 mins per pose):",
                "- Dragon pose (deep psoas release)",
                "- Sphinx & Seal pose (spine decompression)",
                "- Reclined spinal twist with bolsters"
            ]),
            ("Day 7", "Restorative Yoga & Breathwork", "REST", [
                "Legs-Up-The-Wall (Viparita Karani) for 10 mins",
                "Box breathing (4-4-4-4) to reduce sympathetic nervous tone"
            ])
        ]
    else:  # WALKING / GENERAL
        templates = [
            ("Day 1", "Brisk Incline Walk", "WORKOUT", [
                f"{dur} mins brisk walking (5.0–5.8 km/h) on 3–6% treadmill incline or hilly trail",
                "Maintain tall posture, engaged core, and rhythmic arm swings"
            ]),
            ("Day 2", "Rest & Lower Body Stretch", "REST", [
                "Calf, quad, and hamstring stretches",
                "Hydrate and aim for 8,000 steps baseline"
            ]),
            ("Day 3", "Power Interval Walking", "WORKOUT", [
                "5 min warm-up walk",
                "10 rounds: 1 min fast power walk (6.2 km/h) / 1 min moderate recovery walk",
                "5 min cool-down walk"
            ]),
            ("Day 4", "Rest & Posture Reset", "REST", [
                "Shoulder rolls, chest openers, and deep belly breathing"
            ]),
            ("Day 5", "Steady Aerobic Outdoor Walk", "WORKOUT" if days >= 4 else "REST", [
                f"{dur} mins brisk outdoor nature walk at consistent aerobic pace"
            ]),
            ("Day 6", "Rest & Mobility", "REST", [
                "Gentle yoga stretch and adequate hydration"
            ]),
            ("Day 7", "Long Weekend Step Builder", "WORKOUT", [
                f"{int(dur * 1.3)} mins continuous relaxing walk in a park or scenic route"
            ])
        ]

    for item in templates:
        schedule.append({
            "day": item[0],
            "title": item[1],
            "type": item[2],
            "duration": f"{dur} mins" if item[2] == "WORKOUT" else "20 mins",
            "exercises": item[3]
        })

    return schedule

def _get_warmup_and_cooldown(activity: str) -> (List[str], List[str]):
    warmup = [
        "2–3 minutes light cardio (jogging in place, jumping jacks, or high knees)",
        "Arm circles & thoracic rotations (10 reps each direction)",
        "Leg swings front-to-back and side-to-side (10 reps per leg)",
        "Bodyweight squats & lunges with torso twist (8 reps per side)"
    ]
    cooldown = [
        "2 minutes gentle walking to bring heart rate below 100 bpm",
        "Standing quad stretch (30s per leg)",
        "Hamstring forward reach stretch (30s per leg)",
        "Chest & shoulder doorway stretch (30s)",
        "Deep diaphragm breathing (5 deep cycles in through nose, out through mouth)"
    ]
    return warmup, cooldown

def _get_progression_tips(activity: str, level: str, goal: str) -> List[str]:
    tips = [
        "Track your workouts and weights/pace weekly to ensure progressive overload.",
        "Deload or reduce volume by 30% every 4–6 weeks to prevent overtraining and joint fatigue.",
        "Quality form always supersedes weight or speed: never compromise mechanics for numbers.",
        "Prioritize 7–9 hours of deep sleep per night — muscle hypertrophy and CNS adaptation occur during sleep."
    ]
    if activity == "WEIGHTLIFTING":
        tips.insert(0, "When you can complete all target sets at the upper rep range with crisp form, increase the load by 2.5–5%.")
    elif activity in ("RUNNING", "CYCLING"):
        tips.insert(0, "Do not increase total weekly mileage or volume by more than 10% per week to safeguard tendons.")
    return tips

def generate_full_plan(
    age: int,
    weight_kg: float,
    fitness_level: str,
    goal: str,
    weekly_workouts: int,
    recommended_activity: str,
    target_activity: Optional[str] = None,
    dietary_preference: str = "STANDARD",
    height_cm: float = 175.0,
    gender: str = "MALE",
    average_duration: float = 45.0
) -> Dict[str, Any]:
    # If the user specified a target activity and it's not "AUTO", respect their requested activity
    final_activity = recommended_activity
    if target_activity and target_activity.strip().upper() not in ("AUTO", "NONE", ""):
        final_activity = target_activity.strip().upper()

    diet = calculate_diet_plan(
        age=age,
        weight_kg=weight_kg,
        fitness_level=fitness_level,
        goal=goal,
        weekly_workouts=weekly_workouts,
        dietary_preference=dietary_preference,
        height_cm=height_cm,
        gender=gender
    )

    workout = generate_workout_plan(
        activity=final_activity,
        fitness_level=fitness_level,
        goal=goal,
        weekly_workouts=weekly_workouts,
        duration_min=average_duration
    )

    return {
        "finalActivity": final_activity,
        "dietPlan": diet,
        "activityPlan": workout
    }
