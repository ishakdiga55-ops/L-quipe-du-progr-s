// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    
    // جلب جميع أزرار "إتمام" التمارين
    const completeButtons = document.querySelectorAll('.complete-btn');

    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const listItem = this.parentElement;
            const taskText = listItem.querySelector('span');
            
            // تغيير شكل النص ليدل على الإنجاز
            taskText.classList.toggle('completed-task');
            
            // تغيير حالة الزر
            if (this.innerText === 'إتمام') {
                this.innerText = 'تم الإنجاز ✅';
                this.classList.replace('bg-green-500', 'bg-gray-400');
                this.classList.replace('hover:bg-green-600', 'hover:bg-gray-500');
            } else {
                this.innerText = 'إتمام';
                this.classList.replace('bg-gray-400', 'bg-green-500');
                this.classList.replace('hover:bg-gray-500', 'hover:bg-green-600');
            }
        });
    });
});
