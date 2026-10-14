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
            email: "bagireddy2008@gmail.com", // <-- REPLACE with Bhargavi's actual email
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
    // 5. Birthday Fun Wheel of Surprises (Section 3)
    // ------------------------------------------
    // You can edit, add, or customize any of the options below!
    // The very first outcome she gets will be sent to your email automatically.
    wheelOptions: [
        { label: "Treat From Dinesh", icon: "🍕", desc: "Dinesh will treat you to your favorite meal or snacks!" },
        { label: "Dare For Kireeti", icon: "😈", desc: "Kireeti has to do any 1 funny dare you give him!" },
        { label: "Coffee From Bhargavi", icon: "☕", desc: "Bhargavi treats you to coffee and your favorite dessert!" },
        { label: "Queen For A Day", icon: "👑", desc: "All 3 of us must follow your hangout plan with zero complaints!" },
        { label: "Movie+Biryani treat from kireeti", icon: "🎤", desc: "Dinesh, Kireeti & Bhargavi will sing you a birthday song on call!" },
        { label: "Secret Trio Wish", icon: "✨", desc: "One custom wish granted by all three of us together!" }
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
