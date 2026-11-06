// استدعاء مكتبات Firebase من الـ CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// مفاتيح مشروعك التي أرسلتها
const firebaseConfig = {
  apiKey: "AIzaSyAdv5Y3OXQQDFNI8lrgQca9aZNoypV0jnI",
  authDomain: "fitness-a36e0.firebaseapp.com",
  projectId: "fitness-a36e0",
  storageBucket: "fitness-a36e0.firebasestorage.app",
  messagingSenderId: "582421153883",
  appId: "1:582421153883:web:e3072dfb0416958574177e",
  measurementId: "G-RG4BPK34NW"
};

// تهيئة الاتصال بـ Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    // المستخدم الحالي المحفوظ في ذاكرة الهاتف لكي لا يعيد التسجيل
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

    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
        });
    }

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

    document.getElementById('link-home').addEventListener('click', () => showPage('home'));
    document.getElementById('link-workouts').addEventListener('click', () => showPage('workouts'));
    document.getElementById('link-measurements').addEventListener('click', () => showPage('measurements'));

    // ================= 1. برمجة صفحة المدرب (جلب من الإنترنت) =================
    document.getElementById('link-coach').addEventListener('click', async () => {
        const pin = prompt('أدخل الرمز السري للمدرب (الرمز: 1234):');
        if (pin === '1234') {
            showPage('coach');
            await loadCoachDashboard();
        } else if (pin !== null) {
            alert('الرمز السري خاطئ!');
        }
    });

    async function loadCoachDashboard() {
        const listContainer = document.getElementById('trainees-list-container');
        listContainer.innerHTML = '<p class="text-cyan-500 text-center font-bold">جاري تحميل البيانات من السحابة... ⏳</p>';
        
        try {
            // جلب جميع المتدربين من قاعدة بيانات Firestore
            const querySnapshot = await getDocs(collection(db, "trainees"));
            let traineesHTML = '';
            let count = 0;

            querySnapshot.forEach((doc) => {
                count++;
                const trainee = doc.data();
                traineesHTML += `
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

            document.getElementById('total-trainees-count').innerText = count;
            
            if(count === 0) {
                listContainer.innerHTML = '<p class="text-slate-500 text-center font-bold">لا يوجد متدربين مسجلين بعد.</p>';
            } else {
                listContainer.innerHTML = traineesHTML;
            }
        } catch (error) {
            listContainer.innerHTML = '<p class="text-red-500 text-center font-bold">حدث خطأ أثناء الاتصال بالإنترنت.</p>';
            console.error("Error fetching documents: ", error);
        }
    }

    document.getElementById('add-new-trainee-btn').addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('profile-form').reset();
        registrationSection.classList.remove('hidden');
        mainContent.classList.add('hidden');
    });

    // ================= 2. برمجة ملف المتدرب =================
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

    loadCurrentUser();

    // ================= 3. تسجيل بطل جديد في الإنترنت =================
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const name = document.getElementById('user-name').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const weight = document.getElementById('user-weight').value.trim();
            const date = document.getElementById('start-date').value;

            if (!name) {
                alert("الاسم الكامل مطلوب!");
                return;
            }

            saveBtn.innerText = "جاري التسجيل السحابي... ⏳";
            saveBtn.disabled = true;

            const newProfile = {
                name: name,
                phone: phone,
                weight: weight,
                date: date,
                createdAt: new Date().toISOString()
            };

            try {
                // حفظ البيانات في Firestore
                const docRef = await addDoc(collection(db, "trainees"), newProfile);
                
                // إضافة المعرف السحابي لملف المستخدم
                newProfile.id = docRef.id;
                
                currentUser = newProfile;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                loadCurrentUser();
            } catch (error) {
                alert("حدث خطأ أثناء حفظ البيانات، تأكد من اتصالك بالإنترنت.");
                console.error("Error adding document: ", error);
            } finally {
                saveBtn.innerText = "تسجيل وانطلاق 🚀";
                saveBtn.disabled = false;
            }
        });
    }

    // ================= 4. تحديث الوزن في الإنترنت =================
    const saveNewWeightBtn = document.getElementById('save-new-weight-btn');
    if (saveNewWeightBtn) {
        saveNewWeightBtn.addEventListener('click', async () => {
            const input = document.getElementById('new-weight-input');
            if (input && input.value && currentUser && currentUser.id) {
                
                saveNewWeightBtn.innerText = "جاري...";
                saveNewWeightBtn.disabled = true;

                try {
                    // تحديث المستند في Firestore السحابي
                    const traineeDocRef = doc(db, "trainees", currentUser.id);
                    await updateDoc(traineeDocRef, {
                        weight: input.value
                    });

                    // تحديث محلي
                    currentUser.weight = input.value;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    document.getElementById('display-weight').innerText = input.value;
                    input.value = '';
                    alert('✅ تم تحديث الوزن بنجاح في السحابة!');
                } catch (error) {
                    alert("خطأ في تحديث الوزن. تأكد من اتصالك بالإنترنت.");
                    console.error("Error updating document: ", error);
                } finally {
                    saveNewWeightBtn.innerText = "تحديث";
                    saveNewWeightBtn.disabled = false;
                }
            }
        });
    }

    // أزرار التمارين
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
});
