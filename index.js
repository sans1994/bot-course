const TelegramApi = require('node-telegram-bot-api')

const token = '5267068560:AAHCp7EM7yHXki_4tGoD-Le8IgCMs-acgwg';
const { gameOptions, againOptions } = require('./options')

const bot = new TelegramApi(token, {
	polling: true
})

const chats = [];

const startGame = async (chatId) => {
	await  bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать)')
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{
			command: '/start',
			description: 'Начальное приветствие'
		},
		{
			command: '/info',
			description: 'Получить информацию о пользователе'
		},
		{
			command: '/game',
			description: 'Игра угадай цифру'
		}
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/cb8/a14/cb8a144e-592c-4fc7-b84c-f76e93debacc/1.jpg')
			return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот)))')
		}
		if (text === '/info') {
			return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю! Попробуй еще раз)')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;

		if (data === '/again') {
			return startGame(chatId)
		}
		console.log(chats[chatId]);

		if (data === chats[chatId]) {
			return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
		} else {
			return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
		}
	})
}

start()
