document.addEventListener('DOMContentLoaded', () => {
    
    // 1. القائمة المنسدلة للهواتف
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
        });
    }

    // 2. التحكم في التنقل بين الأقسام
    const pageHome = document.getElementById('page-home');
    const pageWorkouts = document.getElementById('page-workouts');
    const pageMeasurements = document.getElementById('page-measurements');
    const registrationSection = document.getElementById('registration-form');
    const mainContent = document.getElementById('main-content');
    const allPages = [pageHome, pageWorkouts, pageMeasurements];

    function showPage(pageToShow) {
        if (!pageToShow) return;

        if (registrationSection) registrationSection.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');

        allPages.forEach(p => { if (p) p.classList.add('hidden'); });
        pageToShow.classList.remove('hidden');

        if (window.innerWidth < 768 && navLinks) {
            navLinks.classList.add('hidden');
            navLinks.classList.remove('flex');
        }
    }

    const linkHome = document.getElementById('link-home');
    const linkWorkouts = document.getElementById('link-workouts');
    const linkMeasurements = document.getElementById('link-measurements');

    if (linkHome) linkHome.addEventListener('click', () => showPage(pageHome));
    if (linkWorkouts) linkWorkouts.addEventListener('click', () => showPage(pageWorkouts));
    if (linkMeasurements) linkMeasurements.addEventListener('click', () => showPage(pageMeasurements));

    // 3. إدارة الملف الشخصي
    const saveBtn = document.getElementById('save-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');

    function loadProfile() {
        const savedData = localStorage.getItem('traineeProfile');
        if (savedData) {
            const profile = JSON.parse(savedData);
            
            if (document.getElementById('display-name')) document.getElementById('display-name').innerText = profile.name || 'بطل الفريق';
            if (document.getElementById('display-phone')) document.getElementById('display-phone').innerText = profile.phone || '---';
            if (document.getElementById('display-weight')) document.getElementById('display-weight').innerText = profile.weight || '---';
            if (document.getElementById('display-date')) document.getElementById('display-date').innerText = profile.date || '---';
            
            if (profile.image && document.getElementById('display-image')) {
                document.getElementById('display-image').src = profile.image;
            }

            showPage(pageHome);
        } else {
            if (registrationSection) registrationSection.classList.remove('hidden');
            if (mainContent) mainContent.classList.add('hidden');
        }
    }

    loadProfile();

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const weight = document.getElementById('user-weight').value.trim();
            const date = document.getElementById('start-date').value;
            const imageInput = document.getElementById('user-image');

            if (!name) {
                alert("الرجاء إدخال الاسم الكامل أولاً!");
                return;
            }

            const imageFile = imageInput && imageInput.files ? imageInput.files[0] : null;

            const executeSave = (imgData) => {
                const profile = { name, phone, weight, date, image: imgData };
                localStorage.setItem('traineeProfile', JSON.stringify(profile));
                loadProfile();
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    executeSave(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                executeSave(null);
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const savedData = localStorage.getItem('traineeProfile');
            if (savedData) {
                const profile = JSON.parse(savedData);
                if (document.getElementById('user-name')) document.getElementById('user-name').value = profile.name || '';
                if (document.getElementById('user-phone')) document.getElementById('user-phone').value = profile.phone || '';
                if (document.getElementById('user-weight')) document.getElementById('user-weight').value = profile.weight || '';
                if (document.getElementById('start-date')) document.getElementById('start-date').value = profile.date || '';
            }
            if (registrationSection) registrationSection.classList.remove('hidden');
            if (mainContent) mainContent.classList.add('hidden');
        });
    }

    // 4. أزرار إتمام التمارين (محدثة للوضع الداكن)
    const completeBtns = document.querySelectorAll('.complete-btn');
    completeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('li');
            const title = card.querySelector('div span:first-child'); // استهداف نص التمرين فقط
            
            card.classList.toggle('completed-workout');
            title.classList.toggle('completed-task');

            if (this.innerText === 'إتمام') {
                this.innerText = 'تم الإنجاز ✅';
                this.classList.replace('bg-green-500', 'bg-slate-700');
                this.classList.replace('text-slate-900', 'text-slate-300');
                this.classList.replace('hover:bg-green-400', 'hover:bg-slate-600');
                this.classList.remove('shadow-[0_0_15px_rgba(34,197,94,0.3)]');
            } else {
                this.innerText = 'إتمام';
                this.classList.replace('bg-slate-700', 'bg-green-500');
                this.classList.replace('text-slate-300', 'text-slate-900');
                this.classList.replace('hover:bg-slate-600', 'hover:bg-green-400');
                this.classList.add('shadow-[0_0_15px_rgba(34,197,94,0.3)]');
            }
        });
    });

    // 5. تحديث الوزن من صفحة القياسات
    const saveNewWeightBtn = document.getElementById('save-new-weight-btn');
    if (saveNewWeightBtn) {
        saveNewWeightBtn.addEventListener('click', () => {
            const input = document.getElementById('new-weight-input');
            const msg = document.getElementById('weight-success-msg');
            if (input && input.value) {
                const val = input.value;
                const saved = localStorage.getItem('traineeProfile');
                if (saved) {
                    const profile = JSON.parse(saved);
                    profile.weight = val;
                    localStorage.setItem('traineeProfile', JSON.stringify(profile));
                    if (document.getElementById('display-weight')) {
                        document.getElementById('display-weight').innerText = val;
                    }
                }
                if (msg) msg.classList.remove('hidden');
                setTimeout(() => {
                    if (msg) msg.classList.add('hidden');
                    input.value = '';
                }, 3000);
            } else {
                alert('الرجاء كتابة الوزن الجديد!');
            }
        });
    }
});
