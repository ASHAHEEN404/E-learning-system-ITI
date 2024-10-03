module.exports = (sequelize, DataTypes) => {
	const Event = sequelize.define('Event', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		start: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		adminId: {
			type: DataTypes.UUID,
			references: {
				model: 'Admins',
				key: 'id',
			},
		},
	});

	Event.associate = function (models) {
		Event.belongsTo(models.Admin, {
			foreignKey: 'adminId',
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
	};

	return Event;
};
