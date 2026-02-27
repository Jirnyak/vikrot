# Ассеты для игры «Виктор Аргонов: Симулятор»

## Портреты персонажей → `portraits/`

| Файл | Персонаж |
|------|----------|
| `viktor.png` | Виктор Аргонов (ГГ) |
| `ariel.png` | Ариэль (солистка) |
| `olivia.png` | Оливия Кибер (киборг) |
| `mitrofanov.png` | Митрофанов (баритон) |
| `mukhin.png` | Валерий Мухин (менеджер) |
| `dantesik.png` | Дантесик (тусовщик) |
| `tomilov.png` | Томилов (фантаст) |
| `volaliel.png` | Волалиэль Волко (шиз) |
| `zheka.png` | Жека (программист) |
| `prof_ivanov.png` | Проф. Иванов (философ) |
| `marina.png` | Марина (журналистка) |
| `hacker_bob.png` | Боб-хакер (даркнет) |
| `sasha.png` | Саша (веган-ударник) |

**Размер:** 256×256+ px, квадрат, PNG с прозрачным фоном.

## Картинки событий → `events/`

### Случайные
| Файл | Событие |
|------|---------|
| `troll_attack.png` | Набег троллей |
| `donor_appears.png` | Щедрый донатер |
| `dvfu_invite.png` | ДВФУ |
| `drug_bust.png` | Полиция |
| `viral_post.png` | Вирусный пост |
| `concert_offer.png` | Концерт |
| `rain_vladivostok.png` | Тайфун |
| `inspiration_strike.png` | Вдохновение |
| `chinese_tourists.png` | Китайские туристы |

### Цепочки
| Файл | Событие |
|------|---------|
| `troll_retaliation.png` | Тролли мстят |
| `scammed_donor_revenge.png` | Обманутый донатер |
| `police_raid.png` | Обыск |
| `mega_concert.png` | Мега-концерт |
| `zheka_startup_result.png` | Результат стартапа |
| `bob_analyzed_result.png` | Результаты анализа |

### Персонажные
| Файл | Событие |
|------|---------|
| `ariel_drama.png` | Ариэль: Драма |
| `ariel_quits.png` | Ариэль уходит |
| `ariel_return.png` | Ариэль возвращается |
| `ariel_conflict_removed.png` | Конфликт с Ариэль |
| `olivia_glitch.png` | Оливия: Сбой |
| `olivia_upgrade_event.png` | Оливия: Апгрейд |
| `mitrofanov_drunk.png` | Митрофанов пьяный |
| `mitrofanov_vs_olivia.png` | Митрофанов vs Оливия |
| `mukhin_offer.png` | Мухин: Заказ |
| `dantesik_trouble.png` | Дантесик: Закон |
| `dantesik_big_concert.png` | Дантесик: Мега-концерт |
| `tomilov_idea.png` | Томилов: Идея |
| `tomilov_novel_movie.png` | Томилов: Экранизация |
| `volaliel_prophecy_event.png` | Волалиэль: Пророчество |
| `volaliel_dimension_rift.png` | Волалиэль: Разрыв реальности |
| `sasha_intervention.png` | Саша: Интервенция |
| `sasha_marathon.png` | Саша: Марафон |
| `zheka_startup.png` | Жека: Стартап |
| `bob_darkweb.png` | Боб: Тёмное предложение |
| `marina_article.png` | Марина: Статья |

### Опера
| Файл | Событие |
|------|---------|
| `opera1_premiere.png` | Премьера: 2032 |
| `opera2_crisis.png` | Кризис Пепла и воды |
| `opera3_eureka.png` | Прорыв: Синтетическая душа |

### Наркотики
| Файл | Событие |
|------|---------|
| `addiction_crisis.png` | Ломка |
| `meph_aftermath.png` | После мефедрона |
| `alpha_nightmare.png` | Альфа-ПВП: На грани |
| `clean_streak.png` | Чистая полоса |

**Размер:** 400×300+ px, PNG/JPG.

## Как это работает

Игра автоматически ищет файл:
- `portraits/{id}.png` → показывает вместо эмодзи
- `events/{id}.png` → показывает вверху карточки события
- Если файла нет → эмодзи-фоллбэк

**Просто кинь PNG — и оно в игре!**

## Как добавить новый контент

1. **Новый персонаж** → добавь в `CHARACTERS[]` в `gameData.ts`, кинь `{id}.png` в `portraits/`
2. **Новое событие** → добавь в `EVENTS[]`, кинь `{id}.png` в `events/`
3. **Новый наркотик** → добавь в `SUBSTANCES[]`
4. **Новая активность** → добавь в `ACTIVITIES[]`
5. **Новая опера** → добавь в `OPERAS[]`

### Условия событий (EventCondition)
```
flags: ['flag1']           — флаг должен быть SET
noFlags: ['flag2']         — флаг НЕ должен быть SET
inBand: ['ariel']          — персонаж в группе
notInBand: ['ariel']       — персонаж НЕ в группе
minRelation: { ariel: 30 } — отношения >= 30
maxRelation: { ariel: -10 }— отношения <= -10
minDay: 5                  — минимальный день
minMoney: 10000            — минимум денег
minPopularity: 50          — минимум популярности
operaIndex: 1              — текущая опера
minOperaProgress: 50       — прогресс оперы
hasAddiction: ['mephedrone']— зависимость от вещества
totalDosesMin: 10          — всего доз принято
```

### Выборы (EventChoice) — мета-эффекты
```
setsFlags: ['flag1']       — установить флаг
removesFlags: ['flag2']    — убрать флаг  
triggersEventId: 'event2'  — запустить цепочку
triggersDelay: 3           — через N дней
```
