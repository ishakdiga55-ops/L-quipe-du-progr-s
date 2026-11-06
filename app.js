document.addEventListener('DOMContentLoaded', () => {
    
    // إعدادات قواعد البيانات المحلية (لجهاز واحد حالياً)
    let allTrainees = JSON.parse(localStorage.getItem('teamTrainees')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // عناصر الواجهة
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const registrationSection = document.getElementById('registration-form');
    const mainContent = document.getElementById('main-content');
    
    const pages = {
        home: document.getElementById('page-home'),
        workouts: document.getElementById('page-workouts'),
        measurements: document.getElementById('page-measurements'),
        coach: document.getElementById('page-coach')
    };

    // القائمة المنسدلة
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
        });
    }

    // التنقل بين الصفحات
    function showPage(pageName) {
        registrationSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        Object.values(pages).forEach(p => p.classList.add('hidden'));
        pages[pageName].classList.remove('hidden');

        if (window.innerWidth < 768 && navLinks) {
            navLinks.classList.add('hidden');
            navLinks.classList.remove('flex');
        }
    }

    // أزرار التنقل
    document.getElementById('link-home').addEventListener('click', () => showPage('home'));
    document.getElementById('link-workouts').addEventListener('click', () => showPage('workouts'));
    document.getElementById('link-measurements').addEventListener('click', () => showPage('measurements'));

    // ================= برمجة صفحة المدرب =================
    document.getElementById('link-coach').addEventListener('click', () => {
        // حماية بسيطة لصفحة المدرب
        const pin = prompt('أدخل الرمز السري للمدرب (الرمز الافتراضي: 1234):');
        if (pin === '1234') {
            updateCoachDashboard();
            showPage('coach');
        } else if (pin !== null) {
            alert('الرمز السري خاطئ!');
        }
    });

    function updateCoachDashboard() {
        document.getElementById('total-trainees-count').innerText = allTrainees.length;
        const listContainer = document.getElementById('trainees-list-container');
        listContainer.innerHTML = ''; // مسح القائمة الحالية

        if(allTrainees.length === 0) {
            listContainer.innerHTML = '<p class="text-slate-500 text-center font-bold">لا يوجد متدربين مسجلين بعد.</p>';
            return;
        }

        allTrainees.forEach((trainee, index) => {
            listContainer.innerHTML += `
                <div class="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex justify-between items-center hover:border-cyan-500/30 transition">
                    <div>
                        <div class="text-white font-black text-lg">${trainee.name}</div>
                        <div class="text-slate-400 text-sm font-semibold mt-1">📱 ${trainee.phone || 'بدون رقم'} | ⚖️ ${trainee.weight} كغ</div>
                    </div>
                    <div class="text-left">
                        <span class="block text-cyan-500 text-xs font-bold mb-1">البدء</span>
                        <span class="text-slate-300 text-sm">${trainee.date}</span>
                    </div>
                </div>
            `;
        });
    }

    // زر إضافة متدرب جديد (من داخل لوحة المدرب)
    document.getElementById('add-new-trainee-btn').addEventListener('click', () => {
        currentUser = null; // تفريغ المستخدم الحالي لتسجيل جديد
        document.getElementById('profile-form').reset();
        registrationSection.classList.remove('hidden');
        mainContent.classList.add('hidden');
    });

    // ================= برمجة ملف المتدرب (Current User) =================
    function loadCurrentUser() {
        if (currentUser) {
            if (document.getElementById('display-name')) document.getElementById('display-name').innerText = currentUser.name;
            if (document.getElementById('display-weight')) document.getElementById('display-weight').innerText = currentUser.weight;
            if (document.getElementById('display-date')) document.getElementById('display-date').innerText = currentUser.date;
            
            showPage('home');
        } else {
            registrationSection.classList.remove('hidden');
            mainContent.classList.add('hidden');
        }
    }

    // تشغيل عند فتح الموقع
    loadCurrentUser();

    // تسجيل بطل جديد وحفظه في قائمة المدرب
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const weight = document.getElementById('user-weight').value.trim();
            const date = document.getElementById('start-date').value;

            if (!name) {
                alert("الاسم الكامل مطلوب!");
                return;
            }

            // إنشاء ملف المتدرب الجديد
            const newProfile = {
                id: Date.now(),
                name: name,
                phone: phone,
                weight: weight,
                date: date
            };

            // حفظ في مصفوفة المتدربين (للمدرب)
            allTrainees.push(newProfile);
            localStorage.setItem('teamTrainees', JSON.stringify(allTrainees));

            // تعيين كالمستخدم النشط حالياً
            currentUser = newProfile;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            loadCurrentUser();
        });
    }

    // أزرار إتمام التمارين 
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('li');
            const title = card.querySelector('div span:first-child');
            card.classList.toggle('completed-workout');
            title.classList.toggle('completed-task');

            if (this.innerText === 'إتمام') {
                this.innerText = 'تم الإنجاز ✅';
                this.classList.replace('bg-green-500', 'bg-slate-700');
                this.classList.replace('text-slate-900', 'text-slate-300');
            } else {
                this.innerText = 'إتمام';
                this.classList.replace('bg-slate-700', 'bg-green-500');
                this.classList.replace('text-slate-300', 'text-slate-900');
            }
        });
    });

    // تحديث الوزن
    const saveNewWeightBtn = document.getElementById('save-new-weight-btn');
    if (saveNewWeightBtn) {
        saveNewWeightBtn.addEventListener('click', () => {
            const input = document.getElementById('new-weight-input');
            if (input && input.value && currentUser) {
                
                // تحديث وزن المستخدم الحالي
                currentUser.weight = input.value;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // تحديث وزنه في قائمة المدرب الشاملة أيضاً
                const traineeIndex = allTrainees.findIndex(t => t.id === currentUser.id);
                if(traineeIndex !== -1) {
                    allTrainees[traineeIndex].weight = input.value;
                    localStorage.setItem('teamTrainees', JSON.stringify(allTrainees));
                }

                document.getElementById('display-weight').innerText = input.value;
                input.value = '';
                alert('تم تحديث الوزن بنجاح!');
            }
        });
    }
});
