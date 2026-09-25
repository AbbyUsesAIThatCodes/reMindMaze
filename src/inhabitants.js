export const INHABITANTS = [
  { name:'Mira', role:'the Archivist', room:'The Hall of Remembering', color:'#577a68', skin:'#b97e59', hair:'#372923', kind:'scholar', source:'Rosetta Stone', lines:[
    'Welcome, traveler. These doors have forgotten how to open. Remind them of something true, and they remember.',
    'I once catalogued every room in this castle. Then the rooms rearranged themselves. Very inconsiderate of them.',
    'A name on a stone. A note in a margin. Sometimes the smallest surviving thing opens the largest door into the past.'
  ]},
  { name:'Peregrin', role:'the Cartographer', room:'The Mapmaker’s Gallery', color:'#8b674d', skin:'#d5a175', hair:'#49332e', kind:'traveler', source:'Andes', lines:[
    'I have mapped seven kingdoms, three deserts, and half the pantry. The pantry remains my most dangerous expedition.',
    'The little gold stair on your map is our way upward. A torch will show the route, but only for a little while.',
    'There are a hundred rooms on this floor. You need not visit them all. Though I would never discourage a detour.'
  ]},
  { name:'Fern', role:'the Garden Keeper', room:'The Ivy Cloister', color:'#567047', skin:'#98633f', hair:'#282b20', kind:'gardener', source:'Honey bee', lines:[
    'The ivy keeps growing through the curse. It seems nobody remembered to explain the situation to the ivy.',
    'When the doors are difficult, take your time. Even an oak starts by getting one small thing right.',
    'I keep bees in the western tower. They are the only residents who always agree on a direction.'
  ]},
  { name:'Orin', role:'the Stargazer', room:'The Astral Chamber', color:'#565d91', skin:'#c58e68', hair:'#dad1b7', kind:'wizard', source:'Solar System', lines:[
    'Ah! Someone from beyond the walls. Tell me: are there still more stars than anyone can count? Good. I worry.',
    'Being wrong is a useful place to begin. Staying incurious is a much more troublesome condition.',
    'My telescope sees distant worlds. My spectacles, regrettably, are still missing.'
  ]},
  { name:'Cadence', role:'the Court Musician', room:'The Echoing Gallery', color:'#895776', skin:'#c1906d', hair:'#44242b', kind:'bard', source:'Piano', lines:[
    'The castle has been stuck on the same melancholy chord for a century. A little knowledge might resolve it.',
    'I wrote a song about a door that would not open. Nobody could get past the first verse.',
    'A question, a pause, an answer. There is music in that, if you listen.'
  ]},
  { name:'Quill', role:'the Story Keeper', room:'The Whispering Library', color:'#6d5b80', skin:'#e0b386', hair:'#b6a890', kind:'scholar', source:'The Hobbit', lines:[
    'Every good adventure begins when someone leaves a comfortable chair. Mine is over there, should you change your mind.',
    'I keep a journal of things I learn. Yours is in the upper corner. An excellent habit for travelers.',
    'There are books here about worlds that never were. Somehow they still tell us things that are true.'
  ]},
  { name:'Rook', role:'the Gate Warden', room:'The King’s Antechamber', color:'#667479', skin:'#a87550', hair:'#4b342b', kind:'knight', source:'Chess', lines:[
    'No sword required, traveler. The lock prefers a well-informed answer. Much less paperwork for me.',
    'A wrong answer costs no accumulated points. Think again. The doors are patient, even if they look stern.',
    'I challenged the curse to chess. It declined. A suspicious lack of sportsmanship.'
  ]},
  { name:'Tamsin', role:'the Clockmaker', room:'The Brass Workshop', color:'#866743', skin:'#dda57c', hair:'#964e32', kind:'traveler', source:'Steam engine', lines:[
    'The clock runs, the wheels turn, the doors sulk. Two out of three is a start.',
    'A machine is a conversation between parts. A castle is much the same, only with more arguments about curtains.',
    'Solved doors stay open. A sensible design. I am quite certain it was my idea.'
  ]},
  { name:'Sable', role:'the Interpreter', room:'The Scriptorium', color:'#4a757a', skin:'#885c43', hair:'#292421', kind:'scholar', source:'Braille', lines:[
    'A hundred rooms, a hundred ways of saying welcome. I am working on the translation for the broom cupboard.',
    'The book beside a question leads to the wider world. Please use it. Curiosity is precisely the point.',
    'The curse confuses silence with emptiness. But there is more than one way to read, or speak, or know.'
  ]},
];
export const inhabitantFor = state => INHABITANTS[(state.pos * 7 + state.floor - 1) % INHABITANTS.length];
