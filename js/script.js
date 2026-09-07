// Database Configuration (Mock Database - In production use Node.js/Express backend)
const DB = {
    courses: [
        {
            id: 1,
            title: "تعلم HTML و CSS",
            description: "دورة شاملة لتعلم أساسيات تصميم الويب",
            instructor: "أحمد محمد",
            price: 299,
            duration: "30 ساعة",
            students: 1250,
            rating: 4.8,
            icon: "fa-code"
        },
        {
            id: 2,
            title: "JavaScript المتقدم",
            description: "تعلم البرمجة بلغة جافا سكريبت بشكل متقدم",
            instructor: "فاطمة علي",
            price: 399,
            duration: "40 ساعة",
            students: 980,
            rating: 4.9,
            icon: "fa-js"
        },
        {
            id: 3,
            title: "قواعد البيانات SQL",
            description: "إتقان لغة الاستعلام البنيوية وإدارة البيانات",
            instructor: "محمود حسن",
            price: 349,
            duration: "35 ساعة",
            students: 750,
            rating: 4.7,
            icon: "fa-database"
        },
        {
            id: 4,
            title: "React من الصفر",
            description: "تعلم مكتبة React لبناء تطبيقات ويب حديثة",
            instructor: "ليلى صالح",
            price: 449,
            duration: "45 ساعة",
            students: 650,
            rating: 4.8,
            icon: "fa-react"
        },
        {
            id: 5,
            title: "Node.js والـ Express",
            description: "بناء خوادم ويب قوية باستخدام Node.js",
            instructor: "سارة إبراهيم",
            price: 399,
            duration: "38 ساعة",
            students: 580,
            rating: 4.6,
            icon: "fa-server"
        },
        {
            id: 6,
            title: "Python للمبتدئين",
            description: "ابدأ رحلتك في البرمجة مع لغة Python",
            instructor: "خالد أحمد",
            price: 279,
            duration: "28 ساعة",
            students: 1450,
            rating: 4.9,
            icon: "fa-python"
        }
    ],
    users: [
        {
            id: 1,
            email: "user@example.com",
            password: "password123",
            name: "أحمد العلي",
            enrolledCourses: [1, 3]
        }
    ],
    cart: [],
    enrollments: []
};

// Local Storage Management
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Initialize Local Storage with default data
function initializeStorage() {
    if (!getFromLocalStorage('courses')) {
        saveToLocalStorage('courses', DB.courses);
    }
    if (!getFromLocalStorage('users')) {
        saveToLocalStorage('users', DB.users);
    }
    if (!getFromLocalStorage('cart')) {
        saveToLocalStorage('cart', []);
    }
}

// Modal Management
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
}

// Load Courses
function loadCourses() {
    const courses = getFromLocalStorage('courses') || DB.courses;
    const coursesContainer = document.getElementById('coursesContainer');
    
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-header">
                <i class="fas ${course.icon}"></i>
                <h3>${course.title}</h3>
            </div>
            <div class="course-body">
                <p>${course.description}</p>
                <div class="course-info">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                </div>
                <div class="course-info">
                    <span><i class="fas fa-users"></i> ${course.students} طالب</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                </div>
                <div class="course-price">
                    <span class="currency">$</span>${course.price}
                </div>
                <button class="course-btn" onclick="enrollCourse(${course.id})">التحاق الآن</button>
            </div>
        `;
        coursesContainer.appendChild(courseCard);
    });
}

// Enroll in Course
function enrollCourse(courseId) {
    const currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser) {
        alert('يرجى تسجيل الدخول أولاً');
        openLoginModal();
        return;
    }
    
    const enrollments = getFromLocalStorage('enrollments') || [];
    const isEnrolled = enrollments.some(e => e.userId === currentUser.id && e.courseId === courseId);
    
    if (isEnrolled) {
        alert('أنت بالفعل مسجل في هذه الدورة');
        return;
    }
    
    enrollments.push({
        userId: currentUser.id,
        courseId: courseId,
        enrolledDate: new Date().toISOString(),
        progress: 0
    });
    
    saveToLocalStorage('enrollments', enrollments);
    alert('تم التحاقك بالدورة بنجاح! 🎉');
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    loadCourses();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    const users = getFromLocalStorage('users') || DB.users;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        saveToLocalStorage('currentUser', {
            id: user.id,
            email: user.email,
            name: user.name
        });
        
        closeLoginModal();
        alert(`مرحباً بعودتك ${user.name}! 👋`);
        e.target.reset();
        updateUserDisplay();
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;
    
    if (password !== confirmPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    const users = getFromLocalStorage('users') || DB.users;
    
    if (users.some(u => u.email === email)) {
        alert('البريد الإلكتروني مسجل بالفعل');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        enrolledCourses: []
    };
    
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    saveToLocalStorage('currentUser', {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
    });
    
    closeSignupModal();
    alert(`مرحباً بك ${name}! تم إنشاء حسابك بنجاح 🎓`);
    e.target.reset();
    updateUserDisplay();
}

function handleContactForm(e) {
    e.preventDefault();
    
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;
    
    // Save contact message to localStorage
    const messages = getFromLocalStorage('contactMessages') || [];
    messages.push({
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString()
    });
    
    saveToLocalStorage('contactMessages', messages);
    
    alert('شكراً لك على رسالتك! سنقوم بالرد عليك قريباً.');
    e.target.reset();
}

function updateUserDisplay() {
    const currentUser = getFromLocalStorage('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser && authButtons) {
        authButtons.innerHTML = `
            <div style="color: white; display: flex; align-items: center; gap: 1rem;">
                <span>مرحباً ${currentUser.name}</span>
                <button class="btn-login" onclick="logout()">تسجيل خروج</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                link.style.borderBottom = '2px solid white';
            } else {
                link.style.borderBottom = 'none';
            }
        }
    });
});

// Search and Filter Courses
function searchCourses(query) {
    const courses = getFromLocalStorage('courses') || DB.courses;
    return courses.filter(course => 
        course.title.includes(query) || 
        course.description.includes(query)
    );
}

// Get User Progress
function getUserProgress(userId) {
    const enrollments = getFromLocalStorage('enrollments') || [];
    return enrollments.filter(e => e.userId === userId);
}

// Update Course Progress
function updateCourseProgress(userId, courseId, progress) {
    const enrollments = getFromLocalStorage('enrollments') || [];
    const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    
    if (enrollment) {
        enrollment.progress = Math.min(progress, 100);
        saveToLocalStorage('enrollments', enrollments);
    }
}

// Export data for analytics
function exportUserData(userId) {
    const users = getFromLocalStorage('users') || DB.users;
    const enrollments = getFromLocalStorage('enrollments') || [];
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    
    return {
        user: users.find(u => u.id === userId),
        enrollments: userEnrollments
    };
}

// Import/Export functionality for admin
function exportAllData() {
    const data = {
        courses: getFromLocalStorage('courses') || DB.courses,
        users: getFromLocalStorage('users') || DB.users,
        enrollments: getFromLocalStorage('enrollments') || [],
        messages: getFromLocalStorage('contactMessages') || []
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'educational_platform_data.json';
    link.click();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 5px;
        z-index: 3000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Analytics Functions
function getCourseAnalytics(courseId) {
    const enrollments = getFromLocalStorage('enrollments') || [];
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    
    return {
        totalEnrollments: courseEnrollments.length,
        averageProgress: courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length || 0,
        completionRate: courseEnrollments.filter(e => e.progress === 100).length / courseEnrollments.length || 0
    };
}