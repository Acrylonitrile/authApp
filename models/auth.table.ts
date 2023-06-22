import sequelize from "."
import { DataTypes } from "sequelize"

const authTable = sequelize.define("Users", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

export default authTable
