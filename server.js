import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Consistent structure: all quotes have id and text
let quotes = [
    {
        id: 0,
        text: "Focus on the outcome not the obstacle",
    }
];
let id = 1;

//  Root endpoint
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Get all quotes
app.get("/quotes", (req, res) => {
    res.json(quotes);
});

// Add a new quote
app.post("/quotes", (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Quote text is required" });
    }
    const newQuote = { id: id++, text };
    quotes.push(newQuote);
    res.status(201).json(newQuote);
});

// Update a quote by ID
app.put("/quotes/:id", (req, res) => {
    const quoteId = parseInt(req.params.id);
    const { text } = req.body;
    const quote = quotes.find((q) => q.id === quoteId);
    if (quote) {
        quote.text = text;
        res.json(quote);
    } else {
        res.status(404).json({ error: "Quote not found" });
    }
});

// Delete a quote by ID
app.delete("/quotes/:id", (req, res) => {
    const quoteId = parseInt(req.params.id);
    const index = quotes.findIndex((q) => q.id === quoteId);
    if (index !== -1) {
        const deleted = quotes.splice(index, 1);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ error: "Quote not found" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));