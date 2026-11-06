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

    // 2. إدارة بيانات الملف الشخصي
    const profileForm = document.getElementById('profile-form');
    const registrationSection = document.getElementById('registration-form');
    const profileCard = document.getElementById('profile-card');
    const workoutsSection = document.getElementById('workouts-section');
    const editProfileBtn = document.getElementById('edit-profile-btn');

    // دالة لعرض البيانات المحفوظة
    function loadProfile() {
        const savedData = localStorage.getItem('traineeProfile');
        if (savedData) {
            const profile = JSON.parse(savedData);
            
            // تعبئة البيانات في البطاقة
            document.getElementById('display-name').innerText = profile.name;
            document.getElementById('display-phone').innerText = profile.phone;
            document.getElementById('display-weight').innerText = profile.weight;
            document.getElementById('display-date').innerText = profile.date;
            if(profile.image) {
                document.getElementById('display-image').src = profile.image;
            }

            // إخفاء نموذج الإدخال وإظهار الملف الشخصي والتمارين
            registrationSection.classList.add('hidden');
            profileCard.classList.remove('hidden');
            workoutsSection.classList.remove('hidden');
        }
    }

    // التحقق من وجود بيانات عند تحميل الصفحة
    loadProfile();

    // حفظ البيانات عند الضغط على زر الحفظ
    if(profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة

            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const weight = document.getElementById('user-weight').value;
            const date = document.getElementById('start-date').value;
            const imageFile = document.getElementById('user-image').files[0];

            // دالة لحفظ البيانات (مع أو بدون صورة)
            const saveData = (imageData) => {
                const profile = { name, phone, weight, date, image: imageData };
                localStorage.setItem('traineeProfile', JSON.stringify(profile));
                loadProfile();
            };

            // معالجة الصورة في حال تم رفعها
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveData(event.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                saveData(null); // حفظ بدون صورة
            }
        });
    }

    // زر تعديل البيانات
    if(editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            registrationSection.classList.remove('hidden');
            profileCard.classList.add('hidden');
            workoutsSection.classList.add('hidden');
        });
    }

    // 3. برمجة أزرار التمارين
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
});
