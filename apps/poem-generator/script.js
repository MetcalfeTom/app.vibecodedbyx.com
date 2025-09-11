const poemData = {
    adventure: {
        starters: [
            "ACROSS THE ROLLING WAVES WE SAIL",
            "BENEATH THE STARLIT PIRATE FLAG",
            "THROUGH MISTS OF LEGEND AND OF TALE",
            "WITH CUTLASS GLEAMING IN THE GALE",
            "BEYOND THE EDGE OF CHARTED SEAS"
        ],
        middles: [
            "WHERE KRAKEN DWELL AND SIRENS SING",
            "THROUGH STORMS THAT RAGE AND TEMPESTS ROAR",
            "PAST ISLANDS WILD AND UNEXPLORED",
            "WHERE CANNONS BOOM AND SABERS RING",
            "THROUGH WATERS DARK AND MYSTERIES DEEP"
        ],
        endings: [
            "WE FIND OUR FORTUNE OR OUR DOOM!",
            "ADVENTURE CALLS FROM EVERY SHORE!",
            "THE PIRATE'S LIFE FOREVER MORE!",
            "OUR LEGEND ECHOES THROUGH THE GLOOM!",
            "WHERE BRAVE HEARTS SAIL AND SPIRITS SOAR!"
        ]
    },
    treasure: {
        starters: [
            "BURIED DEEP BENEATH THE SAND",
            "MARKED BY X UPON THE MAP",
            "HIDDEN IN A PIRATE'S HAND",
            "LOCKED AWAY IN DAVY'S TRAP",
            "GLEAMING GOLD AND SILVER BRIGHT"
        ],
        middles: [
            "LIES A CHEST OF PRECIOUS STONES",
            "DIAMONDS, RUBIES, EMERALDS GREEN",
            "DOUBLOONS AND ANCIENT BONES",
            "THE GREATEST TREASURE EVER SEEN",
            "PEARLS FROM DEPTHS UNKNOWN TO MAN"
        ],
        endings: [
            "AWAITING THOSE WHO DARE TO SEEK!",
            "FOR PIRATES BOLD AND BRAVE AND TRUE!",
            "THE RICHES OF THE CARIBBEAN!",
            "WORTH MORE THAN KINGDOMS OLD AND GRAND!",
            "ARRR, THE TREASURE CALLS TO YOU!"
        ]
    },
    battle: {
        starters: [
            "CANNONS ROAR ACROSS THE SEA",
            "STEEL MEETS STEEL IN MORTAL FIGHT",
            "BATTLE CRIES RING WILD AND FREE",
            "SHIPS COLLIDE IN FADING LIGHT",
            "PIRATES CLASH WITH ROYAL NAVY"
        ],
        middles: [
            "SMOKE AND FIRE FILL THE AIR",
            "BOARDING HOOKS AND GRAPPLING LINES",
            "CUTLASS FLASH WITHOUT A CARE",
            "THROUGH THE FOG THE BATTLE SHINES",
            "BRAVE MEN FALL BUT LEGENDS RISE"
        ],
        endings: [
            "VICTORY TO THE BOLD AND BRAVE!",
            "THE PIRATE FLAG FLIES HIGH TODAY!",
            "FREEDOM WON UPON THE WAVE!",
            "THE SEAS ARE OURS, COME WHAT MAY!",
            "ARRR, WE'VE WON THE FIGHT HOORAY!"
        ]
    },
    love: {
        starters: [
            "UPON THE DECK AT SUNSET'S GLOW",
            "A PIRATE'S HEART CAN LOVE SO TRUE",
            "BENEATH THE MOON'S ROMANTIC FLOW",
            "MY TREASURE ISN'T GOLD BUT YOU",
            "THE FAIREST MAIDEN OF THE SEA"
        ],
        middles: [
            "YOUR EYES LIKE STARS THAT GUIDE MY WAY",
            "THROUGH STORMS OF LIFE AND PASSION'S TIDE",
            "YOUR LOVE'S THE ANCHOR WHERE I'LL STAY",
            "FOREVER BY YOUR LOVING SIDE",
            "NO TREASURE CHEST COULD EVER HOLD"
        ],
        endings: [
            "MY HEART BELONGS TO YOU ALONE!",
            "A PIRATE'S LOVE BURNS BRIGHT AND TRUE!",
            "TOGETHER WE'LL SAIL INTO THE BLUE!",
            "THE RICHES THAT YOUR LOVE HAS SHOWN!",
            "ARRR, MY HEART WILL ALWAYS BE WITH YOU!"
        ]
    },
    storm: {
        starters: [
            "DARK CLOUDS GATHER IN THE SKY",
            "THE WIND HOWLS LIKE A BANSHEE'S CRY",
            "LIGHTNING SPLITS THE NIGHT IN TWO",
            "THE OCEAN ROARS AND MOUNTAINS HIGH",
            "WAVES CRASH OVER THE DECK SO TRUE"
        ],
        middles: [
            "THE SHIP IS TOSSED LIKE DRIFTWOOD SMALL",
            "THROUGH NATURE'S FURY WE MUST SAIL",
            "THE STORM TESTS ONE AND TESTS US ALL",
            "BUT PIRATE HEARTS WILL NEVER FAIL",
            "WE BATTLE MORE THAN WIND AND RAIN"
        ],
        endings: [
            "AND FIND CALM WATERS ONCE AGAIN!",
            "THE STORM WILL PASS, THE SUN WILL SHINE!",
            "WE'LL LIVE TO SAIL ANOTHER DAY!",
            "PIRATES WEATHER ANY PAIN!",
            "ARRR, THE SEA IS OUR DOMAIN!"
        ]
    }
};

function generatePoem() {
    const poemType = document.getElementById('poemType').value;
    const data = poemData[poemType];
    
    const starter = data.starters[Math.floor(Math.random() * data.starters.length)];
    const middle = data.middles[Math.floor(Math.random() * data.middles.length)];
    const ending = data.endings[Math.floor(Math.random() * data.endings.length)];
    
    const poem = `
        <div class="verse">
            <p>${starter},</p>
            <p>${middle},</p>
            <p>${ending}</p>
        </div>
        <div class="signature">
            <p>~ BY THE LEGENDARY PIRATE POET ~</p>
        </div>
    `;
    
    document.getElementById('poemOutput').innerHTML = poem;
}

function clearPoem() {
    document.getElementById('poemOutput').innerHTML = '<p>CLICK THE BUTTON ABOVE TO GENERATE YER FIRST LEGENDARY POEM, MATEY!</p>';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateBtn').addEventListener('click', generatePoem);
    document.getElementById('clearBtn').addEventListener('click', clearPoem);
});