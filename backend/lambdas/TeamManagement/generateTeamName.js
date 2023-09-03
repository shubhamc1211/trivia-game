const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: "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",
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: "Generate a unique and catchy trivia team name.",
		});

		const teamName = response.data.choices[0].text.trim();

		return {
			statusCode: 200,
			body: JSON.stringify({ teamName }),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() }),
		};
	}
};
