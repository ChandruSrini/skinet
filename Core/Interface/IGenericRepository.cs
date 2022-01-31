using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interface
{

    //to be used by classes that is is derived from BaseEntity
    public interface IGenericRepository<T> where T: BaseEntity
    {
        //Task<Product> GetByIdAsync(int id);
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);

        //updating
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);

    }
}