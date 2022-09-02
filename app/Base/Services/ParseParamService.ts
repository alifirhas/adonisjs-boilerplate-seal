export default class ParseParamService {
  LIKE = 'like';
  EQUAL = 'eq';
  NOT_EQUAL = 'ne';
  GREATER_THAN = 'gt';
  GREATER_THAN_EQUAL = 'gte';
  LESS_THAN = 'lt';
  LESS_THAN_EQUAL = 'lte';
  BETWEEN = 'between';

  OPERATOR_LIKE = 'ILIKE';
  OPERATOR_EQUAL = '=';
  OPERATOR_NOT_EQUAL = '!=';
  OPERATOR_GREATER_THAN = '>';
  OPERATOR_GREATER_THAN_EQUAL = '>=';
  OPERATOR_LESS_THAN = '<';
  OPERATOR_LESS_THAN_EQUAL = '<=';

  OPERATION_DEFAULT = "and";

  parse(data: { sort: any; fields: any; embed: any; search: any; page: any; limit: any }) {
    const paginateParams = this.parsePaginateParams(data)
    const sortParams = this.parseSortParams(data.sort)
    const filterParams = this.parseFilterParams(data)
    const projectionParams = this.parseProjectionParams(data.fields)
    const relationParams = this.parseRelationParams(data.embed)
    const searchParams = this.parseSearch(data.search)

    const results = {
      pagination: paginateParams,
      sort: sortParams,
      filter: filterParams,
      fields: projectionParams,
      relation: relationParams,
      search: searchParams
    }

    return results
  }

  parsePaginateParams(data: { page: any; limit: any; }) {
    return {
      page: data.page ?? null,
      limit: data.limit ?? null
    }
  }

  parseSortParams(data: string) {
    if (data) {
      const sorts = data.split(',')
      const parsedSort: any[] = []
  
      sorts.forEach((sort: string) => {
        if (sort.includes('-')) {
          parsedSort.push({
            order: 'desc',
            attribute: sort.split('-')[1]
          })
        } else {
          parsedSort.push({
            order: 'asc',
            attribute: sort
          })
        }
      });
  
      return parsedSort
    }
  }

  parseFilterParams(data: { [x: string]: { [x: string]: any; }; operation?: any; }) {
    const filters: any[] = []

    Object.keys(data).forEach(key => {
      if (key != 'page' && key != 'limit' && key != 'sort' &&
        key != 'fields' && key != 'embed' && key != 'operation' && key != 'search') {
        Object.keys(data[key]).forEach(k => {
          if (k == 'between') {
            const values = data[key][k].split(',')
            if (values.length != 2) {
              return
            } else {
              filters.push({
                attribute: key,
                operator: this.BETWEEN,
                value: values
              })
            }
          } else {
            console.log(data[key][k])
            if (data[key][k].includes(',')) {
              const values = data[key][k].split(',')
              values.forEach((val: any) => {
                filters.push(this.parseFilter(key, k, val))
              });
            } else {
              filters.push(this.parseFilter(key, k, data[key][k]))
            }
          }
        })
      }
    })

    const results = {
      operation: data.operation || 'and',
      data: filters
    }

    return results
  }

  parseProjectionParams(data: string) {
    if (data) {
      return data.split(',')
    }
  }

  parseRelationParams(data: string) {
    if (data) {
      return data.split(',')
    }
  }

  parseSearch(data: { [x: string]: any; }) {
    if (data) {
      const search: any = {
        data: null,
        attributes: [],
        operator: this.OPERATOR_LIKE
      }
      
      Object.keys(data).forEach(key => {
        search.data = `%${data[key]}%`
        search.attributes = key.split(',')
      })

      return search
    }
  }

  parseFilter(attribute: string, operator: string, value: string) {
    if (operator == this.LIKE) {
      value = `%${value}%`
    }

    return {
      attribute: attribute,
      operator: this.parseOperator(operator),
      value: value
    }
  }

  parseOperator(operator: any) {
    switch (operator) {
      case this.LIKE:
        return this.OPERATOR_LIKE
      case this.EQUAL:
        return this.OPERATOR_EQUAL
      case this.NOT_EQUAL:
        return this.OPERATOR_NOT_EQUAL
      case this.GREATER_THAN:
        return this.OPERATOR_GREATER_THAN
      case this.GREATER_THAN_EQUAL:
        return this.OPERATOR_GREATER_THAN_EQUAL
      case this.LESS_THAN:
        return this.OPERATOR_LESS_THAN
      case this.LESS_THAN_EQUAL:
        return this.OPERATOR_LESS_THAN_EQUAL
    }
  }
}
