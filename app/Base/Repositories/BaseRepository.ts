import { DateTime } from "luxon"

export default class BaseRepository {
  protected model: any
  protected mainModel: any
  protected isSoftDelete: boolean
  protected RELATIONS: string[]

  constructor(model: any) {
    this.model = model
    this.mainModel = model
    this.isSoftDelete = model.softDelete
  }
  
  async getAll(pagination: any, sort: any, whereClauses: any, fields: any, search: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      this.model = this.parseSelectedFields(this.model, fields)
      this.model = this.parseWhere(this.model, whereClauses)
      this.model = this.parseSearch(this.model, whereClauses, search)
      this.model = this.parseRelation(this.model)
      this.model = this.parseSort(this.model, sort)
      if (pagination.page && pagination.limit) {
        if (this.isSoftDelete) {
          return await this.model.whereNull('deleted_at').paginate(pagination.page, pagination.limit)
        }
        return await this.model.paginate(pagination.page, pagination.limit)
      } else {
        if (this.isSoftDelete) {
          return await this.model.whereNull('deleted_at')
        }
        return await this.model
      }
    } catch (error) {
      throw error
    }
  }

  async get(data: any = {}) {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      if (data.sort) {
        this.model = this.parseSort(this.model, data.sort)
      }
      return await this.model
    } catch (error) {
      throw error
    }
  }

  async store(data: any) {
    try {
      this.model = this.mainModel
      return await this.model.create(data)
    } catch (error) {
      throw error
    }
  }

  async multiInsert(data: any[]) {
    try {
      this.model = this.mainModel
      return await this.model.createMany(data)
    } catch (error) {
      throw error
    }
  }

  async show(id: any, fields: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query().where(this.model.primaryKey, id)
      this.model = this.parseSelectedFields(this.model, fields)
      this.model = this.parseRelation(this.model)
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  async update(id: any, data: any) {
    try {
      this.model = this.mainModel
      if (! await this.model.find(id)) {
        return null
      }
      if (Object.keys(data).length) {
        await this.model.query().where(this.model.primaryKey, id).update(data)
      }
      return await this.model.find(id)
    } catch (error) {
      throw error
    }
  }

  async delete(id: any) {
    try {
      this.model = this.mainModel
      const result = await this.model.find(id)
      if (this.isSoftDelete) {
        await this.model.query().where(this.model.primaryKey, id).update({ deleted_at: DateTime.local() })
      } else {
        await this.model.query().where(this.model.primaryKey, id).delete()
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deleteAll() {
    try {
      this.model = this.mainModel
      if (this.isSoftDelete) {
        return await this.model.query().whereNull('deleted_at').update({ deleted_at: DateTime.local() })
      } else {
        return await this.model.query().delete()
      }
    } catch (error) {
      throw error
    }
  }

  async first() {
    try {
      this.model = this.mainModel
      this.model = this.model.query()
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  async find(id: any) {
    try {
      this.model = this.mainModel
      this.model = this.model.query().where(this.model.primaryKey, id)
      if (this.isSoftDelete) {
        this.model = this.model.whereNull('deleted_at')
      }
      return await this.model.first()
    } catch (error) {
      throw error
    }
  }

  setRelation(relation: string[]) {
    this.RELATIONS = relation
  }

  parseSelectedFields(model: any, fields: any) {
    if (fields) {
      model = model.select(fields)
    }
    return model
  }

  parseWhere(model: any, whereClauses: any) {
    if (whereClauses.data) {
      if (whereClauses.operation == 'and') {
        whereClauses.data.forEach((whereClause: any) => {
          if (whereClause.operator == 'between') {
            model = model.whereBetween(whereClause.attribute, whereClause.value)
          } else {
            model = model.where(whereClause.attribute, whereClause.operator, whereClause.value)
          }
        });
      } else {
        whereClauses.data.forEach((whereClause: any, index: number) => {
          if (whereClause.operator == 'between') {
            model = model.whereBetween(whereClause.attribute, whereClause.value)
          } else {
            if (index == 0) {
              model = model.where(whereClause.attribute, whereClause.operator, whereClause.value)
            } else {
              model = model.orWhere(whereClause.attribute, whereClause.operator, whereClause.value)
            }
          }
        });
      }
    }
    return model
  }

  parseRelation(model: any) {
    if (this.RELATIONS) {
      this.RELATIONS.forEach((relation) => {
        if (relation.split('.').length > 1) {
          model = model.preload(relation.substr(0, relation.indexOf('.')), (query) => {
            this.parseNestedRelation(query, relation.substr(relation.indexOf('.') + 1), relation.substr(0, relation.indexOf('.')))
          })
        } else {
          model = model.preload(relation)
        }
      })
    }
    return model
  }

  parseNestedRelation(query: any, relation: string, firstRelation: string) {
    const relations = this.RELATIONS.filter(d => {return d.includes(firstRelation + '.')})
    if (relations.length > 1) {
      relations.map(data => {
        this.parseNestedRelation(query, data.substr(data.indexOf('.') + 1), relation.substr(0, data.indexOf('.')))
      })
    } else {
      if (relation.indexOf('.') > 0) {
        query.preload(relation.substr(0, relation.indexOf('.')), (subQuery) => {
          this.parseNestedRelation(subQuery, relation.substr(relation.indexOf('.') + 1), relation.substr(0, relation.indexOf('.')))
        })
      } else {
        query.preload(relation)
      }
    }
  }

  parseSort(model: any, sort: any[]) {
    if (sort) {
      sort.forEach((sort: any) => {
        model = model.orderBy(sort.attribute, sort.order)
      });
    }
    return model
  }

  parseSearch(model: any, whereClauses: any, search: any) {
    if (search) {
      const data = search.data
      const attributes = search.attributes
      const operator = search.operator
      
      if (attributes) {
        if (whereClauses.data) {
          attributes.forEach((attribute: string) => {
            if (attribute.includes('.')) {
              const attr = attribute.split('.')
              model = model.orWhereHas(attr[0], (builder: any) => {
                builder.where(attr[1], operator, data)
              })
            } else {
              model = model.orWhere(attribute, operator, data)
            }
          });
        } else {
          attributes.forEach((attribute: any, index: number) => {
            if (index == 0) {
              model = model.where(attribute, operator, data)
            } else {
              model = model.orWhere(attribute, operator, data)
            }
          });
        }
      }
    }
    return model
  }
}