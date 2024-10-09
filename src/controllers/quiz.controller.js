const { sequelize, Quiz, Question, Answer } = require('../models');

exports.createQuiz = async (req, res) => {
	const { title, Duration, sectionId, questions } = req.body;
	if (req.role !== 'teacher') {
		return res.status(401).json({ error: 'لا يمكنك الوصول لهذة الصفحة' });
	}
	const teacherId = req.teacher.id;
	const transaction = await sequelize.transaction();
	try {
		const quiz = await Quiz.create(
			{
				title,
				Duration,
				sectionId,
				teacherId,
			},
			{ transaction },
		);
		for (const question of questions) {
			const { questionTitle, mark, answers } = question;
			const createdQuestion = await Question.create(
				{
					title: questionTitle,
					mark,
					quizId: quiz.id,
				},
				{ transaction },
			);

			const answerPromises = answers.map((answer) => {
				return Answer.create(
					{
						title: answer.title,
						isCorrect: answer.isCorrect,
						questionId: createdQuestion.id,
					},
					{ transaction },
				);
			});
			await Promise.all(answerPromises);
		}
		await transaction.commit();
		return res.status(201).json(quiz);
	} catch (error) {
		await transaction.rollback();
		return res.status(500).json({ error: error.message });
	}
};


