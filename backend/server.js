const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'shopzone_fallback_jwt_key_2026';

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

function readDatabase() {
    const initialData = {
        users: [],
        orders: [],
        products: [
            {
                _id: "prod_1",
                name: "iPhone 16 Pro",
                category: "Phones",
                price: 119900,
                tag: "New",
                image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
                stock: 8,
                description: "Experience premium power with the iPhone 16 Pro, featuring a sleek titanium architecture, cutting-edge camera performance, and ultra-smooth refresh rates."
            },
            {
                _id: "prod_2",
                name: "Samsung Galaxy S25",
                category: "Phones",
                price: 79999,
                tag: "Trending",
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80",
                stock: 10,
                description: "The peak of Android hardware. Samsung Galaxy S25 delivers advanced pro-grade photography sensors, high-speed processing, and striking display clarity."
            },
            {
                _id: "prod_3",
                name: "OnePlus 13",
                category: "Phones",
                price: 64999,
                tag: "New",
                image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
                stock: 12,
                description: "Fast and fluid flagship experience. Powered by premium processors, offering ultra-rapid warp charging speeds and a cinematic display panel."
            },
            {
                _id: "prod_4",
                name: "Google Pixel 10",
                category: "Phones",
                price: 75999,
                tag: "Hot",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
                stock: 7,
                description: "Pure Android computing at its best. Features revolutionary computational camera frameworks, minimalist chassis aesthetics, and seamless AI assistance tools."
            },
            {
                _id: "prod_5",
                name: "MacBook Air M5",
                category: "Laptops",
                price: 134900,
                tag: "Hot",
                image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80",
                stock: 6,
                description: "Incredibly thin, lightning fast, and silent. Supercharged by the revolutionary M5 chip to bring extreme battery life and flawless development efficiency."
            },
            {
                _id: "prod_6",
                name: "Dell XPS 15",
                category: "Laptops",
                price: 145000,
                tag: "Premium",
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80",
                stock: 5,
                description: "Official workspace grade build. Features sleek carbon-fiber composite palm rests, zero-border InfinityEdge screens, and supreme graphic compiling processing speeds."
            },
            {
                _id: "prod_7",
                name: "Sony WH-1000XM6",
                category: "Audio",
                price: 32999,
                tag: "New",
                image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80",
                stock: 12,
                description: "Next-generation industry-leading audio. Offers unmatched noise cancellation capabilities, tailored smart listing filters, and luxury memory foam comfort."
            },
            {
                _id: "prod_8",
                name: "AirPods Pro",
                category: "Audio",
                price: 24900,
                tag: "Sale",
                image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
                stock: 15,
                description: "True wireless earbuds optimized for immersive sound profiles. Features customizable active noise cancellations and dynamic spatial sound fields."
            },
            {
                _id: "prod_9",
                name: "Bluetooth Speaker",
                category: "Audio",
                price: 8999,
                tag: "Trending",
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80",
                stock: 18,
                description: "Crisp structural wireless acoustics housing deep booming subwoofers. Rugged weather-sealed exterior engineered for full 360-degree clear room projections."
            },
            {
                _id: "prod_10",
                name: "Gaming Mouse",
                category: "Gaming",
                price: 4500,
                tag: "Hot",
                image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
                stock: 25,
                description: "Ultra-responsive high polling rates, precision optical laser tracking accuracy, and premium ergonomic chassis design built to accelerate command tracks."
            },
            {
                _id: "prod_11",
                name: "RGB Keyboard",
                category: "Gaming",
                price: 5500,
                tag: "New",
                image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
                stock: 20,
                description: "Premium tactile mechanical gaming switches equipped with gorgeous customizable multi-layered backlighting matrices for immediate keystroke feedback."
            },
            {
                _id: "prod_12",
                name: "Gaming Controller",
                category: "Gaming",
                price: 4999,
                tag: "Pro Gear",
                image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80",
                stock: 14,
                description: "Ergonomic pro-style gamepad featuring ultra-responsive thumbsticks, dual vibration haptic rumble feedback motors, and cross-platform compatibility mapping."
            },
            {
                _id: "prod_13",
                name: "Canon EOS R50",
                category: "Cameras",
                price: 65000,
                tag: "Trending",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
                stock: 7,
                description: "A compact mirrorless travel camera designed for creators. Delivers sharp 4K recording clarity, a bright layout, and intelligent auto-focus target locking."
            },
            {
                _id: "prod_14",
                name: "Fast Charger 65W",
                category: "Accessories",
                price: 2999,
                tag: "Essential",
                image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
                stock: 40,
                description: "High-density multi-port wall charger utility engineered with GaN hardware to rapidly charge laptops, tablets, and mobile flagships safely."
            },
            {
                _id: "prod_15",
                name: "Power Bank 20000mAh",
                category: "Accessories",
                price: 3999,
                tag: "Sale",
                image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&auto=format&fit=crop&q=80",
                stock: 30,
                description: "Sleek, high-capacity portable power station with modern smart delivery safety circuitry to charge your devices multiple times over on the go."
            },
            {
                _id: "prod_16",
                name: "Digital Watch",
                category: "Electronics",
                price: 18500,
                tag: "Hot",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
                stock: 14,
                description: "Beautiful minimalist luxury smartwatch design isolated against a pure clean setting. Tracks continuous training metrics, active vitals, and incoming relays."
            }
        ]
    };

    // Loops fix: This writes to data.json ONLY if the file doesn't exist yet!
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeDatabase(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

readDatabase();
console.log('Connected to Local File Database Utility successfully.');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password) return res.status(400).json({ success: false, message: 'Required fields missing.' });

        const db = readDatabase();
        if (db.users.find(u => u.username === username.toLowerCase())) {
            return res.status(400).json({ success: false, message: 'Username is already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.users.push({ 
            _id: 'user_' + Date.now(), 
            username: username.toLowerCase(), 
            email: email || '',
            password: hashedPassword 
        });
        writeDatabase(db);
        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server registration error.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = readDatabase();
        const user = db.users.find(u => u.username === username.toLowerCase());

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token, username: user.username });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server login error.' });
    }
});

app.get('/api/products', (req, res) => {
    res.json(readDatabase().products);
});

app.get('/api/products/:id', (req, res) => {
    const product = readDatabase().products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
});

app.post('/api/orders', authenticateToken, (req, res) => {
    try {
        const { items, total } = req.body;
        const db = readDatabase();

        for (const item of items) {
            const targetProd = db.products.find(p => p._id === item.product.id);
            if (!targetProd || targetProd.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product.name}.` });
            }
        }

        items.forEach(item => {
            const targetProd = db.products.find(p => p._id === item.product.id);
            targetProd.stock -= item.quantity;
        });

        const newOrder = {
            _id: 'ORD_' + Math.floor(100000 + Math.random() * 900000),
            username: req.user.username,
            items,
            total,
            date: new Date().toISOString()
        };

        db.orders.push(newOrder);
        writeDatabase(db);
        res.status(201).json({ success: true, orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error processing order.' });
    }
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const userOrders = readDatabase().orders
        .filter(o => o.username === req.user.username)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(userOrders);
});

app.listen(PORT, () => console.log(`Express server running on http://localhost:${PORT}`));