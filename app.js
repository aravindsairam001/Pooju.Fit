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

        // Workout start buttons
        document.querySelectorAll('.workout-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workoutType = e.target.dataset.workout;
                this.startWorkout(workoutType);
            });
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
        
        // Update hero section
        this.updateHeroSection(todaysWorkout, today);
    }

    // Update hero section with today's workout
    updateHeroSection(todaysWorkout, dayName) {
        const heroSection = document.querySelector('#home .max-w-4xl');
        
        const todaysWorkoutCard = `
            <div class="mt-12 glass rounded-3xl p-8 max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-yellow-400 mb-2">Today's Workout - ${dayName}</h3>
                    <div class="w-16 h-16 bg-gradient-to-r ${todaysWorkout.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="${todaysWorkout.icon}" class="w-8 h-8 text-white"></i>
                    </div>
                    <h4 class="text-3xl font-bold mb-2">${todaysWorkout.name}</h4>
                    <p class="text-gray-300 mb-4">${todaysWorkout.focus}</p>
                    <div class="flex justify-center items-center gap-6 text-sm text-gray-400 mb-6">
                        <span>⏱️ ${todaysWorkout.duration}</span>
                        <span>🔥 ${todaysWorkout.intensity}</span>
                    </div>
                </div>
                
                ${todaysWorkout.workout === 'rest' ? 
                    `<div class="text-center">
                        <p class="text-lg text-gray-300 mb-4">Take a well-deserved rest today!</p>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div class="bg-gray-700/30 rounded-xl p-4">
                                <h5 class="font-bold mb-2">💧 Stay Hydrated</h5>
                                <p class="text-gray-400">Drink 2-3L of water</p>
                            </div>
                            <div class="bg-gray-700/30 rounded-xl p-4">
                                <h5 class="font-bold mb-2">🧘 Light Stretching</h5>
                                <p class="text-gray-400">10-15 minutes</p>
                            </div>
                            <div class="bg-gray-700/30 rounded-xl p-4">
                                <h5 class="font-bold mb-2">🚶 Gentle Walk</h5>
                                <p class="text-gray-400">20-30 minutes</p>
                            </div>
                            <div class="bg-gray-700/30 rounded-xl p-4">
                                <h5 class="font-bold mb-2">📝 Plan Tomorrow</h5>
                                <p class="text-gray-400">Prep for next workout</p>
                            </div>
                        </div>
                    </div>` :
                    `<div class="text-center">
                        <button onclick="window.poojoFit.startWorkout('${todaysWorkout.workout}')" 
                                class="bg-gradient-to-r ${todaysWorkout.gradient} hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4">
                            Start Today's Workout 💪
                        </button>
                        <p class="text-sm text-gray-400">Or choose from the weekly schedule below</p>
                    </div>`
                }
            </div>
        `;
        
        heroSection.insertAdjacentHTML('beforeend', todaysWorkoutCard);
    }

    // Display weekly schedule
    displayWeeklySchedule(weeklyPlan) {
        const workoutsSection = document.querySelector('#workouts .grid');
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        workoutsSection.innerHTML = '';
        workoutsSection.className = 'grid md:grid-cols-2 lg:grid-cols-4 gap-4';
        
        Object.entries(weeklyPlan).forEach(([day, workout]) => {
            const isToday = day === today;
            const cardClass = isToday ? 'ring-2 ring-yellow-400 ring-opacity-60' : '';
            
            const workoutCard = `
                <div class="glass rounded-2xl p-6 card-hover ${cardClass} relative">
                    ${isToday ? '<div class="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">TODAY</div>' : ''}
                    
                    <div class="text-center mb-4">
                        <h4 class="text-lg font-bold mb-2">${day}</h4>
                        <div class="w-12 h-12 bg-gradient-to-r ${workout.gradient} rounded-xl flex items-center justify-center mx-auto mb-3">
                            <i data-lucide="${workout.icon}" class="w-6 h-6 text-white"></i>
                        </div>
                    </div>
                    
                    <h5 class="text-xl font-bold mb-2 text-center">${workout.name}</h5>
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
                        `<button onclick="window.poojoFit.startWorkout('${workout.workout}')" 
                                class="w-full bg-gradient-to-r ${workout.gradient} hover:opacity-80 text-white py-2 rounded-xl text-sm font-bold transition-all duration-200">
                            ${isToday ? 'Start Now!' : 'Start Workout'}
                        </button>`
                    }
                </div>
            `;
            
            workoutsSection.insertAdjacentHTML('beforeend', workoutCard);
        });
    }

    // Setup Progress Tracking
    setupProgressTracking() {
        const userData = this.getUserData();
        
        // Update stats display
        document.querySelector('.workout-count').textContent = userData.totalWorkouts || 0;
        document.querySelector('.streak-count').textContent = userData.currentStreak || 0;
        document.querySelector('.time-count').textContent = userData.totalTime || '0h';
        document.querySelector('.pr-count').textContent = userData.personalRecords || 0;
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
            startTime: new Date()
        };

        // Show workout screen
        this.showWorkoutScreen();
        
        // Update user data
        this.updateWorkoutStats();
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
        this.startCurrentExercise();
        lucide.createIcons();
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
                    <button onclick="window.poojoFit.exitWorkout()" class="glass p-3 rounded-xl">
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
                    <button onclick="window.poojoFit.pauseWorkout()" id="pause-btn" 
                            class="glass px-6 py-3 rounded-xl font-bold">
                        <i data-lucide="pause" class="w-5 h-5 mr-2 inline"></i>Pause
                    </button>
                    <button onclick="window.poojoFit.nextExercise()" 
                            class="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl font-bold">
                        <i data-lucide="skip-forward" class="w-5 h-5 mr-2 inline"></i>Next
                    </button>
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

    // Start current exercise
    startCurrentExercise() {
        const workout = this.currentWorkout.data;
        const exercise = workout.exercises[this.currentWorkout.currentExercise];
        
        if (exercise.duration) {
            this.startTimer(exercise.duration);
        } else {
            // For rep-based exercises, show reps and wait for user input
            document.getElementById('exercise-display').textContent = exercise.reps;
        }
        
        this.startWorkoutTimer();
    }

    // Timer for timed exercises
    startTimer(seconds) {
        let timeLeft = seconds;
        const display = document.getElementById('exercise-display');
        
        this.exerciseTimer = setInterval(() => {
            display.textContent = timeLeft;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(this.exerciseTimer);
                this.nextExercise();
            }
        }, 1000);
    }

    // Workout timer
    startWorkoutTimer() {
        const startTime = this.currentWorkout.startTime;
        const timerDisplay = document.getElementById('workout-timer');
        
        this.workoutTimer = setInterval(() => {
            const elapsed = Math.floor((new Date() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Next exercise
    nextExercise() {
        clearInterval(this.exerciseTimer);
        
        const workout = this.currentWorkout.data;
        
        if (this.currentWorkout.currentExercise < workout.exercises.length - 1) {
            this.currentWorkout.currentExercise++;
            this.showWorkoutScreen();
        } else {
            // End of round
            if (this.currentWorkout.currentRound < workout.rounds) {
                this.currentWorkout.currentRound++;
                this.currentWorkout.currentExercise = 0;
                this.showWorkoutScreen();
            } else {
                this.completeWorkout();
            }
        }
    }

    // Complete workout
    completeWorkout() {
        clearInterval(this.workoutTimer);
        clearInterval(this.exerciseTimer);
        
        const totalTime = Math.floor((new Date() - this.currentWorkout.startTime) / 1000 / 60);
        
        document.querySelector('body').innerHTML = `
        <div class="min-h-screen gradient-bg text-white flex items-center justify-center p-6">
            <div class="text-center max-w-md">
                <div class="text-8xl mb-6">🎉</div>
                <h2 class="text-4xl font-bold mb-4">Workout Complete!</h2>
                <p class="text-xl text-gray-300 mb-6">
                    You completed ${this.currentWorkout.data.name} in ${totalTime} minutes!
                </p>
                <div class="glass rounded-2xl p-6 mb-8">
                    <h3 class="text-lg font-bold mb-4">Cooldown</h3>
                    <div class="space-y-2 text-gray-300">
                        ${this.currentWorkout.data.cooldown.map(stretch => `
                            <div class="p-2">${stretch}</div>
                        `).join('')}
                    </div>
                </div>
                <button onclick="location.reload()" 
                        class="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-xl font-bold text-lg">
                    Back to Home
                </button>
            </div>
        </div>
        `;
        
        // Update stats
        const userData = this.getUserData();
        userData.totalWorkouts = (userData.totalWorkouts || 0) + 1;
        userData.totalTime = (userData.totalTime || 0) + totalTime;
        this.saveUserData(userData);
    }

    // Pause workout
    pauseWorkout() {
        // Implementation for pause functionality
        alert('Pause feature coming soon!');
    }

    // Exit workout
    exitWorkout() {
        if (confirm('Are you sure you want to exit this workout?')) {
            clearInterval(this.workoutTimer);
            clearInterval(this.exerciseTimer);
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