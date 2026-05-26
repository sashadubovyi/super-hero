/**
 * Хардкоженные списки ID для главной страницы.
 * SuperheroAPI не умеет фильтровать "дай мне всех Marvel" —
 * только поиск по имени или по конкретному ID. Поэтому подборки делаем вручную.
 *
 * ID можно подсмотреть тут: https://superheroapi.com/ids.html
 */

export const CATEGORIES = [
  {
    id: "marvel",
    title: "Marvel Heroes",
    ids: [
      149, // Captain America
      346, // Iron Man
      620, // Spider-Man
      659, // Thor
      263, // Doctor Strange
      370, // Hulk
      720, // Wolverine
      85,  // Black Widow
      55,  // Ant-Man
      647, // Storm
      217, // Daredevil
      332, // Hawkeye
    ],
  },
  {
    id: "dc",
    title: "DC Heroes",
    ids: [
      70,  // Batman
      644, // Superman
      720, // (placeholder swap — Wonder Woman) - см. комментарий ниже
      720, // Wonder Woman — реальный id может отличаться
      265, // Flash III (Wally West)
      298, // Green Lantern
      30,  // Aquaman
      144, // Catwoman
      534, // Robin (Tim Drake)
      558, // Shazam
      302, // Green Arrow
      463, // Martian Manhunter
    ],
  },
  {
    id: "strongest",
    title: "Strongest",
    ids: [
      370, // Hulk
      644, // Superman
      659, // Thor
      90,  // Bizarro
      213, // Darkseid
      278, // Galactus
      306, // Gladiator
      355, // Hyperion
      460, // Martian Manhunter
      681, // Thanos
      135, // Captain Marvel
      558, // Shazam
    ],
  },
  {
    id: "smartest",
    title: "Smartest",
    ids: [
      70,  // Batman
      346, // Iron Man
      263, // Doctor Strange
      490, // Mister Fantastic
      525, // Professor X
      425, // Lex Luthor
      266, // Doctor Doom
      497, // Ozymandias
      82,  // Black Panther
      71,  // Beast
    ],
  },
  {
    id: "villains",
    title: "Villains",
    ids: [
      213, // Darkseid
      266, // Doctor Doom
      278, // Galactus
      425, // Lex Luthor
      655, // The Joker
      681, // Thanos
      403, // Loki
      415, // Magneto
      720, // Venom (id placeholder)
      652, // Two-Face
      610, // Sinestro
      221, // Deadpool (debatable, but cool)
    ],
  },
];