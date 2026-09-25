// Original question wording. Factual sources: the linked Wikipedia articles.
// Each source group contains one question at each of four editorial difficulty tiers.
export const CATEGORIES = [
  { id:'history', name:'History', symbol:'⌛', color:'#bf8e64' },
  { id:'geography', name:'Geography', symbol:'◈', color:'#81aaa2' },
  { id:'nature', name:'Natural world', symbol:'❧', color:'#a3b879' },
  { id:'science', name:'Science', symbol:'✧', color:'#92a9d0' },
  { id:'arts', name:'Arts & music', symbol:'♫', color:'#c696ac' },
  { id:'literature', name:'Literature', symbol:'❦', color:'#c5a978' },
  { id:'games', name:'Sports & games', symbol:'♜', color:'#b9b0d3' },
  { id:'technology', name:'Inventions', symbol:'⚙', color:'#d1a66b' },
  { id:'language', name:'Language', symbol:'Ω', color:'#83b9ba' },
];
export const sourceURL = title => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
const groups = [
['history','Ancient Egypt',[
['Which river sustained ancient Egyptian agriculture?','Nile|Danube|Amazon|Indus','Seasonal Nile flooding and irrigation supported farming.'],
['Which title is associated with the rulers of ancient Egypt?','Pharaoh|Consul|Shogun|Doge','The pharaoh stood at the head of Egyptian government.'],
['Which material did Egyptians make from a wetland plant for writing?','Papyrus|Porcelain|Vellum|Silk','Papyrus sheets were made from the stems of the papyrus plant.'],
['Which ancient Egyptian official oversaw administration beneath the pharaoh?','Vizier|Tribune|Ephor|Archon','The vizier coordinated major government responsibilities.'],
]],
['history','Rosetta Stone',[
['The Rosetta Stone helped scholars decipher which writing system?','Egyptian hieroglyphs|Maya glyphs|Linear A|Rongorongo','Parallel inscriptions helped unlock Egyptian writing.'],
['Which language appears in the lowest inscription on the Rosetta Stone?','Ancient Greek|Latin|Sanskrit|Akkadian','The lower text is Greek; the other two use Egyptian scripts.'],
['In which year was the Rosetta Stone found by French forces?','1799|1492|1822|1922','It was found at Fort Julien near Rashid in 1799.'],
['Which king is named in the decree recorded on the Rosetta Stone?','Ptolemy V|Ramesses II|Akhenaten|Tutankhamun','The decree was issued in 196 BCE for Ptolemy V.'],
]],
['history','Printing press',[
['What does a printing press transfer onto a surface such as paper?','Ink|Molten glass|Electric charge only|Woven thread','A press applies pressure to an inked surface to make an impression.'],
['Who developed a movable-type printing press in fifteenth-century Europe?','Johannes Gutenberg|Isaac Newton|Galileo Galilei|James Watt','Gutenberg combined several techniques into a practical printing system.'],
['Which kind of ink did Gutenberg use for printing with metal type?','Oil-based ink|Invisible ink|Water alone|Chalk dust','Oil-based ink worked well with metal printing type.'],
['Which three metals formed Gutenberg’s type alloy?','Lead, tin, antimony|Iron, nickel, cobalt|Copper, silver, gold|Aluminum, zinc, magnesium','This alloy made durable, reproducible pieces of type.'],
]],
['geography','Africa',[
['The Sahara is on which continent?','Africa|Asia|Australia|South America','The Sahara spans much of northern Africa.'],
['Which sea borders Africa to the north?','Mediterranean Sea|Baltic Sea|Caribbean Sea|Bering Sea','The Mediterranean separates northern Africa from southern Europe.'],
['By area, where does Africa rank among the continents?','Second|First|Third|Fourth','Only Asia has a larger land area.'],
['Which strait separates northwestern Africa from mainland Europe?','Strait of Gibraltar|Strait of Malacca|Bering Strait|Bass Strait','The Strait of Gibraltar lies between Morocco and Spain.'],
]],
['geography','Andes',[
['Along which continent do the Andes run?','South America|Europe|Africa|Australia','The Andes follow the western side of South America.'],
['Which ocean lies west of the Andes?','Pacific Ocean|Atlantic Ocean|Indian Ocean|Arctic Ocean','The mountains run near South America’s Pacific coast.'],
['What is the highest peak in the Andes?','Aconcagua|Kilimanjaro|Denali|Mont Blanc','Aconcagua is in Argentina and rises to about 6,961 metres.'],
['Across how many countries does the Andean mountain chain extend?','Seven|Three|Five|Ten','It extends from Venezuela south to Chile and Argentina.'],
]],
['geography','Japan',[
['What is the capital of Japan?','Tokyo|Kyoto|Osaka|Sapporo','Tokyo is Japan’s capital.'],
['Japan’s islands lie in which ocean?','Pacific Ocean|Atlantic Ocean|Arctic Ocean|Southern Ocean','Japan is an island country off the eastern coast of Asia.'],
['Which Japanese island contains both Tokyo and Kyoto?','Honshu|Hokkaido|Shikoku|Kyushu','Honshu is the largest of Japan’s main islands.'],
['Which is Japan’s largest freshwater lake?','Lake Biwa|Lake Baikal|Lake Toba|Lake Victoria','Lake Biwa is an ancient lake in Shiga Prefecture.'],
]],
['nature','Photosynthesis',[
['Which energy source drives photosynthesis in green plants?','Sunlight|Sound|Wind|Magnetism','Photosynthesis converts light energy into chemical energy.'],
['Which gas do green plants release during oxygenic photosynthesis?','Oxygen|Helium|Methane|Argon','Oxygen is released by the light-dependent reactions.'],
['In which organelles does photosynthesis occur in plants?','Chloroplasts|Ribosomes|Lysosomes|Centrioles','Chloroplasts contain the membranes and pigments needed for photosynthesis.'],
['The oxygen released by plant photosynthesis comes directly from splitting what?','Water|Carbon dioxide|Glucose|Nitrogen','Water is split during the light-dependent reactions.'],
]],
['nature','Octopus',[
['How many arms does a typical octopus have?','Eight|Six|Ten|Twelve','Octopuses are eight-armed molluscs.'],
['An octopus belongs to which animal group?','Molluscs|Reptiles|Crustaceans|Mammals','Octopuses are cephalopod molluscs.'],
['How many hearts does an octopus have?','Three|One|Two|Four','Two hearts supply the gills; one supplies the rest of the body.'],
['Which oxygen-carrying protein contributes to an octopus’s blue blood?','Hemocyanin|Hemoglobin|Keratin|Collagen','Hemocyanin contains copper and carries oxygen in the blood.'],
]],
['nature','Honey bee',[
['Which sweet substance do honey bees produce and store?','Honey|Maple syrup|Molasses|Caramel','Honey is produced from nectar and stored in the nest.'],
['What are male honey bees called?','Drones|Workers|Queens|Nymphs','Drones are the male members of a honey bee colony.'],
['What behavior communicates the location of food to other workers?','Waggle dance|Wing shedding|Nest abandonment|Winter hibernation','Foraging bees communicate resource information through dance.'],
['Honey bees belong to which genus?','Apis|Bombus|Vespa|Formica','Apis is the honey bee genus; Bombus contains bumblebees.'],
]],
['science','Solar System',[
['Which star is at the center of our Solar System?','The Sun|Sirius|Polaris|Vega','The Solar System is gravitationally bound to the Sun.'],
['Which planet is the largest in our Solar System?','Jupiter|Earth|Saturn|Neptune','Jupiter is the largest of the eight planets.'],
['Between which two planets is the main asteroid belt?','Mars and Jupiter|Earth and Mars|Jupiter and Saturn|Uranus and Neptune','The main asteroid belt lies beyond Mars and inside Jupiter’s orbit.'],
['Which pair of planets is classified as ice giants?','Uranus and Neptune|Jupiter and Saturn|Venus and Earth|Mercury and Mars','Uranus and Neptune differ in composition from the gas giants.'],
]],
['science','Atom',[
['What is the central part of an atom called?','Nucleus|Crust|Membrane|Mantle','The nucleus contains protons and, in most atoms, neutrons.'],
['Which particle has a negative electric charge?','Electron|Proton|Neutron|Photon','Electrons carry negative charge.'],
['What determines the chemical element of an atom?','Number of protons|Number of neutrons|Number of electron shells|Its temperature','The proton count is the atomic number.'],
['Isotopes of one element differ in their number of what?','Neutrons|Protons|Quarks per proton|Positive charges per proton','Isotopes share an atomic number but have different neutron counts.'],
]],
['science','Sound',[
['Sound is produced by what kind of motion?','Vibration|Constant position|Perfect stillness|Uniform color change','Sound propagates as a mechanical disturbance through a medium.'],
['Which unit measures the frequency of a sound wave?','Hertz|Joule|Pascal|Kelvin','One hertz means one cycle per second.'],
['Why can ordinary sound not travel through a perfect vacuum?','There is no material medium|Gravity is too strong|Light blocks it|It has no color','Sound requires matter through which vibrations can propagate.'],
['In air, sound travels mainly as which kind of wave?','Longitudinal|Transverse electromagnetic|Standing light|Gravitational','Air particles oscillate parallel to the wave’s direction of travel.'],
]],
['arts','Piano',[
['Which part of a piano does a player normally press with their fingers?','Keys|Strings directly|Tuning pins|Soundboard','A piano keyboard controls the action inside the instrument.'],
['What strikes the strings inside an acoustic piano?','Hammers|Plectrums|Bows|Air jets','Pressing a key operates a hammer that strikes strings.'],
['How many keys does a typical modern full-size piano have?','88|64|72|96','The standard keyboard has 52 white keys and 36 black keys.'],
['Who is credited with inventing the piano?','Bartolomeo Cristofori|Antonio Stradivari|Adolphe Sax|Theobald Boehm','Cristofori developed the instrument around 1700 in Italy.'],
]],
['arts','Mona Lisa',[
['Who painted the Mona Lisa?','Leonardo da Vinci|Vincent van Gogh|Claude Monet|Pablo Picasso','Leonardo painted the portrait during the Italian Renaissance.'],
['Which Paris museum houses the Mona Lisa?','Louvre|Musée d’Orsay|Centre Pompidou|Musée Rodin','The painting belongs to the Louvre’s collection.'],
['The Mona Lisa is painted on a panel of which wood?','Poplar|Mahogany|Bamboo|Ebony','The painting uses oil on a poplar panel.'],
['The portrait is generally identified as depicting which woman?','Lisa del Giocondo|Isabella d’Este|Catherine de’ Medici|Artemisia Gentileschi','Lisa del Giocondo is the generally accepted sitter.'],
]],
['arts','Sonnet',[
['A traditional sonnet has how many lines?','Fourteen|Eight|Twelve|Twenty','The sonnet is traditionally a fourteen-line poetic form.'],
['The sonnet originated in which country?','Italy|Japan|Egypt|Norway','Its origins are associated with medieval Sicily.'],
['How is a typical Petrarchan sonnet divided?','Octave and sestet|Two equal septets|Three quintains|Four tercets','An octave of eight lines is followed by a sestet of six.'],
['What is the turn in thought in a sonnet often called?','Volta|Coda|Refrain|Caesura','The volta marks a turn or shift in the poem’s argument.'],
]],
['literature','William Shakespeare',[
['Who wrote Hamlet?','William Shakespeare|Charles Dickens|Jane Austen|John Milton','Hamlet is one of Shakespeare’s tragedies.'],
['In which English town was Shakespeare born?','Stratford-upon-Avon|Bath|York|Canterbury','Shakespeare was born in Stratford-upon-Avon.'],
['Which London theatre is closely associated with Shakespeare’s company?','Globe|La Scala|Odéon|Bolshoi','The company built the Globe Theatre in 1599.'],
['How many sonnets are in Shakespeare’s collection published in 1609?','154|100|128|200','The 1609 collection contains 154 sonnets.'],
]],
['literature','The Hobbit',[
['Who is the hobbit at the center of The Hobbit?','Bilbo Baggins|Frodo Baggins|Samwise Gamgee|Meriadoc Brandybuck','Bilbo leaves home to join the dwarves’ quest.'],
['What is the name of the dragon in The Hobbit?','Smaug|Glaurung|Ancalagon|Saphira','Smaug occupies the dwarves’ former home and treasure.'],
['In which year was The Hobbit first published?','1937|1917|1954|1967','J. R. R. Tolkien’s novel was first published in 1937.'],
['Which dwarf leads the company that hires Bilbo?','Thorin Oakenshield|Balin|Gimli|Dáin Ironfoot','Thorin leads the expedition to reclaim the Lonely Mountain.'],
]],
['literature','Homer',[
['Homer is traditionally associated with literature in which language?','Ancient Greek|Latin|Old English|Sanskrit','The Homeric epics are works of ancient Greek poetry.'],
['Which two epics are traditionally attributed to Homer?','Iliad and Odyssey|Aeneid and Metamorphoses|Beowulf and Edda|Inferno and Purgatorio','The Iliad and Odyssey are the two Homeric epics.'],
['Whose journey home is the central subject of the Odyssey?','Odysseus|Achilles|Hector|Agamemnon','The Odyssey follows Odysseus’s return from the Trojan War.'],
['In which meter are the Homeric epics composed?','Dactylic hexameter|Iambic pentameter|Trochaic tetrameter|Anapestic trimeter','The epics use dactylic hexameter, the Greek epic meter.'],
]],
['games','Chess',[
['How many squares are on a standard chessboard?','64|49|81|100','The board has eight rows and eight columns.'],
['Which chess piece moves in an L-shaped pattern?','Knight|Bishop|Rook|King','A knight moves two squares along one axis and one along the other.'],
['Which special move involves both a king and a rook?','Castling|En passant|Promotion|Forking','Castling moves the king and one rook under specific conditions.'],
['Which special pawn capture must occur immediately after an opposing pawn’s two-square advance?','En passant|Castling|Promotion|Stalemate','En passant is available only on the immediately following move.'],
]],
['games','Basketball',[
['In standard basketball, what is the target for scoring?','An elevated hoop|A ground-level net|A wicket|A finish line','Points are scored by putting the ball through the basket.'],
['How many players from each team are normally on court?','Five|Six|Seven|Eleven','Standard basketball uses two teams of five on the court.'],
['Who invented basketball in 1891?','James Naismith|William Morgan|Walter Camp|Abner Doubleday','Naismith devised the game as an indoor activity.'],
['In which Massachusetts city was basketball invented?','Springfield|Boston|Salem|Worcester','Naismith developed basketball in Springfield, Massachusetts.'],
]],
['games','Olympic Games',[
['How many interlocking rings are in the Olympic symbol?','Five|Four|Six|Seven','The Olympic symbol contains five interlocking rings.'],
['The ancient Olympic Games took place in which civilization?','Ancient Greece|Ancient Egypt|Han China|Inca Empire','The ancient festival was held at Olympia in Greece.'],
['Which city hosted the first modern Olympic Games in 1896?','Athens|Paris|London|Rome','Athens hosted the first modern Games.'],
['Who founded the International Olympic Committee in 1894?','Pierre de Coubertin|Jules Rimet|James Naismith|Avery Brundage','Coubertin helped establish the IOC and revive the Games.'],
]],
['technology','World Wide Web',[
['What do you normally use to view pages on the World Wide Web?','Web browser|Compiler|Disk formatter|Device driver','Browsers retrieve and display web pages.'],
['Who invented the World Wide Web?','Tim Berners-Lee|Alan Turing|Charles Babbage|Alexander Graham Bell','Berners-Lee invented the Web while working at CERN.'],
['What does the H in HTML stand for?','HyperText|High-speed|Hardware|Hierarchical','HTML stands for HyperText Markup Language.'],
['At which research organization was the Web developed?','CERN|NASA|Bell Labs|Royal Society','The Web began at CERN as a way to share information.'],
]],
['technology','Steam engine',[
['What working fluid powers a steam engine?','Steam|Liquid mercury|Compressed helium|Molten salt','Steam engines use steam to perform mechanical work.'],
['A steam engine is an example of what kind of engine?','External combustion|Internal combustion|Ion propulsion|Electric induction','Heat is supplied outside the working cylinder or turbine.'],
['What improvement helped James Watt’s engine use less fuel?','A separate condenser|A spark plug|A carburetor|A diesel injector','A separate condenser reduced repeated heating and cooling of the cylinder.'],
['Whose atmospheric engine preceded Watt’s improvements?','Thomas Newcomen|Rudolf Diesel|Nikolaus Otto|Frank Whittle','Newcomen’s atmospheric engine was used for pumping water.'],
]],
['technology','Bicycle',[
['How many wheels does a conventional bicycle have?','Two|One|Three|Four','A conventional bicycle has two wheels arranged in line.'],
['On a typical chain-driven bicycle, which wheel is driven by the pedals?','Rear wheel|Front wheel|Both equally|Neither wheel','The chain transfers power to a sprocket on the rear wheel.'],
['What mechanism shifts a bicycle chain between sprockets?','Derailleur|Caliper|Headset|Spoke nipple','A derailleur moves the chain sideways to another sprocket.'],
['In a lower gear, one pedal revolution produces what?','Fewer rear-wheel revolutions|More rear-wheel revolutions|Exactly one wheel revolution|No chain movement','A low gear trades distance per pedal turn for easier pedaling.'],
]],
['language','Spanish language',[
['Spanish belongs to which language group?','Romance|Germanic|Slavic|Celtic','Spanish is a Romance language descended from Latin.'],
['From which earlier language did Spanish develop?','Vulgar Latin|Old Norse|Classical Arabic|Sanskrit','Spanish evolved from spoken Latin on the Iberian Peninsula.'],
['What other name is commonly used for the Spanish language?','Castilian|Catalan|Galician|Basque','Castilian refers to its origins in the region of Castile.'],
['Which historical kingdom gave Castilian its name?','Castile|Wessex|Bavaria|Burgundy','The language originated in the Kingdom of Castile.'],
]],
['language','Braille',[
['Braille is primarily read using which sense?','Touch|Hearing|Smell|Taste','Raised dot patterns can be read with the fingertips.'],
['Who developed the writing system called braille?','Louis Braille|Louis Pasteur|Alexander Bell|Samuel Morse','Louis Braille developed the system in nineteenth-century France.'],
['How many dot positions are in a traditional braille cell?','Six|Four|Eight|Ten','A traditional cell has two columns of three dot positions.'],
['Including the blank cell, how many patterns are possible in a six-dot cell?','64|32|36|128','Six on-or-off positions give 2 to the sixth power: 64 patterns.'],
]],
['language','Greek alphabet',[
['Which letter begins the Greek alphabet?','Alpha|Beta|Gamma|Delta','Alpha is the first letter of the Greek alphabet.'],
['Which letter ends the standard Greek alphabet?','Omega|Sigma|Psi|Phi','Omega is its final letter.'],
['How many letters are in the standard Greek alphabet?','24|26|28|22','The standard Greek alphabet contains 24 letters.'],
['The Greek alphabet was adapted from which earlier alphabet?','Phoenician|Cyrillic|Runic|Hangul','Greek adapted the Phoenician alphabet and developed vowel letters.'],
]],
];
export const QUESTIONS = groups.flatMap(([category, source, rows], group) => rows.map(([prompt, answers, explanation], index) => {
  const choices = answers.split('|');
  return { id: `lantern-${String(group * 4 + index + 1).padStart(3,'0')}`, category, level:index+1, prompt, choices, answer:choices[0], explanation, source, url:sourceURL(source), checked:'2026-09-25' };
}));
