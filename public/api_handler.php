<?php

// api_handler.php - обработчик всех форм для MVP Logtail

// Устанавливаем заголовок для JSON-ответа
header('Content-Type: application/json');

// Загружаем переменные окружения из .env файла
$env = parse_ini_file(__DIR__ . '/.env');
$telegramToken = $env['TELEGRAM_BOT_TOKEN'] ?? '';
$telegramChatId = $env['TELEGRAM_CHAT_ID'] ?? '';

// Проверяем наличие токена и chat ID
if (empty($telegramToken) || empty($telegramChatId)) {
    error_log('Ошибка: Не настроены переменные TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID в .env файле');
    echo json_encode(['success' => false, 'message' => 'Ошибка конфигурации сервера']);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса']);
    exit;
}

// Получаем данные из запроса
$postData = $_POST;
$action = $postData['action'] ?? '';
$email = filter_var($postData['email'] ?? '', FILTER_SANITIZE_EMAIL);

// Проверяем наличие email
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email обязателен для заполнения']);
    exit;
}

// Проверяем корректность email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный формат email']);
    exit;
}

// Формируем сообщение для Telegram в зависимости от формы
$messageText = '';
$source = '';

switch ($action) {
    case 'login':
        $source = 'Форма входа';
        $messageText = "🔐 Новый вход\nEmail: $email";
        break;

    case 'signup':
        $source = 'Форма регистрации';
        $companyName = htmlspecialchars($postData['company_name'] ?? '');
        $messageText = "📝 Новая регистрация\nEmail: $email";

        if (!empty($companyName)) {
            $messageText .= "\nКомпания: $companyName";
        }
        break;

    case 'newsletter':
        $source = 'Форма подписки внизу страницы';
        $messageText = "📰 Новый потенциальный клиент \nEmail: $email";
        break;

    case 'contact':
        $source = 'Контактная форма';
        $name = htmlspecialchars($postData['name'] ?? '');
        $message = htmlspecialchars($postData['message'] ?? '');

        $messageText = "📞 Новое сообщение из контактной формы\nEmail: $email";

        if (!empty($name)) {
            $messageText .= "\nИмя: $name";
        }

        if (!empty($message)) {
            $messageText .= "\nСообщение: $message";
        }
        break;

    case 'demo':
        $source = 'Запрос демо сверху страницы';
        $messageText = "🎮 Новый запрос на демо\nEmail: $email";
        break;

    default:
        $source = 'Неизвестная форма';
        $messageText = "❓ Новая форма отправлена\nEmail: $email";

        // Добавляем все остальные поля
        foreach ($postData as $key => $value) {
            if ($key !== 'email' && $key !== 'action') {
                $messageText .= "\n" . htmlspecialchars($key) . ": " . htmlspecialchars($value);
            }
        }
}

// Добавляем дополнительную информацию
$messageText .= "\n\n📊 Источник: $source";
$messageText .= "\n🕒 Дата: " . date('Y-m-d H:i:s');
$messageText .= "\n🌐 IP: " . $_SERVER['REMOTE_ADDR'];
$messageText .= "\n🔍 User-Agent: " . $_SERVER['HTTP_USER_AGENT'];

// Сохраняем данные в лог-файл
$logEntry = date('Y-m-d H:i:s') . " | $source | $email | " . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
file_put_contents(__DIR__ . '/leads.log', $logEntry, FILE_APPEND);

// Отправляем сообщение в Telegram
$telegramUrl = "https://api.telegram.org/bot$telegramToken/sendMessage";
$telegramData = [
    'chat_id' => $telegramChatId,
    'text' => $messageText,
    'parse_mode' => 'HTML'
];

// Используем cURL для отправки запроса в Telegram
$ch = curl_init($telegramUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $telegramData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$telegramResponse = curl_exec($ch);
$telegramError = curl_error($ch);
curl_close($ch);

// Проверяем результат отправки в Telegram
if ($telegramError) {
    error_log("Ошибка отправки в Telegram: $telegramError");
    // Но пользователю не сообщаем об ошибке отправки в Telegram
}

// Возвращаем успешный ответ пользователю
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Ваша информация получена.',
    'redirect' => $action === 'signup' ? '/welcome' : null
]);
