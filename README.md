# Stud Market

Студенческий маркетплейс кампуса: Smart Locker, Tech Rent, Print Point, Lost & Found, Skill Exchange.
Заказы с QR-подтверждением, чат по заказу, оплата (демо), StudCoins, админка с заявками и клиентами.

Одно приложение работает в трёх местах:

| Где | Как собирается |
|---|---|
| **Android** | GitHub Actions → `StudMarket.apk` в релизе **latest** |
| **iOS** | GitHub Actions на macOS (без Mac у вас) |
| **Веб** | `npm run build` → папка `dist` |

## Технологии

- **React 18 + Vite** — интерфейс
- **Capacitor 6** — упаковывает интерфейс в iOS- и Android-приложение
- **Neon** — база PostgreSQL, вход (Neon Auth) и Data API
- Языки интерфейса: казахский (основной), русский, английский

## Структура кода

```
src/
├── main.jsx              точка входа
├── App.jsx               экраны входа → онбординг → приложение, общее состояние
├── styles.css            все стили (iOS-стиль, темы Aurora и Midnight)
│
├── lib/                  логика без интерфейса
│   ├── api.js            вход и все запросы к базе (db.*)
│   ├── format.js         форматирование чисел и дат
│   ├── platform.js       веб или приложение (iOS/Android)
│   └── storage.js        локальные настройки
│
├── context/AppContext.js общие данные для всех экранов (useApp)
├── i18n/                 тексты на kz / ru / en
├── data/                 каталог сервисов, варианты профиля
│
├── auth/                 заставка, вход, онбординг, редактор профиля
├── screens/              экраны: Home, Services, Orders, Messages, Profile
│   ├── services/         Locker, Tech, Print, Lost, Skill
│   └── admin/            Admin (сканер, заказы, заявки), Clients
├── sheets/               всплывающие окна: QR, оплата, чат, сканер, заявка
└── components/           мелкие детали: иконки, аватар, сканер, StudCoins
```

Нативные проекты: `android/` и `ios/` (созданы Capacitor, вручную обычно не меняются).

## Запуск на компьютере

```bash
npm install
npm run dev          # веб-версия на http://localhost:5173
```

Файл `.env` содержит адреса Neon (они публичные, секретов там нет).

## Сборка приложений

**Android.** Каждый push в `main` запускает workflow *Android APK*.
Готовый файл: вкладка **Releases → latest → StudMarket.apk**. Скачайте на телефон и установите
(Android попросит разрешить установку из этого источника).

**iOS.** Workflow *iOS build* собирает приложение на macOS в облаке.
Без аккаунта Apple Developer получается сборка для симулятора — она проверяет, что приложение собирается.
Чтобы поставить на настоящий iPhone (TestFlight), нужен аккаунт Apple Developer ($99/год)
и секреты подписи в настройках репозитория — это следующий шаг.

Локально (нужны Android Studio / Xcode на Mac):

```bash
npm run app:android   # открыть в Android Studio
npm run app:ios       # открыть в Xcode (только Mac)
```

## База данных (Neon)

Таблицы: `profiles`, `orders`, `messages`, `lost_posts`, `skill_offers`, `staff`, `admin_requests`.
Права проверяются в самой базе (RLS и функции `redeem_order`, `staff_set_status`,
`request_admin`, `review_admin_request`, `set_staff`), поэтому студент не может
выдать себе права или подтвердить чужой заказ.

## Ограничения

- Оплата Kaspi и картой — демо, реальные деньги не списываются.
- В приложении вход только по email: Google запрещает вход через встроенные браузеры.
