const { execFile } = require("child_process");
const axios = require("axios");
const connection = require("../config/db");

const MODEL = process.env.OLLAMA_MODEL || "lfm2.5-thinking:1.2b-q4_K_M";
const OLLAMA_SERVER_URL = process.env.OLLAMA_SERVER_URL || "http://localhost:11434";

function buildProductContext(products) {
    if (!products || products.length === 0) {
        return "Không có sản phẩm nào trong cơ sở dữ liệu.";
    }

    return products
        .map((p) => {
            return `- ${p.name} (ID: ${p.id}) - Category: ${p.category || "N/A"}, Brand: ${p.brand || "N/A"}, Price: ${p.price} VND, Stock: ${p.stock_quantity}\n  Description: ${p.description || "Không có mô tả"}`;
        })
        .join("\n");
}

function createSystemPrompt(productContext) {
    return `Bạn là một trợ lý tư vấn sản phẩm tại TechForge trong vai trò Sales/Technical Consultant.
Bạn chỉ được phép trả lời dựa trên dữ liệu có sẵn trong cơ sở dữ liệu sản phẩm sau đây.
Nếu câu hỏi không nằm trong phạm vi sản phẩm, hãy trả lời một cách lịch sự rằng bạn chỉ hỗ trợ tư vấn sản phẩm hiện có.
Không tự suy đoán ngoài dữ liệu.

Dữ liệu sản phẩm:
${productContext}

Hãy trả lời ngắn gọn, thực tế và chuyên nghiệp cho khách hàng.`;
}

function runOllamaCli(prompt) {
    return new Promise((resolve, reject) => {
        execFile("ollama", ["run", MODEL, prompt], { timeout: 120000 }, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stderr, stdout });
            }
            resolve(stdout.trim());
        });
    });
}

async function runOllamaServer(prompt) {
    const response = await axios.post(`${OLLAMA_SERVER_URL}/v1/chat/completions`, {
        model: MODEL,
        messages: [
            { role: "system", content: "You are a product assistant. Only answer from provided product data." },
            { role: "user", content: prompt },
        ],
        temperature: 0.4,
    }, {
        timeout: 120000,
    });

    if (!response?.data?.choices?.length) {
        throw new Error("Ollama server không trả về nội dung.");
    }

    return response.data.choices[0].message?.content?.trim() || "";
}

async function runOllama(prompt) {
    // Nếu đang bật OLLAMA_USE_SERVER=true thì dùng HTTP API, nếu không thì dùng CLI.
    if (process.env.OLLAMA_USE_SERVER === "true") {
        return runOllamaServer(prompt);
    }

    // Nếu server có sẵn, dùng server ưu tiên để tránh CLI block.
    try {
        return await runOllamaServer(prompt);
    } catch (serverErr) {
        console.warn("Ollama server unavailable, fallback to CLI:", serverErr?.message || serverErr);
        return runOllamaCli(prompt);
    }
}

exports.handleChat = async (req, res) => {
    const userMessage = req.body?.message;

    if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ message: "Trường 'message' là bắt buộc và phải là chuỗi." });
    }

    const productSql = "SELECT id, name, category, brand, price, stock_quantity, description FROM products LIMIT 200";

    connection.query(productSql, async (err, products) => {
        if (err) {
            console.error("DB query error:", err);
            return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
        }

        const productContext = buildProductContext(products);
        const systemPrompt = createSystemPrompt(productContext);

        const finalPrompt = `${systemPrompt}\n\nKhách: ${userMessage}\nTrợ lý:`;

        try {
            const responseText = await runOllama(finalPrompt);
            return res.status(200).json({ reply: responseText });
        } catch (ollamaErr) {
            console.error("Ollama error:", ollamaErr);
            return res.status(500).json({ message: "Lỗi khi gọi Ollama", details: ollamaErr?.stderr || ollamaErr?.error?.message });
        }
    });
};
