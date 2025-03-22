import axios from "axios";

export const SendMessage = async (message: string) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-r1-zero:free",
                messages: [{ role: "user", content: "give me the sammuary of this : " + message }],
                response_format: "text",
            },
            {
                headers: {
                    Authorization: "Bearer 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",
                    "HTTP-Referer": "mola7dat.vercel.app",
                    "X-Title": "Mola7dat",
                    "Content-Type": "application/json",
                },
            }
        );

        let reply = response.data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a message.";

        // Remove LaTeX formatting like \boxed{}, \text{}, and other special characters
        reply = reply
            .replace(/\\boxed\{(.*?)\}/g, "$1")  // Removes \boxed{}
            .replace(/\\text\{(.*?)\}/g, "$1")   // Removes \text{}
            .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "($1/$2)") // Converts \frac{a}{b} to (a/b)
            .replace(/[\$\^_{}]/g, "")  // Removes $, ^, _, {, } (common in LaTeX)
            .trim();

        return reply;
    } catch (error) {
        console.error("Error sending message:", error);
        return "Error fetching response.";
    }
};
