// Pooju.Fit - Progressive Web App
class PoojoFit {
    constructor() {
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.initializeUI();
        this.bindEvents();
        this.loadUserData();
        lucide.createIcons();
    }

    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registered successfully:', registration.scope);
            } catch (error) {
                console.log('ServiceWorker registration failed:', error);
            }
        }
    }

    // Initialize UI Components
    initializeUI() {
        this.createWeeklySchedule();
        this.setupProgressTracking();
        this.initializeMobileMenu();
        this.updateTodaysWorkout();
    }

    // Event Binding
    bindEvents() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', this.toggleMobileMenu);
        }

        // Use event delegation for workout buttons since they're dynamically created
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-workout]') || e.target.matches('[onclick*="startWorkout"]')) {
                e.preventDefault();
                const workoutType = e.target.dataset.workout || 
                                  (e.target.onclick && e.target.onclick.toString().match(/startWorkout\('([^']+)'\)/)?.[1]);
                if (workoutType && workoutType !== 'undefined') {
                    this.startWorkout(workoutType);
                }
            }
        });
    }

    // Create Weekly Schedule
    createWeeklySchedule() {
        const weeklyPlan = this.getWeeklyPlan();
        this.displayWeeklySchedule(weeklyPlan);
    }

    // Get weekly workout plan
    getWeeklyPlan() {
        return {
            'Monday': {
                workout: 'belly-blast',
                name: 'Belly Fat Blast',
                duration: '25-30 min',
                focus: 'Core & Fat Burn',
                icon: 'target',
                gradient: 'from-pink-500 to-rose-500',
                intensity: 'Medium'
            },
            'Tuesday': {
                workout: 'arm-slim',
                name: 'Arm Slimming',
                duration: '20-25 min',
                focus: 'Upper Body Toning',
                icon: 'zap',
                gradient: 'from-emerald-500 to-teal-500',
                intensity: 'Low-Medium'
            },
            'Wednesday': {
                workout: 'rest',
                name: 'Active Rest Day',
                duration: 'Light activity',
                focus: 'Recovery & Stretching',
                icon: 'heart',
                gradient: 'from-gray-500 to-gray-600',
                intensity: 'Recovery'
            },
            'Thursday': {
                workout: 'thigh-tone',
                name: 'Thigh Slimming',
                duration: '30-35 min',
                focus: 'Lower Body Toning',
                icon: 'activity',
                gradient: 'from-purple-500 to-indigo-500',
                intensity: 'Medium'
            },
            'Friday': {
                workout: 'full-body-burn',
                name: 'Total Body Fat Burn',
                duration: '35-40 min',
                focus: 'High Intensity Cardio',
                icon: 'flame',
                gradient: 'from-orange-500 to-red-500',
                intensity: 'High'
            },
            'Saturday': {
                workout: 'belly-blast',
                name: 'Belly Fat Blast',
                duration: '25-30 min',
                focus: 'Core Focus (Light)',
                icon: 'target',
                gradient: 'from-pink-400 to-rose-400',
                intensity: 'Medium'
            },
            'Sunday': {
                workout: 'rest',
                name: 'Complete Rest',
                duration: 'Full recovery',
                focus: 'Meal prep & Planning',
                icon: 'coffee',
                gradient: 'from-gray-500 to-gray-600',
                intensity: 'Rest'
            }
        };
    }

    // Update today's workout
    updateTodaysWorkout() {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const weeklyPlan = this.getWeeklyPlan();
        const todaysWorkout = weeklyPlan[today];
        
        console.log(`Today is ${today}, workout:`, todaysWorkout);
        
        // Update the existing today's workout card in hero section
        this.updateHeroSection(todaysWorkout, today);
    }

    // Update hero section with today's workout
    updateHeroSection(todaysWorkout, dayName) {
        const workoutContentDiv = document.getElementById('workout-content');
        const startTodayBtn = document.getElementById('start-today-btn');
        
        if (!workoutContentDiv) return;
        
        // Check if today's workout is already completed
        const userData = this.getUserData();
        const today = new Date().toDateString();
        const isCompleted = userData.completedWorkouts && userData.completedWorkouts[today];
        
        if (isCompleted) {
            // Show completion status
            const completedWorkout = userData.completedWorkouts[today];
            workoutContentDiv.innerHTML = `
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="check-circle" class="w-8 h-8 text-white"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-2">Workout Complete! 🎉</h4>
                    <p class="text-gray-300 mb-4">You completed <strong>${completedWorkout.workoutName}</strong></p>
                    <div class="grid grid-cols-2 gap-3 text-sm text-gray-400 mb-4">
                        <div>⏱️ ${completedWorkout.duration} minutes</div>
                        <div>🔥 ${completedWorkout.exercises} exercises</div>
                        <div>🔄 ${completedWorkout.rounds} rounds</div>
                        <div>✅ ${new Date(completedWorkout.completedAt).toLocaleTimeString()}</div>
                    </div>
                    <div class="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                        <div class="font-bold text-green-400 mb-1">Great job! 💪</div>
                        <div class="text-gray-300 text-sm">Tomorrow's challenge awaits!</div>
                    </div>
                </div>
            `;
            
            if (startTodayBtn) {
                startTodayBtn.textContent = 'Already Completed ✅';
                startTodayBtn.disabled = true;
                startTodayBtn.className = 'bg-green-600 border border-green-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold cursor-not-allowed opacity-75';
            }
        } else if (todaysWorkout.workout === 'rest') {
            workoutContentDiv.innerHTML = `
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r ${todaysWorkout.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="${todaysWorkout.icon}" class="w-8 h-8 text-white"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-2">${todaysWorkout.name}</h4>
                    <p class="text-gray-300 mb-4">${todaysWorkout.focus}</p>
                    <div class="flex justify-center items-center gap-4 text-sm text-gray-400 mb-6">
                        <span>⏱️ ${todaysWorkout.duration}</span>
                        <span>🧘 ${todaysWorkout.intensity}</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-gray-700/30 rounded-lg p-3">
                            <div class="font-bold mb-1">💧 Hydrate</div>
                            <div class="text-gray-400">2-3L water</div>
                        </div>
                        <div class="bg-gray-700/30 rounded-lg p-3">
                            <div class="font-bold mb-1">🧘 Stretch</div>
                            <div class="text-gray-400">10-15 min</div>
                        </div>
                        <div class="bg-gray-700/30 rounded-lg p-3">
                            <div class="font-bold mb-1">🚶 Walk</div>
                            <div class="text-gray-400">20-30 min</div>
                        </div>
                        <div class="bg-gray-700/30 rounded-lg p-3">
                            <div class="font-bold mb-1">📝 Plan</div>
                            <div class="text-gray-400">Tomorrow</div>
                        </div>
                    </div>
                </div>
            `;
            
            if (startTodayBtn) {
                startTodayBtn.textContent = 'Enjoy Your Rest Day 😌';
                startTodayBtn.disabled = true;
                startTodayBtn.className = 'bg-gray-600 border border-gray-500 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold cursor-not-allowed';
            }
        } else {
            workoutContentDiv.innerHTML = `
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r ${todaysWorkout.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="${todaysWorkout.icon}" class="w-8 h-8 text-white"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-2">${todaysWorkout.name}</h4>
                    <p class="text-gray-300 mb-4">${todaysWorkout.focus}</p>
                    <div class="flex justify-center items-center gap-4 text-sm text-gray-400">
                        <span>⏱️ ${todaysWorkout.duration}</span>
                        <span>🔥 ${todaysWorkout.intensity}</span>
                    </div>
                </div>
            `;
            
            if (startTodayBtn) {
                startTodayBtn.textContent = 'Start Today\'s Workout 💪';
                startTodayBtn.disabled = false;
                startTodayBtn.className = 'bg-gradient-to-r ' + todaysWorkout.gradient + ' text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg';
                startTodayBtn.onclick = () => this.startWorkout(todaysWorkout.workout);
            }
        }
        
        // Refresh icons after updating content
        setTimeout(() => lucide.createIcons(), 100);
    }

    // Display weekly schedule
    displayWeeklySchedule(weeklyPlan) {
        const workoutsSection = document.querySelector('#workouts .grid');
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        if (!workoutsSection) {
            console.error('Workouts section not found');
            return;
        }
        
        // Check completion status
        const userData = this.getUserData();
        const todayDate = new Date().toDateString();
        const isCompleted = userData.completedWorkouts && userData.completedWorkouts[todayDate];
        
        workoutsSection.innerHTML = '';
        workoutsSection.className = 'grid md:grid-cols-2 lg:grid-cols-4 gap-6';
        
        Object.entries(weeklyPlan).forEach(([day, workout]) => {
            const isToday = day === today;
            const isTodayCompleted = isToday && isCompleted;
            const cardClass = isToday ? 'ring-2 ring-yellow-400 ring-opacity-60' : '';
            const completedClass = isTodayCompleted ? 'ring-2 ring-green-400 ring-opacity-60' : '';
            
            const workoutCard = `
                <div class="glass rounded-2xl p-6 card-hover ${cardClass} ${completedClass} relative">
                    ${isToday && !isTodayCompleted ? '<div class="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">TODAY</div>' : ''}
                    ${isTodayCompleted ? '<div class="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full">DONE ✓</div>' : ''}
                    
                    <div class="text-center mb-4">
                        <h4 class="text-lg font-bold mb-2">${day}</h4>
                        <div class="w-12 h-12 bg-gradient-to-r ${workout.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 ${isTodayCompleted ? 'opacity-75' : ''}">
                            <i data-lucide="${isTodayCompleted ? 'check-circle' : workout.icon}" class="w-6 h-6 text-white"></i>
                        </div>
                    </div>
                    
                    <h5 class="text-xl font-bold mb-2 text-center ${isTodayCompleted ? 'text-green-400' : ''}">${workout.name}</h5>
                    <p class="text-gray-300 text-sm text-center mb-3">${workout.focus}</p>
                    
                    <div class="space-y-2 text-xs text-gray-400 mb-4">
                        <div class="flex justify-between">
                            <span>Duration:</span>
                            <span>${workout.duration}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Intensity:</span>
                            <span>${workout.intensity}</span>
                        </div>
                    </div>
                    
                    ${workout.workout === 'rest' ? 
                        `<button class="w-full bg-gray-600 text-gray-300 py-2 rounded-xl text-sm cursor-not-allowed">
                            Rest Day 😌
                        </button>` :
                        isTodayCompleted ? 
                        `<button class="w-full bg-green-600 text-white py-2 rounded-xl text-sm font-bold cursor-not-allowed opacity-75">
                            Completed ✓
                        </button>` :
                        `<button onclick="window.poojoFit.startWorkout('${workout.workout}')" 
                                class="w-full bg-gradient-to-r ${workout.gradient} hover:opacity-80 text-white py-2 rounded-xl text-sm font-bold transition-all duration-200">
                            ${isToday ? 'Start Now!' : 'Start Workout'}
                        </button>`
                    }
                </div>
            `;
            
            workoutsSection.insertAdjacentHTML('beforeend', workoutCard);
        });
        
        // Refresh icons after adding all workout cards
        setTimeout(() => lucide.createIcons(), 100);
    }

    // Setup Progress Tracking
    setupProgressTracking() {
        const userData = this.getUserData();
        
        // Update stats display if elements exist
        const workoutCountEl = document.querySelector('.workout-count');
        const streakCountEl = document.querySelector('.streak-count'); 
        const timeCountEl = document.querySelector('.time-count');
        const prCountEl = document.querySelector('.pr-count');
        
        if (workoutCountEl) workoutCountEl.textContent = userData.totalWorkouts || 0;
        if (streakCountEl) streakCountEl.textContent = userData.currentStreak || 0;
        if (timeCountEl) timeCountEl.textContent = userData.totalTime || '0h';
        if (prCountEl) prCountEl.textContent = userData.personalRecords || 0;
    }

    // Initialize Mobile Menu
    initializeMobileMenu() {
        // Mobile menu functionality can be added here
    }

    // Mobile Menu Toggle
    toggleMobileMenu() {
        // Implementation for mobile menu
        console.log('Mobile menu toggled');
    }

    // Start Workout
    startWorkout(workoutType) {
        console.log(`Starting ${workoutType} workout`);
        
        // Find the workout data
        const workoutData = this.getWorkoutData(workoutType);
        if (!workoutData) {
            alert('Workout not found!');
            return;
        }

        // Initialize workout state
        this.currentWorkout = {
            type: workoutType,
            data: workoutData,
            currentRound: 1,
            currentExercise: 0,
            isResting: false,
            isPaused: false,
            exerciseTimeLeft: 0,
            pauseStartTime: null,
            startTime: new Date()
        };

        // Show workout screen
        this.showWorkoutScreen();
        
        // Note: Workout stats will only be updated when user clicks "Finish"
    }

    // Get workout data by type
    getWorkoutData(workoutType) {
        const workouts = this.getWorkoutsData();
        return workouts.find(w => w.id === workoutType);
    }

    // Get all workouts data
    getWorkoutsData() {
        return [
            {
                id: 'belly-blast',
                name: 'Belly Fat Blast',
                description: 'Target belly fat with core-focused cardio and toning exercises.',
                duration: '25-30 min',
                exercises: [
                    { name: 'Jumping Jacks', duration: 45, rest: 15, reps: null, target: 'Full body warm-up' },
                    { name: 'Mountain Climbers', duration: 30, rest: 20, reps: null, target: 'Core & cardio' },
                    { name: 'Bicycle Crunches', duration: null, rest: 15, reps: 20, target: 'Lower belly' },
                    { name: 'Plank', duration: 30, rest: 20, reps: null, target: 'Deep core' },
                    { name: 'Russian Twists', duration: null, rest: 15, reps: 20, target: 'Side belly' },
                    { name: 'Leg Raises', duration: null, rest: 20, reps: 15, target: 'Lower abs' },
                    { name: 'Dead Bug', duration: null, rest: 15, reps: 12, target: 'Core stability' },
                    { name: 'High Knees', duration: 30, rest: 15, reps: null, target: 'Cardio & core' }
                ],
                rounds: 3,
                cooldown: ['Child\'s Pose - 30s', 'Cat-Cow Stretch - 30s', 'Deep breathing - 1 min']
            },
            {
                id: 'thigh-tone',
                name: 'Thigh Slimming',
                exercises: [
                    { name: 'Marching in Place', duration: 60, rest: 15, reps: null, target: 'Warm-up' },
                    { name: 'Squats', duration: null, rest: 20, reps: 15, target: 'Thighs & glutes' },
                    { name: 'Side Lunges', duration: null, rest: 15, reps: 12, target: 'Inner thighs' },
                    { name: 'Wall Sit', duration: 30, rest: 20, reps: null, target: 'Thigh endurance' },
                    { name: 'Calf Raises', duration: null, rest: 15, reps: 20, target: 'Lower legs' },
                    { name: 'Glute Bridges', duration: null, rest: 20, reps: 15, target: 'Glutes & thighs' },
                    { name: 'Step-ups (use stairs)', duration: null, rest: 15, reps: 10, target: 'Thigh sculpting' },
                    { name: 'Single Leg Glute Bridge', duration: null, rest: 20, reps: 8, target: 'Targeted toning' }
                ],
                rounds: 3,
                cooldown: ['Quad Stretch - 30s each leg', 'Hamstring Stretch - 30s each leg', 'Figure 4 Stretch - 30s each leg']
            },
            {
                id: 'arm-slim',
                name: 'Arm Slimming',
                exercises: [
                    { name: 'Arm Circles', duration: 30, rest: 10, reps: null, target: 'Shoulder warm-up' },
                    { name: 'Wall Push-ups', duration: null, rest: 15, reps: 12, target: 'Arms & chest' },
                    { name: 'Tricep Dips (chair)', duration: null, rest: 20, reps: 10, target: 'Back of arms' },
                    { name: 'Pike Push-ups', duration: null, rest: 15, reps: 8, target: 'Shoulders & arms' },
                    { name: 'Arm Pulses', duration: 45, rest: 15, reps: null, target: 'Arm endurance' },
                    { name: 'Prayer Pulse', duration: 30, rest: 15, reps: null, target: 'Inner arms' },
                    { name: 'Modified Plank', duration: 20, rest: 15, reps: null, target: 'Arm strength' },
                    { name: 'Shoulder Blade Squeezes', duration: null, rest: 10, reps: 15, target: 'Upper back' }
                ],
                rounds: 2,
                cooldown: ['Arm Cross Stretch - 20s each arm', 'Overhead Stretch - 30s', 'Shoulder Rolls - 30s']
            },
            {
                id: 'full-body-burn',
                name: 'Total Body Fat Burn',
                exercises: [
                    { name: 'Jumping Jacks', duration: 45, rest: 15, reps: null, target: 'Full body cardio' },
                    { name: 'Burpees (modified)', duration: null, rest: 30, reps: 8, target: 'Total body' },
                    { name: 'Mountain Climbers', duration: 30, rest: 15, reps: null, target: 'Core & cardio' },
                    { name: 'Squat Jumps', duration: null, rest: 20, reps: 10, target: 'Legs & cardio' },
                    { name: 'Push-up to T', duration: null, rest: 25, reps: 6, target: 'Arms & core' },
                    { name: 'Plank Jacks', duration: 20, rest: 15, reps: null, target: 'Core & shoulders' },
                    { name: 'Lunge Jumps', duration: null, rest: 20, reps: 8, target: 'Legs & balance' },
                    { name: 'Star Jumps', duration: 30, rest: 20, reps: null, target: 'Full body burn' }
                ],
                rounds: 3,
                cooldown: ['Forward Fold - 30s', 'Side Stretch - 20s each side', 'Deep breathing - 2 min']
            }
        ];
    }

    // Show workout screen
    showWorkoutScreen() {
        // Hide main content and show workout interface
        document.querySelector('body').innerHTML = this.getWorkoutHTML();
        this.attachWorkoutEventListeners();
        this.startCurrentExercise();
        lucide.createIcons();
    }

    // Attach event listeners for workout screen
    attachWorkoutEventListeners() {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exitWorkout();
            });
        }

        // Pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.pauseWorkout();
            });
        }

        // Skip button (for timed exercises)
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.skipCurrentExercise();
            });
        }

        // Next/Finish button
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextExercise();
            });
        }
        
        if (finishBtn) {
            finishBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.finishWorkout();
            });
        }
    }

    // Generate workout HTML
    getWorkoutHTML() {
        const workout = this.currentWorkout.data;
        const currentEx = workout.exercises[this.currentWorkout.currentExercise];
        
        return `
        <div class="min-h-screen gradient-bg text-white p-6">
            <div class="max-w-2xl mx-auto">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <button class="glass p-3 rounded-xl" id="back-btn">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <div class="text-center">
                        <h2 class="text-2xl font-bold">${workout.name}</h2>
                        <p class="text-gray-300">Round ${this.currentWorkout.currentRound} of ${workout.rounds}</p>
                    </div>
                    <div class="glass p-3 rounded-xl">
                        <span id="workout-timer" class="text-lg font-bold">0:00</span>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-700/50 rounded-full h-2 mb-8">
                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                         style="width: ${((this.currentWorkout.currentExercise + 1) / workout.exercises.length) * 100}%"></div>
                </div>

                <!-- Current Exercise -->
                <div class="glass rounded-3xl p-8 text-center mb-6">
                    <h3 class="text-3xl font-bold mb-4">${currentEx.name}</h3>
                    <p class="text-gray-300 mb-4">${currentEx.target}</p>
                    
                    <div class="text-6xl font-bold mb-6" id="exercise-display">
                        ${currentEx.duration ? currentEx.duration : currentEx.reps}
                    </div>
                    
                    <p class="text-xl text-gray-300">
                        ${currentEx.duration ? 'seconds' : 'reps'}
                    </p>
                </div>

                <!-- Controls -->
                <div class="flex gap-4 justify-center">
                    <button id="pause-btn" class="glass px-6 py-3 rounded-xl font-bold">
                        <i data-lucide="pause" class="w-5 h-5 mr-2 inline"></i>Pause
                    </button>
                    
                    <!-- Skip button - only show for timed exercises -->
                    ${currentEx.duration ? 
                        `<button id="skip-btn" class="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 rounded-xl font-bold text-sm">
                            <i data-lucide="fast-forward" class="w-4 h-4 mr-1 inline"></i>Skip Timer
                        </button>` : ''
                    }
                    
                    ${this.isLastExerciseOfWorkout() ? 
                        `<button id="finish-btn" class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl font-bold">
                            <i data-lucide="check-circle" class="w-5 h-5 mr-2 inline"></i>🏁 Finish Workout
                        </button>` :
                        `<button id="next-btn" class="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl font-bold">
                            <i data-lucide="skip-forward" class="w-5 h-5 mr-2 inline"></i>➡️ Next Exercise (${this.currentWorkout.currentExercise + 1}/${this.currentWorkout.data.exercises.length})
                        </button>`
                    }
                </div>

                <!-- Exercise List -->
                <div class="mt-8 glass rounded-2xl p-6">
                    <h4 class="text-lg font-bold mb-4">Today's Exercises</h4>
                    <div class="space-y-2">
                        ${workout.exercises.map((ex, index) => `
                            <div class="flex items-center justify-between p-3 rounded-xl ${index === this.currentWorkout.currentExercise ? 'bg-pink-500/20' : 'bg-gray-700/30'}">
                                <span class="${index === this.currentWorkout.currentExercise ? 'text-pink-300' : 'text-gray-300'}">${ex.name}</span>
                                <span class="text-sm text-gray-400">${ex.duration ? ex.duration + 's' : ex.reps + ' reps'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Check if this is the last exercise of the entire workout
    isLastExerciseOfWorkout() {
        if (!this.currentWorkout || !this.currentWorkout.data) {
            console.log('No current workout data');
            return false;
        }
        
        const workout = this.currentWorkout.data;
        const isLastExercise = this.currentWorkout.currentExercise === workout.exercises.length - 1;
        const isLastRound = this.currentWorkout.currentRound === workout.rounds;
        const result = isLastExercise && isLastRound;
        
        console.log('isLastExerciseOfWorkout check:', {
            workoutName: workout.name,
            currentExercise: this.currentWorkout.currentExercise,
            totalExercises: workout.exercises.length,
            currentExerciseName: workout.exercises[this.currentWorkout.currentExercise]?.name,
            isLastExercise,
            currentRound: this.currentWorkout.currentRound,
            totalRounds: workout.rounds,
            isLastRound,
            result
        });
        
        return result;
    }

    // Start current exercise
    startCurrentExercise() {
        const workout = this.currentWorkout.data;
        const exercise = workout.exercises[this.currentWorkout.currentExercise];
        
        if (exercise.duration) {
            this.startTimer(exercise.duration);
        } else {
            // For rep-based exercises, show reps and wait for user input
            const display = document.getElementById('exercise-display');
            display.textContent = exercise.reps;
            display.className = 'text-6xl font-bold mb-6 text-purple-400';
            
            // Add instruction for rep-based exercises
            const instructionEl = document.querySelector('.text-xl.text-gray-300');
            if (instructionEl) {
                instructionEl.innerHTML = 'reps<br><span class="text-sm text-yellow-400">Complete your reps, then click "Next"</span>';
            }
        }
        
        this.startWorkoutTimer();
    }

    // Timer for timed exercises
    startTimer(seconds) {
        let timeLeft = seconds;
        const display = document.getElementById('exercise-display');
        
        // Store the remaining time for pause functionality
        this.currentWorkout.exerciseTimeLeft = timeLeft;
        
        this.exerciseTimer = setInterval(() => {
            if (!this.currentWorkout.isPaused) {
                display.textContent = timeLeft;
                this.currentWorkout.exerciseTimeLeft = timeLeft;
                timeLeft--;
                
                if (timeLeft < 0) {
                    clearInterval(this.exerciseTimer);
                    this.nextExercise();
                }
            }
        }, 1000);
    }

    // Workout timer
    startWorkoutTimer() {
        const startTime = this.currentWorkout.startTime;
        const timerDisplay = document.getElementById('workout-timer');
        
        this.workoutTimer = setInterval(() => {
            if (!this.currentWorkout.isPaused) {
                const elapsed = Math.floor((new Date() - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                if (timerDisplay) {
                    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);
    }

    // Skip current exercise (for when user can't complete timed exercise)
    skipCurrentExercise() {
        // Clear any active timer
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
            this.currentTimer = null;
        }
        
        // Show skip feedback
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.textContent = 'Skipped!';
            timerDisplay.style.color = '#fbbf24'; // Yellow color for feedback
            
            // After brief delay, proceed to next exercise (skip rest timer)
            setTimeout(() => {
                this.proceedToNextExercise();
            }, 800);
        }
    }

    // Next exercise  
    nextExercise() {
        if (this.currentWorkout.isActive) {
            const currentProgram = this.workoutPrograms.find(p => p.id === this.currentWorkout.programId);
            const currentEx = currentProgram.exercises[this.currentWorkout.exerciseIndex];
            
            // Show rest timer if there's a rest period
            if (currentEx.rest > 0) {
                this.showRestTimer(currentEx.rest);
                return;
            }
            
            this.proceedToNextExercise();
        }
    }

    proceedToNextExercise() {
        const currentProgram = this.workoutPrograms.find(p => p.id === this.currentWorkout.programId);
        
        // Check if it's the last exercise of the current round
        if (this.currentWorkout.exerciseIndex >= currentProgram.exercises.length - 1) {
            if (this.currentWorkout.round >= currentProgram.rounds) {
                // Start cooldown
                this.showCooldownScreen(currentProgram);
                return;
            }
            
            // Start next round
            this.currentWorkout.round++;
            this.currentWorkout.exerciseIndex = 0;
            this.showRoundTransition(this.currentWorkout.round);
        } else {
            // Move to next exercise
            this.currentWorkout.exerciseIndex++;
            this.showExercise();
        }
    }

    showRestTimer(restDuration) {
        const workoutContent = document.getElementById('workout-content');
        workoutContent.innerHTML = `
            <div class="text-center">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Rest Time</h2>
                    <p class="text-gray-600">Take a quick break</p>
                </div>
                
                <div class="mb-8">
                    <div class="text-6xl font-bold text-blue-600 mb-4" id="rest-timer">${restDuration}</div>
                    <div class="text-lg text-gray-600">seconds</div>
                </div>
                
                <button id="skip-rest-btn" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                    Skip Rest
                </button>
            </div>
        `;
        
        let timeLeft = restDuration;
        const timerDisplay = document.getElementById('rest-timer');
        const skipRestBtn = document.getElementById('skip-rest-btn');
        
        this.currentTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                this.proceedToNextExercise();
            }
        }, 1000);
        
        // Skip rest functionality
        skipRestBtn.addEventListener('click', () => {
            clearInterval(this.currentTimer);
            this.proceedToNextExercise();
        });
    }

    // Finish workout (called by finish button)
    finishWorkout() {
        console.log('finishWorkout called - user clicked finish button');
        
        // Clear timers
        clearInterval(this.workoutTimer);
        clearInterval(this.exerciseTimer);
        
        const totalTime = Math.floor((new Date() - this.currentWorkout.startTime) / 1000 / 60);
        const workoutDate = new Date().toDateString();
        
        // ONLY save data when user explicitly finishes workout
        this.saveWorkoutCompletion(totalTime, workoutDate);
        
        // Show completion screen
        this.showCompletionScreen(totalTime, true);
    }

    // Complete workout (called internally, no data saving)
    completeWorkout() {
        console.log('completeWorkout called - workout finished automatically');
        
        clearInterval(this.workoutTimer);
        clearInterval(this.exerciseTimer);
        
        const totalTime = Math.floor((new Date() - this.currentWorkout.startTime) / 1000 / 60);
        
        // Show completion screen but don't save data (user didn't explicitly finish)
        this.showCompletionScreen(totalTime, false);
    }

    // Show completion screen
    showCompletionScreen(totalTime, dataSaved) {
        const completionEmoji = dataSaved ? '🎉' : '⏱️';
        const completionTitle = dataSaved ? 'Workout Complete!' : 'Workout Finished';
        const completionMessage = dataSaved 
            ? `Amazing work! You completed <strong>${this.currentWorkout.data.name}</strong> in ${totalTime} minutes!<br><span class="text-green-400">✅ Progress saved to your records!</span>`
            : `You finished <strong>${this.currentWorkout.data.name}</strong> in ${totalTime} minutes!<br><span class="text-yellow-400">⚠️ Progress not saved - you didn't click finish.</span>`;
        
        document.querySelector('body').innerHTML = `
        <div class="min-h-screen gradient-bg text-white flex items-center justify-center p-6">
            <div class="text-center max-w-md">
                <div class="text-8xl mb-6">${completionEmoji}</div>
                <h2 class="text-4xl font-bold mb-4">${completionTitle}</h2>
                <p class="text-xl text-gray-300 mb-6">
                    ${completionMessage}
                </p>
                
                <!-- Achievement Stats -->
                <div class="glass rounded-2xl p-6 mb-6">
                    <h3 class="text-lg font-bold mb-4">Today's Achievement 🏆</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="bg-pink-500/20 rounded-lg p-3">
                            <div class="font-bold text-pink-400">Workout</div>
                            <div class="text-gray-300">${this.currentWorkout.data.name}</div>
                        </div>
                        <div class="bg-purple-500/20 rounded-lg p-3">
                            <div class="font-bold text-purple-400">Duration</div>
                            <div class="text-gray-300">${totalTime} min</div>
                        </div>
                        <div class="bg-emerald-500/20 rounded-lg p-3">
                            <div class="font-bold text-emerald-400">Exercises</div>
                            <div class="text-gray-300">${this.currentWorkout.data.exercises.length}</div>
                        </div>
                        <div class="bg-orange-500/20 rounded-lg p-3">
                            <div class="font-bold text-orange-400">Rounds</div>
                            <div class="text-gray-300">${this.currentWorkout.data.rounds}</div>
                        </div>
                    </div>
                </div>
                
                <div class="glass rounded-2xl p-6 mb-8">
                    <h3 class="text-lg font-bold mb-4">Cooldown Stretches 🧘‍♀️</h3>
                    <div class="space-y-2 text-gray-300 text-sm">
                        ${this.currentWorkout.data.cooldown.map(stretch => `
                            <div class="p-2 bg-gray-700/30 rounded-lg">${stretch}</div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="window.poojoFit.returnToHome()" 
                            class="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-xl font-bold text-lg flex-1">
                        <i data-lucide="home" class="w-5 h-5 mr-2 inline"></i>Back to Home
                    </button>
                </div>
                
                <p class="text-sm text-gray-400 mt-4">
                    Keep up the great work! Tomorrow's workout is waiting for you 💪
                </p>
            </div>
        </div>
        `;
        
        // Refresh icons
        setTimeout(() => lucide.createIcons(), 100);
    }

    // Save workout completion with comprehensive data
    saveWorkoutCompletion(totalTime, workoutDate) {
        const userData = this.getUserData();
        
        // Update basic stats
        userData.totalWorkouts = (userData.totalWorkouts || 0) + 1;
        userData.totalTime = (userData.totalTime || 0) + totalTime;
        
        // Update streak
        const lastWorkoutDate = userData.lastWorkoutDate;
        const today = new Date().toDateString();
        
        if (lastWorkoutDate === today) {
            // Already worked out today - don't increment streak again
        } else if (this.isConsecutiveDay(lastWorkoutDate, today)) {
            userData.currentStreak = (userData.currentStreak || 0) + 1;
        } else {
            userData.currentStreak = 1; // Reset streak
        }
        
        // Track daily completions
        if (!userData.completedWorkouts) userData.completedWorkouts = {};
        userData.completedWorkouts[today] = {
            workoutType: this.currentWorkout.type,
            workoutName: this.currentWorkout.data.name,
            duration: totalTime,
            exercises: this.currentWorkout.data.exercises.length,
            rounds: this.currentWorkout.data.rounds,
            completedAt: new Date().toISOString()
        };
        
        // Update last workout date
        userData.lastWorkoutDate = today;
        
        // Update personal records
        if (!userData.personalRecords) userData.personalRecords = {};
        const workoutKey = this.currentWorkout.type;
        if (!userData.personalRecords[workoutKey] || userData.personalRecords[workoutKey] > totalTime) {
            userData.personalRecords[workoutKey] = totalTime;
        }
        
        this.saveUserData(userData);
        console.log('Workout completion saved:', userData);
    }

    // Check if dates are consecutive
    isConsecutiveDay(lastDate, currentDate) {
        if (!lastDate) return true;
        
        const last = new Date(lastDate);
        const current = new Date(currentDate);
        const diffTime = Math.abs(current - last);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays === 1;
    }

    // Return to home page
    returnToHome() {
        // Reset workout state
        this.currentWorkout = null;
        
        // Return to main page and refresh to show updated stats
        location.reload();
    }

    // Pause workout
    pauseWorkout() {
        if (!this.currentWorkout?.isPaused) {
            // Pause the workout
            this.currentWorkout.isPaused = true;
            clearInterval(this.exerciseTimer);
            clearInterval(this.workoutTimer);
            
            // Update button to show resume
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) {
                pauseBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5 mr-2 inline"></i>Resume';
                pauseBtn.onclick = () => window.poojoFit.resumeWorkout();
            }
            
            // Show pause overlay
            this.showPauseOverlay();
        }
    }

    // Resume workout
    resumeWorkout() {
        if (this.currentWorkout.isPaused) {
            this.currentWorkout.isPaused = false;
            
            // Update pause time to maintain accurate workout timer
            const pauseDuration = new Date() - this.currentWorkout.pauseStartTime;
            this.currentWorkout.startTime = new Date(this.currentWorkout.startTime.getTime() + pauseDuration);
            
            // Restart timers
            this.startWorkoutTimer();
            const workout = this.currentWorkout.data;
            const currentExercise = workout.exercises[this.currentWorkout.currentExercise];
            
            if (currentExercise.duration && this.currentWorkout.exerciseTimeLeft > 0) {
                this.startTimer(this.currentWorkout.exerciseTimeLeft);
            }
            
            // Update button back to pause
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) {
                pauseBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5 mr-2 inline"></i>Pause';
                pauseBtn.onclick = () => window.poojoFit.pauseWorkout();
            }
            
            // Remove pause overlay
            this.removePauseOverlay();
            lucide.createIcons();
        }
    }

    // Show pause overlay
    showPauseOverlay() {
        this.currentWorkout.pauseStartTime = new Date();
        
        const overlay = document.createElement('div');
        overlay.id = 'pause-overlay';
        overlay.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="glass rounded-3xl p-8 text-center max-w-sm mx-auto">
                <div class="text-6xl mb-4">⏸️</div>
                <h3 class="text-2xl font-bold mb-4">Workout Paused</h3>
                <p class="text-gray-300 mb-6">Take a breather! Resume when you're ready.</p>
                <div class="flex gap-4">
                    <button id="resume-btn" class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl font-bold flex-1">
                        <i data-lucide="play" class="w-5 h-5 mr-2 inline"></i>Resume
                    </button>
                    <button id="exit-overlay-btn" class="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-xl font-bold flex-1">
                        <i data-lucide="x" class="w-5 h-5 mr-2 inline"></i>Exit
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners to pause overlay buttons
        const resumeBtn = overlay.querySelector('#resume-btn');
        const exitBtn = overlay.querySelector('#exit-overlay-btn');
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                this.resumeWorkout();
            });
        }
        
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                this.exitWorkout();
            });
        }
        
        lucide.createIcons();
    }

    // Remove pause overlay
    removePauseOverlay() {
        const overlay = document.getElementById('pause-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Exit workout
    exitWorkout() {
        try {
            if (confirm('Are you sure you want to exit this workout? Your progress will not be saved.')) {
                // Clear all timers
                if (this.workoutTimer) {
                    clearInterval(this.workoutTimer);
                }
                if (this.exerciseTimer) {
                    clearInterval(this.exerciseTimer);
                }
                
                // Remove pause overlay if it exists
                this.removePauseOverlay();
                
                // Reset workout state
                this.currentWorkout = null;
                
                // Return to main page
                location.reload();
            }
        } catch (error) {
            console.error('Error in exitWorkout:', error);
            // Force exit in case of error
            location.reload();
        }
    }

    // Update Workout Statistics
    updateWorkoutStats() {
        const userData = this.getUserData();
        userData.totalWorkouts = (userData.totalWorkouts || 0) + 1;
        userData.currentStreak = (userData.currentStreak || 0) + 1;
        
        this.saveUserData(userData);
        this.setupProgressTracking();
    }

    // User Data Management
    getUserData() {
        const data = localStorage.getItem('poojofit-userdata');
        return data ? JSON.parse(data) : {};
    }

    saveUserData(data) {
        localStorage.setItem('poojofit-userdata', JSON.stringify(data));
    }

    loadUserData() {
        const userData = this.getUserData();
        
        // Set default data if first time user
        if (!userData.firstVisit) {
            userData.firstVisit = new Date().toISOString();
            userData.totalWorkouts = 0;
            userData.currentStreak = 0;
            userData.totalTime = 0;
            userData.personalRecords = 0;
            this.saveUserData(userData);
        }

        this.setupProgressTracking();
    }

    // Utility Methods
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.poojoFit = new PoojoFit();
});

// Handle install prompt for PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or banner
    console.log('PWA install prompt available');
});

// Handle PWA installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
});