// ============================================================
// UNIVERSAL CONTENT MODULE — just add more entries to expand!
// ============================================================
// HOW TO ADD CONTENT:
// 1. Characters → push to CHARACTERS[]
// 2. Events → push to EVENTS[] (with conditions, flags, chains)
// 3. Substances → push to SUBSTANCES[]
// 4. Activities → push to ACTIVITIES[]
// 5. Operas → push to OPERAS[]
// 6. Band roles → push to BAND_ROLES[]
//
// EVENT SYSTEM:
//   conditions: { flags, noFlags, minRelation, maxRelation, inBand, notInBand, minDay, minMoney, operaIndex, minPopularity }
//   effects: money, health, sanity, energy, focus, creativity, bladder, bowel, operaProgress, popularity
//   setsFlags: string[] — flags set when this choice is picked
//   triggersEventId: string — queue an event to fire in N days
//   triggersDelay: number — days until triggered event fires
// ============================================================

// --- CHARACTERS ---
export interface CharacterPerk {
  name: string;
  desc: string;
  effect: { [key: string]: number };
}

export interface CharacterInteraction {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  energyCost: number;
  effects: { [key: string]: number };
  relationChange: number;
  audienceEffects?: { [groupId: string]: number };
  requiredRelation?: number;
  message: string;
}

export interface Character {
  id: string;
  name: string;
  desc: string;
  portrait: string;
  color: string;
  naturalRoles: string[];
  mismatchQuotes: { [roleId: string]: string };
  baseRelation: number;
  traits: string[];
  perks: CharacterPerk[];
  interactions: CharacterInteraction[];
}

// --- BAND ROLES ---
export interface BandRole {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  buffs: { focus?: number; creativity?: number; sanity?: number; popularity?: number; donateBonus?: number; operaBonus?: number };
}

export const BAND_ROLES: BandRole[] = [
  { id: 'solist', name: 'Солист(ка)', emoji: '🎤', desc: 'Главный вокал группы', buffs: { creativity: 10, popularity: 8 } },
  { id: 'back_vocal', name: 'Бэк-вокал', emoji: '🎶', desc: 'Подпевка и гармонии', buffs: { creativity: 5, sanity: 3 } },
  { id: 'guitar', name: 'Гитара', emoji: '🎸', desc: 'Электро/акустическая гитара', buffs: { creativity: 7, popularity: 3 } },
  { id: 'bass', name: 'Бас', emoji: '🎸', desc: 'Бас-гитара, основа ритма', buffs: { sanity: 5, creativity: 4 } },
  { id: 'keys', name: 'Клавиши', emoji: '🎹', desc: 'Синтезатор/фортепиано', buffs: { creativity: 8, focus: 5 } },
  { id: 'drums', name: 'Ударные', emoji: '🥁', desc: 'Перкуссия и ритм-секция', buffs: { sanity: 4, creativity: 3, popularity: 2 } },
  { id: 'violin', name: 'Скрипка', emoji: '🎻', desc: 'Классическая скрипка', buffs: { creativity: 8, popularity: 4 } },
  { id: 'cello', name: 'Виолончель', emoji: '🪕', desc: 'Глубина и драматизм', buffs: { creativity: 6, sanity: 5 } },
  { id: 'composer', name: 'Композитор', emoji: '📝', desc: 'Помощь с аранжировками', buffs: { creativity: 10, operaBonus: 10 } },
  { id: 'admin', name: 'Админ', emoji: '🖥️', desc: 'Техническая поддержка', buffs: { focus: 10, sanity: 5 } },
  { id: 'sound', name: 'Звукорежиссёр', emoji: '🎚️', desc: 'Сведение и мастеринг', buffs: { creativity: 5, focus: 7 } },
  { id: 'manager', name: 'Менеджер', emoji: '💼', desc: 'Букинг, продвижение', buffs: { popularity: 10, donateBonus: 15 } },
  { id: 'donor', name: 'Донатер', emoji: '💰', desc: 'Финансовая поддержка', buffs: { donateBonus: 25, popularity: 3 } },
];

// --- CHARACTERS ---
export const CHARACTERS: Character[] = [
  {
    id: 'ariel', name: 'Ариэль', portrait: '👩‍🎤', color: '#e879f9',
    desc: 'Солистка с ангельским голосом и мистической аурой. Считает себя полуэльфом.',
    naturalRoles: ['solist', 'back_vocal'],
    mismatchQuotes: { drums: '"Ударные?! Я же ЭЛЬФ!"', admin: '"Компьютеры уничтожают ауру..."', manager: '"Деньги — низменная энергия."', bass: '"Бас — слишком грубо."', composer: '"Я ЧУВСТВУЮ музыку, а не пишу."', donor: '"Деньги дают бездарности."' },
    baseRelation: 40,
    traits: ['творческая', 'капризная', 'мистичная'],
    perks: [
      { name: 'Голос ангела', desc: '+15% к качеству оперы если солистка', effect: { operaBonus: 15 } },
      { name: 'Эмоциональная', desc: 'Случайные перепады настроения', effect: { sanityCost: -5 } },
    ],
    interactions: [
      { id: 'ariel_sing', name: 'Послушать пение', emoji: '🎵', desc: 'Попросить спеть новую арию', energyCost: 5, effects: { creativity: 15, sanity: 10 }, relationChange: 5, message: 'Ариэль поёт... и мир замирает.' },
      { id: 'ariel_argue', name: 'Спорить об аранжировке', emoji: '⚔️', desc: 'У неё СВОЁ видение', energyCost: 10, effects: { creativity: 5, sanity: -10 }, relationChange: -10, message: 'Ариэль хлопает дверью! Но идея интересная...' },
      { id: 'ariel_gift', name: 'Подарить кристалл', emoji: '💎', desc: 'Она любит мистические штуки', energyCost: 2, effects: { money: -500 }, relationChange: 20, message: 'Ариэль в восторге! "Живая энергия!"' },
      { id: 'ariel_collab', name: 'Совместная импровизация', emoji: '🎼', desc: 'Создать что-то вместе', energyCost: 20, effects: { operaProgress: 8, creativity: 20, sanity: -5 }, relationChange: 10, requiredRelation: 30, message: 'Магия! Нечто невероятное вдвоём!', audienceEffects: { musicians: 3, schizos: 2 } },
    ],
  },
  {
    id: 'olivia', name: 'Оливия Кибер', portrait: '🤖', color: '#22d3ee',
    desc: 'Солистка-трансгуманистка. Вокодер и нейроинтерфейсы. Полукиборг.',
    naturalRoles: ['solist', 'back_vocal', 'sound'],
    mismatchQuotes: { drums: '"Ритм-машина эффективнее."', manager: '"Оптимизирую через нейросеть."', donor: '"Деньги — устаревший протокол."', guitar: '"Лучше подключу к нейроинтерфейсу."' },
    baseRelation: 25,
    traits: ['технологичная', 'холодная', 'перфекционистка'],
    perks: [
      { name: 'Кибер-голос', desc: 'Уникальный электронный вокал', effect: { schizoBonus: 10 } },
      { name: 'Перфекционизм', desc: 'Требует больше времени', effect: { rehearsalCost: 5 } },
    ],
    interactions: [
      { id: 'olivia_tech', name: 'Обсудить нейроинтерфейсы', emoji: '🧠', desc: 'Техно-философская беседа', energyCost: 10, effects: { focus: 10, creativity: 10 }, relationChange: 8, message: 'Оливия показывает новый чип. Будущее здесь!' },
      { id: 'olivia_upgrade', name: 'Помочь с апгрейдом', emoji: '🔧', desc: 'Её вокодер глючит', energyCost: 15, effects: { money: -1000 }, relationChange: 15, message: 'Вокодер починен!', audienceEffects: { biohackers: 3 } },
      { id: 'olivia_duet', name: 'Записать кибер-дуэт', emoji: '🎹', desc: 'Человек + машина', energyCost: 25, effects: { operaProgress: 10, creativity: 15 }, relationChange: 12, requiredRelation: 20, message: 'Дуэт человека и киборга!', audienceEffects: { biohackers: 5, schizos: 3, musicians: 4 } },
    ],
  },
  {
    id: 'mitrofanov', name: 'Митрофанов', portrait: '🎙️', color: '#fb923c',
    desc: 'Солист-баритон старой школы. Электроника — деградация. Пьёт коньяк.',
    naturalRoles: ['solist', 'back_vocal'],
    mismatchQuotes: { keys: '"Синтезатор — калькулятор!"', sound: '"Я артист, а не кнопконажиматель!"', admin: '"Я оперный певец, а не секретарша!"', drums: '"Барабаны — удел дикарей."', donor: '"Я не буду ПЛАТИТЬ... или буду?"' },
    baseRelation: 15,
    traits: ['классический', 'консервативный', 'мощный голос'],
    perks: [
      { name: 'Бас-баритон', desc: 'Глубина звучания', effect: { intellectBonus: 10 } },
      { name: 'Старая школа', desc: 'Конфликтует с электроникой', effect: { oliviaConflict: -5 } },
    ],
    interactions: [
      { id: 'mitro_drink', name: 'Выпить коньяку', emoji: '🥃', desc: 'За искусство!', energyCost: 10, effects: { sanity: 10, health: -5, creativity: 8 }, relationChange: 12, message: 'Байки из оперного театра. Душевно!' },
      { id: 'mitro_classic', name: 'Послушать оперные арии', emoji: '🎭', desc: 'Классика бессмертна', energyCost: 8, effects: { creativity: 15, focus: 5 }, relationChange: 8, message: 'Митрофанов поёт Верди. Мурашки.' },
      { id: 'mitro_argue', name: 'Спорить о электронике', emoji: '💥', desc: 'Он ненавидит синтезаторы', energyCost: 10, effects: { sanity: -15 }, relationChange: -15, message: '"Это не музыка! Это пиканье!"' },
    ],
  },
  {
    id: 'mukhin', name: 'Валерий Мухин', portrait: '💼', color: '#a3e635',
    desc: 'Менеджер-оптимизатор. Считает всё в Excel. Костюм даже на пляже.',
    naturalRoles: ['manager', 'admin'],
    mismatchQuotes: { solist: '"Ла-ла... *кашель*... не моё."', drums: '"Бить палками? Я бью Excel!"', guitar: '"ROI гитары отрицательный."', violin: '"Аллергия на канифоль."', composer: '"Оптимизирую ноты. До-ре-ми — 33%."' },
    baseRelation: 30,
    traits: ['деловой', 'расчётливый', 'эффективный'],
    perks: [
      { name: 'Оптимизатор', desc: '+20% к донатам если менеджер', effect: { donateBonus: 20 } },
      { name: 'Скучный', desc: 'Снижает креативность', effect: { creativityCost: -3 } },
    ],
    interactions: [
      { id: 'mukhin_plan', name: 'Обсудить бизнес-план', emoji: '📊', desc: 'Стратегия монетизации', energyCost: 10, effects: { focus: 15, money: 500 }, relationChange: 8, message: 'Мухин показывает графики. Мы можем больше!' },
      { id: 'mukhin_sponsor', name: 'Найти спонсора', emoji: '💰', desc: 'Его контакты — золото', energyCost: 5, effects: { money: 3000 }, relationChange: -5, requiredRelation: 20, message: 'Спонсор найден! "Я не благотворитель."' },
      { id: 'mukhin_fire', name: 'Критиковать методы', emoji: '📉', desc: 'Искусство не про деньги!', energyCost: 5, effects: { sanity: 5 }, relationChange: -20, message: 'Мухин молча поправляет галстук.' },
    ],
  },
  {
    id: 'dantesik', name: 'Дантесик', portrait: '🎩', color: '#f472b6',
    desc: 'Менеджер-тусовщик. Знает всех. Сомнительные связи.',
    naturalRoles: ['manager', 'admin'],
    mismatchQuotes: { solist: '"Йоу! *фальшивит* ...зато я знаю ВСЕХ!"', composer: '"Ноты? Не, бро, я по вайбу."', violin: '"Скрипку? На вечеринке разве что!"', cello: '"Виолончель не влезет в тачку."' },
    baseRelation: 20,
    traits: ['тусовщик', 'харизматичный', 'ненадёжный'],
    perks: [
      { name: 'Связи', desc: 'Уникальные ивенты и концерты', effect: { eventBonus: 1 } },
      { name: 'Ненадёжный', desc: '10% подвести в критический момент', effect: { failChance: 10 } },
    ],
    interactions: [
      { id: 'dantes_party', name: 'Вечеринка', emoji: '🎉', desc: 'ЛУЧШИЕ места', energyCost: 25, effects: { sanity: 10, health: -5, popularity: 5 }, relationChange: 10, message: 'Безумная вечеринка! Фоточки огонь.', audienceEffects: { hamsters: 3, trolls: 2, normies: 4 } },
      { id: 'dantes_promo', name: 'Промо', emoji: '📢', desc: 'Знает блогеров', energyCost: 5, effects: { popularity: 8, money: -2000 }, relationChange: 5, requiredRelation: 10, message: 'Реклама у топ-блогера!', audienceEffects: { hamsters: 8, normies: 5 } },
      { id: 'dantes_scheme', name: 'Мутная схема', emoji: '🕵️', desc: '"Выгодная штука"', energyCost: 5, effects: { money: 5000, sanity: -10 }, relationChange: 5, message: '"Не спрашивай откуда деньги, бро."' },
    ],
  },
  {
    id: 'tomilov', name: 'Томилов', portrait: '📚', color: '#818cf8',
    desc: 'Писатель-фантаст. 12 романов про ИИ. Живёт в книгах. Бородатый.',
    naturalRoles: ['composer'],
    mismatchQuotes: { solist: '"*читает либретто вместо пения*"', drums: '"Ритмично стучу по клавиатуре!"', manager: '"В 2045 деньги отменили."', sound: '"Озвучу аудиокнигу?"', guitar: '"*держит гитару как книгу*"' },
    baseRelation: 45,
    traits: ['интеллектуал', 'мечтатель', 'бородатый'],
    perks: [
      { name: 'Мастер сюжета', desc: 'Помогает с либретто', effect: { librettoBonus: 10 } },
      { name: 'Рассеянный', desc: 'Забывает о встречах', effect: { unreliable: 1 } },
    ],
    interactions: [
      { id: 'tomilov_libretto', name: 'Писать либретто', emoji: '✍️', desc: 'Его сюжеты — огонь', energyCost: 20, effects: { operaProgress: 12, creativity: 10 }, relationChange: 10, message: 'Гениальный поворот сюжета!', audienceEffects: { intellectuals: 3 } },
      { id: 'tomilov_discuss', name: 'Обсудить сингулярность', emoji: '🤔', desc: 'Философские дебаты', energyCost: 15, effects: { sanity: 5, creativity: 15, focus: -5 }, relationChange: 8, message: 'Три часа спорили о сознании ИИ.' },
      { id: 'tomilov_book', name: 'Прочитать роман', emoji: '📖', desc: '800 страниц про пост-людей', energyCost: 15, effects: { creativity: 20, sanity: 5 }, relationChange: 12, message: 'Роман потрясающий! Но 800 страниц...' },
      { id: 'tomilov_collab', name: 'Совместный манифест', emoji: '📜', desc: 'Трансгуманистический манифест', energyCost: 25, effects: { popularity: 10, creativity: 10 }, relationChange: 15, requiredRelation: 40, message: 'Манифест опубликован!', audienceEffects: { intellectuals: 8, schizos: 5, trolls: 3, biohackers: 5 } },
    ],
  },
  {
    id: 'volaliel', name: 'Волалиэль Волко', portrait: '🌀', color: '#c084fc',
    desc: 'Шиз-гений. Параллельные вселенные. Пророчества. Или бред.',
    naturalRoles: ['back_vocal', 'keys'],
    mismatchQuotes: { manager: '"Я управляю ИЗМЕРЕНИЯМИ!"', admin: '"Компьютер — портал. Я знаю."', drums: '"Барабаны — КОСМИЧЕСКИЙ РИТМ!"', donor: '"Деньги — иллюзия матрицы!"' },
    baseRelation: 10,
    traits: ['шизоид', 'гениальный', 'непредсказуемый'],
    perks: [
      { name: 'Безумное вдохновение', desc: '+25 creativity -10 sanity', effect: { creativityBoost: 25, sanityCost: -10 } },
      { name: 'Пророчества', desc: 'Иногда предсказывает события', effect: { prophecy: 1 } },
    ],
    interactions: [
      { id: 'volaliel_vision', name: 'Послушать видения', emoji: '👁️', desc: '"Я видел это во сне..."', energyCost: 10, effects: { creativity: 25, sanity: -15 }, relationChange: 10, message: 'Невозможные миры. Либо гений, либо...' },
      { id: 'volaliel_music', name: 'Джем-сессия хаоса', emoji: '🌪️', desc: 'Играть без правил', energyCost: 15, effects: { creativity: 30, sanity: -20, operaProgress: 3 }, relationChange: 8, message: 'ХАОС! Но из хаоса — красота.', audienceEffects: { schizos: 8, musicians: -2 } },
      { id: 'volaliel_prophecy', name: 'Спросить пророчество', emoji: '🔮', desc: 'Что нас ждёт?', energyCost: 5, effects: { sanity: -8 }, relationChange: 5, message: '"Звёзды говорят... будь осторожен с кофе."' },
      { id: 'volaliel_ritual', name: 'Ритуал вдохновения', emoji: '🕯️', desc: 'Мистический ритуал', energyCost: 20, effects: { creativity: 35, sanity: -25, health: -5 }, relationChange: 12, requiredRelation: 5, message: 'Свечи, благовония... НЕЧТО. Или гипоксия.', audienceEffects: { schizos: 10, haters: 3 } },
    ],
  },
  {
    id: 'zheka', name: 'Жека', portrait: '💻', color: '#4ade80',
    desc: 'Старый друг-программист, фанат трансгуманизма. Помогает с техникой.',
    naturalRoles: ['sound', 'admin'],
    mismatchQuotes: { solist: '"Ла-ла... *голос ломается*"', drums: '"Стучу по клавиатуре РИТМИЧНО."', violin: '"Сегфолт в мозгу."', donor: '"Ипотека, бро. Но немного могу."' },
    baseRelation: 55,
    traits: ['умный', 'ленивый', 'верный друг'],
    perks: [
      { name: 'Техно-гуру', desc: 'Чинит технику, экономит деньги', effect: { techSave: 500 } },
      { name: 'Лень', desc: 'Иногда не приходит', effect: { skipChance: 15 } },
    ],
    interactions: [
      { id: 'zheka_code', name: 'Кодить вместе', emoji: '⌨️', desc: 'Сайт для группы', energyCost: 15, effects: { popularity: 5, focus: 10 }, relationChange: 8, message: 'Жека запилил сайт за вечер!' },
      { id: 'zheka_beer', name: 'Пиво и разговоры', emoji: '🍺', desc: 'Как в старые времена', energyCost: 10, effects: { sanity: 15, health: -3, money: -300 }, relationChange: 10, message: 'Жека хороший друг.' },
      { id: 'zheka_fix', name: 'Починить технику', emoji: '🔧', desc: 'Синтезатор глючит', energyCost: 3, effects: { money: -200, focus: 5 }, relationChange: 3, message: 'Починил за час. Почти бесплатно.' },
    ],
  },
  {
    id: 'prof_ivanov', name: 'Проф. Иванов', portrait: '🎓', color: '#fbbf24',
    desc: 'Профессор философии сознания из ДВФУ. Квалиа и hard problem.',
    naturalRoles: ['composer'],
    mismatchQuotes: { solist: '"*монотонно* ...квалиа..."', drums: '"Я предпочитаю ударные аргументы."', guitar: '"Кант не играл на гитаре... надо проверить."', manager: '"Менеджмент — прикладная этика."', donor: '"Грант — это тоже донат."' },
    baseRelation: 50,
    traits: ['учёный', 'занудный', 'мудрый'],
    perks: [
      { name: 'Академический вес', desc: '+popularity у интеллектуалов', effect: { intellectPop: 5 } },
      { name: 'Зануда', desc: 'Долгие лекции утомляют', effect: { energyCost: 5 } },
    ],
    interactions: [
      { id: 'prof_lecture', name: 'Совместная лекция', emoji: '🏛️', desc: 'В ДВФУ о сознании', energyCost: 25, effects: { popularity: 8, money: 3000, focus: -10 }, relationChange: 10, message: 'Блестящая лекция! Аплодисменты.', audienceEffects: { intellectuals: 8, biohackers: 3 } },
      { id: 'prof_debate', name: 'Дебаты о квалиа', emoji: '🤔', desc: 'Функционализм vs дуализм', energyCost: 15, effects: { creativity: 10, sanity: 5, focus: -10 }, relationChange: 5, message: 'Три часа. Ничего не решили. Интересно!' },
      { id: 'prof_paper', name: 'Написать статью', emoji: '📝', desc: 'Академическая публикация', energyCost: 20, effects: { popularity: 5, focus: -15 }, relationChange: 15, requiredRelation: 30, message: 'Статья принята!', audienceEffects: { intellectuals: 10 } },
    ],
  },
  {
    id: 'marina', name: 'Марина', portrait: '📰', color: '#fb7185',
    desc: 'Журналистка. Может прославить, может уничтожить.',
    naturalRoles: ['manager'],
    mismatchQuotes: { solist: '"Я в микрофон каждый день! ...не так?"', drums: '"Ритм ПРАВДЫ!"', composer: '"Тексты! Ну, статьи."', keys: '"Печатаю на клавиатуре!"' },
    baseRelation: 25,
    traits: ['любопытная', 'двуличная', 'влиятельная'],
    perks: [
      { name: 'Четвёртая власть', desc: 'Публикации сильно влияют', effect: { mediaImpact: 2 } },
      { name: 'Двуличная', desc: 'Может написать что угодно', effect: { unpredictable: 1 } },
    ],
    interactions: [
      { id: 'marina_interview', name: 'Дать интервью', emoji: '🎤', desc: 'Для её издания', energyCost: 15, effects: { popularity: 10 }, relationChange: 8, message: 'Большой материал. Ждём реакции...', audienceEffects: { normies: 5, hamsters: 3, intellectuals: 2 } },
      { id: 'marina_expose', name: 'Рассказать правду', emoji: '💣', desc: 'Полный откровенный рассказ', energyCost: 10, effects: { popularity: 15, sanity: -10 }, relationChange: 15, message: 'Шокирующий материал!', audienceEffects: { biohackers: 10, haters: 8, normies: -5, schizos: 5 } },
      { id: 'marina_coffee', name: 'Кофе не для интервью', emoji: '☕', desc: 'Просто поболтать', energyCost: 8, effects: { sanity: 5, bladder: -15 }, relationChange: 10, message: 'Марина приятная, когда не при исполнении.' },
    ],
  },
  {
    id: 'hacker_bob', name: 'Боб-хакер', portrait: '🕶️', color: '#10b981',
    desc: 'Анонимус из даркнета. Поставляет "витаминки". Тёмная фигура.',
    naturalRoles: ['admin', 'sound'],
    mismatchQuotes: { solist: '"Я анонимус, а не певец."', drums: '"Стучу по клавишам."', violin: '"Слишком аналоговое."', composer: '"Алгоритм лучше."' },
    baseRelation: 5,
    traits: ['криминальный', 'полезный', 'анонимный'],
    perks: [
      { name: 'Даркнет', desc: 'Скидки на вещества', effect: { drugDiscount: 30 } },
      { name: 'Опасные связи', desc: 'Может привлечь внимание', effect: { heatRisk: 1 } },
    ],
    interactions: [
      { id: 'bob_supply', name: 'Заказать "витаминки"', emoji: '💊', desc: 'Со скидкой', energyCost: 3, effects: { focus: 20, health: -5, money: -300 }, relationChange: 5, message: '"Как обычно, бро."' },
      { id: 'bob_hack', name: 'Попросить хакнуть', emoji: '💻', desc: 'По-хакерски', energyCost: 5, effects: { money: -1000, popularity: 3 }, relationChange: 8, message: 'Сделано. Не спрашивай.' },
      { id: 'bob_crypto', name: 'Инвестиции в крипту', emoji: '₿', desc: '"100x, бро"', energyCost: 3, effects: { money: -2000 }, relationChange: 5, message: 'Либо 100x, либо 0.' },
    ],
  },
  {
    id: 'sasha', name: 'Саша', portrait: '🥗', color: '#84cc16',
    desc: 'Ударник-веган. Ненавидит стимуляторы. Бегает марафоны.',
    naturalRoles: ['drums', 'bass'],
    mismatchQuotes: { solist: '"Только мантры. На пробежке."', keys: '"Предпочитаю палочки."', composer: '"Планы тренировок > ноты."', manager: '"Главное — дисциплина! Подъём в 5!"', donor: '"На органическую еду."' },
    baseRelation: 15,
    traits: ['здоровый', 'категоричный', 'дисциплинированный'],
    perks: [
      { name: 'Дисциплина', desc: '+10 health если в группе', effect: { healthBoost: 10 } },
      { name: 'Моралист', desc: 'Ненавидит наркотики', effect: { drugHate: -5 } },
    ],
    interactions: [
      { id: 'sasha_run', name: 'Пробежка', emoji: '🏃', desc: 'По набережной Владивостока', energyCost: 20, effects: { health: 15, sanity: 10, bowel: -15 }, relationChange: 12, message: '5 км! Саша бодр. Ты еле выжил.' },
      { id: 'sasha_cook', name: 'Веганский ужин', emoji: '🥬', desc: 'Тофу', energyCost: 8, effects: { health: 10, energy: 10, money: -200, sanity: 3 }, relationChange: 8, message: 'Тофу... съедобный? Саша сияет.' },
      { id: 'sasha_lecture', name: 'Лекция о ЗОЖ', emoji: '🧘', desc: 'ОБЯЗАТЕЛЬНО расскажет', energyCost: 10, effects: { sanity: -5, health: 5 }, relationChange: 5, message: '"Кофе — яд! Модафинил..." *Саша в обмороке от злости*' },
    ],
  },
];

// --- AUDIENCE GROUPS ---
export interface AudienceGroup {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  baseSize: number;
  donateRate: number;
}

export const AUDIENCE_GROUPS: AudienceGroup[] = [
  { id: 'intellectuals', name: 'Интеллектуалы', emoji: '🧠', desc: 'Ценят глубину и философию', baseSize: 100, donateRate: 0.5 },
  { id: 'schizos', name: 'Шизы', emoji: '🌀', desc: 'Фанаты всего странного', baseSize: 50, donateRate: 0.3 },
  { id: 'hamsters', name: 'Хомяки', emoji: '🐹', desc: 'Массовая аудитория', baseSize: 200, donateRate: 0.1 },
  { id: 'trolls', name: 'Тролли', emoji: '👹', desc: 'Ради хаоса', baseSize: 80, donateRate: 0.05 },
  { id: 'haters', name: 'Хейтеры', emoji: '💢', desc: 'Ненавидят, но смотрят', baseSize: 30, donateRate: -0.1 },
  { id: 'biohackers', name: 'Биохакеры', emoji: '💊', desc: 'Трансгуманизм и ноотропы', baseSize: 60, donateRate: 0.4 },
  { id: 'musicians', name: 'Музыканты', emoji: '🎵', desc: 'Оценивают мастерство', baseSize: 40, donateRate: 0.6 },
  { id: 'normies', name: 'Нормисы', emoji: '😐', desc: 'Зашли случайно', baseSize: 150, donateRate: 0.08 },
];

// --- SUBSTANCES ---
// Tiers: light (чай, кофе), medium (ноотропы), hard (рецептурные), extreme (уличные)
export type SubstanceTier = 'light' | 'medium' | 'hard' | 'extreme';

export interface Substance {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  tier: SubstanceTier;
  cost: number;
  effects: { focus?: number; creativity?: number; health?: number; sanity?: number; energy?: number; bladder?: number; bowel?: number };
  overdoseThreshold: number;
  addictiveness: number;
  audienceReaction?: { [groupId: string]: number }; // audience reacts to drug use
}

export const SUBSTANCE_TIER_INFO: Record<SubstanceTier, { name: string; emoji: string; color: string; desc: string }> = {
  light: { name: 'Лёгкие', emoji: '🍵', color: '#4ade80', desc: 'Безвредные стимуляторы' },
  medium: { name: 'Ноотропы', emoji: '💊', color: '#60a5fa', desc: 'Умеренный риск' },
  hard: { name: 'Рецептурные', emoji: '💉', color: '#f59e0b', desc: 'Высокий риск зависимости' },
  extreme: { name: 'Тяжёлые', emoji: '☠️', color: '#ef4444', desc: 'КРАЙНЕ ОПАСНО' },
};

export const SUBSTANCES: Substance[] = [
  // LIGHT
  { id: 'green_tea', name: 'Зелёный чай', emoji: '🍵', tier: 'light', desc: 'L-теанин + кофеин = дзен', cost: 30, effects: { focus: 8, sanity: 5, energy: 10, health: 2, bladder: -15 }, overdoseThreshold: 6, addictiveness: 0.02 },
  { id: 'coffee', name: 'Кофе', emoji: '☕', tier: 'light', desc: 'Классика. Бодрит, бьёт по мочевому', cost: 50, effects: { focus: 15, energy: 20, bladder: -25, health: -2 }, overdoseThreshold: 4, addictiveness: 0.1 },
  { id: 'energy_drink', name: 'Энергетик', emoji: '⚡', tier: 'light', desc: 'Дешёвый буст, сердечко...', cost: 80, effects: { energy: 30, focus: 5, health: -8, bladder: -20, bowel: -10 }, overdoseThreshold: 3, addictiveness: 0.2 },

  // MEDIUM — nootropics
  { id: 'piracetam', name: 'Пирацетам', emoji: '💊', tier: 'medium', desc: 'Мягкий ноотроп', cost: 100, effects: { focus: 10, creativity: 8, health: -1 }, overdoseThreshold: 3, addictiveness: 0.05 },
  { id: 'noopept', name: 'Ноопепт', emoji: '🧬', tier: 'medium', desc: 'Российский ноотроп. Патриотично', cost: 150, effects: { focus: 20, creativity: 5, health: -2, sanity: 3 }, overdoseThreshold: 2, addictiveness: 0.1 },
  { id: 'phenibut', name: 'Фенибут', emoji: '😌', tier: 'medium', desc: 'Снимает тревогу, вызывает зависимость', cost: 200, effects: { sanity: 25, focus: -5, creativity: 10, health: -4 }, overdoseThreshold: 1, addictiveness: 0.5, audienceReaction: { biohackers: 1 } },

  // HARD — prescription
  { id: 'modafinil', name: 'Модафинил', emoji: '🧠', tier: 'hard', desc: 'Сверхфокус. Рецептурный', cost: 300, effects: { focus: 35, energy: 15, health: -5, sanity: -3, bladder: -10 }, overdoseThreshold: 2, addictiveness: 0.3, audienceReaction: { biohackers: 2, haters: 1, sasha: -3 } },
  { id: 'lyrica', name: 'Лирика (Прегабалин)', emoji: '🎸', tier: 'hard', desc: 'Противосудорожное. Эйфория, расслабление. Привыкание!', cost: 400, effects: { sanity: 30, creativity: 15, focus: -10, health: -8, energy: -5 }, overdoseThreshold: 1, addictiveness: 0.6, audienceReaction: { schizos: 2, haters: 2 } },
  { id: 'baclofen', name: 'Баклофен', emoji: '💤', tier: 'hard', desc: 'Миорелаксант. Снимает тревогу, но замедляет', cost: 350, effects: { sanity: 20, health: -6, focus: -15, energy: -10, creativity: 5 }, overdoseThreshold: 1, addictiveness: 0.55, audienceReaction: { biohackers: 1, haters: 1 } },
  { id: 'microdose', name: 'Микродоза', emoji: '🍄', tier: 'hard', desc: 'Открывает двери восприятия. Или крышу сносит', cost: 500, effects: { creativity: 40, sanity: -15, focus: -5, health: -3 }, overdoseThreshold: 1, addictiveness: 0.15, audienceReaction: { schizos: 3, biohackers: 2, haters: 2 } },

  // EXTREME — street drugs. HUGE buffs, HUGE damage
  { id: 'mephedrone', name: 'Мефедрон (мяу)', emoji: '🐱', tier: 'extreme', desc: 'Стимулятор. Эйфория + энергия + РАЗРУШЕНИЕ. Крайне аддиктивен', cost: 800, effects: { energy: 50, creativity: 35, focus: 25, health: -20, sanity: -15, bladder: -30 }, overdoseThreshold: 1, addictiveness: 0.85, audienceReaction: { schizos: 5, haters: 10, biohackers: -5, normies: -3 } },
  { id: 'alpha_pvp', name: 'Альфа-ПВП', emoji: '💀', tier: 'extreme', desc: 'САМЫЙ ОПАСНЫЙ. Нечеловеческая продуктивность. Один шаг от смерти', cost: 1200, effects: { energy: 80, creativity: 50, focus: 50, health: -35, sanity: -30, bladder: -40, bowel: -30 }, overdoseThreshold: 1, addictiveness: 0.95, audienceReaction: { schizos: 8, haters: 15, biohackers: -10, normies: -8, intellectuals: -5, musicians: -3 } },
];

// --- ACTIVITIES ---
export interface Activity {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  effects: { operaProgress?: number; popularity?: number; money?: number; health?: number; sanity?: number; energy?: number; focus?: number; creativity?: number; bladder?: number; bowel?: number };
  audienceEffects?: { [groupId: string]: number };
  requiredFocus?: number;
  requiredEnergy?: number;
}

export const ACTIVITIES: Activity[] = [
  { id: 'write_opera', name: 'Писать оперу', emoji: '🎼', desc: 'Работа над произведением', effects: { operaProgress: 5, energy: -20, focus: -10, sanity: -3, bladder: -10, bowel: -5 }, audienceEffects: { intellectuals: 2, musicians: 3, schizos: 1 }, requiredFocus: 30 },
  { id: 'shitpost', name: 'Щитпостить', emoji: '💩', desc: 'Набрасывать в соцсетях', effects: { popularity: 3, energy: -5, sanity: -5, bladder: -5 }, audienceEffects: { trolls: 5, hamsters: 3, haters: 2, intellectuals: -2, normies: 1 } },
  { id: 'lecture', name: 'Лекция о сознании', emoji: '🧠', desc: 'Философия в ДВФУ', effects: { popularity: 5, money: 2000, energy: -25, sanity: 5, focus: -15 }, audienceEffects: { intellectuals: 5, biohackers: 2, schizos: -1, hamsters: -1 } },
  { id: 'stream', name: 'Стрим', emoji: '📺', desc: 'Живой эфир', effects: { popularity: 4, money: 500, energy: -15, sanity: -2, bladder: -15 }, audienceEffects: { hamsters: 4, trolls: 2, normies: 3, schizos: 1 } },
  { id: 'sleep', name: 'Спать', emoji: '😴', desc: 'Восстановить силы', effects: { energy: 40, health: 10, sanity: 10, focus: 15, bladder: -20, bowel: -15 } },
  { id: 'exercise', name: 'Зарядка', emoji: '🏃', desc: 'Пробежка по набережной', effects: { health: 15, energy: -10, sanity: 8, bowel: -20, bladder: -10 }, audienceEffects: { biohackers: 1, haters: -1 } },
  { id: 'toilet', name: 'В туалет', emoji: '🚽', desc: 'Необходимость', effects: { bladder: 50, bowel: 50, energy: -2 } },
  { id: 'eat', name: 'Поесть', emoji: '🍜', desc: 'Корейская кухня Владивостока', effects: { energy: 15, health: 5, money: -300, bowel: -15, sanity: 3 } },
  { id: 'rehearsal', name: 'Репетиция с группой', emoji: '🎸', desc: 'С "Комплексными числами"', effects: { operaProgress: 2, energy: -20, sanity: 3, focus: -10 }, audienceEffects: { musicians: 4, intellectuals: 1 } },
  { id: 'biohack', name: 'Биохакинг', emoji: '🧬', desc: 'Измерять показатели', effects: { health: 5, sanity: -5, energy: -10, money: -500 }, audienceEffects: { biohackers: 5, schizos: 2, haters: 1 } },
  { id: 'interview', name: 'Дать интервью', emoji: '🎤', desc: 'О трансгуманизме прессе', effects: { popularity: 8, energy: -15, sanity: -3 }, audienceEffects: { normies: 5, intellectuals: 3, hamsters: 4, haters: 2 } },
  { id: 'walk_vladivostok', name: 'Гулять по Владивостоку', emoji: '🌊', desc: 'Золотой мост, бухта', effects: { sanity: 15, creativity: 10, health: 5, energy: -8, bladder: -8, bowel: -5 } },
  { id: 'argue_online', name: 'Спорить в интернете', emoji: '⚔️', desc: 'Доказывать что сознание — это...', effects: { sanity: -10, energy: -10, popularity: 2 }, audienceEffects: { trolls: 3, intellectuals: -1, haters: 4, schizos: 3 } },
  { id: 'meditate', name: 'Медитация', emoji: '🧘', desc: 'Понять сознание изнутри', effects: { sanity: 20, focus: 10, energy: 5, creativity: 5 }, audienceEffects: { biohackers: 1, schizos: -1 } },
  { id: 'compose_electronic', name: 'Электронная музыка', emoji: '🎛️', desc: 'Эксперименты с синтезаторами', effects: { operaProgress: 3, creativity: 10, energy: -15, focus: -8 }, audienceEffects: { schizos: 3, biohackers: 2, musicians: 2 } },
  { id: 'podcast', name: 'Записать подкаст', emoji: '🎙️', desc: 'О трансгуманизме', effects: { popularity: 6, energy: -12, sanity: -2, money: 300 }, audienceEffects: { intellectuals: 4, biohackers: 3, normies: 2, hamsters: 2 } },
];

// ================================================================
// UNIVERSAL EVENT SYSTEM
// ================================================================
// CONDITIONS — what must be true for event to fire
// FLAGS — persistent state variables set/checked by events
// CHAINS — events can trigger other events with delay
// ================================================================

export interface EventCondition {
  // Flag-based conditions
  flags?: string[];         // all these flags must be SET
  noFlags?: string[];       // all these flags must NOT be set
  // Character conditions
  minRelation?: { [charId: string]: number };
  maxRelation?: { [charId: string]: number };
  inBand?: string[];        // these characters must be in band
  notInBand?: string[];     // these characters must NOT be in band
  // State conditions
  minDay?: number;
  maxDay?: number;
  minMoney?: number;
  maxMoney?: number;
  minPopularity?: number;
  maxPopularity?: number;
  operaIndex?: number;      // current opera index must equal this
  minOperaProgress?: number;
  minHealth?: number;
  maxHealth?: number;
  minSanity?: number;
  maxSanity?: number;
  // Substance conditions
  hasAddiction?: string[];   // has addiction to these substances
  totalDosesMin?: number;    // total lifetime doses across all substances
}

export interface EventChoice {
  text: string;
  effects: { money?: number; popularity?: number; health?: number; sanity?: number; energy?: number; operaProgress?: number; focus?: number; creativity?: number; bladder?: number; bowel?: number };
  audienceEffects?: { [groupId: string]: number };
  relationEffects?: { [charId: string]: number };
  message: string;
  // Universal modular fields
  setsFlags?: string[];      // flags to SET when this choice is picked
  removesFlags?: string[];   // flags to REMOVE
  triggersEventId?: string;  // queue another event
  triggersDelay?: number;    // days until triggered event (default 1)
}

export interface GameEvent {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  characterId?: string;
  // Conditions for this event to appear
  condition?: EventCondition;
  // Is this a chain event (triggered by another event)?
  isChainEvent?: boolean;     // if true, only fires when triggered, not randomly
  // Once-only event?
  unique?: boolean;           // if true, can only fire once (auto-sets flag `event_done_{id}`)
  // Category for easy organization
  category?: 'random' | 'character' | 'opera' | 'drugs' | 'chain';
  choices: EventChoice[];
}

export const EVENTS: GameEvent[] = [
  // ============================
  // RANDOM EVENTS (always pool)
  // ============================
  {
    id: 'troll_attack', title: 'Набег троллей', emoji: '👹', category: 'random',
    desc: 'Тролли набежали в комменты: опера — отстой.',
    choices: [
      { text: 'Игнорировать', effects: { sanity: -5 }, audienceEffects: { trolls: -2 }, message: 'Стоически молчишь. Тролли скучают.' },
      { text: 'Ответить щитпостом', effects: { sanity: -10, popularity: 3 }, audienceEffects: { trolls: 5, hamsters: 3, intellectuals: -3 }, message: 'Эпичная перебранка! Охваты!', setsFlags: ['shitpost_war'] },
      { text: 'Философский ответ', effects: { energy: -10, sanity: 5 }, audienceEffects: { intellectuals: 5, trolls: -3, schizos: 2 }, message: 'Тролли в замешательстве от Канта.' },
    ],
  },
  {
    id: 'troll_retaliation', title: 'Тролли мстят!', emoji: '👹💥', category: 'chain',
    desc: 'После твоего щитпоста тролли организовали рейд! Тысячи ботов атакуют.',
    isChainEvent: true,
    condition: { flags: ['shitpost_war'] },
    choices: [
      { text: 'Хакнуть ботов (Боб!)', effects: { money: -500 }, relationEffects: { hacker_bob: 10 }, audienceEffects: { trolls: -5, biohackers: 3 }, message: 'Боб вырубил ботнет. Тролли в шоке.', removesFlags: ['shitpost_war'], setsFlags: ['troll_war_won'] },
      { text: 'Удалить аккаунт', effects: { popularity: -10, sanity: 10 }, audienceEffects: { trolls: -10, hamsters: -5 }, message: 'Нет аккаунта — нет проблем... и подписчиков.', removesFlags: ['shitpost_war'] },
      { text: 'Терпеть и ждать', effects: { sanity: -15 }, audienceEffects: { trolls: 3, haters: 5 }, message: 'Рейд продолжается неделю...' },
    ],
  },
  {
    id: 'donor_appears', title: 'Щедрый донатер', emoji: '💰', category: 'random',
    desc: 'Анонимный донатер хочет поддержать оперу, но просит рекламу криптовалюты.',
    choices: [
      { text: 'Взять деньги с рекламой', effects: { money: 10000, operaProgress: -3 }, audienceEffects: { intellectuals: -5, hamsters: 2, haters: 3 }, message: 'Деньги есть, опера пострадала.', setsFlags: ['sold_out'] },
      { text: 'Отказать', effects: { sanity: 5 }, audienceEffects: { intellectuals: 3, musicians: 2 }, message: 'Искусство не продаётся!' },
      { text: 'Взять и обмануть', effects: { money: 10000, sanity: -10 }, audienceEffects: { trolls: 3 }, message: 'Хитрый ход. Совесть скрипит.', setsFlags: ['scammed_donor'] },
    ],
  },
  {
    id: 'scammed_donor_revenge', title: 'Обманутый донатер', emoji: '😡💰', category: 'chain',
    desc: 'Донатер узнал что ты его кинул. Он оказался крипто-китом с армией подписчиков.',
    isChainEvent: true,
    condition: { flags: ['scammed_donor'] },
    choices: [
      { text: 'Вернуть деньги', effects: { money: -15000 }, audienceEffects: { haters: -3 }, message: 'Пришлось отдать с процентами...', removesFlags: ['scammed_donor'] },
      { text: 'Стоять на своём', effects: { popularity: -15, sanity: -10 }, audienceEffects: { haters: 15, trolls: 10 }, message: 'Он натравил армию хейтеров!' },
    ],
  },
  {
    id: 'dvfu_invite', title: 'Приглашение из ДВФУ', emoji: '🏛️', category: 'random',
    desc: 'Профессор Иванов приглашает на лекцию о квалиа.',
    condition: { minRelation: { prof_ivanov: 20 } },
    choices: [
      { text: 'Согласиться', effects: { popularity: 5, money: 3000, energy: -20 }, audienceEffects: { intellectuals: 8, biohackers: 3 }, relationEffects: { prof_ivanov: 10 }, message: 'Блестящая лекция!', setsFlags: ['dvfu_lecture_done'] },
      { text: 'Нет сил', effects: {}, relationEffects: { prof_ivanov: -10 }, message: 'Иванов разочарован.' },
    ],
  },
  {
    id: 'drug_bust', title: 'Проверка полиции', emoji: '🚔', category: 'random',
    desc: 'Участковый стучит. "Странные запахи", говорят соседи.',
    condition: { totalDosesMin: 5 },
    choices: [
      { text: 'Открыть и быть вежливым', effects: { sanity: -10, energy: -5 }, message: 'Ничего не нашёл. Фух.' },
      { text: 'Не открывать', effects: { sanity: -15 }, message: 'Ушёл... вернётся ли?', setsFlags: ['police_suspicious'] },
      { text: 'Угостить чаем', effects: { sanity: -5, money: -200 }, message: 'Фанат электронной музыки. Мир тесен.', setsFlags: ['cop_friend'] },
    ],
  },
  {
    id: 'police_raid', title: 'Обыск!', emoji: '🚨', category: 'chain',
    desc: 'Полиция пришла с обыском! Нашли "витаминки" Боба.',
    isChainEvent: true,
    condition: { flags: ['police_suspicious'], totalDosesMin: 10 },
    choices: [
      { text: 'Позвонить Мухину (адвокат)', effects: { money: -10000 }, relationEffects: { mukhin: -10 }, message: 'Мухин нашёл адвоката. Дорого.', removesFlags: ['police_suspicious'], setsFlags: ['police_cleared'] },
      { text: 'Позвонить Бобу', effects: { money: -5000 }, relationEffects: { hacker_bob: 15 }, message: 'Боб "решил вопрос". Не спрашивай.', removesFlags: ['police_suspicious'] },
      { text: 'Сдать Боба', effects: { sanity: -20 }, relationEffects: { hacker_bob: -100 }, message: 'Боб в ярости. Ты потерял друга. И может быть больше.', removesFlags: ['police_suspicious'], setsFlags: ['betrayed_bob'] },
    ],
  },
  {
    id: 'viral_post', title: 'Вирусный пост', emoji: '📱', category: 'random',
    desc: 'Твой старый пост о сознании завирусился!',
    choices: [
      { text: 'Развить тему', effects: { popularity: 10, energy: -10 }, audienceEffects: { intellectuals: 5, schizos: 5, hamsters: 8, normies: 5 }, message: '100К просмотров!' },
      { text: 'Проигнорировать', effects: { popularity: 3 }, audienceEffects: { hamsters: 3 }, message: 'Волна прошла.' },
    ],
  },
  {
    id: 'concert_offer', title: 'Предложение концерта', emoji: '🎤', category: 'random',
    desc: 'Клуб "Мумий Тролль" предлагает выступить.',
    choices: [
      { text: 'Согласиться', effects: { money: 5000, popularity: 8, energy: -30 }, audienceEffects: { musicians: 5, normies: 5, hamsters: 3 }, message: 'Зал полон!' },
      { text: 'Нет сил', effects: {}, message: 'В другой раз...' },
      { text: 'На своих условиях', effects: { money: 8000, popularity: 5, energy: -25, sanity: -5 }, audienceEffects: { musicians: 3, intellectuals: 2 }, message: 'Только оперу. Согласились.' },
    ],
  },
  {
    id: 'rain_vladivostok', title: 'Тайфун во Владивостоке', emoji: '🌧️', category: 'random',
    desc: 'Мощный тайфун. Электричество мигает.',
    choices: [
      { text: 'Работать при свечах', effects: { creativity: 15, sanity: -5, operaProgress: 3 }, message: 'Романтично! Шедевральная ария!' },
      { text: 'Лечь спать', effects: { energy: 30, health: 5 }, message: 'Под дождь спится отлично.' },
    ],
  },
  {
    id: 'inspiration_strike', title: 'Вдохновение!', emoji: '✨', category: 'random',
    desc: 'Среди ночи — гениальная музыкальная идея!',
    choices: [
      { text: 'Вскочить и записать!', effects: { operaProgress: 8, energy: -20, creativity: 15, sanity: -3 }, message: 'Четыре часа — целая сцена!' },
      { text: 'Записать голосовое', effects: { operaProgress: 3, energy: -5 }, message: 'Утром разберёшь... если сможешь.' },
    ],
  },
  {
    id: 'chinese_tourists', title: 'Китайские туристы', emoji: '🇨🇳', category: 'random',
    desc: 'Китайские туристы узнали тебя на улице!',
    condition: { minPopularity: 30 },
    choices: [
      { text: 'Фото с улыбкой', effects: { popularity: 3, energy: -3, sanity: 3 }, message: 'Разлетелось по Weibo!' },
      { text: 'Убежать', effects: { energy: -5, health: 3 }, message: 'Кардио!' },
    ],
  },

  // ============================
  // CHARACTER EVENTS — with conditions
  // ============================

  // --- АРИЭЛЬ серия ---
  {
    id: 'ariel_drama', title: 'Ариэль: Драма на репетиции', emoji: '🎭', category: 'character', characterId: 'ariel',
    desc: 'Ариэль угрожает уйти если не поменять аранжировку!',
    condition: { inBand: ['ariel'] },
    choices: [
      { text: 'Уступить', effects: { operaProgress: -2, sanity: -5 }, relationEffects: { ariel: 15 }, message: 'Ариэль довольна. Ты — тряпка.' },
      { text: 'Стоять на своём', effects: { sanity: -3 }, relationEffects: { ariel: -20 }, message: 'Хлопает дверью. Звенит стакан.', setsFlags: ['ariel_angry'] },
      { text: 'Компромисс', effects: { energy: -10, operaProgress: -1 }, relationEffects: { ariel: 5, mitrofanov: 5 }, message: 'Все почти довольны.' },
    ],
  },
  {
    id: 'ariel_quits', title: 'Ариэль уходит!', emoji: '😤👩‍🎤', category: 'chain', characterId: 'ariel',
    desc: 'После ссоры Ариэль заявляет что уходит из группы навсегда!',
    isChainEvent: true,
    condition: { flags: ['ariel_angry'], inBand: ['ariel'], maxRelation: { ariel: 10 } },
    unique: true,
    choices: [
      { text: 'Умолять остаться', effects: { sanity: -15, energy: -10 }, relationEffects: { ariel: 10 }, message: 'Ариэль соглашается... на своих условиях.', removesFlags: ['ariel_angry'], setsFlags: ['ariel_diva'] },
      { text: 'Пусть уходит', effects: { sanity: -5 }, relationEffects: { ariel: -30 }, message: 'Ариэль ушла. Тишина в студии.', removesFlags: ['ariel_angry'], setsFlags: ['ariel_left'] },
      { text: 'Подарить кристалл (5000₽)', effects: { money: -5000 }, relationEffects: { ariel: 25 }, message: 'Ариэль рыдает от счастья. "Живая энергия!"', removesFlags: ['ariel_angry'] },
    ],
  },
  {
    id: 'ariel_return', title: 'Ариэль хочет вернуться', emoji: '👩‍🎤💕', category: 'chain', characterId: 'ariel',
    desc: 'Ариэль звонит: "Я скучаю по группе... можно вернуться?"',
    isChainEvent: true,
    condition: { flags: ['ariel_left'], notInBand: ['ariel'], minDay: 5 },
    unique: true,
    choices: [
      { text: 'Конечно!', effects: { sanity: 10 }, relationEffects: { ariel: 20 }, message: 'Ариэль вернулась! Группа снова полна!', removesFlags: ['ariel_left'] },
      { text: 'Нет, без тебя лучше', effects: { sanity: -5 }, relationEffects: { ariel: -40 }, message: 'Ариэль плачет. Ты чувствуешь себя монстром.' },
    ],
  },
  {
    id: 'ariel_conflict_removed', title: 'Конфликт с Ариэль', emoji: '😢👩‍🎤', category: 'character', characterId: 'ariel',
    desc: 'Ариэль узнала что ты убрал её из группы. Она в ярости и рыдает одновременно.',
    condition: { notInBand: ['ariel'], minRelation: { ariel: -50 } },
    unique: true,
    choices: [
      { text: 'Объяснить причины', effects: { energy: -10 }, relationEffects: { ariel: -10 }, message: '"Ты предатель!" — но немного успокоилась.' },
      { text: 'Извиниться', effects: { sanity: -5 }, relationEffects: { ariel: 15 }, message: 'Ариэль всё ещё обижена, но ценит извинение.' },
      { text: 'Пригласить обратно', effects: {}, relationEffects: { ariel: 30 }, message: 'Ариэль сияет! "Я знала что ты одумаешься!"' },
    ],
  },

  // --- ОЛИВИЯ серия ---
  {
    id: 'olivia_glitch', title: 'Оливия: Сбой системы', emoji: '⚡', category: 'character', characterId: 'olivia',
    desc: 'У Оливии глючит нейроинтерфейс во время концерта!',
    condition: { inBand: ['olivia'] },
    choices: [
      { text: 'Перезагрузить', effects: { energy: -15, focus: -10 }, relationEffects: { olivia: 15 }, message: 'Ребут успешен.' },
      { text: 'Заменить Митрофановым', effects: {}, relationEffects: { olivia: -25, mitrofanov: 15 }, message: 'Оливия обижена. Митрофанов сияет.' },
      { text: 'Импровизировать', effects: { creativity: 15, energy: -20 }, relationEffects: { olivia: -10 }, audienceEffects: { musicians: 3, schizos: 5 }, message: 'Хаотичная импровизация!' },
    ],
  },
  {
    id: 'olivia_upgrade_event', title: 'Оливия: Апгрейд нейроинтерфейса', emoji: '🧠🔧', category: 'character', characterId: 'olivia',
    desc: 'Оливия нашла новый чип за 15000₽. Обещает революцию в звуке!',
    condition: { inBand: ['olivia'], minRelation: { olivia: 30 }, minMoney: 15000 },
    unique: true,
    choices: [
      { text: 'Оплатить апгрейд', effects: { money: -15000 }, relationEffects: { olivia: 30 }, message: 'Новый звук НЕВЕРОЯТНЫЙ!', setsFlags: ['olivia_upgraded'], audienceEffects: { biohackers: 10, musicians: 5, schizos: 3 } },
      { text: 'Нет денег на эксперименты', effects: {}, relationEffects: { olivia: -15 }, message: 'Оливия разочарована.' },
    ],
  },

  // --- МИТРОФАНОВ серия ---
  {
    id: 'mitrofanov_drunk', title: 'Митрофанов: Опять коньяк', emoji: '🥃', category: 'character', characterId: 'mitrofanov',
    desc: 'Митрофанов пришёл на репетицию пьяный. Красиво, но шатается.',
    condition: { inBand: ['mitrofanov'] },
    choices: [
      { text: 'Дать допеть', effects: { operaProgress: 3, creativity: 5 }, relationEffects: { mitrofanov: 10, sasha: -10 }, message: 'Пьяный Митрофанов — другой уровень.' },
      { text: 'Отправить домой', effects: { sanity: -3 }, relationEffects: { mitrofanov: -15 }, message: 'Уходит, бормоча проклятия.' },
      { text: 'Серьёзный разговор', effects: { energy: -10 }, relationEffects: { mitrofanov: -5, sasha: 5 }, message: 'Обещает исправиться.', setsFlags: ['mitro_warned'] },
    ],
  },
  {
    id: 'mitrofanov_vs_olivia', title: 'Митрофанов vs Оливия', emoji: '🎙️⚡🤖', category: 'character',
    desc: 'Митрофанов назвал вокодер Оливии "жестяной мусоркой". Оливия предложила заменить его синтезатором.',
    condition: { inBand: ['mitrofanov', 'olivia'] },
    unique: true,
    choices: [
      { text: 'Поддержать Митрофанова', effects: { sanity: -5 }, relationEffects: { mitrofanov: 15, olivia: -20 }, message: 'Митрофанов торжествует. Оливия молчит. Опасно.' },
      { text: 'Поддержать Оливию', effects: { sanity: -5 }, relationEffects: { olivia: 15, mitrofanov: -20 }, message: 'Оливия довольна. Митрофанов пьёт коньяк.' },
      { text: 'Примирить', effects: { energy: -15, sanity: -10 }, relationEffects: { mitrofanov: 5, olivia: 5 }, message: 'Три часа переговоров. Хрупкий мир.' },
    ],
  },

  // --- МУХИН ---
  {
    id: 'mukhin_offer', title: 'Мухин: Корпоративный заказ', emoji: '📊', category: 'character', characterId: 'mukhin',
    desc: 'Мухин нашёл клиента — опера для тимбилдинга. 50,000₽.',
    condition: { inBand: ['mukhin'] },
    choices: [
      { text: 'Согласиться', effects: { money: 50000, sanity: -15, operaProgress: -5 }, relationEffects: { mukhin: 15, ariel: -10, tomilov: -10 }, message: 'Опера для тимбилдинга. Серьёзно.', audienceEffects: { intellectuals: -5, haters: 5 }, setsFlags: ['sold_out'] },
      { text: 'Отказать', effects: { sanity: 5 }, relationEffects: { mukhin: -15 }, audienceEffects: { intellectuals: 3 }, message: '"Ты мог быть БОГАТЫМ!"' },
      { text: 'Контроффер', effects: { money: 20000, energy: -10 }, relationEffects: { mukhin: 5 }, message: 'Меньше денег, больше свободы.' },
    ],
  },

  // --- ДАНТЕСИК ---
  {
    id: 'dantesik_trouble', title: 'Дантесик: Проблемы с законом', emoji: '🚔', category: 'character', characterId: 'dantesik',
    desc: 'Звонит в 3 ночи: "Бро, забери из отделения."',
    choices: [
      { text: 'Поехать выручить', effects: { energy: -20, money: -5000, sanity: -10 }, relationEffects: { dantesik: 25 }, message: 'Он должен тебе. Говорит.' },
      { text: 'Пусть сидит', effects: { sanity: -5 }, relationEffects: { dantesik: -30 }, message: 'Не простил. Но ты выспался.' },
      { text: 'Позвонить Бобу', effects: { money: -2000 }, relationEffects: { dantesik: 15, hacker_bob: 5 }, message: 'Боб "решил". Не спрашивай.' },
    ],
  },
  {
    id: 'dantesik_big_concert', title: 'Дантесик: Мега-концерт!', emoji: '🎪🎩', category: 'character', characterId: 'dantesik',
    desc: 'Дантесик организовал концерт на 5000 человек! Но нужно 20000₽ аванса.',
    condition: { inBand: ['dantesik'], minRelation: { dantesik: 30 }, minMoney: 20000, minPopularity: 40 },
    unique: true,
    choices: [
      { text: 'Вложить 20000₽', effects: { money: -20000 }, message: 'Концерт через 3 дня!', setsFlags: ['mega_concert_planned'], triggersEventId: 'mega_concert', triggersDelay: 3 },
      { text: 'Слишком рискованно', effects: {}, relationEffects: { dantesik: -15 }, message: 'Дантесик расстроен.' },
    ],
  },
  {
    id: 'mega_concert', title: 'МЕГА-КОНЦЕРТ!', emoji: '🎆🎤', category: 'chain',
    desc: '5000 человек! Зал гудит! Момент славы!',
    isChainEvent: true,
    condition: { flags: ['mega_concert_planned'] },
    choices: [
      { text: 'Выступить на максимуме', effects: { money: 80000, popularity: 30, energy: -40, health: -10 }, audienceEffects: { hamsters: 15, normies: 10, musicians: 8, intellectuals: 5 }, message: 'ЛЕГЕНДА! Зал в экстазе! 80000₽ за ночь!', removesFlags: ['mega_concert_planned'], setsFlags: ['mega_concert_done'] },
      { text: 'Осторожное выступление', effects: { money: 40000, popularity: 15, energy: -20 }, audienceEffects: { hamsters: 5, normies: 5, musicians: 3 }, message: 'Хорошо, но не идеально.', removesFlags: ['mega_concert_planned'] },
    ],
  },

  // --- ТОМИЛОВ ---
  {
    id: 'tomilov_idea', title: 'Томилов: Безумная идея', emoji: '💡', category: 'character', characterId: 'tomilov',
    desc: '"Я придумал финал для оперы! Нужно переписать ВСЁ!"',
    condition: { minRelation: { tomilov: 20 } },
    choices: [
      { text: 'Переписать финал', effects: { operaProgress: -15, creativity: 25, energy: -20 }, relationEffects: { tomilov: 20 }, message: 'Новый финал ГЕНИАЛЕН.', audienceEffects: { intellectuals: 5, schizos: 3 }, setsFlags: ['tomilov_genius_finale'] },
      { text: 'Отказать', effects: {}, relationEffects: { tomilov: -10 }, message: 'Грустит, но понимает.' },
      { text: 'Адаптировать', effects: { operaProgress: -5, creativity: 15, energy: -10 }, relationEffects: { tomilov: 10 }, message: 'Компромисс сработал!' },
    ],
  },
  {
    id: 'tomilov_novel_movie', title: 'Томилов: Экранизация!', emoji: '🎬📚', category: 'chain', characterId: 'tomilov',
    desc: 'Роман Томилова хотят экранизировать! Он предлагает написать саундтрек!',
    isChainEvent: true,
    condition: { flags: ['tomilov_genius_finale'], minRelation: { tomilov: 40 } },
    unique: true,
    choices: [
      { text: 'Написать саундтрек!', effects: { money: 30000, popularity: 20, energy: -30, creativity: 15 }, relationEffects: { tomilov: 25 }, message: 'Саундтрек к фильму! Мировой уровень!', audienceEffects: { intellectuals: 10, normies: 8, musicians: 5 } },
      { text: 'Нет времени', effects: {}, relationEffects: { tomilov: -20 }, message: 'Упущенная возможность...' },
    ],
  },

  // --- ВОЛАЛИЭЛЬ ---
  {
    id: 'volaliel_prophecy_event', title: 'Волалиэль: Пророчество', emoji: '🔮', category: 'character', characterId: 'volaliel',
    desc: '"МАТРИЦА ТРЕЩИТ! СКОРО ВСЁ ИЗМЕНИТСЯ!!!"',
    choices: [
      { text: 'Выслушать', effects: { creativity: 20, sanity: -15, energy: -10 }, relationEffects: { volaliel: 15 }, audienceEffects: { schizos: 5 }, message: 'Три часа безумных откровений.' },
      { text: 'Дать чай', effects: { energy: -5, sanity: 5 }, relationEffects: { volaliel: 5 }, message: 'Успокоился. "Дам знак, когда придёт время."' },
      { text: 'Записать на камеру', effects: { popularity: 5, energy: -5 }, relationEffects: { volaliel: -5 }, audienceEffects: { schizos: 8, trolls: 5, haters: 3 }, message: 'Видео завирусилось!' },
    ],
  },
  {
    id: 'volaliel_dimension_rift', title: 'Волалиэль: Разрыв реальности', emoji: '🌀⚡', category: 'character', characterId: 'volaliel',
    desc: 'Волалиэль утверждает что открыл портал в параллельную вселенную в подвале студии.',
    condition: { minRelation: { volaliel: 30 } },
    unique: true,
    choices: [
      { text: 'Пойти посмотреть', effects: { creativity: 40, sanity: -30, health: -5 }, relationEffects: { volaliel: 25 }, message: 'Это была... дыра в стене. Но ты ВИДЕЛ нечто. Или нет?', audienceEffects: { schizos: 15 }, setsFlags: ['saw_portal'] },
      { text: 'Вызвать врача', effects: { sanity: 5 }, relationEffects: { volaliel: -30 }, message: 'Волалиэль обижен. "ТЫ НЕ ГОТОВ!"' },
      { text: 'Привести Томилова', effects: { creativity: 20, sanity: -15, energy: -10 }, relationEffects: { volaliel: 15, tomilov: 10 }, message: 'Томилов в восторге! Новая глава романа!', audienceEffects: { schizos: 8, intellectuals: 3 } },
    ],
  },

  // --- САША ---
  {
    id: 'sasha_intervention', title: 'Саша: Интервенция', emoji: '🥦', category: 'character', characterId: 'sasha',
    desc: 'Пришёл с плакатами "СТОП НООТРОПЫ" и смузи.',
    condition: { totalDosesMin: 3 },
    choices: [
      { text: 'Выпить смузи', effects: { health: 10, sanity: 5, energy: 5 }, relationEffects: { sasha: 15, hacker_bob: -5 }, message: 'Спирулина и шпинат. Трава на вкус. Саша счастлив.' },
      { text: 'Спорить о биохакинге', effects: { sanity: -10, energy: -10 }, relationEffects: { sasha: -15 }, audienceEffects: { biohackers: 3, haters: 2 }, message: 'Эпичный спор! Оба красные.' },
      { text: 'Пообещать меньше', effects: { sanity: 3 }, relationEffects: { sasha: 10 }, message: 'Верит. Ну... на сегодня без модафинила.' },
    ],
  },
  {
    id: 'sasha_marathon', title: 'Саша: Марафон!', emoji: '🏃‍♂️🏆', category: 'character', characterId: 'sasha',
    desc: 'Саша зовёт на марафон по Владивостоку! 42 км! С прессой!',
    condition: { inBand: ['sasha'], minRelation: { sasha: 40 } },
    unique: true,
    choices: [
      { text: 'Пробежать!', effects: { health: 20, energy: -50, sanity: 15, popularity: 10 }, relationEffects: { sasha: 30 }, message: 'Ты ВЫЖИЛ! Еле-еле, но выжил. Саша гордится!', audienceEffects: { normies: 5, biohackers: 5, haters: -3 }, setsFlags: ['marathon_done'] },
      { text: 'Пробежать 5 км', effects: { health: 10, energy: -20, sanity: 5, popularity: 3 }, relationEffects: { sasha: 10 }, message: 'Хотя бы попытался.' },
      { text: 'Нет, я композитор', effects: {}, relationEffects: { sasha: -15 }, message: 'Саша разочарован. "Тело — храм!"' },
    ],
  },

  // --- ЖЕКА ---
  {
    id: 'zheka_startup', title: 'Жека: Стартап', emoji: '🚀', category: 'character', characterId: 'zheka',
    desc: 'Приложение "Uber для ноотропов". Нужны инвестиции.',
    choices: [
      { text: 'Вложить 10,000₽', effects: { money: -10000 }, relationEffects: { zheka: 20 }, message: 'Обещает x10. Как обычно.', setsFlags: ['zheka_startup_invested'], triggersEventId: 'zheka_startup_result', triggersDelay: 5 },
      { text: 'Отказать', effects: {}, relationEffects: { zheka: -10 }, message: 'Расстроился, но не обиделся.' },
      { text: 'Помочь кодом', effects: { energy: -15 }, relationEffects: { zheka: 15 }, audienceEffects: { biohackers: 2 }, message: 'Пару вечеров за кодом.' },
    ],
  },
  {
    id: 'zheka_startup_result', title: 'Жека: Результат стартапа', emoji: '📈📉', category: 'chain', characterId: 'zheka',
    desc: 'Стартап Жеки запустился! Результаты...',
    isChainEvent: true,
    condition: { flags: ['zheka_startup_invested'] },
    choices: [
      { text: 'Проверить баланс', effects: { money: Math.random() > 0.5 ? 30000 : -5000 }, message: Math.random() > 0.5 ? 'ПРИБЫЛЬ! Стартап взлетел! +30000₽' : 'Стартап провалился... -5000₽ на серверах.', removesFlags: ['zheka_startup_invested'] },
    ],
  },

  // --- БОБ ---
  {
    id: 'bob_darkweb', title: 'Боб: Тёмное предложение', emoji: '🕶️', category: 'character', characterId: 'hacker_bob',
    desc: '"Экспериментальный ноотроп" из тёмной лаборатории. "100% safe, бро."',
    choices: [
      { text: 'Попробовать', effects: { focus: 30, creativity: 30, health: -15, sanity: -20 }, relationEffects: { hacker_bob: 10, sasha: -15 }, message: 'ВАУ. Цвета ярче. Музыка в голове. Гениально... или ужасно.', audienceEffects: { biohackers: 5, schizos: 3 }, setsFlags: ['dark_nootropic'] },
      { text: 'Отказаться', effects: { sanity: 5 }, relationEffects: { hacker_bob: -5 }, message: 'Благоразумие победило.' },
      { text: 'Отдать на анализ', effects: { money: -2000, energy: -5 }, relationEffects: { hacker_bob: -10 }, message: 'Результаты... лучше бы не знал.', setsFlags: ['analyzed_bobs_stuff'] },
    ],
  },
  {
    id: 'bob_analyzed_result', title: 'Результаты анализа', emoji: '🔬🕶️', category: 'chain',
    desc: 'Результаты из лаборатории: "препарат" Боба содержит экспериментальные нейропептиды. Это может быть прорывом... или катастрофой.',
    isChainEvent: true,
    condition: { flags: ['analyzed_bobs_stuff'] },
    unique: true,
    choices: [
      { text: 'Опубликовать результаты', effects: { popularity: 15, money: 5000 }, relationEffects: { hacker_bob: -30, prof_ivanov: 15 }, audienceEffects: { biohackers: 10, intellectuals: 5, schizos: 8 }, message: 'Сенсация! Боб в ярости!', removesFlags: ['analyzed_bobs_stuff'] },
      { text: 'Скрыть', effects: { sanity: -5 }, message: 'Что не знаешь, то не убьёт... наверное.', removesFlags: ['analyzed_bobs_stuff'] },
    ],
  },

  // --- МАРИНА ---
  {
    id: 'marina_article', title: 'Марина: Статья', emoji: '📰', category: 'character', characterId: 'marina',
    desc: '"Гений или безумец? Виктор Аргонов — композитор на ноотропах"',
    choices: [
      { text: 'Поблагодарить', effects: { popularity: 10, sanity: -5 }, relationEffects: { marina: 10 }, audienceEffects: { normies: 8, hamsters: 5, biohackers: 5, haters: 5 }, message: 'Статья наделала шума!' },
      { text: 'Потребовать удалить', effects: { sanity: -10 }, relationEffects: { marina: -25 }, audienceEffects: { trolls: 3 }, message: '"Свобода прессы, Виктор."' },
      { text: 'Ответная статья', effects: { energy: -15, popularity: 5 }, relationEffects: { marina: -5 }, audienceEffects: { intellectuals: 8, biohackers: 3 }, message: 'Глубокая и аргументированная.' },
    ],
  },

  // ============================
  // OPERA-RELATED EVENTS
  // ============================
  {
    id: 'opera1_premiere', title: 'Премьера: 2032', emoji: '🎭🎉', category: 'opera',
    desc: 'Опера "2032: Легенда о несбывшемся грядущем" готова к премьере! Зал ДВФУ полон!',
    isChainEvent: true,
    condition: { operaIndex: 0, minOperaProgress: 95 },
    unique: true,
    choices: [
      { text: 'Грандиозная премьера!', effects: { popularity: 20, money: 10000, energy: -30, sanity: 10 }, audienceEffects: { intellectuals: 10, musicians: 8, schizos: 5, normies: 5 }, message: 'СТОЯЧИЕ ОВАЦИИ! Критики в восторге!', setsFlags: ['opera1_premiered'] },
      { text: 'Скромная премьера', effects: { popularity: 8, money: 3000, energy: -15 }, audienceEffects: { intellectuals: 5, musicians: 3 }, message: 'Тихо, но достойно.' },
    ],
  },
  {
    id: 'opera2_crisis', title: 'Кризис "Пепла и воды"', emoji: '🎼😰', category: 'opera',
    desc: 'На половине второй оперы — творческий тупик. Ноты не складываются.',
    condition: { operaIndex: 1, minOperaProgress: 50 },
    unique: true,
    choices: [
      { text: 'Сжечь и начать заново', effects: { operaProgress: -30, creativity: 30, sanity: -20 }, message: 'Из пепла рождается новое!', setsFlags: ['opera2_restarted'] },
      { text: 'Продолжить через силу', effects: { sanity: -15, energy: -20, operaProgress: 5 }, message: 'Тяжело... но дисциплина.' },
      { text: 'Попросить Волалиэля о ритуале', effects: { creativity: 35, sanity: -25, operaProgress: 10 }, relationEffects: { volaliel: 15 }, message: 'БЕЗУМИЕ! Но мелодия пришла!', audienceEffects: { schizos: 5 } },
    ],
  },
  {
    id: 'opera3_eureka', title: 'Прорыв: Синтетическая душа', emoji: '✨🎼', category: 'opera',
    desc: 'Среди ночи — озарение! Ты понял как закончить "Синтетическую душу"! Это будет ШЕДЕВР!',
    condition: { operaIndex: 2, minOperaProgress: 150 },
    unique: true,
    choices: [
      { text: 'Работать 48 часов без перерыва!', effects: { operaProgress: 50, energy: -60, health: -20, sanity: -15, creativity: 30 }, message: 'ДВА ДНЯ. Не ел, не спал. Но ФИНАЛ ГОТОВ.', setsFlags: ['opera3_finale_ready'] },
      { text: 'Записать идею и спать', effects: { operaProgress: 15, creativity: 10, energy: 5 }, message: 'Мудрый выбор. Идея никуда не денется.' },
    ],
  },

  // ============================
  // DRUG EVENTS
  // ============================
  {
    id: 'addiction_crisis', title: 'Ломка', emoji: '🤮', category: 'drugs',
    desc: 'Тело требует дозу. Руки трясутся. Не можешь сосредоточиться.',
    condition: { hasAddiction: ['modafinil', 'phenibut', 'lyrica', 'baclofen', 'mephedrone', 'alpha_pvp'] },
    choices: [
      { text: 'Принять дозу', effects: { sanity: 5, focus: 10, health: -5 }, message: 'Временное облегчение...', setsFlags: ['gave_in_to_addiction'] },
      { text: 'Терпеть', effects: { sanity: -20, energy: -20, focus: -20, health: -5 }, message: 'Ад. Но ты сильнее.', setsFlags: ['resisted_addiction'] },
      { text: 'Попросить Сашу помочь', effects: { sanity: -10, energy: -10 }, relationEffects: { sasha: 20 }, message: 'Саша рядом. Помогает. Не осуждает (почти).', setsFlags: ['sasha_helped_addiction'] },
    ],
  },
  {
    id: 'meph_aftermath', title: 'После мефедрона', emoji: '🐱💀', category: 'drugs',
    desc: 'Утро после мефедрона. Всё болит. Мир серый. Депрессия.',
    condition: { hasAddiction: ['mephedrone'] },
    unique: false,
    choices: [
      { text: 'Ещё дозу (круг ада)', effects: { energy: 30, health: -15, sanity: -20 }, message: 'Порочный круг...', setsFlags: ['meph_spiral'] },
      { text: 'Пережить', effects: { sanity: -15, energy: -15 }, message: 'Самый тяжёлый день в жизни.' },
      { text: 'Вызвать скорую', effects: { money: -5000, health: 20, sanity: 10 }, message: 'Врачи помогли. Позор, но живой.', setsFlags: ['hospital_visit'] },
    ],
  },
  {
    id: 'alpha_nightmare', title: 'Альфа-ПВП: На грани', emoji: '💀🔥', category: 'drugs',
    desc: 'Видишь тени. Слышишь голоса. Сердце бьётся 200 ударов. Это конец?',
    condition: { hasAddiction: ['alpha_pvp'] },
    choices: [
      { text: 'Скорая помощь!', effects: { money: -10000, health: 30, sanity: 20 }, message: 'Реанимация. Едва выжил. Прессе не сказали.', setsFlags: ['near_death_experience'] },
      { text: 'Терпеть (ОПАСНО)', effects: { health: -30, sanity: -30 }, message: 'Чудом выжил. Но по ту сторону ты видел... нечто.' },
      { text: 'Позвонить Жеке', effects: { health: -10, sanity: -10 }, relationEffects: { zheka: 15 }, message: 'Жека примчался. Спас. Настоящий друг.', setsFlags: ['zheka_saved_life'] },
    ],
  },
  {
    id: 'clean_streak', title: 'Чистая полоса', emoji: '🌟', category: 'drugs',
    desc: 'Неделя без веществ! Голова ясная, тело восстанавливается.',
    condition: { flags: ['resisted_addiction'] },
    unique: true,
    choices: [
      { text: 'Продолжать!', effects: { health: 15, sanity: 15, focus: 10 }, message: 'Каждый день легче!', relationEffects: { sasha: 10 }, audienceEffects: { biohackers: 3, normies: 2 } },
    ],
  },
];

// --- OPERAS ---
export interface Opera {
  id: string;
  name: string;
  desc: string;
  requiredProgress: number;
  rewards: { money: number; popularity: number };
  audienceReaction: { [groupId: string]: number };
}

export const OPERAS: Opera[] = [
  { id: 'opera1', name: '2032: Легенда о несбывшемся грядущем', desc: 'Рок-опера о будущем, которое не наступило', requiredProgress: 100, rewards: { money: 20000, popularity: 30 }, audienceReaction: { intellectuals: 15, schizos: 10, musicians: 10, hamsters: 5, normies: 3 } },
  { id: 'opera2', name: 'Пепел и вода', desc: 'Опера о смысле сознания', requiredProgress: 150, rewards: { money: 35000, popularity: 50 }, audienceReaction: { intellectuals: 20, biohackers: 10, schizos: 15, musicians: 15, haters: 5 } },
  { id: 'opera3', name: 'Синтетическая душа', desc: 'Магнум опус — трансгуманизм и квалиа', requiredProgress: 250, rewards: { money: 60000, popularity: 80 }, audienceReaction: { intellectuals: 25, biohackers: 20, schizos: 20, musicians: 20, normies: 10, hamsters: 10, haters: 10 } },
];
