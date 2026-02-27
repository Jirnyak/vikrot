// ============================================================
// UNIVERSAL CONTENT MODULE — just add more entries to expand!
// ============================================================

// --- CHARACTERS ---
export interface CharacterPerk {
  name: string;
  desc: string;
  effect: { [key: string]: number };
}

export interface Character {
  id: string;
  name: string;
  desc: string;
  portrait: string; // emoji or image path
  color: string; // theme color for card
  naturalRoles: string[]; // roles they're naturally good at (role ids from BAND_ROLES)
  mismatchQuotes: { [roleId: string]: string }; // funny quotes for mismatched roles
  baseRelation: number;
  traits: string[];
  perks: CharacterPerk[];
  interactions: CharacterInteraction[];
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
  requiredRelation?: number; // min relation to unlock
  message: string;
}

// --- BAND ROLES ---
// Universal roles - ANYONE can be assigned to ANY role!
// But characters have naturalRoles they're actually good at.
// Mismatch = funny + debuffs; natural fit = strong buffs
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
  { id: 'admin', name: 'Админ', emoji: '🖥️', desc: 'Техническая поддержка и организация', buffs: { focus: 10, sanity: 5 } },
  { id: 'sound', name: 'Звукорежиссёр', emoji: '🎚️', desc: 'Сведение и мастеринг', buffs: { creativity: 5, focus: 7 } },
  { id: 'manager', name: 'Менеджер', emoji: '💼', desc: 'Букинг, продвижение, финансы', buffs: { popularity: 10, donateBonus: 15 } },
  { id: 'donor', name: 'Донатер', emoji: '💰', desc: 'Финансовая поддержка группы', buffs: { donateBonus: 25, popularity: 3 } },
];

export const CHARACTERS: Character[] = [
  {
    id: 'ariel', name: 'Ариэль', portrait: '👩‍🎤', color: '#e879f9',
    desc: 'Солистка с ангельским голосом и мистической аурой. Считает себя полуэльфом.',
    naturalRoles: ['solist', 'back_vocal'],
    mismatchQuotes: {
      drums: '"Ударные?! Я же ЭЛЬФ! Мои руки для арф!"',
      admin: '"Компьютеры уничтожают ауру..."',
      manager: '"Деньги — низменная энергия."',
      bass: '"Бас-гитара? Это слишком... грубо."',
      composer: '"Я не пишу ноты, я ЧУВСТВУЮ музыку."',
      donor: '"Деньги дают только те, кто не умеет ТВОРИТЬ."',
    },
    baseRelation: 40,
    traits: ['творческая', 'капризная', 'мистичная'],
    perks: [
      { name: 'Голос ангела', desc: '+15% к качеству оперы если солистка', effect: { operaBonus: 15 } },
      { name: 'Эмоциональная', desc: 'Случайные перепады настроения (-5 sanity группе)', effect: { sanityCost: -5 } },
    ],
    interactions: [
      { id: 'ariel_sing', name: 'Послушать пение', emoji: '🎵', desc: 'Попросить спеть новую арию', energyCost: 5, effects: { creativity: 15, sanity: 10 }, relationChange: 5, message: 'Ариэль поёт... и мир замирает.' },
      { id: 'ariel_argue', name: 'Спорить об аранжировке', emoji: '⚔️', desc: 'У неё СВОЁ видение', energyCost: 10, effects: { creativity: 5, sanity: -10 }, relationChange: -10, message: 'Ариэль хлопает дверью! Но идея интересная...' },
      { id: 'ariel_gift', name: 'Подарить кристалл', emoji: '💎', desc: 'Она любит мистические штуки', energyCost: 2, effects: { money: -500 }, relationChange: 20, message: 'Ариэль в восторге! Говорит, в нём "живая энергия".' },
      { id: 'ariel_collab', name: 'Совместная импровизация', emoji: '🎼', desc: 'Создать что-то вместе', energyCost: 20, effects: { operaProgress: 8, creativity: 20, sanity: -5 }, relationChange: 10, requiredRelation: 30, message: 'Магия! Вы создали нечто невероятное вдвоём!', audienceEffects: { musicians: 3, schizos: 2 } },
    ],
  },
  {
    id: 'olivia', name: 'Оливия Кибер', portrait: '🤖', color: '#22d3ee',
    desc: 'Солистка-трансгуманистка. Использует вокодер и нейроинтерфейсы. Полукиборг.',
    naturalRoles: ['solist', 'back_vocal', 'sound'],
    mismatchQuotes: {
      drums: '"Ритм-машина эффективнее. Но... ладно."',
      manager: '"Оптимизирую всё через нейросеть."',
      donor: '"Деньги — устаревший протокол. Но принимаю."',
      guitar: '"Я лучше подключу гитару к нейроинтерфейсу."',
    },
    baseRelation: 25,
    traits: ['технологичная', 'холодная', 'перфекционистка'],
    perks: [
      { name: 'Кибер-голос', desc: 'Уникальный электронный вокал, +10 к schizos', effect: { schizoBonus: 10 } },
      { name: 'Перфекционизм', desc: 'Требует больше времени на репетиции', effect: { rehearsalCost: 5 } },
    ],
    interactions: [
      { id: 'olivia_tech', name: 'Обсудить нейроинтерфейсы', emoji: '🧠', desc: 'Техно-философская беседа', energyCost: 10, effects: { focus: 10, creativity: 10 }, relationChange: 8, message: 'Оливия показывает новый чип. Будущее уже здесь!' },
      { id: 'olivia_upgrade', name: 'Помочь с апгрейдом', emoji: '🔧', desc: 'Её вокодер глючит', energyCost: 15, effects: { money: -1000 }, relationChange: 15, message: 'Вокодер починен! Оливия благодарна.', audienceEffects: { biohackers: 3 } },
      { id: 'olivia_duet', name: 'Записать кибер-дуэт', emoji: '🎹', desc: 'Человек + машина', energyCost: 25, effects: { operaProgress: 10, creativity: 15 }, relationChange: 12, requiredRelation: 20, message: 'Дуэт человека и киборга — это новое слово в музыке!', audienceEffects: { biohackers: 5, schizos: 3, musicians: 4 } },
    ],
  },
  {
    id: 'mitrofanov', name: 'Митрофанов', portrait: '🎙️', color: '#fb923c',
    desc: 'Солист-баритон старой школы. Считает электронику деградацией. Пьёт коньяк.',
    naturalRoles: ['solist', 'back_vocal'],
    mismatchQuotes: {
      keys: '"Синтезатор — это не инструмент! Это калькулятор!"',
      sound: '"Звукорежиссёр?! Я артист, а не кнопконажиматель!"',
      admin: '"Я оперный певец, а не секретарша!"',
      drums: '"Барабаны — удел дикарей. Но... ладно, для искусства."',
      donor: '"Я не буду ПЛАТИТЬ за честь быть в группе! ...или буду?"',
    },
    baseRelation: 15,
    traits: ['классический', 'консервативный', 'мощный голос'],
    perks: [
      { name: 'Бас-баритон', desc: 'Добавляет глубину звучанию, +10 intellectuals', effect: { intellectBonus: 10 } },
      { name: 'Старая школа', desc: 'Конфликтует с электроникой, -5 relation с Оливией', effect: { oliviaConflict: -5 } },
    ],
    interactions: [
      { id: 'mitro_drink', name: 'Выпить коньяку', emoji: '🥃', desc: 'За искусство!', energyCost: 10, effects: { sanity: 10, health: -5, creativity: 8 }, relationChange: 12, message: 'Митрофанов рассказывает байки из оперного театра. Душевно!' },
      { id: 'mitro_classic', name: 'Послушать оперные арии', emoji: '🎭', desc: 'Классика бессмертна', energyCost: 8, effects: { creativity: 15, focus: 5 }, relationChange: 8, message: 'Митрофанов поёт Верди. По спине мурашки.' },
      { id: 'mitro_argue', name: 'Спорить о электронике', emoji: '💥', desc: 'Он ненавидит синтезаторы', energyCost: 10, effects: { sanity: -15 }, relationChange: -15, message: '"Это не музыка! Это пиканье!" — кричит Митрофанов.' },
    ],
  },
  {
    id: 'mukhin', name: 'Валерий Мухин', portrait: '💼', color: '#a3e635',
    desc: 'Менеджер-оптимизатор. Считает всё в Excel. Носит костюм даже на пляже.',
    naturalRoles: ['manager', 'admin'],
    mismatchQuotes: {
      solist: '"Ла-ла-ла... *кашель*... я же говорил, это не моё."',
      drums: '"Бить палками? Я бью таблицами Excel!"',
      guitar: '"ROI гитары отрицательный. Но ладно."',
      violin: '"Скрипка? У меня аллергия на канифоль."',
      composer: '"Я оптимизирую ноты. До-ре-ми... эффективность 33%."',
    },
    baseRelation: 30,
    traits: ['деловой', 'расчётливый', 'эффективный'],
    perks: [
      { name: 'Оптимизатор', desc: '+20% к донатам если менеджер', effect: { donateBonus: 20 } },
      { name: 'Скучный', desc: 'Снижает креативность группы', effect: { creativityCost: -3 } },
    ],
    interactions: [
      { id: 'mukhin_plan', name: 'Обсудить бизнес-план', emoji: '📊', desc: 'Стратегия монетизации', energyCost: 10, effects: { focus: 15, money: 500 }, relationChange: 8, message: 'Мухин показывает графики. Оказывается, мы можем зарабатывать больше!' },
      { id: 'mukhin_sponsor', name: 'Попросить найти спонсора', emoji: '💰', desc: 'Его контакты — золото', energyCost: 5, effects: { money: 3000 }, relationChange: -5, requiredRelation: 20, message: 'Мухин нашёл спонсора! Но напоминает: "Я не благотворитель."' },
      { id: 'mukhin_fire', name: 'Критиковать его методы', emoji: '📉', desc: 'Искусство не про деньги!', energyCost: 5, effects: { sanity: 5 }, relationChange: -20, message: 'Мухин молча поправляет галстук. Глаза холодные.' },
    ],
  },
  {
    id: 'dantesik', name: 'Дантесик', portrait: '🎩', color: '#f472b6',
    desc: 'Менеджер-тусовщик. Знает всех. Организует вечеринки. Сомнительные связи.',
    naturalRoles: ['manager', 'admin'],
    mismatchQuotes: {
      solist: '"Йоу! *фальшивит* ...бро, зато я знаю ВСЕХ!"',
      composer: '"Ноты? Не, бро, я по вайбу."',
      violin: '"Скрипку? Хах, разве что на вечеринке!"',
      cello: '"Бро, виолончель даже не влезет в мою тачку."',
    },
    baseRelation: 20,
    traits: ['тусовщик', 'харизматичный', 'ненадёжный'],
    perks: [
      { name: 'Связи', desc: 'Открывает уникальные ивенты и концерты', effect: { eventBonus: 1 } },
      { name: 'Ненадёжный', desc: '10% шанс подвести в критический момент', effect: { failChance: 10 } },
    ],
    interactions: [
      { id: 'dantes_party', name: 'Пойти на вечеринку', emoji: '🎉', desc: 'Он знает ЛУЧШИЕ места', energyCost: 25, effects: { sanity: 10, health: -5, popularity: 5 }, relationChange: 10, message: 'Безумная вечеринка! Утром не помнишь половину. Но фоточки огонь.', audienceEffects: { hamsters: 3, trolls: 2, normies: 4 } },
      { id: 'dantes_promo', name: 'Попросить промо', emoji: '📢', desc: 'Он знает блогеров', energyCost: 5, effects: { popularity: 8, money: -2000 }, relationChange: 5, requiredRelation: 10, message: 'Дантесик разместил рекламу у топ-блогера!', audienceEffects: { hamsters: 8, normies: 5 } },
      { id: 'dantes_scheme', name: 'Мутная схема', emoji: '🕵️', desc: 'Он предлагает "выгодную штуку"', energyCost: 5, effects: { money: 5000, sanity: -10 }, relationChange: 5, message: '"Не спрашивай откуда деньги, бро."' },
    ],
  },
  {
    id: 'tomilov', name: 'Томилов', portrait: '📚', color: '#818cf8',
    desc: 'Писатель-фантаст. Написал 12 романов про ИИ. Живёт в книгах. Бородатый.',
    naturalRoles: ['composer'],
    mismatchQuotes: {
      solist: '"*читает либретто вместо пения* ...ну, это же лучше?"',
      drums: '"Я ритмично стучу по клавиатуре! Считается?"',
      manager: '"Деньги? В моих романах деньги отменили в 2045."',
      sound: '"Я могу озвучить аудиокнигу вместо этого?"',
      guitar: '"*держит гитару как книгу* Струны — это как строки..."',
    },
    baseRelation: 45,
    traits: ['интеллектуал', 'мечтатель', 'бородатый'],
    perks: [
      { name: 'Мастер сюжета', desc: 'Помогает с либретто оперы', effect: { librettoBonus: 10 } },
      { name: 'Рассеянный', desc: 'Забывает о встречах', effect: { unreliable: 1 } },
    ],
    interactions: [
      { id: 'tomilov_libretto', name: 'Писать либретто вместе', emoji: '✍️', desc: 'Его сюжеты — огонь', energyCost: 20, effects: { operaProgress: 12, creativity: 10 }, relationChange: 10, message: 'Томилов предложил гениальный поворот сюжета! Опера становится глубже.', audienceEffects: { intellectuals: 3 } },
      { id: 'tomilov_discuss', name: 'Обсудить сингулярность', emoji: '🤔', desc: 'Философские дебаты', energyCost: 15, effects: { sanity: 5, creativity: 15, focus: -5 }, relationChange: 8, message: 'Три часа спорили о том, будет ли ИИ иметь сознание. Мозг кипит!' },
      { id: 'tomilov_book', name: 'Прочитать его новый роман', emoji: '📖', desc: '800 страниц про пост-людей', energyCost: 15, effects: { creativity: 20, sanity: 5 }, relationChange: 12, message: 'Роман потрясающий! Но 800 страниц...' },
      { id: 'tomilov_collab', name: 'Совместный манифест', emoji: '📜', desc: 'Трансгуманистический манифест', energyCost: 25, effects: { popularity: 10, creativity: 10 }, relationChange: 15, requiredRelation: 40, message: 'Манифест опубликован! Философы обсуждают, тролли высмеивают.', audienceEffects: { intellectuals: 8, schizos: 5, trolls: 3, biohackers: 5 } },
    ],
  },
  {
    id: 'volaliel', name: 'Волалиэль Волко', portrait: '🌀', color: '#c084fc',
    desc: 'Шиз-гений. Верит в параллельные вселенные. Иногда говорит пророчества. Или бред.',
    naturalRoles: ['back_vocal', 'keys'],
    mismatchQuotes: {
      manager: '"Менеджмент? Я управляю ИЗМЕРЕНИЯМИ!"',
      admin: '"Компьютер — это портал. Я знаю."',
      drums: '"Барабаны — ритм вселенной! КОСМИЧЕСКИЙ РИТМ!"',
      donor: '"Деньги — иллюзия матрицы! Но могу дать."',
    },
    baseRelation: 10,
    traits: ['шизоид', 'гениальный', 'непредсказуемый'],
    perks: [
      { name: 'Безумное вдохновение', desc: '+25 creativity но -10 sanity при взаимодействии', effect: { creativityBoost: 25, sanityCost: -10 } },
      { name: 'Пророчества', desc: 'Иногда предсказывает события (случайный бонус)', effect: { prophecy: 1 } },
    ],
    interactions: [
      { id: 'volaliel_vision', name: 'Послушать видения', emoji: '👁️', desc: '"Я видел это во сне..."', energyCost: 10, effects: { creativity: 25, sanity: -15 }, relationChange: 10, message: 'Волалиэль описывает невозможные миры. Либо он гений, либо...' },
      { id: 'volaliel_music', name: 'Джем-сессия хаоса', emoji: '🌪️', desc: 'Играть без правил', energyCost: 15, effects: { creativity: 30, sanity: -20, operaProgress: 3 }, relationChange: 8, message: 'ХАОС! Но из хаоса рождается нечто прекрасное... кажется.', audienceEffects: { schizos: 8, musicians: -2 } },
      { id: 'volaliel_prophecy', name: 'Спросить пророчество', emoji: '🔮', desc: 'Что нас ждёт?', energyCost: 5, effects: { sanity: -8 }, relationChange: 5, message: 'Волалиэль закатил глаза: "Звёзды говорят... будь осторожен с кофе."' },
      { id: 'volaliel_ritual', name: 'Ритуал вдохновения', emoji: '🕯️', desc: 'Мистический ритуал с музыкой', energyCost: 20, effects: { creativity: 35, sanity: -25, health: -5 }, relationChange: 12, requiredRelation: 5, message: 'Свечи, благовония, странная музыка... Ты чувствуешь НЕЧТО. Или это гипоксия.', audienceEffects: { schizos: 10, haters: 3 } },
    ],
  },
  {
    id: 'zheka', name: 'Жека', portrait: '💻', color: '#4ade80',
    desc: 'Старый друг-программист, фанат трансгуманизма. Работает в IT, помогает с техникой.',
    naturalRoles: ['sound', 'admin'],
    mismatchQuotes: {
      solist: '"Ла-ла-ла... *голос ломается* ...я лучше покодю."',
      drums: '"Могу стучать по клавиатуре ОЧЕНЬ ритмично."',
      violin: '"У меня от скрипки сегфолт в мозгу."',
      donor: '"У меня ипотека, бро. Но немного могу."',
    },
    baseRelation: 55,
    traits: ['умный', 'ленивый', 'верный друг'],
    perks: [
      { name: 'Техно-гуру', desc: 'Чинит любую технику, экономит деньги', effect: { techSave: 500 } },
      { name: 'Лень', desc: 'Иногда не приходит на репетицию', effect: { skipChance: 15 } },
    ],
    interactions: [
      { id: 'zheka_code', name: 'Кодить вместе', emoji: '⌨️', desc: 'Сайт для группы', energyCost: 15, effects: { popularity: 5, focus: 10 }, relationChange: 8, message: 'Жека запилил крутой сайт за вечер! Программисты...' },
      { id: 'zheka_beer', name: 'Пиво и разговоры', emoji: '🍺', desc: 'Как в старые времена', energyCost: 10, effects: { sanity: 15, health: -3, money: -300 }, relationChange: 10, message: 'Посидели, поболтали о жизни. Жека хороший друг.' },
      { id: 'zheka_fix', name: 'Попросить починить технику', emoji: '🔧', desc: 'Синтезатор опять глючит', energyCost: 3, effects: { money: -200, focus: 5 }, relationChange: 3, message: 'Жека починил всё за час. И даже не взял денег (почти).' },
    ],
  },
  {
    id: 'prof_ivanov', name: 'Проф. Иванов', portrait: '🎓', color: '#fbbf24',
    desc: 'Профессор философии сознания из ДВФУ. Специалист по квалиа и hard problem.',
    naturalRoles: ['composer'],
    mismatchQuotes: {
      solist: '"*монотонно читает лекцию на мотив арии* ...квалиа..."',
      drums: '"Ударные? Я предпочитаю ударные аргументы."',
      guitar: '"Кант не играл на гитаре. Хотя... надо проверить."',
      manager: '"Менеджмент — это прикладная этика. Справлюсь."',
      bass: '"Бас-гитара — метафора фундамента сознания!"',
      donor: '"Грант — это тоже донат, верно?"',
    },
    baseRelation: 50,
    traits: ['учёный', 'занудный', 'мудрый'],
    perks: [
      { name: 'Академический вес', desc: '+popularity среди интеллектуалов', effect: { intellectPop: 5 } },
      { name: 'Зануда', desc: 'Долгие лекции утомляют', effect: { energyCost: 5 } },
    ],
    interactions: [
      { id: 'prof_lecture', name: 'Совместная лекция', emoji: '🏛️', desc: 'В ДВФУ о сознании', energyCost: 25, effects: { popularity: 8, money: 3000, focus: -10 }, relationChange: 10, message: 'Блестящая лекция на двоих! Аудитория в восторге.', audienceEffects: { intellectuals: 8, biohackers: 3 } },
      { id: 'prof_debate', name: 'Дебаты о квалиа', emoji: '🤔', desc: 'Функционализм vs дуализм', energyCost: 15, effects: { creativity: 10, sanity: 5, focus: -10 }, relationChange: 5, message: 'Три часа спорили. Ничего не решили. Но было интересно!' },
      { id: 'prof_paper', name: 'Написать статью вместе', emoji: '📝', desc: 'Академическая публикация', energyCost: 20, effects: { popularity: 5, focus: -15 }, relationChange: 15, requiredRelation: 30, message: 'Статья принята в журнал! Академическое признание.', audienceEffects: { intellectuals: 10 } },
    ],
  },
  {
    id: 'marina', name: 'Марина', portrait: '📰', color: '#fb7185',
    desc: 'Журналистка, пишет про трансгуманизм. Может прославить, может уничтожить.',
    naturalRoles: ['manager'],
    mismatchQuotes: {
      solist: '"Я говорю в микрофон каждый день! ...не так? Ладно."',
      drums: '"Я буду отбивать ритм ПРАВДЫ!"',
      composer: '"Я пишу тексты! Ну, статьи. Это почти то же самое."',
      bass: '"Бас? Мой голос достаточно низкий для скандалов."',
      keys: '"Я печатаю на клавиатуре! Клавиши — клавиши!"',
    },
    baseRelation: 25,
    traits: ['любопытная', 'двуличная', 'влиятельная'],
    perks: [
      { name: 'Четвёртая власть', desc: 'Публикации сильно влияют на аудиторию', effect: { mediaImpact: 2 } },
      { name: 'Двуличная', desc: 'Может написать как хвалебную, так и разгромную статью', effect: { unpredictable: 1 } },
    ],
    interactions: [
      { id: 'marina_interview', name: 'Дать интервью', emoji: '🎤', desc: 'Для её издания', energyCost: 15, effects: { popularity: 10 }, relationChange: 8, message: 'Марина написала большой материал. Ждём реакции...', audienceEffects: { normies: 5, hamsters: 3, intellectuals: 2 } },
      { id: 'marina_expose', name: 'Рассказать правду', emoji: '💣', desc: 'Полный откровенный рассказ', energyCost: 10, effects: { popularity: 15, sanity: -10 }, relationChange: 15, message: 'Шокирующий материал! Одни восхищаются, другие в ужасе.', audienceEffects: { biohackers: 10, haters: 8, normies: -5, schizos: 5 } },
      { id: 'marina_coffee', name: 'Кофе не для интервью', emoji: '☕', desc: 'Просто поболтать', energyCost: 8, effects: { sanity: 5, bladder: -15 }, relationChange: 10, message: 'Марина — приятный человек, когда не при исполнении.' },
    ],
  },
  {
    id: 'hacker_bob', name: 'Боб-хакер', portrait: '🕶️', color: '#10b981',
    desc: 'Анонимус из даркнета. Поставляет "витаминки" и решает проблемы. Тёмная фигура.',
    naturalRoles: ['admin', 'sound'],
    mismatchQuotes: {
      solist: '"Я анонимус, а не певец."',
      drums: '"Стучать? Я стучу по клавишам."',
      violin: '"Скрипка? Слишком аналоговое."',
      composer: '"Алгоритм напишет музыку лучше."',
    },
    baseRelation: 5,
    traits: ['криминальный', 'полезный', 'анонимный'],
    perks: [
      { name: 'Даркнет', desc: 'Скидки на вещества, доступ к редким', effect: { drugDiscount: 30 } },
      { name: 'Опасные связи', desc: 'Знакомство с ним может привлечь внимание', effect: { heatRisk: 1 } },
    ],
    interactions: [
      { id: 'bob_supply', name: 'Заказать "витаминки"', emoji: '💊', desc: 'Со скидкой, конечно', energyCost: 3, effects: { focus: 20, health: -5, money: -300 }, relationChange: 5, message: 'Боб доставил пакет. "Как обычно, бро." Не спрашивай что внутри.' },
      { id: 'bob_hack', name: 'Попросить хакнуть', emoji: '💻', desc: 'Решить проблему по-хакерски', energyCost: 5, effects: { money: -1000, popularity: 3 }, relationChange: 8, message: 'Боб сделал дело. Не спрашивай как.' },
      { id: 'bob_crypto', name: 'Инвестиции в крипту', emoji: '₿', desc: 'Боб говорит "100x, бро"', energyCost: 3, effects: { money: -2000 }, relationChange: 5, message: 'Вложил деньги. Либо 100x, либо 0. Узнаем завтра.' },
    ],
  },
  {
    id: 'sasha', name: 'Саша', portrait: '🥗', color: '#84cc16',
    desc: 'Ударник-веган. Ненавидит любые стимуляторы. Бегает марафоны. Морализирует.',
    naturalRoles: ['drums', 'bass'],
    mismatchQuotes: {
      solist: '"Петь? Только мантры. И то на пробежке."',
      keys: '"Клавиши? Я предпочитаю барабанные палочки."',
      composer: '"Я пишу планы тренировок, а не ноты."',
      manager: '"Менеджмент? Главное — дисциплина! Подъём в 5 утра!"',
      donor: '"Деньги — на органическую еду. Но ладно."',
    },
    baseRelation: 15,
    traits: ['здоровый', 'категоричный', 'дисциплинированный'],
    perks: [
      { name: 'Дисциплина', desc: '+10 health группе если в группе', effect: { healthBoost: 10 } },
      { name: 'Моралист', desc: 'Портит отношения если принимаешь вещества', effect: { drugHate: -5 } },
    ],
    interactions: [
      { id: 'sasha_run', name: 'Пробежка вместе', emoji: '🏃', desc: 'По набережной Владивостока', energyCost: 20, effects: { health: 15, sanity: 10, bowel: -15 }, relationChange: 12, message: 'Пробежали 5 км! Саша даже не запыхался. Ты — еле выжил.' },
      { id: 'sasha_cook', name: 'Веганский ужин', emoji: '🥬', desc: 'Саша готовит тофу', energyCost: 8, effects: { health: 10, energy: 10, money: -200, sanity: 3 }, relationChange: 8, message: 'Тофу оказался... съедобным? Саша сияет от гордости.' },
      { id: 'sasha_lecture', name: 'Выслушать лекцию о ЗОЖ', emoji: '🧘', desc: 'Он ОБЯЗАТЕЛЬНО расскажет', energyCost: 10, effects: { sanity: -5, health: 5 }, relationChange: 5, message: '"Кофе — это яд! Сахар — зло! Модафинил..." *Саша падает в обморок от злости*' },
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
  { id: 'schizos', name: 'Шизы', emoji: '🌀', desc: 'Фанаты всего странного и безумного', baseSize: 50, donateRate: 0.3 },
  { id: 'hamsters', name: 'Хомяки', emoji: '🐹', desc: 'Массовая аудитория, легко увлекаются', baseSize: 200, donateRate: 0.1 },
  { id: 'trolls', name: 'Тролли', emoji: '👹', desc: 'Живут ради хаоса, но генерируют охваты', baseSize: 80, donateRate: 0.05 },
  { id: 'haters', name: 'Хейтеры', emoji: '💢', desc: 'Ненавидят, но не могут оторваться', baseSize: 30, donateRate: -0.1 },
  { id: 'biohackers', name: 'Биохакеры', emoji: '💊', desc: 'Фанаты трансгуманизма и ноотропов', baseSize: 60, donateRate: 0.4 },
  { id: 'musicians', name: 'Музыканты', emoji: '🎵', desc: 'Коллеги, оценивают мастерство', baseSize: 40, donateRate: 0.6 },
  { id: 'normies', name: 'Нормисы', emoji: '😐', desc: 'Обычные люди, зашли случайно', baseSize: 150, donateRate: 0.08 },
];

// --- SUBSTANCES ---
export interface Substance {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  cost: number;
  effects: {
    focus?: number;
    creativity?: number;
    health?: number;
    sanity?: number;
    energy?: number;
    bladder?: number;
    bowel?: number;
  };
  overdoseThreshold: number;
  addictiveness: number;
}

export const SUBSTANCES: Substance[] = [
  { id: 'coffee', name: 'Кофе', emoji: '☕', desc: 'Классика. Бодрит, но бьёт по мочевому', cost: 50, effects: { focus: 15, energy: 20, bladder: -25, health: -2 }, overdoseThreshold: 4, addictiveness: 0.1 },
  { id: 'modafinil', name: 'Модафинил', emoji: '💊', desc: 'Ноотроп для сверхфокуса', cost: 300, effects: { focus: 35, energy: 15, health: -5, sanity: -3, bladder: -10 }, overdoseThreshold: 2, addictiveness: 0.3 },
  { id: 'piracetam', name: 'Пирацетам', emoji: '💉', desc: 'Мягкий ноотроп, почти безвредный', cost: 100, effects: { focus: 10, creativity: 8, health: -1 }, overdoseThreshold: 3, addictiveness: 0.05 },
  { id: 'microdose', name: 'Микродоза', emoji: '🍄', desc: 'Открывает двери восприятия. Или крышу сносит', cost: 500, effects: { creativity: 40, sanity: -15, focus: -5, health: -3 }, overdoseThreshold: 1, addictiveness: 0.15 },
  { id: 'energy_drink', name: 'Энергетик', emoji: '⚡', desc: 'Дешёвый буст, но сердечко...', cost: 80, effects: { energy: 30, focus: 5, health: -8, bladder: -20, bowel: -10 }, overdoseThreshold: 3, addictiveness: 0.2 },
  { id: 'noopept', name: 'Ноопепт', emoji: '🧬', desc: 'Российский ноотроп. Патриотично и умно', cost: 150, effects: { focus: 20, creativity: 5, health: -2, sanity: 3 }, overdoseThreshold: 2, addictiveness: 0.1 },
  { id: 'green_tea', name: 'Зелёный чай', emoji: '🍵', desc: 'L-теанин + кофеин = дзен продуктивность', cost: 30, effects: { focus: 8, sanity: 5, energy: 10, health: 2, bladder: -15 }, overdoseThreshold: 6, addictiveness: 0.02 },
  { id: 'phenibut', name: 'Фенибут', emoji: '😌', desc: 'Снимает тревогу, но вызывает зависимость', cost: 200, effects: { sanity: 25, focus: -5, creativity: 10, health: -4 }, overdoseThreshold: 1, addictiveness: 0.5 },
];

// --- ACTIVITIES ---
export interface Activity {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  effects: {
    operaProgress?: number;
    popularity?: number;
    money?: number;
    health?: number;
    sanity?: number;
    energy?: number;
    focus?: number;
    creativity?: number;
    bladder?: number;
    bowel?: number;
  };
  audienceEffects?: { [groupId: string]: number };
  requiredFocus?: number;
  requiredEnergy?: number; // soft requirement - warns but allows (with damage)
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'write_opera', name: 'Писать оперу', emoji: '🎼', desc: 'Работа над великим произведением',
    effects: { operaProgress: 5, energy: -20, focus: -10, sanity: -3, bladder: -10, bowel: -5 },
    audienceEffects: { intellectuals: 2, musicians: 3, schizos: 1 },
    requiredFocus: 30,
  },
  {
    id: 'shitpost', name: 'Щитпостить', emoji: '💩', desc: 'Набрасывать в соцсетях',
    effects: { popularity: 3, energy: -5, sanity: -5, bladder: -5 },
    audienceEffects: { trolls: 5, hamsters: 3, haters: 2, intellectuals: -2, normies: 1 },
  },
  {
    id: 'lecture', name: 'Лекция о сознании', emoji: '🧠', desc: 'Философия сознания в ДВФУ',
    effects: { popularity: 5, money: 2000, energy: -25, sanity: 5, focus: -15 },
    audienceEffects: { intellectuals: 5, biohackers: 2, schizos: -1, hamsters: -1 },
  },
  {
    id: 'stream', name: 'Стрим', emoji: '📺', desc: 'Живой эфир для подписчиков',
    effects: { popularity: 4, money: 500, energy: -15, sanity: -2, bladder: -15 },
    audienceEffects: { hamsters: 4, trolls: 2, normies: 3, schizos: 1 },
  },
  {
    id: 'sleep', name: 'Спать', emoji: '😴', desc: 'Восстановить силы',
    effects: { energy: 40, health: 10, sanity: 10, focus: 15, bladder: -20, bowel: -15 },
  },
  {
    id: 'exercise', name: 'Зарядка', emoji: '🏃', desc: 'Пробежка по набережной Владивостока',
    effects: { health: 15, energy: -10, sanity: 8, bowel: -20, bladder: -10 },
    audienceEffects: { biohackers: 1, haters: -1 },
  },
  {
    id: 'toilet', name: 'В туалет', emoji: '🚽', desc: 'Необходимость есть необходимость',
    effects: { bladder: 50, bowel: 50, energy: -2 },
  },
  {
    id: 'eat', name: 'Поесть', emoji: '🍜', desc: 'Подкрепиться (корейская кухня Владивостока)',
    effects: { energy: 15, health: 5, money: -300, bowel: -15, sanity: 3 },
  },
  {
    id: 'rehearsal', name: 'Репетиция с группой', emoji: '🎸', desc: 'Репетиция с "Комплексными числами"',
    effects: { operaProgress: 2, energy: -20, sanity: 3, focus: -10 },
    audienceEffects: { musicians: 4, intellectuals: 1 },
  },
  {
    id: 'biohack', name: 'Биохакинг сессия', emoji: '🧬', desc: 'Измерять показатели, оптимизировать тело',
    effects: { health: 5, sanity: -5, energy: -10, money: -500 },
    audienceEffects: { biohackers: 5, schizos: 2, haters: 1 },
  },
  {
    id: 'interview', name: 'Дать интервью', emoji: '🎤', desc: 'Рассказать о трансгуманизме прессе',
    effects: { popularity: 8, energy: -15, sanity: -3 },
    audienceEffects: { normies: 5, intellectuals: 3, hamsters: 4, haters: 2 },
  },
  {
    id: 'walk_vladivostok', name: 'Гулять по Владивостоку', emoji: '🌊', desc: 'Золотой мост, бухта, вдохновение',
    effects: { sanity: 15, creativity: 10, health: 5, energy: -8, bladder: -8, bowel: -5 },
  },
  {
    id: 'argue_online', name: 'Спорить в интернете', emoji: '⚔️', desc: 'Доказывать что сознание — это...',
    effects: { sanity: -10, energy: -10, popularity: 2 },
    audienceEffects: { trolls: 3, intellectuals: -1, haters: 4, schizos: 3 },
  },
  {
    id: 'meditate', name: 'Медитация', emoji: '🧘', desc: 'Попытка понять сознание изнутри',
    effects: { sanity: 20, focus: 10, energy: 5, creativity: 5 },
    audienceEffects: { biohackers: 1, schizos: -1 },
  },
  {
    id: 'compose_electronic', name: 'Электронная музыка', emoji: '🎛️', desc: 'Эксперименты с синтезаторами',
    effects: { operaProgress: 3, creativity: 10, energy: -15, focus: -8 },
    audienceEffects: { schizos: 3, biohackers: 2, musicians: 2 },
  },
  {
    id: 'podcast', name: 'Записать подкаст', emoji: '🎙️', desc: 'Разговоры о трансгуманизме',
    effects: { popularity: 6, energy: -12, sanity: -2, money: 300 },
    audienceEffects: { intellectuals: 4, biohackers: 3, normies: 2, hamsters: 2 },
  },
];

// --- EVENTS ---
export interface GameEvent {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  image?: string; // event image path for future expansion
  characterId?: string; // if event is about specific character
  choices: {
    text: string;
    effects: {
      money?: number;
      popularity?: number;
      health?: number;
      sanity?: number;
      energy?: number;
      operaProgress?: number;
      focus?: number;
      creativity?: number;
      bladder?: number;
      bowel?: number;
    };
    audienceEffects?: { [groupId: string]: number };
    relationEffects?: { [charId: string]: number };
    message: string;
  }[];
  condition?: (state: any) => boolean;
}

export const EVENTS: GameEvent[] = [
  {
    id: 'troll_attack', title: 'Набег троллей', emoji: '👹',
    desc: 'Тролли массово набежали в комменты и пишут что опера — отстой.',
    choices: [
      { text: 'Игнорировать', effects: { sanity: -5 }, audienceEffects: { trolls: -2 }, message: 'Ты стоически молчишь. Тролли скучают.' },
      { text: 'Ответить щитпостом', effects: { sanity: -10, popularity: 3 }, audienceEffects: { trolls: 5, hamsters: 3, intellectuals: -3 }, message: 'Эпичная перебранка! Охваты растут!' },
      { text: 'Написать философский ответ', effects: { energy: -10, sanity: 5 }, audienceEffects: { intellectuals: 5, trolls: -3, schizos: 2 }, message: 'Тролли в замешательстве от Канта.' },
    ],
  },
  {
    id: 'donor_appears', title: 'Щедрый донатер', emoji: '💰',
    desc: 'Анонимный донатер хочет поддержать оперу, но просит добавить рекламу криптовалюты.',
    choices: [
      { text: 'Взять деньги и добавить', effects: { money: 10000, operaProgress: -3 }, audienceEffects: { intellectuals: -5, hamsters: 2, haters: 3 }, message: 'Деньги капают, но опера пострадала.' },
      { text: 'Отказать принципиально', effects: { sanity: 5 }, audienceEffects: { intellectuals: 3, musicians: 2 }, message: 'Искусство не продаётся!' },
      { text: 'Взять деньги, но обмануть', effects: { money: 10000, sanity: -10 }, audienceEffects: { trolls: 3 }, message: 'Хитрый ход. Совесть скрипит.' },
    ],
  },
  {
    id: 'ariel_drama', title: 'Ариэль: Драма на репетиции', emoji: '🎭', characterId: 'ariel',
    desc: 'Ариэль угрожает уйти из группы если не поменять аранжировку. Глаза горят!',
    choices: [
      { text: 'Уступить капризам', effects: { operaProgress: -2, sanity: -5 }, relationEffects: { ariel: 15 }, message: 'Ариэль довольна. Ты чувствуешь себя тряпкой.' },
      { text: 'Стоять на своём', effects: { sanity: -3 }, relationEffects: { ariel: -20 }, message: 'Ариэль хлопает дверью. Звенит стакан.' },
      { text: 'Творческий компромисс', effects: { energy: -10, operaProgress: -1 }, relationEffects: { ariel: 5, mitrofanov: 5 }, message: 'Долгие переговоры. Все довольны. Ну, почти.' },
    ],
  },
  {
    id: 'olivia_glitch', title: 'Оливия: Сбой системы', emoji: '⚡', characterId: 'olivia',
    desc: 'У Оливии во время концерта глючит нейроинтерфейс. Она паникует (для киборга).',
    choices: [
      { text: 'Помочь перезагрузить', effects: { energy: -15, focus: -10 }, relationEffects: { olivia: 15 }, message: 'Ребут прошёл успешно. Оливия благодарна.' },
      { text: 'Заменить на Митрофанова', effects: {}, relationEffects: { olivia: -25, mitrofanov: 15 }, message: 'Оливия обижена. Митрофанов сияет.' },
      { text: 'Импровизировать без неё', effects: { creativity: 15, energy: -20 }, relationEffects: { olivia: -10 }, audienceEffects: { musicians: 3, schizos: 5 }, message: 'Хаотичная импровизация! Публика в шоке, но кому-то понравилось.' },
    ],
  },
  {
    id: 'mitrofanov_drunk', title: 'Митрофанов: Опять коньяк', emoji: '🥃', characterId: 'mitrofanov',
    desc: 'Митрофанов пришёл на репетицию пьяный. Поёт красиво, но шатается.',
    choices: [
      { text: 'Дать допеть', effects: { operaProgress: 3, creativity: 5 }, relationEffects: { mitrofanov: 10, sasha: -10 }, message: 'Пьяный Митрофанов — это какой-то другой уровень.' },
      { text: 'Отправить домой', effects: { sanity: -3 }, relationEffects: { mitrofanov: -15 }, message: 'Митрофанов уходит, бормоча проклятия.' },
      { text: 'Поговорить серьёзно', effects: { energy: -10 }, relationEffects: { mitrofanov: -5, sasha: 5 }, message: 'Тяжёлый разговор. Митрофанов обещает исправиться.' },
    ],
  },
  {
    id: 'mukhin_offer', title: 'Мухин: Деловое предложение', emoji: '📊', characterId: 'mukhin',
    desc: 'Мухин нашёл корпоративного клиента — хотят оперу для тимбилдинга. 50,000₽.',
    choices: [
      { text: 'Согласиться', effects: { money: 50000, sanity: -15, operaProgress: -5 }, relationEffects: { mukhin: 15, ariel: -10, tomilov: -10 }, message: 'Деньги есть. Но опера для тимбилдинга? Серьёзно?', audienceEffects: { intellectuals: -5, haters: 5 } },
      { text: 'Отказать', effects: { sanity: 5 }, relationEffects: { mukhin: -15 }, audienceEffects: { intellectuals: 3 }, message: 'Мухин в ярости. "Ты мог бы быть БОГАТЫМ!"' },
      { text: 'Контроффер на своих условиях', effects: { money: 20000, energy: -10 }, relationEffects: { mukhin: 5 }, message: 'Договорились на меньшую сумму, но с творческой свободой.' },
    ],
  },
  {
    id: 'dantesik_trouble', title: 'Дантесик: Проблемы с законом', emoji: '🚔', characterId: 'dantesik',
    desc: 'Дантесик звонит в 3 ночи: "Бро, забери меня из отделения. Пожааалуйста."',
    choices: [
      { text: 'Поехать выручить', effects: { energy: -20, money: -5000, sanity: -10 }, relationEffects: { dantesik: 25 }, message: 'Забрал Дантесика. Он должен тебе. Говорит.' },
      { text: 'Пусть сидит', effects: { sanity: -5 }, relationEffects: { dantesik: -30 }, message: 'Дантесик не простил. Но ты выспался.' },
      { text: 'Позвонить Бобу', effects: { money: -2000 }, relationEffects: { dantesik: 15, hacker_bob: 5 }, message: 'Боб "решил вопрос". Лучше не спрашивать как.' },
    ],
  },
  {
    id: 'tomilov_idea', title: 'Томилов: Безумная идея', emoji: '💡', characterId: 'tomilov',
    desc: 'Томилов звонит в восторге: "Я придумал идеальный финал для оперы! Нужно переписать ВСЁ!"',
    choices: [
      { text: 'Переписать финал', effects: { operaProgress: -15, creativity: 25, energy: -20 }, relationEffects: { tomilov: 20 }, message: 'Месяц работы коту под хвост... но новый финал ГЕНИАЛЕН.', audienceEffects: { intellectuals: 5, schizos: 3 } },
      { text: 'Отказать мягко', effects: {}, relationEffects: { tomilov: -10 }, message: 'Томилов грустит, но понимает.' },
      { text: 'Взять идею, но адаптировать', effects: { operaProgress: -5, creativity: 15, energy: -10 }, relationEffects: { tomilov: 10 }, message: 'Компромисс сработал! Финал стал лучше.' },
    ],
  },
  {
    id: 'volaliel_prophecy', title: 'Волалиэль: Пророчество', emoji: '🔮', characterId: 'volaliel',
    desc: 'Волалиэль врывается к тебе: "Я ВИДЕЛ! МАТРИЦА ТРЕЩИТ! СКОРО ВСЁ ИЗМЕНИТСЯ!!!"',
    choices: [
      { text: 'Выслушать внимательно', effects: { creativity: 20, sanity: -15, energy: -10 }, relationEffects: { volaliel: 15 }, audienceEffects: { schizos: 5 }, message: 'Три часа безумных откровений. Голова раскалывается. Но пара идей...' },
      { text: 'Дать чай и успокоить', effects: { energy: -5, sanity: 5 }, relationEffects: { volaliel: 5 }, message: 'Волалиэль успокоился. Обещает "дать знак, когда придёт время".' },
      { text: 'Записать на камеру', effects: { popularity: 5, energy: -5 }, relationEffects: { volaliel: -5 }, audienceEffects: { schizos: 8, trolls: 5, haters: 3 }, message: 'Видео завирусилось! Мнения разделились...' },
    ],
  },
  {
    id: 'sasha_intervention', title: 'Саша: Интервенция', emoji: '🥦', characterId: 'sasha',
    desc: 'Саша пришёл с плакатами "СТОП НООТРОПЫ" и зелёным смузи.',
    choices: [
      { text: 'Выпить смузи', effects: { health: 10, sanity: 5, energy: 5 }, relationEffects: { sasha: 15, hacker_bob: -5 }, message: 'Смузи из спирулины и шпината. На вкус — трава. Но Саша счастлив.' },
      { text: 'Спорить о биохакинге', effects: { sanity: -10, energy: -10 }, relationEffects: { sasha: -15 }, audienceEffects: { biohackers: 3, haters: 2 }, message: 'Эпичный спор! Саша красный от злости. Но аргументы у обоих слабые.' },
      { text: 'Пообещать меньше принимать', effects: { sanity: 3 }, relationEffects: { sasha: 10 }, message: 'Саша верит. Ну... на сегодня точно можно без модафинила... наверное.' },
    ],
  },
  {
    id: 'dvfu_invite', title: 'Приглашение из ДВФУ', emoji: '🏛️',
    desc: 'Профессор Иванов приглашает прочитать лекцию о квалиа.',
    choices: [
      { text: 'Согласиться', effects: { popularity: 5, money: 3000, energy: -20 }, audienceEffects: { intellectuals: 8, biohackers: 3 }, relationEffects: { prof_ivanov: 10 }, message: 'Блестящая лекция! Студенты аплодируют.' },
      { text: 'Отказать — нет сил', effects: {}, relationEffects: { prof_ivanov: -10 }, message: 'Иванов разочарован.' },
    ],
  },
  {
    id: 'drug_bust', title: 'Проверка полиции', emoji: '🚔',
    desc: 'Участковый стучит в дверь. "Странные запахи", говорят соседи.',
    choices: [
      { text: 'Открыть и быть вежливым', effects: { sanity: -10, energy: -5 }, message: 'Ничего не нашёл. Фух.' },
      { text: 'Не открывать', effects: { sanity: -15 }, message: 'Ушёл... но вернётся ли?' },
      { text: 'Предложить чай', effects: { sanity: -5, money: -200 }, message: 'Оказался фанатом электронной музыки. Мир тесен.' },
    ],
  },
  {
    id: 'viral_post', title: 'Вирусный пост', emoji: '📱',
    desc: 'Твой старый пост о сознании внезапно завирусился!',
    choices: [
      { text: 'Развить тему', effects: { popularity: 10, energy: -10 }, audienceEffects: { intellectuals: 5, schizos: 5, hamsters: 8, normies: 5 }, message: 'Пост набрал 100К просмотров!' },
      { text: 'Проигнорировать', effects: { popularity: 3 }, audienceEffects: { hamsters: 3 }, message: 'Волна прошла сама.' },
    ],
  },
  {
    id: 'concert_offer', title: 'Предложение концерта', emoji: '🎤',
    desc: 'Клуб "Мумий Тролль" предлагает выступить.',
    choices: [
      { text: 'Согласиться', effects: { money: 5000, popularity: 8, energy: -30 }, audienceEffects: { musicians: 5, normies: 5, hamsters: 3 }, message: 'Зал был полон!' },
      { text: 'Нет сил', effects: {}, message: 'В другой раз...' },
      { text: 'На своих условиях', effects: { money: 8000, popularity: 5, energy: -25, sanity: -5 }, audienceEffects: { musicians: 3, intellectuals: 2 }, message: 'Только оперу. Клуб согласился.' },
    ],
  },
  {
    id: 'rain_vladivostok', title: 'Тайфун во Владивостоке', emoji: '🌧️',
    desc: 'Мощный тайфун накрыл город. Электричество мигает.',
    choices: [
      { text: 'Работать при свечах', effects: { creativity: 15, sanity: -5, operaProgress: 3 }, message: 'Романтично! Шедевральная ария родилась!' },
      { text: 'Лечь спать', effects: { energy: 30, health: 5 }, message: 'Под шум дождя спится прекрасно.' },
    ],
  },
  {
    id: 'inspiration_strike', title: 'Вдохновение!', emoji: '✨',
    desc: 'Среди ночи приходит гениальная музыкальная идея!',
    choices: [
      { text: 'Вскочить и записать!', effects: { operaProgress: 8, energy: -20, creativity: 15, sanity: -3 }, message: 'Четыре часа за роялем — целая сцена готова!' },
      { text: 'Записать голосовое', effects: { operaProgress: 3, energy: -5 }, message: 'Утром послушаешь... если разберёшь.' },
    ],
  },
  {
    id: 'chinese_tourists', title: 'Китайские туристы', emoji: '🇨🇳',
    desc: 'Китайские туристы узнали тебя на улице!',
    choices: [
      { text: 'Фото с улыбкой', effects: { popularity: 3, energy: -3, sanity: 3 }, message: 'Фото разлетелось по Weibo!' },
      { text: 'Убежать', effects: { energy: -5, health: 3 }, message: 'Кардио!' },
    ],
  },
  {
    id: 'zheka_startup', title: 'Жека: Стартап-идея', emoji: '🚀', characterId: 'zheka',
    desc: 'Жека хочет сделать приложение "Uber для ноотропов". Нужны инвестиции.',
    choices: [
      { text: 'Вложить 10,000₽', effects: { money: -10000 }, relationEffects: { zheka: 20 }, message: 'Жека счастлив! Обещает x10. Как обычно.' },
      { text: 'Отказать', effects: {}, relationEffects: { zheka: -10 }, message: 'Жека расстроился, но не обиделся. Он друг.' },
      { text: 'Предложить помочь кодом', effects: { energy: -15 }, relationEffects: { zheka: 15 }, audienceEffects: { biohackers: 2 }, message: 'Пару вечеров за кодом. Получилось... что-то.' },
    ],
  },
  {
    id: 'bob_darkweb', title: 'Боб: Тёмное предложение', emoji: '🕶️', characterId: 'hacker_bob',
    desc: 'Боб предлагает "экспериментальный ноотроп" из тёмной лаборатории. "100% safe, бро."',
    choices: [
      { text: 'Попробовать', effects: { focus: 30, creativity: 30, health: -15, sanity: -20 }, relationEffects: { hacker_bob: 10, sasha: -15 }, message: 'ВАУ. Цвета стали ярче. Музыка в голове. Это гениально... или ужасно.', audienceEffects: { biohackers: 5, schizos: 3 } },
      { text: 'Отказаться', effects: { sanity: 5 }, relationEffects: { hacker_bob: -5 }, message: 'Благоразумие победило. На этот раз.' },
      { text: 'Отдать на анализ', effects: { money: -2000, energy: -5 }, relationEffects: { hacker_bob: -10 }, message: 'Результаты анализа... лучше бы ты не знал.' },
    ],
  },
  {
    id: 'marina_article', title: 'Марина: Статья о тебе', emoji: '📰', characterId: 'marina',
    desc: 'Марина опубликовала большую статью. Заголовок: "Гений или безумец? Виктор Аргонов — композитор на ноотропах"',
    choices: [
      { text: 'Поблагодарить', effects: { popularity: 10, sanity: -5 }, relationEffects: { marina: 10 }, audienceEffects: { normies: 8, hamsters: 5, biohackers: 5, haters: 5 }, message: 'Статья наделала шума! Неоднозначно, но охваты!' },
      { text: 'Потребовать удалить', effects: { sanity: -10 }, relationEffects: { marina: -25 }, audienceEffects: { trolls: 3 }, message: 'Марина отказала. "Свобода прессы, Виктор."' },
      { text: 'Написать ответную статью', effects: { energy: -15, popularity: 5 }, relationEffects: { marina: -5 }, audienceEffects: { intellectuals: 8, biohackers: 3 }, message: 'Ответная статья — глубокая и аргументированная. Дискуссия продолжается.' },
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
  { id: 'opera2', name: 'Пепел и вода', desc: 'Опера о смысле существования сознания', requiredProgress: 150, rewards: { money: 35000, popularity: 50 }, audienceReaction: { intellectuals: 20, biohackers: 10, schizos: 15, musicians: 15, haters: 5 } },
  { id: 'opera3', name: 'Синтетическая душа', desc: 'Магнум опус — опера про трансгуманизм и квалиа', requiredProgress: 250, rewards: { money: 60000, popularity: 80 }, audienceReaction: { intellectuals: 25, biohackers: 20, schizos: 20, musicians: 20, normies: 10, hamsters: 10, haters: 10 } },
];
