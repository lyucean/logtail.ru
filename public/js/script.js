// Создаем падающие буквы
const matrix = document.getElementById('matrix');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/`~'; // Расширенный набор символов
const colors = [
    'rgba(0, 255, 0, 0.8)', // Яркий зеленый
    'rgba(0, 200, 0, 0.6)', // Темный зеленый
    'rgba(0, 150, 0, 0.4)', // Более тусклый зеленый
    'rgba(0, 255, 0, 1)',   // Полностью яркий зеленый
    'rgba(0, 255, 100, 0.7)' // Зеленовато-желтый оттенок
];

function createFallingLetter() {
    const span = document.createElement('span');
    span.textContent = letters[Math.floor(Math.random() * letters.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.animationDuration = Math.random() * 3 + 1 + 's'; // Скорость падения
    span.style.color = colors[Math.floor(Math.random() * colors.length)];
    matrix.appendChild(span);

    // Удаляем букву после завершения анимации
    span.addEventListener('animationend', () => {
        span.remove();
    });
}

// Генерируем буквы каждые 75 мс для большего количества символов
setInterval(createFallingLetter, 75);