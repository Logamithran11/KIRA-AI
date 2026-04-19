/* ============================================
   CareerLens AI – Main Application Script
   Firebase + Analysis Engine (ES Module)
   ============================================ */

// ==========================================
// FIREBASE IMPORTS
// ==========================================
import {
    auth, db, storage, googleProvider,
    onAuthStateChanged, signInWithEmailAndPassword,
    createUserWithEmailAndPassword, signOut, updateProfile,
    signInWithPopup,
    collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp, setDoc,
    ref, uploadBytes, getDownloadURL
} from './firebase-config.js';


// ==========================================
// SKILL DATABASE & CONSTANTS
// ==========================================

const SKILL_DATABASE = [
    'javascript','python','java','c++','c#','c','typescript','ruby','php','swift',
    'kotlin','go','rust','scala','perl','r','matlab','dart','lua','shell','bash',
    'powershell','objective-c','haskell','elixir','clojure','groovy',
    'html','css','react','angular','vue','svelte','next.js','nuxt.js','gatsby',
    'tailwindcss','tailwind','bootstrap','sass','less','jquery','webpack','vite',
    'redux','zustand','mobx','three.js','d3.js','chart.js',
    'node.js','express','django','flask','spring','spring boot','fastapi','rails',
    'laravel','asp.net','.net','graphql','rest api','restful','microservices',
    'grpc','kafka','rabbitmq','nestjs',
    'sql','mysql','postgresql','mongodb','redis','elasticsearch','firebase',
    'dynamodb','cassandra','sqlite','oracle','mariadb','supabase','neo4j',
    'aws','azure','gcp','google cloud','docker','kubernetes','terraform',
    'jenkins','ci/cd','github actions','gitlab ci','ansible','nginx','linux',
    'heroku','vercel','netlify','cloudflare',
    'machine learning','deep learning','tensorflow','pytorch','scikit-learn',
    'pandas','numpy','data science','data analysis','data visualization',
    'nlp','computer vision','ai','artificial intelligence','neural networks',
    'tableau','power bi','excel','statistics','bigquery','spark','hadoop',
    'jupyter','matplotlib','seaborn',
    'react native','flutter','android','ios','swiftui','xamarin','ionic',
    'figma','sketch','adobe xd','photoshop','illustrator','ui/ux','ux design',
    'ui design','wireframing','prototyping','user research',
    'git','github','gitlab','bitbucket','jira','agile','scrum',
    'api','oauth','jwt','websocket','testing','jest','mocha','cypress',
    'selenium','postman','swagger','openapi','blockchain','web3','solidity',
    'unity','unreal engine'
];

const RESUME_SECTIONS = [
    { name: 'education', keywords: ['education','university','degree','bachelor','master','b.tech','b.sc','b.e','m.tech','m.sc','school','college','gpa','cgpa'] },
    { name: 'experience', keywords: ['experience','work experience','employment','internship','intern','worked at','working at','job','position','role'] },
    { name: 'skills', keywords: ['skills','technical skills','technologies','tools','proficiency','competencies','expertise'] },
    { name: 'projects', keywords: ['projects','project','portfolio','built','developed','created','designed'] },
    { name: 'certifications', keywords: ['certifications','certified','certification','certificate','credential'] },
    { name: 'summary', keywords: ['summary','objective','about me','profile','introduction','professional summary'] },
    { name: 'contact', keywords: ['email','phone','address','linkedin','github','portfolio','website','contact'] },
    { name: 'achievements', keywords: ['achievements','awards','honors','accomplishments','recognition'] }
];

const JOB_ROLES = [
    {
        title: 'Frontend Developer', icon: '🎨',
        requiredSkills: ['html','css','javascript'],
        preferredSkills: ['react','angular','vue','typescript','next.js','tailwindcss','tailwind','sass','webpack','vite','redux','figma','bootstrap','svelte','jquery','d3.js','three.js'],
        keywords: ['frontend','front-end','front end','ui developer','web developer']
    },
    {
        title: 'Backend Developer', icon: '⚙️',
        requiredSkills: ['python','java','node.js','sql'],
        preferredSkills: ['express','django','flask','spring','spring boot','fastapi','rest api','graphql','mongodb','postgresql','mysql','redis','docker','kubernetes','aws','microservices','kafka','rabbitmq','nestjs','laravel','php','go','rust','grpc'],
        keywords: ['backend','back-end','back end','server-side','api developer']
    },
    {
        title: 'Full Stack Developer', icon: '🚀',
        requiredSkills: ['html','css','javascript','node.js'],
        preferredSkills: ['react','angular','vue','express','mongodb','postgresql','mysql','python','django','flask','next.js','typescript','docker','aws','git','rest api','graphql','redis','firebase','tailwindcss'],
        keywords: ['full stack','fullstack','full-stack','mern','mean']
    },
    {
        title: 'Data Analyst', icon: '📊',
        requiredSkills: ['python','sql','excel'],
        preferredSkills: ['r','tableau','power bi','pandas','numpy','statistics','data analysis','data visualization','matplotlib','seaborn','jupyter','bigquery','spark','data science','machine learning','scikit-learn'],
        keywords: ['data analyst','data analysis','analytics','business intelligence']
    },
    {
        title: 'Data Scientist', icon: '🧪',
        requiredSkills: ['python','machine learning','statistics'],
        preferredSkills: ['tensorflow','pytorch','scikit-learn','pandas','numpy','deep learning','nlp','computer vision','r','sql','jupyter','data science','neural networks','spark','hadoop','bigquery','ai'],
        keywords: ['data scientist','machine learning','deep learning','ai','ml engineer']
    },
    {
        title: 'UI/UX Designer', icon: '✏️',
        requiredSkills: ['figma','ui/ux'],
        preferredSkills: ['sketch','adobe xd','photoshop','illustrator','wireframing','prototyping','user research','css','html','ui design','ux design'],
        keywords: ['designer','ui/ux','ux designer','ui designer','product designer']
    },
    {
        title: 'DevOps Engineer', icon: '🔧',
        requiredSkills: ['docker','linux','ci/cd'],
        preferredSkills: ['kubernetes','aws','azure','gcp','terraform','jenkins','ansible','github actions','gitlab ci','nginx','python','bash','shell','cloudflare','heroku','vercel'],
        keywords: ['devops','sre','site reliability','infrastructure','platform engineer']
    },
    {
        title: 'Mobile Developer', icon: '📱',
        requiredSkills: ['android','ios','react native'],
        preferredSkills: ['flutter','dart','swift','kotlin','java','swiftui','xamarin','ionic','firebase','typescript','javascript','react'],
        keywords: ['mobile developer','android developer','ios developer','app developer']
    }
];

const GITHUB_LANGUAGE_MAP = {
    'JavaScript':'javascript','TypeScript':'typescript','Python':'python','Java':'java',
    'C++':'c++','C#':'c#','C':'c','Ruby':'ruby','PHP':'php','Swift':'swift',
    'Kotlin':'kotlin','Go':'go','Rust':'rust','Scala':'scala','Dart':'dart',
    'Shell':'shell','HTML':'html','CSS':'css','SCSS':'sass','Lua':'lua',
    'R':'r','MATLAB':'matlab','Perl':'perl','Haskell':'haskell','Elixir':'elixir',
    'Clojure':'clojure','Groovy':'groovy','Objective-C':'objective-c',
    'Vue':'vue','Jupyter Notebook':'jupyter','HCL':'terraform','Dockerfile':'docker',
    'Solidity':'solidity'
};


// ==========================================
// APPLICATION STATE
// ==========================================

const AppState = {
    currentPage: 'dashboard',
    currentUser: null,
    resumeFile: null,
    resumeText: '',
    githubUsername: '',
    linkedinText: '',
    results: null,
    history: []
};


// ==========================================
// DOM REFERENCES
// ==========================================

const $ = id => document.getElementById(id);

const DOM = {
    // Auth
    authScreen: $('authScreen'),
    appLayout: $('appLayout'),
    loginForm: $('loginForm'),
    signupForm: $('signupForm'),
    loginTab: $('loginTab'),
    signupTab: $('signupTab'),
    loginEmail: $('loginEmail'),
    loginPassword: $('loginPassword'),
    signupName: $('signupName'),
    signupEmail: $('signupEmail'),
    signupPassword: $('signupPassword'),
    loginBtn: $('loginBtn'),
    signupBtn: $('signupBtn'),
    googleSignInBtn: $('googleSignInBtn'),
    authError: $('authError'),
    // Sidebar & Nav
    sidebar: $('sidebar'),
    menuToggle: $('menuToggle'),
    sidebarOverlay: $('sidebarOverlay'),
    logoutBtn: $('logoutBtn'),
    mobileLogout: $('mobileLogout'),
    userAvatar: $('userAvatar'),
    userName: $('userName'),
    userEmail: $('userEmail'),
    dashboardUserName: $('dashboardUserName'),
    // Stats
    statAnalyses: $('statAnalyses'),
    statBestScore: $('statBestScore'),
    statBestRole: $('statBestRole'),
    // Inputs
    dropZone: $('dropZone'),
    resumeInput: $('resumeInput'),
    fileInfo: $('fileInfo'),
    fileName: $('fileName'),
    removeFile: $('removeFile'),
    githubInput: $('githubInput'),
    linkedinUrl: $('linkedinUrl'),
    linkedinInput: $('linkedinInput'),
    linkedinGuideToggle: $('linkedinGuideToggle'),
    linkedinGuideContent: $('linkedinGuideContent'),
    // Buttons
    startAnalysisBtn: $('startAnalysisBtn'),
    analyzeBtn: $('analyzeBtn'),
    reanalyzeBtn: $('reanalyzeBtn'),
    historyStartBtn: $('historyStartBtn'),
    // Loading
    loadingOverlay: $('loadingOverlay'),
    loadingTitle: $('loadingTitle'),
    loadingStatus: $('loadingStatus'),
    loadingBar: $('loadingBar'),
    // Score elements
    resumeScoreCircle: $('resumeScoreCircle'),
    resumeScoreValue: $('resumeScoreValue'),
    githubScoreCircle: $('githubScoreCircle'),
    githubScoreValue: $('githubScoreValue'),
    linkedinScoreCircle: $('linkedinScoreCircle'),
    linkedinScoreValue: $('linkedinScoreValue'),
    finalScoreCircle: $('finalScoreCircle'),
    finalScoreValue: $('finalScoreValue'),
    finalScoreLabel: $('finalScoreLabel'),
    // Results sections
    resumeSkillsList: $('resumeSkillsList'),
    githubSkillsList: $('githubSkillsList'),
    linkedinSkillsList: $('linkedinSkillsList'),
    jobRecommendations: $('jobRecommendations'),
    consistencyCheck: $('consistencyCheck'),
    resumeSuggestions: $('resumeSuggestions'),
    githubSuggestions: $('githubSuggestions'),
    linkedinSuggestions: $('linkedinSuggestions'),
    // History
    historyContainer: $('historyContainer'),
    historyEmpty: $('historyEmpty'),
    // Toast
    toast: $('toast'),
    toastIcon: $('toastIcon'),
    toastMessage: $('toastMessage')
};


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuth();
    initNavigation();
    initFileUpload();
    initButtons();
    initLinkedInGuide();

    if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
});


// ==========================================
// THEME TOGGLE (Light / Dark)
// ==========================================

function initTheme() {
    const saved = localStorage.getItem('careerlens_theme');
    if (saved === 'light') {
        applyTheme('light');
    }

    // Sidebar toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-mode');
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // Mobile toggle button
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-mode');
            applyTheme(isLight ? 'dark' : 'light');
        });
    }
}

function applyTheme(theme) {
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    const label = document.getElementById('themeLabel');
    const mobileBtn = document.getElementById('mobileThemeToggle');

    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (label) label.textContent = 'Dark Mode';
        if (mobileBtn) mobileBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('careerlens_theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (label) label.textContent = 'Light Mode';
        if (mobileBtn) mobileBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('careerlens_theme', 'dark');
    }
}


// ==========================================
// AUTHENTICATION
// ==========================================

/** Set up Firebase auth state listener and form handlers. */
function initAuth() {
    // Auth state listener — determines if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            AppState.currentUser = user;
            showApp(user);
        } else {
            AppState.currentUser = null;
            showAuthScreen();
        }
    });

    // Tab switching
    DOM.loginTab.addEventListener('click', () => switchAuthTab('login'));
    DOM.signupTab.addEventListener('click', () => switchAuthTab('signup'));

    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const icon = e.currentTarget.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Login form submit
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = DOM.loginEmail.value.trim();
        const password = DOM.loginPassword.value;
        if (!email || !password) return;

        setAuthLoading(DOM.loginBtn, true);
        hideAuthError();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Welcome back!', 'success');
        } catch (error) {
            showAuthError(getAuthErrorMessage(error.code));
        } finally {
            setAuthLoading(DOM.loginBtn, false);
        }
    });

    // Signup form submit
    DOM.signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = DOM.signupName.value.trim();
        const email = DOM.signupEmail.value.trim();
        const password = DOM.signupPassword.value;
        if (!name || !email || !password) return;

        setAuthLoading(DOM.signupBtn, true);
        hideAuthError();

        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName: name });
            
            // Save user profile directly into Firestore 'users' collection
            await setDoc(doc(db, 'users', credential.user.uid), {
                name: name,
                email: email,
                createdAt: serverTimestamp()
            });

            // Force refresh UI with the new display name
            showApp(auth.currentUser);

            showToast('Account created successfully!', 'success');
        } catch (error) {
            showAuthError(getAuthErrorMessage(error.code));
        } finally {
            setAuthLoading(DOM.signupBtn, false);
        }
    });

    // Google Sign-In
    DOM.googleSignInBtn.addEventListener('click', async () => {
        hideAuthError();
        try {
            const credential = await signInWithPopup(auth, googleProvider);
            // Save or update user profile in Firestore
            await setDoc(doc(db, 'users', credential.user.uid), {
                name: credential.user.displayName || credential.user.email.split('@')[0],
                email: credential.user.email,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            }, { merge: true });
            
            showToast('Signed in with Google!', 'success');
        } catch (error) {
            if (error.code !== 'auth/popup-closed-by-user') {
                showAuthError(getAuthErrorMessage(error.code));
            }
        }
    });
}

function switchAuthTab(tab) {
    DOM.loginTab.classList.toggle('active', tab === 'login');
    DOM.signupTab.classList.toggle('active', tab === 'signup');
    DOM.loginForm.classList.toggle('active', tab === 'login');
    DOM.signupForm.classList.toggle('active', tab === 'signup');
    hideAuthError();
}

function setAuthLoading(btn, loading) {
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    if (loading) {
        text.classList.add('hidden');
        loader.classList.remove('hidden');
        btn.disabled = true;
    } else {
        text.classList.remove('hidden');
        loader.classList.add('hidden');
        btn.disabled = false;
    }
}

function showAuthError(msg) {
    DOM.authError.textContent = msg;
    DOM.authError.classList.remove('hidden');
}

function hideAuthError() {
    DOM.authError.classList.add('hidden');
}

function getAuthErrorMessage(code) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups.',
        'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return messages[code] || 'An error occurred. Please try again.';
}

/** Show main app, hide auth screen, populate user info */
function showApp(user) {
    DOM.authScreen.classList.add('hidden');
    DOM.appLayout.classList.remove('hidden');

    // Populate user info
    const displayName = user.displayName || user.email.split('@')[0];
    DOM.userName.textContent = displayName;
    DOM.userEmail.textContent = user.email;
    DOM.userAvatar.textContent = displayName.charAt(0).toUpperCase();
    DOM.dashboardUserName.textContent = displayName.split(' ')[0];

    // Load history from Firestore
    loadHistory();
}

function showAuthScreen() {
    DOM.authScreen.classList.remove('hidden');
    DOM.appLayout.classList.add('hidden');
}

/** Handle logout */
async function handleLogout() {
    try {
        await signOut(auth);
        AppState.results = null;
        AppState.history = [];
        showToast('Signed out successfully', 'info');
    } catch (error) {
        showToast('Logout failed: ' + error.message, 'error');
    }
}


// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    DOM.menuToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
        DOM.sidebarOverlay.classList.toggle('active');
    });

    DOM.sidebarOverlay.addEventListener('click', () => {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('active');
    });
}

function navigateTo(page) {
    AppState.currentPage = page;

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (nav) nav.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = '';
    }

    // Close mobile sidebar
    DOM.sidebar.classList.remove('open');
    DOM.sidebarOverlay.classList.remove('active');

    if (page === 'results' && AppState.results) {
        setTimeout(() => animateScores(), 200);
    }
}


// ==========================================
// FILE UPLOAD
// ==========================================

function initFileUpload() {
    DOM.dropZone.addEventListener('click', () => DOM.resumeInput.click());
    DOM.resumeInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });
    DOM.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); DOM.dropZone.classList.add('drag-over');
    });
    DOM.dropZone.addEventListener('dragleave', () => DOM.dropZone.classList.remove('drag-over'));
    DOM.dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); DOM.dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
    DOM.removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        AppState.resumeFile = null; AppState.resumeText = '';
        DOM.resumeInput.value = '';
        DOM.fileInfo.classList.add('hidden');
        DOM.dropZone.classList.remove('hidden');
        showToast('File removed', 'info');
    });
}

function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
        showToast('Please upload a PDF or DOCX file', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('File too large. Max 10MB.', 'error');
        return;
    }
    AppState.resumeFile = file;
    DOM.fileName.textContent = file.name;
    DOM.fileInfo.classList.remove('hidden');
    DOM.dropZone.classList.add('hidden');
    showToast('Resume uploaded successfully', 'success');
}


// ==========================================
// BUTTONS & UI INTERACTIONS
// ==========================================

function initButtons() {
    DOM.startAnalysisBtn.addEventListener('click', () => navigateTo('analyze'));
    DOM.analyzeBtn.addEventListener('click', () => runAnalysis());
    DOM.reanalyzeBtn.addEventListener('click', () => navigateTo('analyze'));
    DOM.logoutBtn.addEventListener('click', handleLogout);
    DOM.mobileLogout.addEventListener('click', handleLogout);
    if (DOM.historyStartBtn) {
        DOM.historyStartBtn.addEventListener('click', () => navigateTo('analyze'));
    }
}

function initLinkedInGuide() {
    DOM.linkedinGuideToggle.addEventListener('click', () => {
        DOM.linkedinGuideToggle.classList.toggle('open');
        DOM.linkedinGuideContent.classList.toggle('open');
    });
}


// ==========================================
// LOADING ANIMATION
// ==========================================

function showLoading(steps) {
    const tips = [
        "Did you know? Resumes with quantifiable achievements get 40% more callbacks.",
        "GitHub repositories with high-quality READMEs attract more recruiter interest.",
        "Your LinkedIn headline is the first thing recruiters see — make it impactful.",
        "Consistency across Resume, GitHub, and LinkedIn builds professional trust.",
        "Tailoring your skills to specific job roles increases your match score.",
        "CareerLens AI analyzes over 50+ technical data points for every profile.",
        "Keep your GitHub activity consistent — recruiters value steady contributions."
    ];
    
    return new Promise((resolve) => {
        DOM.loadingOverlay.classList.remove('hidden');
        const tipEl = document.getElementById('loadingTip');
        let idx = 0;
        const total = steps.length;

        function updateTip() {
            if (tipEl) {
                tipEl.style.opacity = '0';
                setTimeout(() => {
                    tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
                    tipEl.style.opacity = '1';
                }, 300);
            }
        }

        updateTip();
        const tipInterval = setInterval(updateTip, 4000);

        function next() {
            if (idx >= total) {
                DOM.loadingBar.style.width = '100%';
                clearInterval(tipInterval);
                resolve();
                return;
            }
            const step = steps[idx];
            DOM.loadingTitle.textContent = step.title;
            DOM.loadingStatus.textContent = step.status;
            DOM.loadingBar.style.width = ((idx + 1) / total * 100) + '%';
            idx++;
            setTimeout(next, step.delay || 800);
        }
        next();
    });
}

function hideLoading() {
    return new Promise((resolve) => {
        DOM.loadingBar.style.width = '100%';
        setTimeout(() => {
            DOM.loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                DOM.loadingBar.style.width = '0%';
                resolve();
            }, 400);
        }, 300);
    });
}


// ==========================================
// GEMINI AI INTEGRATION
// ==========================================

const GEMINI_API_KEY = "AIzaSyD6135vISLafbDxdGlFTgvXvlOBBirVvS4";

async function askGeminiAPI(resumeText, githubData, linkedinText) {
    const prompt = `
You are an Expert Technical Career Coach AI. Below is the user's data:
- Resume Content: ${resumeText ? resumeText.substring(0, 5000) : "Not provided."}
- GitHub Stats: Repos: ${githubData.repos}, Stars: ${githubData.stars}, Most used languages: ${Object.keys(githubData.languages).join(', ') || "None"}
- LinkedIn Profile Summary: ${linkedinText || "Not provided."}

Analyze this candidate safely. Return EXACTLY a raw JSON object with NO markdown formatting matching this exact schema:
{
  "resumeScore": number (0-100),
  "resumeSkills": ["skill1", "skill2"],
  "githubScore": number (0-100),
  "githubSkills": ["skill1", "skill2"],
  "linkedinScore": number (0-100),
  "linkedinSkills": ["skill1", "skill2"],
  "finalScore": number (0-100),
  "allSkills": ["skill1", "skill2"],
  "jobs": [
    { "title": "string", "icon": "fa-laptop-code", "matchPercent": number, "reasoning": "string" }
  ],
  "consistency": {
    "score": number (0-100),
    "verdict": "string",
    "details": "string"
  },
  "suggestions": {
    "resume": [ { "text": "string", "priority": "high|medium|low" } ],
    "github": [ { "text": "string", "priority": "high|medium|low" } ],
    "linkedin": [ { "text": "string", "priority": "high|medium|low" } ]
  }
}
If any section (resume/github/linkedin) is missing, give it a score of 0, empty skills, and suggest providing it. Generate 3 good jobs. Keep reasoning and details concise.
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
        })
    });

    if (!response.ok) throw new Error("Gemini API request failed. Please check the console.");
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);
}

// ==========================================
// MAIN ANALYSIS PIPELINE
// ==========================================

async function runAnalysis() {
    const githubUsername = DOM.githubInput.value.trim();
    const linkedinText = DOM.linkedinInput.value.trim();

    if (!AppState.resumeFile) {
        showToast('Please upload a Resume to start the analysis.', 'warning');
        return;
    }

    if (!githubUsername && !linkedinText) {
        showToast('Please provide GitHub or LinkedIn details.', 'warning');
        return;
    }

    AppState.githubUsername = githubUsername;
    AppState.linkedinText = linkedinText;

    // Build loading steps
    const steps = [];
    if (AppState.resumeFile) steps.push({ title: 'Analyzing Resume…', status: 'Extracting text and detecting skills', delay: 1400 });
    if (githubUsername) steps.push({ title: 'Fetching GitHub Data…', status: `Analyzing ${githubUsername}'s repositories and activity`, delay: 1600 });
    if (linkedinText) steps.push({ title: 'Analyzing LinkedIn…', status: 'Parsing professional experience and skills', delay: 1200 });
    steps.push({ title: 'AI Analysis…', status: 'Consulting KIRA AI Reviewer for career insights', delay: 1500 });
    steps.push({ title: 'Calculating Scores…', status: 'Finalizing weighted scoring and competency levels', delay: 1000 });
    steps.push({ title: 'Generating Results…', status: 'Almost there! Preparing your personalized dashboard', delay: 800 });

    const loadingPromise = showLoading(steps);
    let analysisStepsDone = false;
    loadingPromise.then(() => { analysisStepsDone = true; });

    try {
        // Helper to update status if steps are done but API is still running
        const checkWaiting = () => {
            if (analysisStepsDone) {
                DOM.loadingTitle.textContent = 'KIRA AI Analysis…';
                DOM.loadingStatus.textContent = 'Our KIRA AI is carefully reviewing your profile contents. This may take a few more seconds.';
                DOM.loadingStatus.classList.add('pulsing');
            }
        };
        // 1. Resume analysis
        let resumeData = { skills: [], sections: [], text: '', score: 0 };
        if (AppState.resumeFile) {
            resumeData = await analyzeResume(AppState.resumeFile);
        }

        // 2. GitHub analysis
        let githubData = { skills: [], repos: 0, stars: 0, languages: {}, score: 0, repoDetails: [] };
        if (githubUsername) {
            githubData = await analyzeGitHub(githubUsername);
        }

        // 3. LinkedIn analysis
        let linkedinData = { skills: [], score: 0, roleKeywords: [], experienceLevel: '' };
        if (linkedinText) {
            linkedinData = analyzeLinkedIn(linkedinText);
        }

        // 4. Send to Gemini AI for deep analysis
        const apiInterval = setInterval(checkWaiting, 1000);
        const aiResponse = await askGeminiAPI(resumeData.text, githubData, linkedinText);
        clearInterval(apiInterval);
        DOM.loadingStatus.classList.remove('pulsing');

        // Store results
        AppState.results = {
            resume: { score: aiResponse.resumeScore, skills: aiResponse.resumeSkills, text: resumeData.text },
            github: { score: aiResponse.githubScore, skills: aiResponse.githubSkills, repos: githubData.repos, stars: githubData.stars, languages: githubData.languages },
            linkedin: { score: aiResponse.linkedinScore, skills: aiResponse.linkedinSkills },
            jobs: aiResponse.jobs,
            consistency: checkConsistency(aiResponse.resumeSkills, aiResponse.githubSkills, aiResponse.linkedinSkills),
            suggestions: aiResponse.suggestions,
            finalScore: aiResponse.finalScore,
            allSkills: aiResponse.allSkills,
            timestamp: new Date().toISOString()
        };

        // Save to Firestore
        await saveToFirestore(AppState.results);

        // Upload resume to Firebase Storage (optional, with 5 second timeout to prevent infinite hangs if Storage is unconfigured)
        if (AppState.resumeFile) {
            try {
                const uploadPromise = uploadResumeToStorage(AppState.resumeFile);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Storage upload timeout")), 5000));
                await Promise.race([uploadPromise, timeoutPromise]);
            } catch (e) {
                console.warn('Resume upload to storage bypassed (Storage might not be enabled in console):', e.message);
            }
        }

        await loadingPromise;
        await hideLoading();

        renderResults();
        navigateTo('results');
        loadHistory(); // Refresh history
        showToast('Analysis complete & saved!', 'success');

    } catch (error) {
        console.error('Analysis error:', error);
        await hideLoading();
        showToast('Analysis failed: ' + error.message, 'error');
    }
}


// ==========================================
// FIRESTORE OPERATIONS
// ==========================================

/** Save analysis results to Firestore */
async function saveToFirestore(results) {
    if (!auth.currentUser) {
        console.error('Error: Cannot save, user is not authenticated.');
        showToast('Authentication error. Cannot save.', 'error');
        return;
    }

    try {
        console.log('Attempting to save results to Firestore...');
        const record = {
            userId: auth.currentUser.uid,
            resumeScore: results.resume.score,
            githubScore: results.github.score,
            linkedinScore: results.linkedin.score,
            finalScore: results.finalScore,
            bestRole: results.jobs[0]?.title || 'N/A',
            matchPercentage: results.jobs[0]?.matchPercent || 0,
            allSkills: results.allSkills,
            suggestions: {
                resume: results.suggestions.resume,
                github: results.suggestions.github,
                linkedin: results.suggestions.linkedin
            },
            jobs: results.jobs.slice(0, 4).map(j => ({
                title: j.title, icon: j.icon,
                matchPercent: j.matchPercent, reasoning: j.reasoning
            })),
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'analyses'), record);
        console.log('🎉 Success! Data saved to Firestore with ID:', docRef.id);
        
    } catch (error) {
        console.error('🔥 Firestore save error:', error);
        showToast('Save to cloud failed: ' + error.message, 'warning');
    }
}

/** Load analysis history from Firestore */
async function loadHistory() {
    if (!AppState.currentUser) return;

    try {
        const q = query(
            collection(db, 'analyses'),
            where('userId', '==', AppState.currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        AppState.history = [];

        snapshot.forEach(docSnap => {
            AppState.history.push({ id: docSnap.id, ...docSnap.data() });
        });

        renderHistory();
        updateDashboardStats();
    } catch (error) {
        console.error('History load error:', error);
        // If index not yet created, show helpful message
        if (error.code === 'failed-precondition') {
            console.warn('Firestore index required. Create composite index for analyses collection.');
        }
    }
}

/** Delete a history record */
async function deleteHistoryRecord(docId) {
    try {
        await deleteDoc(doc(db, 'analyses', docId));
        showToast('Record deleted', 'info');
        loadHistory();
    } catch (error) {
        showToast('Delete failed: ' + error.message, 'error');
    }
}

/** Upload resume to Firebase Storage */
async function uploadResumeToStorage(file) {
    if (!AppState.currentUser) return;

    const timestamp = Date.now();
    const storageRef = ref(storage, `resumes/${AppState.currentUser.uid}/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}


// ==========================================
// RESUME ANALYSIS
// ==========================================

async function analyzeResume(file) {
    let text = '';
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') text = await extractPdfText(file);
    else if (ext === 'docx') text = await extractDocxText(file);

    AppState.resumeText = text;
    const lowerText = text.toLowerCase();
    const skills = extractSkills(lowerText);
    const sections = detectSections(lowerText);
    const score = calculateResumeScore(skills, sections, text);

    return { skills, sections, text, score };
}

async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
    }
    return fullText;
}

async function extractDocxText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

function extractSkills(text) {
    const found = new Set();
    SKILL_DATABASE.forEach(skill => {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:^|[\\s,;|/()\\[\\]])${escaped}(?:[\\s,;|/()\\[\\]]|$)`, 'i');
        if (regex.test(text)) found.add(skill);
    });
    return Array.from(found);
}

function detectSections(text) {
    return RESUME_SECTIONS.filter(s => s.keywords.some(k => text.includes(k))).map(s => ({ name: s.name }));
}

function calculateResumeScore(skills, sections, text) {
    let score = 0;
    // Skills (0-30)
    const sc = skills.length;
    if (sc >= 10) score += 30; else if (sc >= 7) score += 25; else if (sc >= 5) score += 20;
    else if (sc >= 3) score += 14; else if (sc >= 1) score += 8;
    // Sections (0-30)
    score += Math.min(30, Math.round((sections.length / RESUME_SECTIONS.length) * 30));
    // Content length (0-20)
    const wc = text.split(/\s+/).length;
    if (wc >= 500) score += 20; else if (wc >= 300) score += 16;
    else if (wc >= 150) score += 12; else if (wc >= 50) score += 6; else score += 2;
    // Action verbs (0-20)
    const verbs = ['developed','built','designed','implemented','managed','led','created','improved','optimized','deployed','analyzed','collaborated','architected','maintained','delivered','increased','reduced','automated'];
    const lt = text.toLowerCase();
    const ac = verbs.filter(v => lt.includes(v)).length;
    if (ac >= 8) score += 20; else if (ac >= 5) score += 15;
    else if (ac >= 3) score += 10; else if (ac >= 1) score += 5;
    return Math.min(100, score);
}


// ==========================================
// GITHUB ANALYSIS
// ==========================================

async function analyzeGitHub(username) {
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error(userRes.status === 404 ? `GitHub user "${username}" not found` : 'GitHub API error');
        const userData = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const reposData = await reposRes.json();

        let totalStars = 0;
        const languages = {};
        const repoDetails = [];

        reposData.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
            if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
            repoDetails.push({
                name: repo.name, description: repo.description,
                language: repo.language, stars: repo.stargazers_count,
                forks: repo.forks_count, updated: repo.updated_at
            });
        });

        const skills = [];
        Object.keys(languages).forEach(lang => {
            const mapped = GITHUB_LANGUAGE_MAP[lang];
            if (mapped) skills.push(mapped);
        });

        const repoText = reposData.map(r => `${r.name} ${r.description || ''} ${r.topics ? r.topics.join(' ') : ''}`).join(' ').toLowerCase();
        extractSkills(repoText).forEach(s => { if (!skills.includes(s)) skills.push(s); });

        const now = new Date();
        const recentActivity = reposData.filter(r => {
            return (now - new Date(r.updated_at)) / (1000 * 60 * 60 * 24 * 30) <= 6;
        }).length;

        const score = calculateGitHubScore(reposData.length, Object.keys(languages).length, totalStars, recentActivity);

        return { skills, repos: reposData.length, stars: totalStars, languages, score, repoDetails, recentActivity };
    } catch (error) {
        showToast('GitHub: ' + error.message, 'warning');
        return { skills: [], repos: 0, stars: 0, languages: {}, score: 0, repoDetails: [], error: error.message };
    }
}

function calculateGitHubScore(repos, langCount, stars, recentActivity) {
    let score = 0;
    if (repos >= 30) score += 25; else if (repos >= 20) score += 22;
    else if (repos >= 15) score += 18; else if (repos >= 10) score += 15;
    else if (repos >= 5) score += 10; else if (repos >= 1) score += 5;

    if (langCount >= 7) score += 25; else if (langCount >= 5) score += 20;
    else if (langCount >= 3) score += 15; else if (langCount >= 2) score += 10;
    else if (langCount >= 1) score += 5;

    if (stars >= 50) score += 25; else if (stars >= 20) score += 20;
    else if (stars >= 10) score += 16; else if (stars >= 5) score += 12;
    else if (stars >= 1) score += 6;

    if (recentActivity >= 10) score += 25; else if (recentActivity >= 7) score += 20;
    else if (recentActivity >= 4) score += 15; else if (recentActivity >= 2) score += 10;
    else if (recentActivity >= 1) score += 5;

    return Math.min(100, score);
}


// ==========================================
// LINKEDIN ANALYSIS
// ==========================================

function analyzeLinkedIn(text) {
    const lowerText = text.toLowerCase();
    const skills = extractSkills(lowerText);

    const roleKeywords = [];
    const roles = ['developer','engineer','designer','analyst','manager','lead','architect',
        'consultant','intern','specialist','director','scientist','researcher',
        'devops','qa','tester','product manager','project manager','tech lead',
        'freelancer','founder','full stack','frontend','backend','data engineer','ml engineer'];
    roles.forEach(r => { if (lowerText.includes(r)) roleKeywords.push(r); });

    let experienceLevel = 'entry';
    if (/\b(senior|sr\.|lead|principal|staff|director|10\+? years|8\+? years|7\+? years)\b/i.test(text)) experienceLevel = 'senior';
    else if (/\b(mid[- ]?level|3\+? years|4\+? years|5\+? years|6\+? years)\b/i.test(text)) experienceLevel = 'mid-level';
    else if (/\b(junior|jr\.|entry[- ]?level|trainee|intern|fresher|1\+? year|2\+? years)\b/i.test(text)) experienceLevel = 'junior';

    const hasHeadline = /\b(headline|title|role|position)\b/i.test(text) || roleKeywords.length > 0;
    const hasExperience = /\b(experience|work|employment|years?|internship)\b/i.test(text);
    const hasProjects = /\b(project|built|developed|created|portfolio)\b/i.test(text);
    const hasEducation = /\b(education|university|degree|bachelor|master|b\.?tech|b\.?sc)\b/i.test(text);

    let score = 0;
    const skc = skills.length;
    if (skc >= 8) score += 30; else if (skc >= 5) score += 24;
    else if (skc >= 3) score += 18; else if (skc >= 1) score += 10;
    if (roleKeywords.length >= 3) score += 25; else if (roleKeywords.length >= 2) score += 18;
    else if (roleKeywords.length >= 1) score += 12;
    if (experienceLevel === 'senior') score += 25; else if (experienceLevel === 'mid-level') score += 20;
    else if (experienceLevel === 'junior') score += 14; else score += 8;
    let comp = 0;
    if (hasHeadline) comp += 5; if (hasExperience) comp += 5;
    if (hasProjects) comp += 5; if (hasEducation) comp += 3;
    if (text.length >= 200) comp += 2;
    score += comp;

    return { skills, score: Math.min(100, score), roleKeywords, experienceLevel, hasHeadline, hasExperience, hasProjects, hasEducation };
}


// ==========================================
// JOB MATCHING
// ==========================================

function mergeSkills(...arrays) {
    return Array.from(new Set(arrays.flat()));
}

function calculateJobMatches(allSkills, resumeData, githubData, linkedinData) {
    const allLower = allSkills.map(s => s.toLowerCase());
    return JOB_ROLES.map(role => {
        const reqMatched = role.requiredSkills.filter(s => allLower.includes(s));
        const reqScore = reqMatched.length / role.requiredSkills.length;
        const prefMatched = role.preferredSkills.filter(s => allLower.includes(s));
        const prefScore = role.preferredSkills.length > 0 ? prefMatched.length / role.preferredSkills.length : 0;
        const linkedinBonus = role.keywords.some(k => (AppState.linkedinText || '').toLowerCase().includes(k)) ? 0.1 : 0;
        const matchPercent = Math.min(100, Math.round((reqScore * 0.5 + prefScore * 0.35 + linkedinBonus * 0.15) * 100));

        const parts = [];
        if (reqMatched.length > 0) parts.push(`You have ${reqMatched.length}/${role.requiredSkills.length} core skills (${reqMatched.join(', ')})`);
        else parts.push(`Missing core skills: ${role.requiredSkills.join(', ')}`);
        if (prefMatched.length > 0) parts.push(`Plus ${prefMatched.length} additional skills`);
        if (matchPercent >= 70) parts.push('Strong fit!');
        else if (matchPercent >= 40) parts.push('Good potential — strengthen missing skills.');
        else parts.push('Consider building more skills in this area.');

        return { title: role.title, icon: role.icon, matchPercent, requiredMatched: reqMatched, preferredMatched: prefMatched, reasoning: parts.join('. ') };
    }).sort((a, b) => b.matchPercent - a.matchPercent);
}


// ==========================================
// CONSISTENCY & SUGGESTIONS
// ==========================================

function checkConsistency(rSkills, gSkills, lSkills) {
    const norm = a => a.map(s => s.toLowerCase());
    const r = norm(rSkills), g = norm(gSkills), l = norm(lSkills);
    return {
        resumeVsGithub: { matching: r.filter(s => g.includes(s)), onlyResume: r.filter(s => !g.includes(s)), onlyGithub: g.filter(s => !r.includes(s)) },
        resumeVsLinkedin: { matching: r.filter(s => l.includes(s)), onlyResume: r.filter(s => !l.includes(s)), onlyLinkedin: l.filter(s => !r.includes(s)) },
        githubVsLinkedin: { matching: g.filter(s => l.includes(s)), onlyGithub: g.filter(s => !l.includes(s)), onlyLinkedin: l.filter(s => !g.includes(s)) }
    };
}

function generateSuggestions(resumeData, githubData, linkedinData) {
    const resume = [], github = [], linkedin = [];

    // Resume suggestions
    if (!AppState.resumeFile) {
        resume.push({ text: 'Upload your resume to get personalized feedback', priority: 'high' });
    } else {
        const detected = resumeData.sections.map(s => s.name);
        RESUME_SECTIONS.filter(s => !detected.includes(s.name)).forEach(s => {
            resume.push({ text: `Add a "${s.name}" section to your resume`, priority: 'medium' });
        });
        if (resumeData.skills.length < 5) resume.push({ text: 'Add more technical skills — aim for 8-12 relevant skills', priority: 'high' });
        if (resumeData.text && resumeData.text.split(/\s+/).length < 200) resume.push({ text: 'Expand your resume with more detail', priority: 'medium' });
        const verbs = ['developed','built','designed','implemented','managed','led','created','improved'];
        if (verbs.filter(v => (resumeData.text || '').toLowerCase().includes(v)).length < 3) {
            resume.push({ text: 'Use more action verbs to describe achievements', priority: 'medium' });
        }
        if (!/\d+%/.test(resumeData.text || '')) resume.push({ text: 'Add quantifiable achievements (e.g., "improved by 40%")', priority: 'low' });
    }
    if (resume.length === 0) resume.push({ text: 'Your resume looks comprehensive! Keep it updated.', priority: 'low' });

    // GitHub suggestions
    if (!AppState.githubUsername) {
        github.push({ text: 'Connect your GitHub to showcase your coding profile', priority: 'high' });
    } else {
        if (githubData.repos < 5) github.push({ text: `You have ${githubData.repos} repos — aim for 10+`, priority: 'high' });
        else if (githubData.repos < 10) github.push({ text: 'Good start! Aim for 15+ repos to stand out', priority: 'medium' });
        if (Object.keys(githubData.languages).length < 3) github.push({ text: 'Diversify — try projects in different languages', priority: 'medium' });
        if (githubData.stars < 5) github.push({ text: 'Improve READMEs to attract stars', priority: 'medium' });
        if ((githubData.recentActivity || 0) < 3) github.push({ text: 'Increase activity — commit regularly', priority: 'high' });
        if (githubData.repoDetails) {
            const noDesc = githubData.repoDetails.filter(r => !r.description).length;
            if (noDesc > 2) github.push({ text: `${noDesc} repos lack descriptions — add clear descriptions`, priority: 'low' });
        }
    }
    if (github.length === 0) github.push({ text: 'Great GitHub profile! Keep contributing.', priority: 'low' });

    // LinkedIn suggestions
    if (!AppState.linkedinText) {
        linkedin.push({ text: 'Add your LinkedIn details for a complete analysis', priority: 'high' });
    } else {
        if (!linkedinData.hasHeadline) linkedin.push({ text: 'Add a professional headline', priority: 'high' });
        if (linkedinData.skills.length < 5) linkedin.push({ text: 'Add more skills — aim for 10-15', priority: 'high' });
        if (!linkedinData.hasExperience) linkedin.push({ text: 'Add work experience or internships', priority: 'high' });
        if (!linkedinData.hasProjects) linkedin.push({ text: 'Showcase projects with links', priority: 'medium' });
        if (!linkedinData.hasEducation) linkedin.push({ text: 'Include educational background', priority: 'low' });
        if (linkedinData.roleKeywords.length < 2) linkedin.push({ text: 'Use industry keywords in your headline', priority: 'medium' });
    }
    if (linkedin.length === 0) linkedin.push({ text: 'Your LinkedIn looks solid! Keep networking.', priority: 'low' });

    return { resume, github, linkedin };
}


// ==========================================
// SCORING
// ==========================================

function calculateFinalScore(resumeScore, githubScore, linkedinScore) {
    let totalWeight = 0, weightedSum = 0;
    if (AppState.resumeFile) { weightedSum += resumeScore * 0.4; totalWeight += 0.4; }
    if (AppState.githubUsername) { weightedSum += githubScore * 0.4; totalWeight += 0.4; }
    if (AppState.linkedinText) { weightedSum += linkedinScore * 0.2; totalWeight += 0.2; }
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}


// ==========================================
// RENDERING
// ==========================================

function renderResults() {
    if (!AppState.results) return;
    const r = AppState.results;

    setScoreData('resume', r.resume.score);
    setScoreData('github', r.github.score);
    setScoreData('linkedin', r.linkedin.score);
    setScoreData('final', r.finalScore);
    DOM.finalScoreLabel.textContent = getScoreLabel(r.finalScore);

    renderSkills(DOM.resumeSkillsList, r.resume.skills);
    renderSkills(DOM.githubSkillsList, r.github.skills);
    renderSkills(DOM.linkedinSkillsList, r.linkedin.skills);

    renderJobCards(r.jobs);
    renderConsistency(r.consistency);
    renderSuggestionsList(DOM.resumeSuggestions, r.suggestions.resume);
    renderSuggestionsList(DOM.githubSuggestions, r.suggestions.github);
    renderSuggestionsList(DOM.linkedinSuggestions, r.suggestions.linkedin);
}

function setScoreData(type, score) {
    const circle = DOM[`${type}ScoreCircle`];
    const value = DOM[`${type}ScoreValue`];
    if (circle) circle.dataset.score = score;
    if (value) value.dataset.score = score;
}

function animateScores() {
    ['resume', 'github', 'linkedin', 'final'].forEach(type => {
        const circle = DOM[`${type}ScoreCircle`];
        const value = DOM[`${type}ScoreValue`];
        if (!circle || !value) return;
        const score = parseInt(circle.dataset.score) || 0;
        const circumference = 2 * Math.PI * 52;
        circle.style.strokeDashoffset = circumference - (score / 100) * circumference;
        animateCounter(value, 0, score, 1500);
    });
    setTimeout(() => {
        document.querySelectorAll('.job-match-fill').forEach(bar => {
            bar.style.width = (bar.dataset.percent || 0) + '%';
        });
    }, 300);
}

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function getScoreLabel(score) {
    if (score >= 85) return '🌟 Outstanding';
    if (score >= 70) return '🔥 Strong Profile';
    if (score >= 55) return '👍 Good Progress';
    if (score >= 40) return '📈 Building Up';
    if (score >= 20) return '🌱 Getting Started';
    return '🚀 Start Your Journey';
}

function renderSkills(container, skills) {
    container.innerHTML = '';
    if (skills.length === 0) { container.innerHTML = '<span class="no-data">No skills detected</span>'; return; }
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag'; tag.textContent = skill;
        container.appendChild(tag);
    });
}

function renderJobCards(jobs) {
    DOM.jobRecommendations.innerHTML = '';
    jobs.slice(0, 4).forEach((job, i) => {
        const card = document.createElement('div');
        card.className = 'job-card' + (i === 0 ? ' best-match' : '');
        card.innerHTML = `
            <div class="job-card-badge">${i === 0 ? '<i class="fas fa-crown"></i> Best Match' : `#${i + 1} Match`}</div>
            <h4>${job.icon} ${job.title}</h4>
            <div class="job-match-percent">${job.matchPercent}%</div>
            <div class="job-match-label">Match Score</div>
            <div class="job-match-bar"><div class="job-match-fill" data-percent="${job.matchPercent}"></div></div>
            <div class="job-reasoning">${job.reasoning}</div>`;
        DOM.jobRecommendations.appendChild(card);
    });
}

function renderConsistency(consistency) {
    DOM.consistencyCheck.innerHTML = '';
    const comps = [
        { key: 'resumeVsGithub', title: 'Resume vs GitHub', onlyA: 'onlyResume', onlyB: 'onlyGithub' },
        { key: 'resumeVsLinkedin', title: 'Resume vs LinkedIn', onlyA: 'onlyResume', onlyB: 'onlyLinkedin' },
        { key: 'githubVsLinkedin', title: 'GitHub vs LinkedIn', onlyA: 'onlyGithub', onlyB: 'onlyLinkedin' }
    ];
    comps.forEach(comp => {
        const data = consistency[comp.key];
        const card = document.createElement('div');
        card.className = 'consistency-card';
        const matchHTML = data.matching.length > 0
            ? data.matching.map(s => `<span class="skill-tag match">${s}</span>`).join('')
            : '<span class="no-data">No matching skills</span>';
        const allMissing = [...(data[comp.onlyA] || []), ...(data[comp.onlyB] || [])];
        const gapsHTML = allMissing.length > 0
            ? allMissing.slice(0, 6).map(s => `<span class="skill-tag missing">${s}</span>`).join('') + (allMissing.length > 6 ? `<span class="skill-tag">+${allMissing.length - 6}</span>` : '')
            : '<span class="no-data">Fully consistent!</span>';
        card.innerHTML = `
            <h4><i class="fas fa-exchange-alt"></i> ${comp.title}</h4>
            <h5>✅ Matching</h5><div class="skills-list">${matchHTML}</div>
            <h5>⚠️ Gaps</h5><div class="skills-list">${gapsHTML}</div>`;
        DOM.consistencyCheck.appendChild(card);
    });
}

function renderSuggestionsList(container, suggestions) {
    container.innerHTML = '';
    suggestions.forEach(s => {
        const li = document.createElement('li');
        li.className = `priority-${s.priority}`;
        li.textContent = s.text;
        container.appendChild(li);
    });
}


// ==========================================
// HISTORY RENDERING
// ==========================================

function renderHistory() {
    // Clear existing cards but keep the empty state
    DOM.historyContainer.querySelectorAll('.history-card').forEach(c => c.remove());

    if (AppState.history.length === 0) {
        DOM.historyEmpty.classList.remove('hidden');
        return;
    }

    DOM.historyEmpty.classList.add('hidden');

    AppState.history.forEach(record => {
        const card = document.createElement('div');
        card.className = 'history-card';

        const scoreClass = record.finalScore >= 70 ? 'high' : record.finalScore >= 40 ? 'medium' : 'low';
        const date = record.createdAt?.toDate ? record.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

        card.innerHTML = `
            <div class="history-score-big ${scoreClass}">${record.finalScore}</div>
            <div class="history-details">
                <h4>${record.bestRole || 'N/A'}</h4>
                <p>${date} • ${record.matchPercentage || 0}% match</p>
            </div>
            <div class="history-scores">
                <div class="history-mini-score"><span>${record.resumeScore || 0}</span>Resume</div>
                <div class="history-mini-score"><span>${record.githubScore || 0}</span>GitHub</div>
                <div class="history-mini-score"><span>${record.linkedinScore || 0}</span>LinkedIn</div>
            </div>
            <div class="history-actions">
                <button class="btn-view" data-id="${record.id}"><i class="fas fa-eye"></i></button>
                <button class="btn-delete" data-id="${record.id}"><i class="fas fa-trash"></i></button>
            </div>`;

        // Event listeners
        card.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this analysis record?')) {
                deleteHistoryRecord(record.id);
            }
        });

        card.querySelector('.btn-view').addEventListener('click', () => {
            // Reconstruct minimal results from history record for viewing
            if (record.jobs && record.allSkills) {
                AppState.results = {
                    resume: { skills: [], sections: [], text: '', score: record.resumeScore || 0 },
                    github: { skills: [], repos: 0, stars: 0, languages: {}, score: record.githubScore || 0, repoDetails: [] },
                    linkedin: { skills: [], score: record.linkedinScore || 0, roleKeywords: [], experienceLevel: '' },
                    jobs: record.jobs,
                    consistency: { resumeVsGithub: { matching: [], onlyResume: [], onlyGithub: [] }, resumeVsLinkedin: { matching: [], onlyResume: [], onlyLinkedin: [] }, githubVsLinkedin: { matching: [], onlyGithub: [], onlyLinkedin: [] } },
                    suggestions: record.suggestions || { resume: [], github: [], linkedin: [] },
                    finalScore: record.finalScore,
                    allSkills: record.allSkills || []
                };
                renderResults();
                navigateTo('results');
            }
        });

        DOM.historyContainer.appendChild(card);
    });
}

function updateDashboardStats() {
    const history = AppState.history;
    DOM.statAnalyses.textContent = history.length;

    if (history.length > 0) {
        const best = Math.max(...history.map(h => h.finalScore || 0));
        DOM.statBestScore.textContent = best + '/100';

        // Most frequent best role
        const roles = history.map(h => h.bestRole).filter(Boolean);
        DOM.statBestRole.textContent = roles[0] || '--';
    } else {
        DOM.statBestScore.textContent = '--';
        DOM.statBestRole.textContent = '--';
    }
}


// ==========================================
// TOAST
// ==========================================

function showToast(message, type = 'info') {
    const iconMap = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle', warning: 'fas fa-exclamation-triangle' };
    DOM.toast.className = `toast ${type}`;
    DOM.toastIcon.className = iconMap[type] || iconMap.info;
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.remove('hidden');
    clearTimeout(DOM.toast._timer);
    DOM.toast._timer = setTimeout(() => DOM.toast.classList.add('hidden'), 4000);
}
