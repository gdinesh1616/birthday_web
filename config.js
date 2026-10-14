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
    senderName: "Dinesh, Kireeti & Bhargavi",            // Your names
    birthdayDate: "15/10",

    // ------------------------------------------
    // 2. Personal Email Delivery Configuration (Section 4)
    // ------------------------------------------
    // She can choose whom to send her personal note to (Dinesh, Kireeti, or Bhargavi)!
    // Each person's note will be delivered directly to their own inbox.
    // Replace the email placeholders below with Kireeti and Bhargavi's real email addresses:
    recipients: {
        dinesh: {
            name: "Dinesh",
            avatar: "👑",
            email: "gdinesh1616@gmail.com",
            formspreeEndpoint: "https://formspree.io/f/xjygeadw" // Dinesh's active endpoint
        },
        kireeti: {
            name: "Kireeti",
            avatar: "⚡",
            email: "krishnakireeti.n@gmail.com", // <-- REPLACE with Kireeti's actual email
            formspreeEndpoint: "" // Optional: paste Kireeti's Formspree endpoint if created
        },
        bhargavi: {
            name: "Bhargavi",
            avatar: "🌸",
            email: "bhargavi_email@gmail.com", // <-- REPLACE with Bhargavi's actual email
            formspreeEndpoint: "" // Optional: paste Bhargavi's Formspree endpoint if created
        }
    },
    // Global fallback email
    yourEmail: "gdinesh1616@gmail.com",

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
            "Happy Birthday to someone who brings so much light, laughter, and genuine warmth into all our lives! On this special day, we wanted to create something truly unique together just for you to celebrate how wonderful and irreplaceable you are.",
            "Through every high and low, every late-night conversation, and all the crazy, silly moments we've shared, having you as our best friend has been one of our greatest blessings. Your kindness, your spirit, and your smile make our world a much brighter place.",
            "May this upcoming year bring you endless happiness, boundless adventures, success in everything your heart desires, and memories that make you smile whenever you look back.",
            "Never forget how truly valued, appreciated, and cherished you are by all three of us. Happy Birthday! ❤️"
        ],
        signOff: "With all our love and warmest wishes,",
        signature: "Dinesh, Kireeti & Bhargavi"
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
            description: "",
            image: "assets/images/img_1.jpeg",
            tag: "Chapter 1"
        },
        {
            date: "Unforgettable Moments",
            title: "Endless Laughter & Crazy Stories",
            description: "Remember all those times we couldn't stop laughing over the most random nonsense? Moments like that with you are pure gold.",
            image: "assets/images/img_2.jpeg",
            tag: "Good Times"
        },
        {
            date: "Little Her",
            title: "The Little Girl You Were",
            description: "A tiny glimpse of the little girl you once were, carrying the same beautiful smile that makes you special today.",
            image: "assets/images/img_3.jpeg",
            tag: "Childhood"
        },
        {
            date: "Swag Since Day One",
            title: "Born To Shine",
            description: "Rocking the shades and that effortless cool charm from the very beginning!",
            image: "assets/images/img_4.jpeg",
            tag: "Childhood"
        },
        {
            date: "Today & Forever",
            title: "Celebrating Another Year of You",
            description: "",
            image: "assets/images/img_5.jpeg",
            tag: "Happy Birthday"
        }
    ]
};
