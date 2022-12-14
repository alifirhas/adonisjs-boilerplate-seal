import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, beforeFind, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Comment from '../Comment/Comment'

export default class Post extends BaseModel {
  public static softDelete = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  static get table() {
    return "posts" // table name
  }

  @beforeFind()
  public static findWithoutSoftDeletes(query) {
    query.whereNull("deleted_at")
  }

  @beforeFetch()
  public static fetchWithoutSoftDeletes(query) {
    query.whereNull("deleted_at")
  }

  @beforeCreate()
  public static setUUID(data: Post) {
    const namespace = uuidv4()
    data.id = uuidv5('Post', namespace)
  }

  @hasMany(() => Comment, {
    foreignKey: 'post_id',
  })
  public comments: HasMany<typeof Comment>
}
