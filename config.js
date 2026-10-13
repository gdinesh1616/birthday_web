// ==========================================
// BIRTHDAY EXPERIENCE CONFIGURATION
// ==========================================
// You can edit any of the details below to personalize the website!

const CONFIG = {
    // ------------------------------------------
    // 1. Basic Details
    // ------------------------------------------
    friendName: "Nandhitha", // Change this to her name (e.g. "Ananya", "Sneha", etc.)
    friendNickname: "Nandu", 
    senderName: "Kireeti",            // Your name
    birthdayDate: "15/10",

    // ------------------------------------------
    // 2. Email Delivery Configuration (Section 4)
    // ------------------------------------------
    // To receive her letter directly in your email:
    // 1. Go to https://formspree.io (100% free)
    // 2. Create a new form and copy the endpoint URL (e.g. "https://formspree.io/f/xknqyzab")
    // 3. Paste the URL here:
    formspreeEndpoint: "https://formspree.io/f/xjygeadw", // e.g. "https://formspree.io/f/your_form_id"
    yourEmail: "gdinesh1616@gmail.com", // Fallback email address

    // ------------------------------------------
    // 3. Audio & Music
    // ------------------------------------------
    // You can put an MP3 file inside "assets/audio/music.mp3" and set musicPath to "assets/audio/music.mp3"
    // If left empty, our built-in soothing Web-Audio synthesizer will play a dreamy ambient melody!
    musicPath: "", 

    // ------------------------------------------
    // 4. Letter Content (Section 2)
    // ------------------------------------------
    letter: {
        salutation: "Dearest,",
        paragraphs: [
            "Happy Birthday to someone who brings so much light, laughter, and genuine warmth into my life. On this special day, I wanted to create something truly unique just for you to celebrate how wonderful you are.",
            "Through every high and low, every random late-night conversation, and all the silly moments we've shared, having you as a friend has been one of the greatest blessings. Your kindness, your spirit, and your smile make the world a much brighter place.",
            "May this upcoming year bring you endless happiness, boundless adventures, success in everything your heart desires, and memories that make you smile whenever you look back.",
            "Never forget how truly valued, appreciated, and cherished you are. Happy Birthday! ❤️"
        ],
        signOff: "With all my love and best wishes,",
        signature: "Kireeti"
    },

    // ------------------------------------------
    // 5. Friendship Quiz / Questions (Section 3)
    // ------------------------------------------
    quiz: [
        {
            question: "What is your official superpower in our friendship?",
            options: [
                "Making me laugh until my stomach hurts",
                "Giving the best advice at just the right time",
                "Being the most photogenic person ever",
                "All of the above (and looking gorgeous while doing it!)"
            ],
            correctIndex: 3,
            feedback: "100% correct! You truly have all the superpowers! ✨"
        },
        {
            question: "If we had an all-expenses-paid trip tomorrow, where are we heading?",
            options: [
                "A quiet cozy mountain cabin under the stars",
                "A tropical beach with iced drinks & sunsets",
                "An amusement park screaming on rollercoasters",
                "A road trip singing our hearts out to good music"
            ],
            correctIndex: 3,
            feedback: "Pack your bags, that adventure is definitely on our bucket list! 🚗✨"
        },
        {
            question: "Who is officially the more dramatic one between us?",
            options: [
                "Definitely you",
                "Definitely me (Dinesh)",
                "It's a very tight 50/50 competition",
                "Neither, we are pure angels 😇"
            ],
            correctIndex: 2,
            feedback: "Haha, let's be honest, it's definitely a tight competition! 😂"
        },
        {
            question: "How awesome is today going to be?",
            options: [
                "Great",
                "Unforgettable",
                "Legendary",
                "Beyond magical because it's YOUR birthday!"
            ],
            correctIndex: 3,
            feedback: "Bingo! Today is all about you! Enjoy every single second! 💖"
        }
    ],

    // ------------------------------------------
    // 6. Memory Timeline (Section 4)
    // ------------------------------------------
    timeline: [
        {
            date: "The Beginning",
            title: "Where It All Started",
            description: "The very first time we crossed paths and started talking. Little did I know how important you would become in my life.",
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
            tag: "Chapter 1"
        },
        {
            date: "Unforgettable Moments",
            title: "Endless Laughter & Crazy Stories",
            description: "Remember that day we couldn't stop laughing over the most random nonsense? Moments like that are pure gold.",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
            tag: "Good Times"
        },
        {
            date: "Always There",
            title: "Through Thick & Thin",
            description: "No matter how busy life gets, knowing I can always count on your support and honesty means everything to me.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            tag: "Gratitude"
        },
        {
            date: "Today & Forever",
            title: "Celebrating Another Year of You",
            description: "Here's to celebrating you today, and looking forward to many more amazing years and unforgettable memories together!",
            image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
            tag: "Happy Birthday"
        }
    ]
};
