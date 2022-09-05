import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, beforeFind, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Post from '../Post/Post'

export default class Comment extends BaseModel {
  public static softDelete = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public content: string

  @column()
  public post_id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  static get table() {
    return "comments" // table name
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
  public static setUUID(data: Comment) {
    const namespace = uuidv4()
    data.id = uuidv5('Comment', namespace)
  }

  @belongsTo(() => Post, {
    foreignKey: 'post_id'
  })
  public posts: BelongsTo<typeof Post>
}
