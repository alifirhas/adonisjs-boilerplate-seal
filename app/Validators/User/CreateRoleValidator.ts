import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateRoleValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public reporter = validator.reporters.api

  public schema = schema.create({
    code: schema.string({}, [
			rules.maxLength(4)
		]),
    name: schema.string({}, [
			rules.maxLength(50)
		]),
		class_name: schema.string.optional({}, [
			rules.maxLength(255)
		]),
		desc: schema.string.optional(),
		priority: schema.number()
  })
}
