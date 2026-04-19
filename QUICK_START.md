# ⚡ ШПАРГАЛКА: 10 минут на GitHub Pages

## 📥 1. Распаковать архив
```bash
tar -xzf english-learning-app.tar.gz
cd english-learning-app
```

## 🔑 2. Создать репозиторий
- Перейти на [github.com/new](https://github.com/new)
- Name: `english-learning-app`
- Visibility: **Public** ✅
- NO init files
- Create

## 📤 3. Залить на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/english-learning-app.git
git push -u origin main
```

## ⚙️ 4. Включить Pages
1. Settings → Pages
2. Branch: `gh-pages` 
3. Save

## ⏳ 5. Ждать (2 минуты)
- Открыть Actions tab
- Ждать ✅

## 🌐 6. Готово!
```
https://YOUR_USERNAME.github.io/english-learning-app/
```

---

## 🔧 Локальная разработка (опционально)

```bash
# Установить
npm install

# Разрабатывать
npm run dev
# → http://localhost:3000

# Залить
git add .
git commit -m "Your changes"
git push
# → Автоматический деплой!
```

---

## 🐛 Если 404 ошибка

- Hard refresh: Ctrl+Shift+R
- Проверить Actions (build может быть в процессе)
- GitHub Pages включен в Settings?

---

**Это всё! Твой сайт на GitHub Pages!** 🚀
