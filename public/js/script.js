document.addEventListener('DOMContentLoaded', function() {
    // Функция для обработки всех форм
    function setupFormHandler(formId, action, successCallback) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Создаем объект FormData
            const formData = new FormData(form);
            formData.append('action', action);

            // Находим или создаем элементы для отображения ошибок и успеха
            let errorElement = form.querySelector('.alert-danger') ||
                (form.parentElement && form.parentElement.querySelector('.alert-danger'));
            let successElement = form.querySelector('.alert-success') ||
                (form.parentElement && form.parentElement.querySelector('.alert-success'));

            // Если элементы не найдены, создаем их
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'alert alert-danger d-none';
                form.parentNode.insertBefore(errorElement, form.nextSibling);
            }

            if (!successElement) {
                successElement = document.createElement('div');
                successElement.className = 'alert alert-success d-none';
                form.parentNode.insertBefore(successElement, form.nextSibling);
            }

            // Скрываем предыдущие сообщения
            errorElement.classList.add('d-none');
            successElement.classList.add('d-none');

            // Отправляем AJAX запрос
            fetch('api_handler.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Если есть callback для успешной отправки, вызываем его
                        if (typeof successCallback === 'function') {
                            successCallback(data);
                        } else {
                            // Иначе показываем стандартное сообщение об успехе
                            successElement.textContent = data.message || 'Успешно отправлено!';
                            successElement.classList.remove('d-none');

                            // Очищаем форму
                            form.reset();

                            // Если указан URL для перенаправления, выполняем его через 2 секунды
                            if (data.redirect) {
                                setTimeout(() => {
                                    window.location.href = data.redirect;
                                }, 2000);
                            }
                        }
                    } else {
                        // Показываем ошибку
                        errorElement.textContent = data.message || 'Произошла ошибка. Попробуйте еще раз.';
                        errorElement.classList.remove('d-none');
                    }
                })
                .catch(error => {
                    errorElement.textContent = 'Произошла ошибка при отправке запроса.';
                    errorElement.classList.remove('d-none');
                    console.error('Error:', error);
                });
        });
    }

    // Настраиваем обработчики для всех форм
    setupFormHandler('loginForm', 'login');
    setupFormHandler('signupForm', 'signup');

    // Форма в верхней части страницы (hero section) - изменено с 'top_form' на 'demo'
    setupFormHandler('heroForm', 'demo', function(data) {
        const form = document.getElementById('heroForm');
        if (!form) return;

        // Безопасно ищем элементы для сообщений
        let successElement = form.querySelector('.alert-success') ||
            (form.parentElement && form.parentElement.querySelector('.alert-success'));
        let errorElement = form.querySelector('.alert-danger') ||
            (form.parentElement && form.parentElement.querySelector('.alert-danger'));

        // Если элементы не найдены, создаем их
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'alert alert-success mt-3';
            form.parentNode.insertBefore(successElement, form.nextSibling);
        }

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'alert alert-danger mt-3 d-none';
            form.parentNode.insertBefore(errorElement, form.nextSibling);
        }

        // Скрываем ошибку и показываем успех
        errorElement.classList.add('d-none');
        successElement.textContent = data.message || 'Спасибо! Мы отправили вам инструкции по настройке.';
        successElement.classList.remove('d-none');

        // Очищаем форму
        form.reset();
    });

    // Форма подписки на новости - изменено с 'bottom_form' на 'newsletter'
    setupFormHandler('newsletterForm', 'newsletter');

    // Контактная форма
    setupFormHandler('contactForm', 'contact');

    // Обработка формы в нижней части страницы - изменено с 'bottom_form' на 'newsletter'
    const footerForm = document.querySelector('.hero form:not(#heroForm)');
    if (footerForm) {
        footerForm.id = 'footerForm';
        setupFormHandler('footerForm', 'newsletter', function(data) {
            const formContainer = footerForm.parentElement;
            if (formContainer) {
                formContainer.innerHTML = `
                    <div class="alert alert-success">
                        ${data.message || 'Спасибо за подписку! Мы свяжемся с вами в ближайшее время.'}
                    </div>
                `;
            }
        });
    }

    // Переключение между модальными окнами
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            // Сбрасываем формы и скрываем сообщения об ошибках при закрытии модального окна
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());

            const alerts = modal.querySelectorAll('.alert');
            alerts.forEach(alert => alert.classList.add('d-none'));
        });
    });
});
