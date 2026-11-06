document.addEventListener('DOMContentLoaded', () => {
    
    // 1. برمجة زر القائمة للهواتف
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
        });
    }

    // 2. إدارة التنقل بين الصفحات
    const pageHome = document.getElementById('page-home');
    const pageWorkouts = document.getElementById('page-workouts');
    const pageMeasurements = document.getElementById('page-measurements');
    const allPages = [pageHome, pageWorkouts, pageMeasurements];

    function showPage(pageToShow) {
        // إخفاء كل الصفحات
        allPages.forEach(page => page.classList.add('hidden'));
        // إظهار الصفحة المطلوبة
        pageToShow.classList.remove('hidden');
        
        // إغلاق قائمة الهاتف تلقائياً بعد اختيار صفحة
        if(window.innerWidth < 768 && navLinks) {
            navLinks.classList.add('hidden');
            navLinks.classList.remove('flex');
        }
    }

    // ربط أزرار القائمة بالصفحات
    document.getElementById('link-home').addEventListener('click', () => showPage(pageHome));
    document.getElementById('link-workouts').addEventListener('click', () => showPage(pageWorkouts));
    document.getElementById('link-measurements').addEventListener('click', () => showPage(pageMeasurements));


    // 3. إدارة بيانات الملف الشخصي
    const registrationSection = document.getElementById('registration-form');
    const mainContent = document.getElementById('main-content');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-btn');

    function loadProfile() {
        const savedData = localStorage.getItem('traineeProfile');
        if (savedData) {
            const profile = JSON.parse(savedData);
            
            document.getElementById('display-name').innerText = profile.name || 'بطل مجهول';
            document.getElementById('display-phone').innerText = profile.phone || '---';
            document.getElementById('display-weight').innerText = profile.weight || '---';
            document.getElementById('display-date').innerText = profile.date || '---';
            
            if(profile.image) {
                document.getElementById('display-image').src = profile.image;
            }

            // إخفاء نموذج التسجيل وإظهار المحتوى الرئيسي (الصفحة الرئيسية افتراضياً)
            registrationSection.classList.add('hidden');
            mainContent.classList.remove('hidden');
            showPage(pageHome);
        }
    }

    loadProfile();

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const weight = document.getElementById('user-weight').value;
            const date = document.getElementById('start-date').value;
            const imageInput = document.getElementById('user-image');
            
            if(name.trim() === "") {
                alert("الرجاء إدخال الاسم الكامل للبدء!");
                return;
            }

            const imageFile = imageInput.files ? imageInput.files[0] : null;

            const saveData = (imageData) => {
                const profile = { name, phone, weight, date, image: imageData };
                localStorage.setItem('traineeProfile', JSON.stringify(profile));
                loadProfile(); 
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveData(event.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                saveData(null);
            }
        });
    }

    if(editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            registrationSection.classList.remove('hidden');
            mainContent.classList.add('hidden');
        });
    }

    // 4. برمجة أزرار التمارين
    const completeButtons = document.querySelectorAll('.complete-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskText = this.parentElement.querySelector('span');
            taskText.classList.toggle('completed-task');
            
            if (this.innerText === 'إتمام') {
                this.innerText = 'تم الإنجاز ✅';
                this.classList.replace('bg-green-500', 'bg-gray-400');
            } else {
                this.innerText = 'إتمام';
                this.classList.replace('bg-gray-400', 'bg-green-500');
            }
        });
    });

    // 5. حفظ الوزن الجديد في صفحة القياسات
    const saveNewWeightBtn = document.getElementById('save-new-weight-btn');
    if(saveNewWeightBtn) {
        saveNewWeightBtn.addEventListener('click', () => {
            const successMsg = document.getElementById('weight-success-msg');
            const input = document.getElementById('new-weight-input');
            if(input.value) {
                successMsg.classList.remove('hidden');
                setTimeout(() => { successMsg.classList.add('hidden'); input.value = ''; }, 3000);
            }
        });
    }
});

