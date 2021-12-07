using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity: BaseEntity
    {
        //Product Entity as IQueryable
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            //inputQuery is Iqueryable of Product
            var query = inputQuery;

            if(spec.Criteria != null)
            {
                //Product.Where
                query = query.Where(spec.Criteria); //spec.Criteria is p => p.ProductTypeId == id
            }

            if(spec.OrderBy != null)
            {
                //
                query = query.OrderBy(spec.OrderBy); //
            }

            if(spec.OrderByDescending != null)
            {
                //
                query = query.OrderByDescending(spec.OrderByDescending); //
            }

            if(spec.IsPagingEnabled)
            {
                //
                query = query.Skip(spec.Skip).Take(spec.Take); //
            }

            // returns aggregate .Include(p =>p.ProductType).Include(p =>p.ProductBrand)
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}